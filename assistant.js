/* ИИ-собеседник Bonjour. Переписка живёт только в памяти текущей вкладки. */
(() => {
  const ENDPOINT_KEY = "bonjour-assistant-endpoint-v1";
  const CONSENT_KEY = "bonjour-assistant-consent-v1";
  const MAX_VISIBLE_HISTORY = 12;
  const $ = selector => document.querySelector(selector);
  const messages = [];
  let listening = false;
  let speechRecognition = null;
  let sending = false;

  const chat = $("#assistant-messages");
  const form = $("#assistant-form");
  const input = $("#assistant-input");
  const endpointInput = $("#assistant-endpoint");
  const accessCodeInput = $("#assistant-access-code");
  const sendButton = $("#assistant-send");
  const status = $("#assistant-status");
  const consent = $("#assistant-consent");
  const language = $("#assistant-language");
  const outputLanguage = $("#assistant-output-language");
  const speakReplies = $("#assistant-speak");
  const micButton = $("#assistant-mic");

  if (!chat || !form) return;

  function setStatus(message, kind = "") {
    status.textContent = message;
    status.className = `assistant-status${kind ? ` ${kind}` : ""}`;
  }

  function getEndpoint() {
    return endpointInput.value.trim().replace(/\/$/, "");
  }

  function renderMessage(role, text) {
    const article = document.createElement("article");
    article.className = `assistant-message ${role === "user" ? "assistant-message-user" : "assistant-message-bot"}`;
    const name = document.createElement("span");
    name.className = "assistant-message-name";
    name.textContent = role === "user" ? "Ты" : "Bonjour";
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    article.append(name, paragraph);
    chat.append(article);
    chat.scrollTop = chat.scrollHeight;
  }

  function setPending(pending) {
    sending = pending;
    sendButton.disabled = pending;
    input.disabled = pending;
    sendButton.innerHTML = pending ? "Думаю… <span aria-hidden=\"true\">✦</span>" : "Отправить <span aria-hidden=\"true\">↗</span>";
    if (pending) {
      const typing = document.createElement("article");
      typing.className = "assistant-message assistant-message-bot assistant-typing";
      typing.id = "assistant-typing";
      typing.textContent = "Bonjour печатает…";
      chat.append(typing);
      chat.scrollTop = chat.scrollHeight;
    } else $("#assistant-typing")?.remove();
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) {
      setStatus("Озвучивание не поддерживается в этом браузере.", "is-error");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const kazakhLetters = /[әғқңөұүһіӘҒҚҢӨҰҮҺІ]/.test(text);
    const hasCyrillic = /[А-Яа-яЁё]/.test(text);
    const detectedLanguage = kazakhLetters ? "kk-KZ" : hasCyrillic ? "ru-RU" : "fr-FR";
    utterance.lang = outputLanguage.value === "auto" ? detectedLanguage : outputLanguage.value;
    utterance.rate = utterance.lang === "fr-FR" ? 0.91 : 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(voice => voice.lang.toLowerCase() === utterance.lang.toLowerCase())
      || voices.find(voice => voice.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2).toLowerCase()));
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage(text) {
    const cleanText = String(text || "").trim();
    if (!cleanText || sending) return;
    if (!consent.checked) {
      setStatus("Поставь отметку в уведомлении о данных, прежде чем отправлять текст.", "is-error");
      return;
    }
    const endpoint = getEndpoint();
    if (!endpoint) {
      setStatus("Сначала вставь адрес API помощника. Его нужно получить после публикации серверной функции.", "is-error");
      endpointInput.focus();
      return;
    }
    let parsed;
    try { parsed = new URL(endpoint); }
    catch { setStatus("Проверь адрес API — нужен полный адрес, начинающийся с https://.", "is-error"); endpointInput.focus(); return; }
    if (parsed.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(parsed.hostname)) {
      setStatus("Адрес помощника должен использовать HTTPS.", "is-error");
      return;
    }
    const code = accessCodeInput.value.trim();
    if (!code) {
      setStatus("Введи код доступа, который задан в переменных среды сервера.", "is-error");
      accessCodeInput.focus();
      return;
    }

    input.value = "";
    messages.push({ role: "user", content: cleanText });
    if (messages.length > MAX_VISIBLE_HISTORY) messages.splice(0, messages.length - MAX_VISIBLE_HISTORY);
    renderMessage("user", cleanText);
    setPending(true);
    setStatus("Отправляю сообщение безопасным соединением…");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Bonjour-Access-Code": code },
        body: JSON.stringify({ messages })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || `Не удалось получить ответ (${response.status}).`);
      const reply = String(result.reply || "").trim();
      if (!reply) throw new Error("Помощник прислал пустой ответ. Попробуй ещё раз.");
      messages.push({ role: "assistant", content: reply });
      if (messages.length > MAX_VISIBLE_HISTORY) messages.splice(0, messages.length - MAX_VISIBLE_HISTORY);
      renderMessage("assistant", reply);
      setStatus("Готова продолжить разговор ✨", "is-success");
      if (speakReplies.checked) speak(reply);
    } catch (error) {
      messages.pop();
      input.value = cleanText;
      const userBubbles = chat.querySelectorAll(".assistant-message-user");
      userBubbles[userBubbles.length - 1]?.remove();
      setStatus(error.message || "Помощник временно недоступен. Попробуй ещё раз.", "is-error");
    } finally {
      setPending(false);
      input.disabled = false;
      input.focus();
    }
  }

  function startDictation() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setStatus("В этом браузере нет голосового распознавания. Нажми микрофон на клавиатуре телефона или напечатай сообщение.", "is-error");
      input.focus();
      return;
    }
    if (!window.isSecureContext) {
      setStatus("Для микрофона нужен HTTPS. Открой опубликованный сайт или включи диктовку клавиатуры телефона.", "is-error");
      return;
    }
    if (listening) {
      speechRecognition?.stop();
      return;
    }
    speechRecognition = new Recognition();
    speechRecognition.lang = language.value;
    speechRecognition.interimResults = true;
    speechRecognition.maxAlternatives = 1;
    listening = true;
    micButton.classList.add("is-listening");
    micButton.setAttribute("aria-label", "Остановить диктовку");
    setStatus(`Слушаю ${language.options[language.selectedIndex].text}…`);
    speechRecognition.onresult = event => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) transcript += event.results[index][0].transcript;
      if (transcript) input.value = transcript.trim();
    };
    speechRecognition.onerror = event => {
      const errors = {
        "not-allowed": "Разреши микрофон для сайта и попробуй снова.",
        "service-not-allowed": "Сервис распознавания речи недоступен в этом браузере.",
        network: "Для распознавания речи проверь интернет.",
        "no-speech": "Речь не услышана. Скажи фразу чуть громче и ближе к микрофону.",
        "audio-capture": "Браузер не нашёл микрофон. Можно воспользоваться диктовкой клавиатуры."
      };
      setStatus(errors[event.error] || `Диктовка остановилась (${event.error}).`, "is-error");
    };
    speechRecognition.onend = () => {
      listening = false;
      micButton.classList.remove("is-listening");
      micButton.setAttribute("aria-label", "Продиктовать сообщение");
      if (input.value.trim()) {
        setStatus("Текст распознан. Проверь его и нажми «Отправить».", "is-success");
        input.focus();
      }
    };
    try { speechRecognition.start(); }
    catch {
      listening = false;
      micButton.classList.remove("is-listening");
      setStatus("Не получилось включить микрофон. Проверь разрешение сайта и попробуй ещё раз.", "is-error");
    }
  }

  endpointInput.value = localStorage.getItem(ENDPOINT_KEY) || "";
  consent.checked = sessionStorage.getItem(CONSENT_KEY) === "yes";
  consent.addEventListener("change", () => {
    if (consent.checked) {
      sessionStorage.setItem(CONSENT_KEY, "yes");
      setStatus("Можно начинать. Переписка останется только в памяти этой вкладки.", "is-success");
    } else {
      sessionStorage.removeItem(CONSENT_KEY);
      setStatus("Перед отправкой нужно подтвердить уведомление о данных.", "is-error");
    }
  });
  $("#assistant-save-endpoint").addEventListener("click", () => {
    const endpoint = getEndpoint();
    if (!endpoint) {
      localStorage.removeItem(ENDPOINT_KEY);
      setStatus("Адрес удалён. Добавь адрес опубликованной функции, когда она будет готова.");
      return;
    }
    try {
      const parsed = new URL(endpoint);
      if (parsed.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(parsed.hostname)) throw new Error();
      localStorage.setItem(ENDPOINT_KEY, endpoint);
      setStatus("Адрес сохранён в этом браузере. Код доступа сохраняется только пока вкладка открыта.", "is-success");
    } catch { setStatus("Введи корректный HTTPS-адрес сервера.", "is-error"); }
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(input.value);
  });
  micButton.addEventListener("click", startDictation);
  chat.parentElement.querySelector(".assistant-quick-prompts").addEventListener("click", event => {
    const button = event.target.closest("[data-assistant-prompt]");
    if (button) {
      input.value = button.dataset.assistantPrompt;
      input.focus();
      sendMessage(input.value);
    }
  });
  $("#assistant-clear").addEventListener("click", () => {
    messages.splice(0, messages.length);
    window.speechSynthesis?.cancel();
    chat.replaceChildren();
    renderMessage("assistant", "Начнём заново! Напиши, что тебя интересует — можем говорить на русском, қазақша или français ✨");
    setStatus("Новый разговор. История прошлого диалога удалена из памяти вкладки.", "is-success");
  });
  language.addEventListener("change", () => {
    const option = language.options[language.selectedIndex];
    setStatus(`Голосовой ввод настроен: ${option.text}. Ответы помощника следуют языку твоего сообщения.`);
  });
  outputLanguage.addEventListener("change", () => {
    if (outputLanguage.value !== "auto") setStatus(`Ответы будут озвучиваться голосом: ${outputLanguage.options[outputLanguage.selectedIndex].text}.`, "is-success");
    else setStatus("Язык озвучивания будет выбран по языку ответа.");
  });
})();
