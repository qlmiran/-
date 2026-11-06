const crypto = require("node:crypto");

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_TOTAL_LENGTH = 8_000;
const requestWindows = new Map();

const SYSTEM_PROMPT = `Ты — Bonjour, доброжелательный и внимательный собеседник. Помогай пользователю с повседневными вопросами, идеями, учёбой, общением, культурой, кино, путешествиями и французским языком. Отвечай на русском, казахском или французском — следуй языку последнего сообщения пользователя. Если пользователь смешивает языки, подстройся; переключай язык по просьбе. Пиши понятно и тепло, без снисходительности. Не превращай каждый разговор в урок французского: исправляй язык только если об этом просят или это явно полезно, и тогда объясняй коротко и бережно. Для практики французского учитывай начальный уровень A1–A2: простые живые примеры, перевод по просьбе, мягкие исправления и короткие вопросы, чтобы поддержать диалог. Не выдумывай факты; если не уверен или вопрос зависит от текущих событий, скажи об ограничении. Не утверждай, что у тебя есть доступ к интернету, личным данным или устройству пользователя, если он не предоставил сведения в разговоре.`;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.end(JSON.stringify(payload));
}

function safeSecretEqual(actual, expected) {
  if (typeof actual !== "string" || typeof expected !== "string") return false;
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

function getRequestBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  return {};
}

function clientIsRateLimited(req) {
  const now = Date.now();
  for (const [ip, state] of requestWindows) {
    if (state.startedAt + WINDOW_MS <= now) requestWindows.delete(ip);
  }
  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim().slice(0, 80);
  const state = requestWindows.get(ip);
  if (!state || state.startedAt + WINDOW_MS <= now) {
    requestWindows.set(ip, { startedAt: now, count: 1 });
    return false;
  }
  state.count += 1;
  return state.count > MAX_REQUESTS_PER_WINDOW;
}

module.exports = async function assistant(req, res) {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://qlmiran.github.io,http://localhost:3000,http://localhost:8000")
    .split(",").map(origin => origin.trim()).filter(Boolean);
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) return sendJson(res, 403, { error: "origin_not_allowed", message: "Этот адрес сайта не разрешён для помощника." });
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Bonjour-Access-Code");
  res.setHeader("Access-Control-Max-Age", "600");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== "POST") return sendJson(res, 405, { error: "method_not_allowed", message: "Используй форму чата на сайте." });

  const apiKey = process.env.OPENROUTER_API_KEY;
  const accessCode = process.env.BONJOUR_ACCESS_CODE;
  if (!apiKey || !accessCode) return sendJson(res, 503, { error: "server_not_configured", message: "Сервер ещё не настроен. Добавь ключ модели и код доступа в переменные среды хостинга." });
  if (!safeSecretEqual(req.headers["x-bonjour-access-code"], accessCode)) return sendJson(res, 401, { error: "access_denied", message: "Код доступа не подошёл. Проверь его в настройках подключения." });
  if (clientIsRateLimited(req)) return sendJson(res, 429, { error: "rate_limited", message: "Слишком много сообщений подряд. Подожди минуту и попробуй снова." });

  let body;
  try { body = getRequestBody(req); }
  catch { return sendJson(res, 400, { error: "invalid_json", message: "Не удалось прочитать сообщение. Попробуй отправить его ещё раз." }); }

  if (!body || !Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > MAX_MESSAGES) {
    return sendJson(res, 400, { error: "invalid_messages", message: "В сообщении слишком много истории. Начни новый разговор." });
  }
  const messages = [];
  let totalLength = 0;
  for (const item of body.messages) {
    if (!item || !["user", "assistant"].includes(item.role) || typeof item.content !== "string") {
      return sendJson(res, 400, { error: "invalid_message", message: "Сообщение имеет неподдерживаемый формат." });
    }
    const content = item.content.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) return sendJson(res, 400, { error: "message_too_long", message: "Одно сообщение должно быть короче 2 000 символов." });
    totalLength += content.length;
    messages.push({ role: item.role, content });
  }
  if (totalLength > MAX_TOTAL_LENGTH || messages[messages.length - 1].role !== "user") {
    return sendJson(res, 400, { error: "conversation_too_long", message: "История разговора слишком большая. Начни новый разговор." });
  }

  try {
    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://qlmiran.github.io/-/",
        "X-Title": "Bonjour French Practice"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 650,
        temperature: 0.65,
        provider: { zdr: true, data_collection: "deny" }
      }),
      signal: AbortSignal.timeout(25_000)
    });

    if (!upstream.ok) {
      const status = upstream.status;
      if (status === 429) return sendJson(res, 429, { error: "provider_limit", message: "Сейчас закончился бесплатный лимит или модель перегружена. Попробуй позже." });
      if (status === 401 || status === 402) return sendJson(res, 503, { error: "provider_setup", message: "Проверь API-ключ или доступ к бесплатным моделям OpenRouter в настройках сервера." });
      if (status === 404 || status === 400) return sendJson(res, 503, { error: "provider_unavailable", message: "Сейчас нет бесплатной модели с нужными настройками приватности. Попробуй позже." });
      return sendJson(res, 502, { error: "provider_error", message: "Не получилось связаться с моделью. Попробуй ещё раз через минуту." });
    }

    const result = await upstream.json();
    const reply = result?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) return sendJson(res, 502, { error: "empty_reply", message: "Помощник не прислал ответ. Сформулируй вопрос ещё раз." });
    return sendJson(res, 200, { reply: reply.trim() });
  } catch (error) {
    const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
    return sendJson(res, 502, { error: timedOut ? "timeout" : "network_error", message: timedOut ? "Ответ задерживается. Попробуй задать вопрос покороче." : "Не удалось подключиться к помощнику. Проверь интернет и адрес API." });
  }
};
