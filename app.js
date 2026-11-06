/* Bonjour! — персональный тренажёр французского.
   Состояние хранится в localStorage: отдельная копия для каждого браузера и устройства. */
const STORAGE_KEY = "bonjour-french-v1";

const lessons = [
  { id: "hello", number: "01", title: "Знакомство без волнения", subtitle: "Приветствие, имя и первая беседа", time: "15 минут", focus: "Говорение · словарь", phrase: "Bonjour, je m’appelle …", translation: "Здравствуйте, меня зовут …", description: "Потренируй приветствия, представься и узнай имя собеседника. Начни с коротких реплик — этого достаточно для настоящего знакомства." },
  { id: "about", number: "02", title: "Расскажи о себе", subtitle: "Учёба, интересы и простые фразы", time: "18 минут", focus: "Предложения · глаголы", phrase: "J’étudie à l’université.", translation: "Я учусь в университете.", description: "Собери несколько фраз о своей учёбе и интересах. Добавь кино, моду или музыку — так новые слова будет проще связать с собой." },
  { id: "cafe", number: "03", title: "Кафе и город", subtitle: "Заказ, просьба и благодарность", time: "15 минут", focus: "Аудирование · вежливость", phrase: "Je voudrais un café, s’il vous plaît.", translation: "Я бы хотела кофе, пожалуйста.", description: "Послушай диалог в кафе, распознай вежливые выражения и попробуй заказать напиток самостоятельно." },
  { id: "culture", number: "04", title: "Кино, мода и впечатления", subtitle: "Говори о том, что тебе нравится", time: "20 минут", focus: "Мнение · прилагательные", phrase: "J’aime beaucoup ce film.", translation: "Мне очень нравится этот фильм.", description: "Выучи способы говорить о своих предпочтениях. Потренируй фразы про кино, стиль и творчество." },
  { id: "travel", number: "05", title: "Первый день в поездке", subtitle: "Спросить дорогу и понять ответ", time: "18 минут", focus: "Понимание речи · вопросы", phrase: "Où se trouve la station de métro ?", translation: "Где находится станция метро?", description: "Разбери полезные вопросы путешественницы и послушай, как собеседник подсказывает дорогу." },
  { id: "plans", number: "06", title: "Планы и новые знакомства", subtitle: "Приглашение, согласие и прощание", time: "20 минут", focus: "Диалог · будущее", phrase: "On se retrouve demain ?", translation: "Увидимся завтра?", description: "Закрепи знакомство в небольшом диалоге: предложи встретиться, ответь и попрощайся." }
];

const practiceVideos = {
  hello: { id: "08KdrgZVrjs", title: "Приветствие и знакомство · Lesson 1", description: "Первые фразы, чтобы начать разговор." },
  about: { id: "_d9MopMB8Fo", title: "Разговор об учёбе и работе · Lesson 7", description: "Полезные слова о занятиях и будущей карьере." },
  cafe: { id: "tHgmZGLe35s", title: "Заказ в кафе · Lesson 9", description: "Вежливые фразы, которые пригодятся в поездке." },
  culture: { id: "jTnqaOsozxw", title: "Le Petit Nicolas · официальный трейлер", description: "Короткая сцена из французского фильма о школе и друзьях." },
  travel: { id: "_yDAAnaMV1I", title: "Как спросить дорогу · Lesson 12", description: "Слушай короткий вопрос и запоминай направление." },
  plans: { id: "iuXt3XSmQRM", title: "Вопросительные слова · Lesson 6", description: "Как задавать вопросы в настоящем разговоре." }
};

const practicePhotos = {
  hello: { src: "https://images.unsplash.com/photo-1637851059744-d3446faa60f4?auto=format&fit=crop&w=1000&q=82", alt: "Вечерний Париж и Эйфелева башня", caption: "Première rencontre à Paris" },
  about: { src: "https://images.unsplash.com/photo-1774084930616-fce8eba59264?auto=format&fit=crop&w=1000&q=82", alt: "Парижское кафе на мощёной улице", caption: "Un café, des idées et des projets" },
  cafe: { src: "https://images.unsplash.com/photo-1774084930616-fce8eba59264?auto=format&fit=crop&w=1000&q=82", alt: "Уютное парижское кафе", caption: "À la terrasse d’un café" },
  culture: { src: "https://images.unsplash.com/photo-1764689668473-b834a1a575e7?auto=format&fit=crop&w=1000&q=82", alt: "Винтажный кинопроектор", caption: "Silence… on tourne !" },
  travel: { src: "https://images.unsplash.com/photo-1637851059744-d3446faa60f4?auto=format&fit=crop&w=1000&q=82", alt: "Париж и Эйфелева башня на закате", caption: "On cherche le métro ?" },
  plans: { src: "https://images.unsplash.com/photo-1774084930616-fce8eba59264?auto=format&fit=crop&w=1000&q=82", alt: "Кафе в центре Парижа", caption: "On se retrouve demain ?" }
};

const practiceMemes = [
  { id: "js6NXc48PocYEVb2cn", title: "Когда услышала знакомое bonjour", fr: "Moi quand je reconnais « bonjour » dans une conversation :", ru: "Я распознала «бонжур» — уже почти переводчик 😄" },
  { id: "WkmIglAtM68g2a2bNl", title: "Парижский режим: активирован", fr: "Moi : je vais parler français. Aussi moi : bonjour, croissant, merci.", ru: "Я: сейчас буду говорить по-французски. Тоже я: бонжур, круассан, мерси 😅" },
  { id: "MkByV1VzMpfsEt6djb", title: "Французский мозг загружается…", fr: "Quand le serveur dit « Vous désirez ? » et que mon cerveau cherche la réponse…", ru: "Когда официант спрашивает, что будете, а мозг ищет нужную фразу 😄" }
];

const dailyQuotes = [
  { fr: "Petit à petit, l’oiseau fait son nid.", ru: "Потихоньку и птичка свивает гнездо.", author: "Французская пословица" },
  { fr: "Qui ne tente rien n’a rien.", ru: "Кто не пробует, тот ничего не получает.", author: "Французская пословица" },
  { fr: "C’est en forgeant qu’on devient forgeron.", ru: "Мастерство приходит через практику.", author: "Французская пословица" },
  { fr: "À cœur vaillant, rien d’impossible.", ru: "Для смелого сердца нет ничего невозможного.", author: "Французская пословица" },
  { fr: "Après la pluie, le beau temps.", ru: "После дождя всегда выглядывает солнце.", author: "Французская пословица" },
  { fr: "Vouloir, c’est pouvoir.", ru: "Хотеть — значит мочь.", author: "Французская пословица" },
  { fr: "Paris ne s’est pas fait en un jour.", ru: "Париж строился не за один день.", author: "Французская пословица" },
  { fr: "Vingt fois sur le métier remettez votre ouvrage.", ru: "Возвращайся к делу снова и снова — так приходит мастерство.", author: "Николя Буало · «Поэтическое искусство»" },
  { fr: "On ne voit bien qu’avec le cœur.", ru: "Только сердцем видишь ясно.", author: "Антуан де Сент-Экзюпери · «Маленький принц»" },
  { fr: "Chaque mot nouveau te rapproche de la conversation dont tu rêves.", ru: "Каждое новое слово приближает тебя к разговору, о котором ты мечтаешь.", author: "Мысль Bonjour!" },
  { fr: "Une phrase aujourd’hui, plus d’assurance demain.", ru: "Одна фраза сегодня — больше уверенности завтра.", author: "Мысль Bonjour!" },
  { fr: "Ose parler : l’élégance vient avec la pratique.", ru: "Не бойся говорить: уверенность приходит с практикой.", author: "Мысль Bonjour!" },
  { fr: "La confiance se construit une phrase à la fois.", ru: "Уверенность складывается из фраз — одной за другой.", author: "Мысль Bonjour!" },
  { fr: "Un petit pas chaque jour ouvre de grandes portes.", ru: "Маленький шаг каждый день открывает большие двери.", author: "Мысль Bonjour!" }
];

const words = [
  { fr: "Bonjour", ru: "Здравствуйте · Добрый день", say: "Bonjour" },
  { fr: "Enchantée", ru: "Приятно познакомиться (говорит девушка)", say: "Enchantée" },
  { fr: "Je m’appelle…", ru: "Меня зовут…", say: "Je m'appelle" },
  { fr: "J’étudie", ru: "Я учусь · изучаю", say: "J'étudie" },
  { fr: "L’université", ru: "Университет", say: "L'université" },
  { fr: "Le cinéma", ru: "Кино · кинотеатр", say: "Le cinéma" },
  { fr: "J’aime beaucoup", ru: "Мне очень нравится", say: "J'aime beaucoup" },
  { fr: "À bientôt !", ru: "До скорой встречи!", say: "À bientôt" }
];

const dialogue = [
  { who: "C", fr: "Bonjour ! Comment tu t’appelles ?", ru: "Привет! Как тебя зовут?" },
  { who: "T", fr: "Je m’appelle … Et toi ?", ru: "Меня зовут … А тебя?" },
  { who: "C", fr: "Moi, c’est Amélie. Tu étudies quoi ?", ru: "Я Амели. Что ты изучаешь?" },
  { who: "T", fr: "J’étudie l’histoire à l’université.", ru: "Я изучаю историю в университете." },
  { who: "C", fr: "Enchantée ! À bientôt !", ru: "Приятно познакомиться! До встречи!" }
];

const lessonActivities = {
  hello: {
    dialogueTitle: "Приятно познакомиться!",
    dialogueDescription: "Представь, что знакомишься с кем-то на творческом мероприятии в Париже.",
    dialogue,
    phrases: [
      ["Je m’appelle {name}.", "Меня зовут …"],
      ["J’étudie à l’université.", "Я учусь в университете."],
      ["Je m’intéresse au cinéma.", "Я интересуюсь кино."]
    ],
    quiz: { title: "Как сказать «Я учусь»?", options: ["Je suis étudie.", "J’étudie.", "Étudier je."], correct: 1, explanation: "J’étudie значит «я учусь». Местоимение je уже спряталось в форме глагола с апострофом." },
    words
  },
  about: {
    dialogueTitle: "Пара слов о себе",
    dialogueDescription: "Амели знакомится с Томасом и спрашивает о его учёбе и интересах.",
    dialogue: [
      { who: "C", fr: "Tu étudies où ?", ru: "Где ты учишься?" },
      { who: "T", fr: "J’étudie à l’université.", ru: "Я учусь в университете." },
      { who: "C", fr: "Tu étudies l’histoire ?", ru: "Ты изучаешь историю?" },
      { who: "T", fr: "Oui, et j’aime aussi le cinéma.", ru: "Да, и мне ещё нравится кино." }
    ],
    phrases: [["Je suis étudiante.", "Я студентка."], ["J’étudie l’histoire.", "Я изучаю историю."], ["J’aime la musique.", "Я люблю музыку."]],
    quiz: { title: "Как сказать «Я изучаю историю»?", options: ["J’étudie l’histoire.", "Je histoire étudie.", "Je suis l’histoire."], correct: 0, explanation: "Верно: J’étudie l’histoire. Перед существительным l’histoire стоит слитный артикль l’." },
    words: [{ fr: "étudiante", ru: "студентка", say: "étudiante" }, { fr: "l’université", ru: "университет", say: "l'université" }, { fr: "l’histoire", ru: "история", say: "l'histoire" }, { fr: "la matière", ru: "учебный предмет", say: "la matière" }, { fr: "étudier", ru: "учиться · изучать", say: "étudier" }, { fr: "les langues", ru: "языки", say: "les langues" }, { fr: "la musique", ru: "музыка", say: "la musique" }, { fr: "le cinéma", ru: "кино", say: "le cinéma" }]
  },
  cafe: {
    dialogueTitle: "Заказ в кафе",
    dialogueDescription: "Попроси напиток, уточни цену и поблагодари собеседника.",
    dialogue: [
      { who: "C", fr: "Bonjour, vous désirez ?", ru: "Здравствуйте, что будете?" },
      { who: "T", fr: "Je voudrais un café, s’il vous plaît.", ru: "Я бы хотел кофе, пожалуйста." },
      { who: "C", fr: "Et avec ça ?", ru: "Что-нибудь ещё?" },
      { who: "T", fr: "Une bouteille d’eau, merci.", ru: "Бутылку воды, спасибо." },
      { who: "C", fr: "Ça fait cinq euros.", ru: "С вас пять евро." }
    ],
    phrases: [["Je voudrais un café.", "Я бы хотела кофе."], ["Combien ça coûte ?", "Сколько это стоит?"], ["L’addition, s’il vous plaît.", "Счёт, пожалуйста."]],
    quiz: { title: "Как вежливо попросить воду?", options: ["Je voudrais de l’eau, s’il vous plaît.", "Je suis eau, merci.", "Donne eau."], correct: 0, explanation: "Je voudrais… — вежливая просьба «Я бы хотела…». В живом общении добавляй s’il vous plaît." },
    words: [{ fr: "un café", ru: "кофе", say: "un café" }, { fr: "de l’eau", ru: "вода", say: "de l'eau" }, { fr: "je voudrais", ru: "я бы хотел(а)", say: "je voudrais" }, { fr: "l’addition", ru: "счёт в кафе", say: "l'addition" }, { fr: "combien", ru: "сколько", say: "combien" }, { fr: "ça coûte", ru: "это стоит", say: "ça coûte" }, { fr: "s’il vous plaît", ru: "пожалуйста (в просьбе)", say: "s'il vous plaît" }, { fr: "merci", ru: "спасибо", say: "merci" }]
  },
  culture: {
    dialogueTitle: "О кино и впечатлениях",
    dialogueDescription: "Поговори о фильме, который тебе понравился, и коротко объясни почему.",
    dialogue: [
      { who: "C", fr: "Tu as aimé le film ?", ru: "Тебе понравился фильм?" },
      { who: "T", fr: "Oui, beaucoup ! La musique est superbe.", ru: "Да, очень! Музыка замечательная." },
      { who: "C", fr: "Tu préfères le cinéma ou la danse ?", ru: "Ты больше любишь кино или танцы?" },
      { who: "T", fr: "J’aime les deux, mais je préfère le cinéma.", ru: "Мне нравится и то и другое, но я предпочитаю кино." }
    ],
    phrases: [["J’aime beaucoup ce film.", "Мне очень нравится этот фильм."], ["Je préfère la danse.", "Я предпочитаю танцы."], ["C’est intéressant parce que…", "Это интересно, потому что…"]],
    quiz: { title: "Как сказать «Мне нравится эта музыка»?", options: ["J’aime cette musique.", "Je suis musique.", "Cette musique aime moi."], correct: 0, explanation: "J’aime cette musique. После j’aime можно поставить то, что тебе нравится." },
    words: [{ fr: "le film", ru: "фильм", say: "le film" }, { fr: "la musique", ru: "музыка", say: "la musique" }, { fr: "la danse", ru: "танец · танцы", say: "la danse" }, { fr: "j’aime", ru: "мне нравится · я люблю", say: "j'aime" }, { fr: "je préfère", ru: "я предпочитаю", say: "je préfère" }, { fr: "intéressant(e)", ru: "интересный · интересная", say: "intéressante" }, { fr: "superbe", ru: "замечательный", say: "superbe" }, { fr: "parce que", ru: "потому что", say: "parce que" }]
  },
  travel: {
    dialogueTitle: "Как найти метро?",
    dialogueDescription: "Спроси дорогу к станции и разберись в коротком ответе.",
    dialogue: [
      { who: "T", fr: "Excusez-moi, où est la station de métro ?", ru: "Извините, где станция метро?" },
      { who: "C", fr: "Continuez tout droit, puis tournez à gauche.", ru: "Идите прямо, затем поверните налево." },
      { who: "T", fr: "C’est loin d’ici ?", ru: "Это далеко отсюда?" },
      { who: "C", fr: "Non, c’est à cinq minutes à pied.", ru: "Нет, это в пяти минутах пешком." }
    ],
    phrases: [["Où est la station de métro ?", "Где станция метро?"], ["Continuez tout droit.", "Продолжайте идти прямо."], ["C’est loin d’ici ?", "Это далеко отсюда?"]],
    quiz: { title: "Как спросить «Где находится вокзал?»", options: ["Où est la gare ?", "Quand est la gare ?", "Je suis la gare ?"], correct: 0, explanation: "Où est… ? — «Где находится…?». Слово la gare означает «вокзал»." },
    words: [{ fr: "la station", ru: "станция", say: "la station" }, { fr: "le métro", ru: "метро", say: "le métro" }, { fr: "la gare", ru: "вокзал", say: "la gare" }, { fr: "tout droit", ru: "прямо", say: "tout droit" }, { fr: "à gauche", ru: "налево", say: "à gauche" }, { fr: "à droite", ru: "направо", say: "à droite" }, { fr: "à pied", ru: "пешком", say: "à pied" }, { fr: "excusez-moi", ru: "извините (вежливо)", say: "excusez-moi" }]
  },
  plans: {
    dialogueTitle: "Договоримся о встрече",
    dialogueDescription: "Пригласи знакомую на выставку и предложи время встречи.",
    dialogue: [
      { who: "C", fr: "Tu veux aller à l’exposition samedi ?", ru: "Хочешь пойти на выставку в субботу?" },
      { who: "T", fr: "Oui, avec plaisir !", ru: "Да, с удовольствием!" },
      { who: "C", fr: "On se retrouve à deux heures ?", ru: "Встретимся в два часа?" },
      { who: "T", fr: "D’accord. À samedi !", ru: "Хорошо. До субботы!" }
    ],
    phrases: [["Tu veux sortir ?", "Хочешь куда-нибудь сходить?"], ["On se retrouve demain ?", "Увидимся завтра?"], ["Avec plaisir !", "С удовольствием!"]],
    quiz: { title: "Как предложить встретиться завтра?", options: ["On se retrouve demain ?", "Hier, je suis demain.", "Tu es rencontre."], correct: 0, explanation: "On se retrouve demain ? — естественный простой способ предложить встретиться завтра." },
    words: [{ fr: "demain", ru: "завтра", say: "demain" }, { fr: "samedi", ru: "суббота", say: "samedi" }, { fr: "l’exposition", ru: "выставка", say: "l'exposition" }, { fr: "sortir", ru: "выходить · куда-то идти", say: "sortir" }, { fr: "se retrouver", ru: "встретиться", say: "se retrouver" }, { fr: "à deux heures", ru: "в два часа", say: "à deux heures" }, { fr: "d’accord", ru: "хорошо · договорились", say: "d'accord" }, { fr: "avec plaisir", ru: "с удовольствием", say: "avec plaisir" }]
  }
};

const roleplayScenes = {
  hello: { prompt: "Амели улыбается: «Comment tu t’appelles ?» Что ответишь?", options: ["Je m’appelle {name}.", "Je voudrais un café.", "Où est le métro ?"], correct: 0, success: "Идеально! Знакомство состоялось, фотограф может убрать круассан из кадра." },
  about: { prompt: "На вечеринке спрашивают: «Qu’est-ce que tu étudies ?»", options: ["J’étudie l’histoire.", "Je voudrais une robe.", "À gauche, merci."], correct: 0, success: "Супер! Теперь все знают, что у вечеринки есть историк." },
  cafe: { prompt: "Бариста спрашивает: «Vous désirez ?» Выбери вежливый заказ.", options: ["Je voudrais un café, s’il vous plaît.", "Je suis un café.", "Le métro est à gauche."], correct: 0, success: "Заказ принят. Ты заказала кофе, а не превратилась в него — отлично." },
  culture: { prompt: "Подруга спрашивает: «Tu préfères le cinéma ou la danse ?»", options: ["Je préfère la danse.", "Je m’appelle cinéma.", "Deux cafés, s’il vous plaît."], correct: 0, success: "Твой вкус прозвучал убедительно. Критики уже записывают интервью." },
  travel: { prompt: "Путешественница спрашивает, как дойти до метро. Помоги ей.", options: ["Continuez tout droit.", "Je m’intéresse au cinéma.", "Enchantée, je m’appelle…"], correct: 0, success: "Навигатор аплодирует. Теперь никто не заблудится по дороге к круассанам." },
  plans: { prompt: "Тебя приглашают: «Tu veux aller à l’exposition samedi ?»", options: ["Oui, avec plaisir !", "Je suis une exposition.", "La station coûte cinq euros."], correct: 0, success: "Встреча назначена! Французский светский календарь официально запущен." }
};

const initialState = {
  name: "",
  voiceURI: "",
  amelieVoiceURI: "",
  thomasVoiceURI: "",
  sessionMinutes: 20,
  musicVolume: 0.075,
  musicVolumeVersion: 2,
  musicAutoEnabled: false,
  completedLessons: [],
  knownWords: [],
  customWords: [],
  practiced: { listen: false, build: false, speak: false },
  practicedDate: "",
  lessonDates: [],
  skills: { speaking: 8, listening: 8, grammar: 8, vocabulary: 8 },
  quizBest: 0
};

const frenchMusicTracks = [
  { id: "0TFNGRYMz1U", title: "Je veux", artist: "ZAZ" },
  { id: "oiKj0Z_Xnjc", title: "Papaoutai", artist: "Stromae" },
  { id: "K5KAc5CoCuk", title: "Dernière Danse", artist: "Indila" },
  { id: "bb-DKKRN4o8", title: "Les Champs-Élysées", artist: "Joe Dassin" },
  { id: "8IjWHBGzsu4", title: "On ira", artist: "ZAZ" },
  { id: "VHoT4N43jK8", title: "Alors on danse", artist: "Stromae" }
];

function shuffleMusicTracks(tracks) {
  const shuffled = [...tracks];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return structuredClone(initialState);
    return {
      ...structuredClone(initialState), ...saved,
      musicAutoEnabled: false,
      amelieVoiceURI: saved.amelieVoiceURI || "",
      thomasVoiceURI: saved.thomasVoiceURI || "",
      sessionMinutes: [20, 30, 60].includes(Number(saved.sessionMinutes)) ? Number(saved.sessionMinutes) : 20,
      musicVolume: Number.isFinite(Number(saved.musicVolume))
        ? Math.max(0, Math.min(0.14, Number(saved.musicVolume) * (Number(saved.musicVolumeVersion || 1) < 2 ? 1.75 : 1)))
        : initialState.musicVolume,
      musicVolumeVersion: 2,
      practiced: saved.practicedDate === todayKey() ? { ...initialState.practiced, ...(saved.practiced || {}) } : { ...initialState.practiced },
      practicedDate: saved.practicedDate || "",
      skills: { ...initialState.skills, ...(saved.skills || {}) },
      completedLessons: Array.isArray(saved.completedLessons) ? saved.completedLessons : [],
      knownWords: Array.isArray(saved.knownWords) ? saved.knownWords : [],
      customWords: Array.isArray(saved.customWords) ? saved.customWords : [],
      lessonDates: Array.isArray(saved.lessonDates) ? saved.lessonDates : []
    };
  } catch { return structuredClone(initialState); }
}

let state = loadState();
let currentWordIndex = 0;
let quizAnswered = false;
let toastTimer;
let currentPracticeStep = 0;
let currentFlowLessonId = lessons[0].id;
let currentDialogue = dialogue;
let currentQuiz = lessonActivities.hello.quiz;
let currentTargetPhrase = "";
let currentTargetPhraseIndex = 0;
let checkedTargetIndexes = new Set();
let musicEnabled = false;
let musicVolume = state.musicVolume;
let musicDucked = false;
let musicQueue = [frenchMusicTracks[0], ...shuffleMusicTracks(frenchMusicTracks.slice(1))];
let currentMusicIndex = -1;
let youtubeMusicPlayer = null;
let youtubeMusicApiPromise = null;
let youtubeMusicPlayerPromise = null;
let musicPlayerErrors = 0;
let mediaRecorder = null;
let recordingStream = null;
let dialogueReadyToConfirm = false;
let dialoguePlaybackToken = 0;
let currentLessonListenDone = false;
let dialoguePlaybackFallback = false;

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderAll();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function greetingName() {
  const name = state.name.trim();
  if (!name) return "будущая полиглотка";
  return name;
}

function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function recordLessonActivity() {
  const today = todayKey();
  if (!state.lessonDates.includes(today)) state.lessonDates.push(today);
  state.lessonDates = [...new Set(state.lessonDates)].sort().slice(-45);
}

function calculateStreak() {
  const days = new Set(state.lessonDates);
  if (!days.size) return 0;
  const today = new Date();
  const key = (date) => date.toISOString().slice(0, 10);
  let streak = 0;
  const cursor = new Date(today);
  if (!days.has(key(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(key(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}

function weeklyLessonCount() {
  const now = new Date();
  const start = new Date(now);
  const dayFromMonday = (now.getDay() + 6) % 7;
  start.setDate(now.getDate() - dayFromMonday);
  start.setHours(0, 0, 0, 0);
  return state.lessonDates.filter(date => new Date(`${date}T00:00:00`) >= start).length;
}

function progressPercent() { return Math.round(state.completedLessons.length / lessons.length * 100); }

function setView(viewName) {
  if (viewName !== "learn" && $("#video-frame") && !$("#video-frame").hidden) closeVideoPlayer(false);
  if (viewName !== "practice") closePracticeVideo();
  $$(".view").forEach(view => view.classList.toggle("active", view.id === `view-${viewName}`));
  $$(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === viewName));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function practiceCards() { return $$(".practice-card", $("#practice-grid")); }

function renderPracticeStep() {
  const cards = practiceCards();
  const lesson = lessons.find(item => item.id === currentFlowLessonId) || lessons[0];
  cards.forEach((card, index) => card.classList.toggle("active-task", index === currentPracticeStep));
  $("#practice-flow-title").textContent = lesson.title;
  $("#practice-step-label").textContent = `ЗАДАНИЕ ${currentPracticeStep + 1} ИЗ ${cards.length}`;
  $("#practice-step-fill").style.width = `${((currentPracticeStep + 1) / cards.length) * 100}%`;
  $("#step-back").disabled = currentPracticeStep === 0;
  $("#step-next").innerHTML = currentPracticeStep === cards.length - 1 ? "Завершить урок ✓" : "Дальше <span aria-hidden=\"true\">→</span>";
  const listeningLocked = currentPracticeStep === 0 && !currentLessonListenDone;
  $("#step-next").disabled = listeningLocked;
  $("#step-next").title = listeningLocked ? "Сначала дослушай весь диалог и отметь задание." : "Перейти дальше";
}

function startPracticeFlow(lessonId = null) {
  const nextLesson = lessons.find(item => !state.completedLessons.includes(item.id)) || lessons[0];
  currentFlowLessonId = lessonId || nextLesson.id;
  currentPracticeStep = 0;
  currentLessonListenDone = false;
  dialogueReadyToConfirm = false;
  dialoguePlaybackFallback = false;
  dialoguePlaybackToken += 1;
  currentTargetPhraseIndex = 0;
  checkedTargetIndexes = new Set();
  renderPracticeContent();
  renderPracticeStep();
  setView("practice");
}

function renderPracticeContent() {
  const lesson = lessons.find(item => item.id === currentFlowLessonId) || lessons[0];
  const activity = lessonActivities[currentFlowLessonId] || lessonActivities.hello;
  currentDialogue = activity.dialogue;
  currentQuiz = activity.quiz;
  $("#dialogue-title").textContent = activity.dialogueTitle;
  $("#dialogue-description").textContent = activity.dialogueDescription;
  $("#speaking-task-title").textContent = lesson.title;
  $("#speaking-task-description").textContent = `Послушай фразы по теме «${lesson.title}», повтори их и затем попробуй ответить своими словами.`;
  const missions = {
    hello: "На парижском показе тебя принимают за звезду. Представься по-французски, пока фотограф не попросил автограф у круассана.",
    about: "На afterparty спросили, чем ты занимаешься. Расскажи про учёбу и интересы — загадочное «эээ…» сегодня не в программе.",
    cafe: "Бариста ждёт заказ. Попроси кофе вежливо, чтобы вместо кофе с собой тебе не принесли само кафе.",
    culture: "Объясни подруге, почему тебе понравился фильм. Одного драматичного «magnifique!» достаточно для трейлера, но не для ответа.",
    travel: "Ты ищешь метро, а телефон решил отдохнуть. Спроси дорогу сама — парижская навигация активирована.",
    plans: "Пригласи нового знакомого на выставку. Скажи samedi чётко, а то внезапно встретитесь с салатом (salade)."
  };
  $("#practice-mission p").textContent = missions[currentFlowLessonId] || missions.hello;
  renderRoleplayScene(currentFlowLessonId);
  renderPracticeMedia(currentFlowLessonId);
  $("#words-title").textContent = `Слова: ${lesson.title.toLowerCase()}`;
  $("#words-description").textContent = "Нажми на карточку, чтобы увидеть перевод. Сложные слова повторятся в следующем круге.";
  const phrases = $("#practice-phrases");
  phrases.replaceChildren();
  activity.phrases.forEach(([french, russian], index) => {
    const spokenFrench = french.replace("{name}", state.name.trim() || "…");
    const row = document.createElement("div");
    row.className = "phrase-box";
    const number = document.createElement("span");
    number.className = "phrase-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const copy = document.createElement("div");
    const phrase = document.createElement("b");
    phrase.textContent = spokenFrench;
    const translation = document.createElement("small");
    translation.textContent = russian;
    copy.append(phrase, translation);
    const sound = document.createElement("button");
    sound.type = "button";
    sound.className = "sound-button";
    sound.dataset.say = spokenFrench.replace("…", "");
    sound.setAttribute("aria-label", "Прослушать фразу");
    sound.textContent = "♫";
    row.append(number, copy, sound);
    phrases.append(row);
  });
  $("#dictation-input").value = "";
  renderDictationTarget();
  renderDialogue();
  updateListeningGate();
  setupQuiz();
  currentWordIndex = 0;
  renderWord();
}

function renderPracticeMedia(lessonId) {
  const clip = practiceVideos[lessonId] || practiceVideos.hello;
  const photo = practicePhotos[lessonId] || practicePhotos.hello;
  const frame = $("#practice-video-frame");
  frame.src = "about:blank";
  frame.hidden = true;
  $("#practice-video-launch").hidden = false;
  $("#practice-video-launch").dataset.videoId = clip.id;
  $("#practice-video-title").textContent = clip.title;
  $("#practice-video-description").textContent = clip.description;
  $("#practice-video-thumb").src = `https://img.youtube.com/vi/${clip.id}/hqdefault.jpg`;
  $("#practice-photo-image").src = photo.src;
  $("#practice-photo-image").alt = photo.alt;
  $("#practice-photo-caption").textContent = photo.caption;
  const meme = practiceMemes[Math.floor(Math.random() * practiceMemes.length)];
  $("#practice-meme-gif").src = `https://giphy.com/embed/${meme.id}`;
  $("#practice-meme-title").textContent = meme.title;
  $("#practice-meme-copy").textContent = meme.fr;
  $("#practice-meme-translation").textContent = meme.ru;
}

function openPracticeVideo(videoId) {
  stopBackgroundMusic();
  const frame = $("#practice-video-frame");
  frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
  frame.hidden = false;
  $("#practice-video-launch").hidden = true;
  frame.scrollIntoView({ behavior: "smooth", block: "center" });
}

function closePracticeVideo() {
  const frame = $("#practice-video-frame");
  if (!frame) return;
  frame.src = "about:blank";
  frame.hidden = true;
  $("#practice-video-launch").hidden = false;
}

function renderRoleplayScene(lessonId) {
  const scene = roleplayScenes[lessonId] || roleplayScenes.hello;
  $("#roleplay-prompt").textContent = scene.prompt;
  $("#roleplay-feedback").textContent = "";
  $("#roleplay-feedback").className = "roleplay-feedback";
  $("#roleplay-options").replaceChildren(...scene.options.map((text, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "roleplay-option";
    button.dataset.roleplayAnswer = String(index);
    button.textContent = text.replace("{name}", state.name.trim() || "Aïda");
    return button;
  }));
}

function answerRoleplay(index, button) {
  const scene = roleplayScenes[currentFlowLessonId] || roleplayScenes.hello;
  const feedback = $("#roleplay-feedback");
  $$(".roleplay-option", $("#roleplay-options")).forEach(option => option.classList.remove("correct", "incorrect"));
  if (index === scene.correct) {
    button.classList.add("correct");
    feedback.className = "roleplay-feedback good";
    feedback.textContent = scene.success;
    $$(".roleplay-option", $("#roleplay-options")).forEach(option => { option.disabled = true; });
  } else {
    button.classList.add("incorrect");
    feedback.className = "roleplay-feedback try-again";
    feedback.textContent = "Cette réplique a pris le mauvais métro 😄 Réessaie avec une autre réponse.";
  }
}

function renderDictationTarget() {
  const phrases = (lessonActivities[currentFlowLessonId] || lessonActivities.hello).phrases;
  currentTargetPhraseIndex = Math.max(0, Math.min(currentTargetPhraseIndex, phrases.length - 1));
  currentTargetPhrase = phrases[currentTargetPhraseIndex][0].replace("{name}", state.name.trim() || "…");
  $("#dictation-target").textContent = `Фраза для сравнения: ${currentTargetPhrase}`;
  $("#dictation-count").textContent = `Фраза ${currentTargetPhraseIndex + 1} из ${phrases.length} · проверено ${checkedTargetIndexes.size} из ${phrases.length}`;
  $("#dictation-prev").disabled = currentTargetPhraseIndex === 0;
  $("#dictation-next").disabled = currentTargetPhraseIndex === phrases.length - 1;
  $("#dictation-input").value = "";
  $("#dictation-result").textContent = "";
  $(".dictation-target-row").classList.toggle("is-match", checkedTargetIndexes.has(currentTargetPhraseIndex));
}

function moveDictationTarget(direction) {
  const count = (lessonActivities[currentFlowLessonId] || lessonActivities.hello).phrases.length;
  currentTargetPhraseIndex = Math.max(0, Math.min(count - 1, currentTargetPhraseIndex + direction));
  renderDictationTarget();
}

function openVideoPlayer(videoId, title) {
  stopBackgroundMusic();
  const frame = $("#video-frame");
  frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
  frame.hidden = false;
  $("#video-poster").hidden = true;
  $("#video-title").textContent = title;
  $("#close-video").hidden = false;
  $("#video-stage").scrollIntoView({ behavior: "smooth", block: "center" });
}

function closeVideoPlayer(scroll = true) {
  const frame = $("#video-frame");
  if (!frame) return;
  frame.src = "about:blank";
  frame.hidden = true;
  $("#video-poster").hidden = false;
  $("#video-title").textContent = "Выбери первый французский ролик";
  $("#close-video").hidden = true;
  if (scroll) $("#video-stage").scrollIntoView({ behavior: "smooth", block: "center" });
}

function movePracticeStep(direction) {
  const cards = practiceCards();
  if (direction < 0) {
    if (currentPracticeStep > 0) currentPracticeStep -= 1;
    renderPracticeStep();
    return;
  }
  if (currentPracticeStep === 0 && !currentLessonListenDone) {
    showToast("Сначала дослушай весь мини-диалог, затем подтверди задание.");
    return;
  }
  if (currentPracticeStep === 1) markPractice("speak", "speaking", "Разговорная практика пройдена.");
  if (currentPracticeStep < cards.length - 1) {
    currentPracticeStep += 1;
    renderPracticeStep();
    return;
  }
  const lesson = lessons.find(item => item.id === currentFlowLessonId);
  if (lesson && !state.completedLessons.includes(lesson.id)) state.completedLessons.push(lesson.id);
  state.skills.grammar = Math.min(100, state.skills.grammar + 4);
  state.skills.vocabulary = Math.min(100, state.skills.vocabulary + 3);
  recordLessonActivity();
  saveState();
  setView("learn");
  showToast("Урок пройден! Отличная работа ✨");
}

function updateProgressDisplays() {
  const percent = progressPercent();
  const streak = calculateStreak();
  const week = Math.min(weeklyLessonCount(), 4);
  $("#welcome-name").textContent = greetingName();
  $("#session-duration").textContent = `${state.sessionMinutes} минут`;
  $("#avatar-initial").textContent = state.name.trim() ? state.name.trim()[0].toUpperCase() : "✿";
  $("#streak-count").textContent = streak;
  $("#streak-label").textContent = streak === 1 ? "день" : streak >= 2 && streak <= 4 ? "дня" : "дней";
  $("#progress-streak").textContent = `${streak} ${streak === 1 ? "день" : streak >= 2 && streak <= 4 ? "дня" : "дней"}`;
  $("#overall-percent").textContent = `${percent}%`;
  $("#overall-bar").style.width = `${percent}%`;
  $("#progress-big-percent").innerHTML = `${percent}<span>%</span>`;
  $("#progress-main-bar").style.width = `${percent}%`;
  $("#learn-level-percent").textContent = `${percent}%`;
  $("#lesson-count").textContent = state.completedLessons.length ? `Пройдено уроков: ${state.completedLessons.length} из ${lessons.length}` : "Начни первый урок — прогресс сохранится здесь";
  $("#goal-count").textContent = `${week}/4`;
  $("#challenge-count").textContent = `${week}/4`;
  $("#challenge-dots").innerHTML = Array.from({ length: 4 }, (_, i) => `<span class="${i < week ? "filled" : ""}"></span>`).join("");
  $("#listen-check").textContent = state.practiced.listen ? "✓" : "○";
  $("#build-check").textContent = state.practiced.build ? "✓" : "○";
  $("#speak-check").textContent = state.practiced.speak ? "✓" : "○";
  $("#listen-check").classList.toggle("done", state.practiced.listen);
  $("#build-check").classList.toggle("done", state.practiced.build);
  $("#speak-check").classList.toggle("done", state.practiced.speak);
  const remaining = Math.max(0, lessons.length - state.completedLessons.length);
  $("#forecast-text").textContent = remaining === 0
    ? "Стартовый модуль пройден! Открой подробный план: там контрольная точка A1 и следующий маршрут к A2. Этот процент считает занятия, а не подтверждает уровень."
    : `В стартовом модуле осталось тем: ${remaining}. Следующее занятие доступно сразу. После вводных тем переходи к контрольным заданиям A1; процент не является официальным тестом уровня.`;
  renderSkills();
}

function renderLessons() {
  $("#lesson-list").innerHTML = lessons.map(lesson => {
    const done = state.completedLessons.includes(lesson.id);
    return `<button class="lesson-card ${done ? "done" : ""}" data-lesson="${lesson.id}">
      <span class="lesson-number">${done ? "✓" : lesson.number}</span><span class="lesson-card-content"><b>${lesson.title}</b><small>${lesson.subtitle} · ${lesson.time}</small></span><span class="lesson-card-arrow">${done ? "↻" : "→"}</span>
    </button>`;
  }).join("");
}

function renderDialogue() {
  $("#dialogue-lines").innerHTML = currentDialogue.map(line => `<div class="dialogue-line"><span class="dialogue-speaker">${line.who === "C" ? "A" : "T"}</span><span class="dialogue-text"><b>${line.fr}</b><small>${line.ru}</small><small class="speaker-name">${line.who === "C" ? "Амели" : "Томас"}</small></span><button class="sound-button" data-role="${line.who === "C" ? "amelie" : "thomas"}" data-say="${line.fr.replaceAll('"', '&quot;')}" aria-label="Прослушать реплику">♫</button></div>`).join("");
}

function updateListeningGate() {
  const button = $("#mark-listen");
  if (!button) return;
  button.disabled = !dialogueReadyToConfirm || currentLessonListenDone;
  button.textContent = currentLessonListenDone
    ? "Задание выполнено ✓"
    : dialogueReadyToConfirm ? (dialoguePlaybackFallback ? "Я прочитала весь диалог ✓" : "Я прослушала весь диалог ✓") : "Сначала послушай весь диалог";
  $("#listen-progress").textContent = currentLessonListenDone
    ? "Диалог пройден. Следующее задание уже открыто ✨"
    : dialogueReadyToConfirm
      ? dialoguePlaybackFallback ? "Озвучка недоступна. Прочитай все реплики, затем подтверди задание." : "Отметь прослушивание, чтобы открыть следующее задание."
      : "Послушай весь диалог до конца — тогда откроется следующее задание.";
  if (currentPracticeStep === 0) renderPracticeStep();
}

function renderDailyQuote() {
  const storedIndex = localStorage.getItem("bonjour-quote-index");
  const previous = storedIndex === null ? -1 : Number(storedIndex);
  let index = Math.floor(Math.random() * dailyQuotes.length);
  if (dailyQuotes.length > 1 && index === previous) index = (index + 1 + Math.floor(Math.random() * (dailyQuotes.length - 1))) % dailyQuotes.length;
  localStorage.setItem("bonjour-quote-index", String(index));
  const quote = dailyQuotes[index];
  $("#quote-text").textContent = quote.fr;
  $("#quote-translation").textContent = quote.ru;
  $("#quote-author").textContent = quote.author;
  const meme = practiceMemes[Math.floor(Math.random() * practiceMemes.length)];
  $("#meme-gif").src = `https://giphy.com/embed/${meme.id}`;
  $("#meme-title").textContent = meme.title;
  $("#meme-caption").textContent = meme.fr;
  $("#meme-translation").textContent = meme.ru;
}

function renderSkills() {
  const skillInfo = [
    ["speaking", "Говорение", "🎙️"], ["listening", "Понимание речи", "🎧"], ["grammar", "Грамматика и фразы", "✍️"], ["vocabulary", "Словарный запас", "💬"]
  ];
  $("#skill-list").innerHTML = skillInfo.map(([key, label, icon]) => `<div class="skill-row"><div class="skill-row-head"><span>${icon} &nbsp;${label}</span><b>${Math.min(100, state.skills[key])}%</b></div><div class="progress-track"><span style="width:${Math.min(100, state.skills[key])}%"></span></div></div>`).join("");
}

function renderAll() {
  renderLessons();
  updateProgressDisplays();
  renderWord();
}

function frenchVoices() {
  if (!("speechSynthesis" in window)) return [];
  const score = voice => {
    const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
    return (/natural|neural|enhanced|premium/i.test(name) ? 10 : 0) + (voice.localService === false ? 2 : 0);
  };
  return window.speechSynthesis.getVoices()
    .filter(voice => voice.lang.toLowerCase().startsWith("fr"))
    .sort((a, b) => score(b) - score(a));
}

function cleanVoiceName(voice) {
  return `${voice.name} ${voice.voiceURI}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function matchesPersonaVoice(voice, role) {
  const name = cleanVoiceName(voice);
  return role === "amelie" ? /amelie|амели/.test(name) : /thomas|томас/.test(name);
}

function renderSpeakerSettings() {
  const voices = frenchVoices();
  const selectFor = (selector, role, savedURI, russianName) => {
    const select = $(selector);
    const matching = voices.filter(voice => matchesPersonaVoice(voice, role));
    select.disabled = matching.length === 0;
    if (!matching.length) {
      select.innerHTML = `<option value="">${russianName} не найден на устройстве</option>`;
      return null;
    }
    select.innerHTML = matching.map(voice => `<option value="${voice.voiceURI.replaceAll('"', '&quot;')}">${voice.name} · ${voice.lang}</option>`).join("");
    const selected = matching.find(voice => voice.voiceURI === savedURI) || matching[0];
    select.value = selected.voiceURI;
    return selected;
  };
  const amelie = selectFor("#voice-amelie", "amelie", state.amelieVoiceURI, "Амели");
  const thomas = selectFor("#voice-thomas", "thomas", state.thomasVoiceURI, "Томас");
  state.amelieVoiceURI = amelie?.voiceURI || "";
  state.thomasVoiceURI = thomas?.voiceURI || "";
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const missing = [!amelie ? "Амели" : "", !thomas ? "Томас" : ""].filter(Boolean);
  $("#voice-help").textContent = missing.length
    ? `Не найден голос ${missing.join(" и ")}. В списке оставлены только Амели и Томас; установи недостающий французский голос в настройках телефона.`
    : `В списках оставлены только Амели и Томас. На этом устройстве: Амели — ${amelie.lang}, Томас — ${thomas.lang}.`;
}

function duckBackgroundMusic(ducked) {
  musicDucked = ducked;
  updateYouTubeMusicVolume();
}

function speakerVoice(role = "amelie") {
  const voices = frenchVoices();
  const voiceURI = role === "thomas" ? state.thomasVoiceURI : state.amelieVoiceURI;
  const preference = voices.find(voice => voice.voiceURI === voiceURI);
  if (preference) return preference;
  return voices.find(voice => matchesPersonaVoice(voice, role)) || null;
}

function speakFrench(text, onEnd, voiceOverride = null, speakerRole = "amelie", onFail = null) {
  if (!("speechSynthesis" in window)) {
    showToast("В этом браузере нет озвучивания. Попробуй открыть сайт в Chrome или Safari.");
    if (onFail) onFail();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const frenchVoice = voiceOverride || speakerVoice(speakerRole);
  if (!frenchVoice) {
    showToast(`Голос ${speakerRole === "thomas" ? "Томаса" : "Амели"} не найден в настройках телефона.`);
    if (onFail) onFail();
    return;
  }
  utterance.lang = frenchVoice.lang || "fr-FR";
  utterance.rate = 0.98;
  utterance.volume = 1;
  utterance.pitch = 1;
  utterance.voice = frenchVoice;
  utterance.onstart = () => duckBackgroundMusic(true);
  utterance.onend = () => { duckBackgroundMusic(false); if (onEnd) onEnd(); };
  utterance.onerror = () => { duckBackgroundMusic(false); if (onFail) onFail(); };
  window.speechSynthesis.speak(utterance);
}

function updateMusicButton() {
  const button = $("#music-toggle");
  button.setAttribute("aria-pressed", String(musicEnabled));
  button.setAttribute("aria-label", musicEnabled ? "Остановить французскую музыку" : "Включить французскую музыку");
  button.title = musicEnabled ? "Остановить французскую музыку" : "Включить французскую музыку";
  $("#music-label").textContent = musicEnabled ? "Музыка: вкл." : "Музыка: выкл.";
}

function effectiveMusicVolume() {
  const volume = Math.min(0.35, musicVolume * 2.5);
  return musicDucked ? volume * 0.12 : volume;
}

function updateYouTubeMusicVolume() {
  if (!youtubeMusicPlayer || typeof youtubeMusicPlayer.setVolume !== "function") return;
  youtubeMusicPlayer.setVolume(Math.round(effectiveMusicVolume() * 100));
}

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeMusicApiPromise) return youtubeMusicApiPromise;
  youtubeMusicApiPromise = new Promise((resolve, reject) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReadyHandler === "function") previousReadyHandler();
      resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      youtubeMusicApiPromise = null;
      reject(new Error("YouTube player API could not be loaded"));
    };
    document.head.append(script);
  });
  return youtubeMusicApiPromise;
}

function currentMusicTrack() {
  return musicQueue[currentMusicIndex] || frenchMusicTracks[0];
}

function showMusicTrack(track) {
  $("#music-track-title").textContent = track.title;
  $("#music-track-artist").textContent = track.artist;
}

function nextMusicTrack() {
  const previousTrackId = currentMusicTrack()?.id;
  currentMusicIndex += 1;
  if (currentMusicIndex >= musicQueue.length) {
    musicQueue = shuffleMusicTracks(frenchMusicTracks.filter(track => track.id !== previousTrackId));
    currentMusicIndex = 0;
  }
  const track = currentMusicTrack();
  showMusicTrack(track);
  if (youtubeMusicPlayer && musicEnabled) {
    youtubeMusicPlayer.setVolume(Math.round(effectiveMusicVolume() * 100));
    youtubeMusicPlayer.loadVideoById(track.id);
  }
}

function handleMusicPlayerError() {
  musicPlayerErrors += 1;
  if (musicPlayerErrors >= frenchMusicTracks.length) {
    stopBackgroundMusic();
    showToast("YouTube не разрешил встроенное воспроизведение этих клипов. Попробуй открыть подборку позже.");
    return;
  }
  nextMusicTrack();
}

function createYouTubeMusicPlayer() {
  if (youtubeMusicPlayerPromise) return youtubeMusicPlayerPromise;
  youtubeMusicPlayerPromise = loadYouTubeIframeApi().then(YT => new Promise((resolve, reject) => {
    const track = currentMusicTrack();
    showMusicTrack(track);
    let playerReady = false;
    youtubeMusicPlayer = new YT.Player("music-player", {
      width: "200",
      height: "200",
      videoId: track.id,
      playerVars: {
        autoplay: 1,
        controls: 1,
        playsinline: 1,
        rel: 0,
        origin: window.location.origin
      },
      events: {
        onReady: event => {
          playerReady = true;
          event.target.setVolume(Math.round(effectiveMusicVolume() * 100));
          if (musicEnabled) event.target.playVideo();
          else event.target.pauseVideo();
          resolve(event.target);
        },
        onStateChange: event => {
          if (event.data === YT.PlayerState.PLAYING) {
            musicEnabled = true;
            musicPlayerErrors = 0;
            updateYouTubeMusicVolume();
            updateMusicButton();
          } else if (event.data === YT.PlayerState.PAUSED) {
            musicEnabled = false;
            updateMusicButton();
          } else if (event.data === YT.PlayerState.ENDED && musicEnabled) {
            nextMusicTrack();
          }
        },
        onError: () => {
          if (!playerReady) reject(new Error("YouTube could not play the selected song"));
          else handleMusicPlayerError();
        }
      }
    });
  }));
  return youtubeMusicPlayerPromise;
}

async function startBackgroundMusic() {
  const dock = $("#music-dock");
  dock.hidden = false;
  if (currentMusicIndex < 0) currentMusicIndex = 0;
  showMusicTrack(currentMusicTrack());
  musicEnabled = true;
  updateMusicButton();
  try {
    const player = await createYouTubeMusicPlayer();
    if (!musicEnabled) return;
    player.setVolume(Math.round(effectiveMusicVolume() * 100));
    player.playVideo();
  } catch {
    musicEnabled = false;
    dock.hidden = true;
    youtubeMusicPlayerPromise = null;
    updateMusicButton();
    showToast("Не удалось запустить YouTube-плеер. Проверь подключение к интернету и попробуй ещё раз.");
  }
}

function stopBackgroundMusic() {
  musicEnabled = false;
  if (youtubeMusicPlayer && typeof youtubeMusicPlayer.pauseVideo === "function") youtubeMusicPlayer.pauseVideo();
  $("#music-dock").hidden = true;
  updateMusicButton();
}

function toggleBackgroundMusic() {
  if (musicEnabled) stopBackgroundMusic();
  else startBackgroundMusic();
}

function renderWord() {
  const deck = allWords();
  const word = deck[currentWordIndex % deck.length];
  $("#flashcard-word").textContent = word.fr;
  $("#flashcard-translation").textContent = word.ru;
  $("#word-index").textContent = (currentWordIndex % deck.length) + 1;
  $("#word-total").textContent = deck.length;
  $("#known-count").textContent = deck.filter(item => state.knownWords.includes(item.fr)).length;
  $("#flashcard").classList.remove("revealed");
}

function allWords() {
  const activity = lessonActivities[currentFlowLessonId] || lessonActivities.hello;
  return [...activity.words, ...state.customWords];
}

function nextWord(markKnown) {
  const deck = allWords();
  const word = deck[currentWordIndex % deck.length];
  if (markKnown && !state.knownWords.includes(word.fr)) {
    state.knownWords.push(word.fr);
    state.skills.vocabulary = Math.min(100, state.skills.vocabulary + 4);
    showToast("Добавлено в знакомые слова — отлично!");
  }
  currentWordIndex = (currentWordIndex + 1) % deck.length;
  saveState();
}

function openLesson(lessonId) {
  const lesson = lessons.find(item => item.id === lessonId);
  if (!lesson) return;
  const isDone = state.completedLessons.includes(lesson.id);
  $("#lesson-dialog-content").innerHTML = `<button class="dialog-close" id="close-lesson" aria-label="Закрыть">×</button><p class="eyebrow">УРОК ${lesson.number} · ${lesson.time}${isDone ? " · УЖЕ ПРОЙДЕН" : ""}</p><h2>${lesson.title}</h2><p>${lesson.description}</p><div class="lesson-example"><b>${lesson.phrase}</b><small>${lesson.translation}</small><button class="text-button" data-say="${lesson.phrase.replaceAll('"', '&quot;')}">♫ Послушать фразу</button></div><p><strong>Попробуй:</strong> пройди четыре коротких задания: аудирование, говорение, квиз и карточки.</p><div class="lesson-dialog-actions"><button class="button button-primary" id="start-lesson">${isDone ? "Пройти ещё раз" : "Начать урок"} <span aria-hidden="true">→</span></button></div>`;
  const dialog = $("#lesson-dialog");
  dialog.showModal();
  $("#close-lesson").addEventListener("click", () => dialog.close());
  $("#start-lesson").addEventListener("click", () => { dialog.close(); startPracticeFlow(lesson.id); });
}

function markPractice(kind, skill, message) {
  if (!state.practiced[kind]) {
    state.practiced[kind] = true;
    state.practicedDate = todayKey();
    state.skills[skill] = Math.min(100, state.skills[skill] + 5);
    recordLessonActivity();
    saveState();
  }
  showToast(message);
}

function setupQuiz() {
  $("#quiz-title").textContent = currentQuiz.title;
  $("#quiz-description").textContent = "Выбери французский вариант.";
  $("#quiz-options").innerHTML = currentQuiz.options.map((option, i) => `<button class="quiz-option" data-answer="${i}">${option}</button>`).join("");
  $("#quiz-feedback").textContent = "";
  quizAnswered = false;
}

function answerQuiz(index) {
  if (quizAnswered) return;
  $$(".quiz-option").forEach(option => option.classList.remove("correct", "incorrect"));
  const correct = index === currentQuiz.correct;
  $$(".quiz-option").forEach((option, i) => {
    if (i === currentQuiz.correct) option.classList.add("correct");
    else if (i === index && !correct) option.classList.add("incorrect");
  });
  $("#quiz-feedback").textContent = correct ? `${currentQuiz.explanation} ✨ Даже круассан бы одобрил.` : `Почти! Французская полиция грамматики пока только выписала предупреждение. Правильный вариант: ${currentQuiz.options[currentQuiz.correct]}.`;
  if (correct) {
    quizAnswered = true;
    state.quizBest = Math.max(state.quizBest, 1);
    markPractice("build", "grammar", "Верно! Ты выполнила задание на построение фраз.");
  } else {
    quizAnswered = false;
  }
}

function normalizeSpeechText(value) {
  return value.toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[’']/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function editDistance(left, right) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= right.length; column += 1) {
      const above = previous[column];
      previous[column] = Math.min(
        previous[column] + 1,
        previous[column - 1] + 1,
        diagonal + (left[row - 1] === right[column - 1] ? 0 : 1)
      );
      diagonal = above;
    }
  }
  return previous[right.length];
}

function checkKeyboardDictation() {
  const heard = $("#dictation-input").value.trim();
  const result = $("#dictation-result");
  if (!heard) {
    result.textContent = "Сначала произнеси всю фразу через микрофон французской клавиатуры.";
    return;
  }
  const expected = normalizeSpeechText(currentTargetPhrase);
  const actual = normalizeSpeechText(heard);
  const similarity = 1 - editDistance(expected, actual) / Math.max(expected.length, actual.length, 1);
  const enoughWords = actual.split(" ").filter(Boolean).length >= Math.min(2, expected.split(" ").filter(Boolean).length);
  if (similarity >= 0.82 && enoughWords) {
    checkedTargetIndexes.add(currentTargetPhraseIndex);
    $(".dictation-target-row").classList.add("is-match");
    $("#dictation-count").textContent = `Фраза ${currentTargetPhraseIndex + 1} из ${(lessonActivities[currentFlowLessonId] || lessonActivities.hello).phrases.length} · проверено ${checkedTargetIndexes.size} из ${(lessonActivities[currentFlowLessonId] || lessonActivities.hello).phrases.length}`;
    result.textContent = `Похоже на всю фразу! Телефон услышал: «${heard}». Слова совпали; произношение автоматически не оценивается.`;
    if (checkedTargetIndexes.size === (lessonActivities[currentFlowLessonId] || lessonActivities.hello).phrases.length) {
      result.textContent += " Все реплики записаны — можно выпускать трейлер твоего французского! 🎬";
      showToast("Три фразы подряд — звезда дубляжа! ✨");
    }
    markPractice("speak", "speaking", "Фраза совпала. Хорошая практика!");
  } else {
    result.textContent = `Пока телефон услышал: «${heard}». Попробуй произнести всю фразу: «${currentTargetPhrase}». Можно выбрать следующую стрелкой.`;
  }
}

function microphoneSecureContextMessage() {
  return "Этот адрес открыт по обычному HTTP. Браузер блокирует микрофон; нужен HTTPS-адрес или localhost на том же устройстве.";
}

function updateMicrophoneStatus() {
  const status = $("#mic-status");
  const help = $("#mic-help");
  if (!window.isSecureContext) {
    status.textContent = "Заблокирован: нужен HTTPS-адрес сайта.";
    help.textContent = `Текущий адрес ${location.host} открыт по HTTP, поэтому браузер не даёт сайту записывать звук. Для прямого доступа нужен HTTPS; пока можно попробовать диктовку через французскую клавиатуру в упражнении.`;
  } else if (!navigator.mediaDevices?.getUserMedia) {
    status.textContent = "Этот браузер не предоставляет доступ к микрофону.";
    help.textContent = "Адрес защищён, но браузер не поддерживает API записи. Попробуй актуальную версию Chrome или Safari.";
  } else {
    status.textContent = "Нажми «Проверить доступ» и разреши микрофон браузеру.";
    help.textContent = "Адрес защищён. После проверки выбери «Попробовать сказать» для распознавания или запиши себя для самопроверки.";
  }
}

async function checkMicrophone() {
  const status = $("#mic-status");
  if (!window.isSecureContext) {
    status.textContent = microphoneSecureContextMessage();
    showToast("Для проверки микрофона сайту нужен HTTPS.");
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    status.textContent = "В этом браузере нет API доступа к микрофону.";
    return;
  }
  status.textContent = "Запрашиваю доступ к микрофону…";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    status.textContent = "Микрофон найден и разрешён. Попробуй речевое задание.";
  } catch (error) {
    const messages = {
      NotAllowedError: "Доступ запрещён. Разреши микрофон для сайта в настройках браузера.",
      NotFoundError: "Браузер не нашёл микрофон на устройстве.",
      NotReadableError: "Микрофон занят другим приложением или недоступен системе."
    };
    status.textContent = messages[error.name] || `Не удалось открыть микрофон (${error.name || "ошибка"}).`;
  }
}

async function recordPracticeAudio() {
  const result = $("#recognition-result");
  const button = $("#record-speech");
  const localButton = $("#record-local");
  if (mediaRecorder?.state === "recording") { mediaRecorder.stop(); return; }
  if (!window.isSecureContext) {
    result.textContent = microphoneSecureContextMessage();
    $("#voice-hint").textContent = "Нужен HTTPS для доступа к микрофону";
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    result.textContent = "Запись недоступна в этом браузере. Послушай образец, повтори фразу и отметь практику кнопкой ниже.";
    return;
  }
  try {
    recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    mediaRecorder = new MediaRecorder(recordingStream);
    mediaRecorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    mediaRecorder.onstop = () => {
      recordingStream?.getTracks().forEach(track => track.stop());
      recordingStream = null;
      button.innerHTML = "● Попробовать сказать";
      localButton.textContent = "Записать себя и прослушать";
      $("#voice-hint").textContent = "Запись готова — прослушай и сравни с примером";
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = URL.createObjectURL(new Blob(chunks, { type: mediaRecorder.mimeType || "audio/webm" }));
      result.replaceChildren(document.createTextNode("Твоя запись. Сравни ритм и звуки с образцом: "), audio);
      markPractice("speak", "speaking", "Запись сохранена для самопроверки.");
      mediaRecorder = null;
    };
    mediaRecorder.start();
    button.textContent = "Остановить запись";
    localButton.textContent = "Остановить запись";
    $("#voice-hint").textContent = "Говори по-французски, затем нажми «Остановить запись»";
    result.textContent = "Идёт запись голоса…";
  } catch (error) {
    const message = error.name === "NotAllowedError" ? "Разреши доступ к микрофону в браузере." : "Не получилось начать запись. Проверь доступ к микрофону.";
    result.textContent = message;
    button.innerHTML = "● Попробовать сказать";
    localButton.textContent = "Записать себя и прослушать";
    $("#voice-hint").textContent = "Микрофон недоступен";
  }
}

function startSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const result = $("#recognition-result");
  const button = $("#record-speech");
  if (mediaRecorder?.state === "recording") { mediaRecorder.stop(); return; }
  if (!window.isSecureContext) {
    result.textContent = microphoneSecureContextMessage();
    $("#voice-hint").textContent = "Нужен HTTPS для доступа к микрофону";
    return;
  }
  if (!SpeechRecognition) {
    result.textContent = "В этом браузере нет распознавания речи. Вместо него можно записать себя и прослушать запись.";
    recordPracticeAudio();
    return;
  }
  const recognition = new SpeechRecognition();
  let receivedResult = false;
  recognition.lang = "fr-FR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  result.textContent = "Подключаю микрофон… Скажи: Je m’appelle …";
  $("#voice-hint").textContent = "Говори по-французски";
  button.textContent = "Слушаю…";
  recognition.onstart = () => { result.textContent = "Слушаю… Скажи фразу по-французски."; };
  recognition.onresult = event => {
    receivedResult = true;
    const transcript = event.results[0][0].transcript;
    $("#dictation-input").value = transcript;
    checkKeyboardDictation();
    result.textContent = `Распознано: «${transcript}». ${$("#dictation-result").textContent}`;
    button.innerHTML = "● Попробовать сказать";
    $("#record-local").textContent = "Записать себя и прослушать";
    $("#voice-hint").textContent = "Можно повторить фразу";
  };
  recognition.onerror = event => {
    const messages = {
      "not-allowed": "Браузер не разрешил микрофон. Проверь разрешение сайта.",
      "service-not-allowed": "Сервис распознавания речи заблокирован браузером.",
      network: "Не удалось подключиться к сервису распознавания. Проверь интернет.",
      "no-speech": "Речь не услышана. Нажми кнопку и попробуй сказать чуть громче.",
      "audio-capture": "Браузер не смог подключиться к микрофону."
    };
    result.textContent = messages[event.error] || `Распознавание остановилось (${event.error}). Можно записать себя и прослушать.`;
    button.innerHTML = "● Попробовать сказать";
    $("#record-local").textContent = "Записать себя и прослушать";
    $("#voice-hint").textContent = "Можно попробовать ещё раз";
  };
  recognition.onend = () => {
    button.innerHTML = "● Попробовать сказать";
    if (!receivedResult && result.textContent.startsWith("Слушаю")) result.textContent = "Ничего не распознано. Проверь микрофон и попробуй ещё раз.";
  };
  try { recognition.start(); } catch { button.innerHTML = "● Попробовать сказать"; result.textContent = "Микрофон уже активен. Подожди и попробуй снова."; }
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ app: "bonjour-french", version: 1, exportedAt: new Date().toISOString(), state }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "bonjour-progress.json";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Резервная копия скачана.");
}

async function importProgress(file) {
  try {
    const backup = JSON.parse(await file.text());
    const imported = backup.state || backup;
    if (!imported || typeof imported !== "object" || !Array.isArray(imported.completedLessons)) throw new Error("Неверный формат");
    state = {
      ...structuredClone(initialState), ...imported,
      musicAutoEnabled: false,
      sessionMinutes: [20, 30, 60].includes(Number(imported.sessionMinutes)) ? Number(imported.sessionMinutes) : 20,
      musicVolume: Number.isFinite(Number(imported.musicVolume))
        ? Math.max(0, Math.min(0.14, Number(imported.musicVolume) * (Number(imported.musicVolumeVersion || 1) < 2 ? 1.75 : 1)))
        : initialState.musicVolume,
      musicVolumeVersion: 2,
      amelieVoiceURI: imported.amelieVoiceURI || "",
      thomasVoiceURI: imported.thomasVoiceURI || "",
      practiced: { ...initialState.practiced, ...(imported.practiced || {}) },
      skills: { ...initialState.skills, ...(imported.skills || {}) }
    };
    musicVolume = state.musicVolume;
    saveState();
    renderSpeakerSettings();
    updateMusicVolumeDisplay();
    showToast("Прогресс перенесён на это устройство.");
  } catch { showToast("Не удалось прочитать копию. Выбери JSON-файл bonjour-progress."); }
}

function updateMusicVolumeDisplay() {
  const output = $("#music-volume-output");
  output.textContent = musicVolume === 0 ? "выкл." : musicVolume <= 0.045 ? "очень тихо" : musicVolume <= 0.09 ? "тихо" : "умеренно";
  updateYouTubeMusicVolume();
}

function openProfile() {
  $("#name-input").value = state.name;
  $("#session-length").value = String(state.sessionMinutes);
  $("#music-volume").value = String(musicVolume);
  renderSpeakerSettings();
  updateMusicVolumeDisplay();
  updateMicrophoneStatus();
  $("#profile-dialog").showModal();
}

function bindEvents() {
  $$("[data-view]").forEach(button => button.addEventListener("click", () => {
    if (button.dataset.view === "practice") startPracticeFlow();
    else setView(button.dataset.view);
  }));
  $$("[data-go]").forEach(button => button.addEventListener("click", () => {
    if (button.dataset.go === "practice") startPracticeFlow();
    else setView(button.dataset.go);
  }));
  $("#exit-practice").addEventListener("click", () => setView("learn"));
  $("#step-back").addEventListener("click", () => movePracticeStep(-1));
  $("#step-next").addEventListener("click", () => movePracticeStep(1));
  $("#dictation-prev").addEventListener("click", () => moveDictationTarget(-1));
  $("#dictation-next").addEventListener("click", () => moveDictationTarget(1));
  $("#roleplay-options").addEventListener("click", event => {
    const option = event.target.closest("[data-roleplay-answer]");
    if (option) answerRoleplay(Number(option.dataset.roleplayAnswer), option);
  });
  $("#media-links").addEventListener("click", event => {
    const card = event.target.closest("[data-video-id]");
    if (card) openVideoPlayer(card.dataset.videoId, card.dataset.videoTitle);
  });
  $("#close-video").addEventListener("click", () => closeVideoPlayer());
  $("#practice-video-launch").addEventListener("click", event => openPracticeVideo(event.currentTarget.dataset.videoId));
  $("#music-toggle").addEventListener("click", toggleBackgroundMusic);
  $("#music-skip").addEventListener("click", nextMusicTrack);
  $("#music-close").addEventListener("click", stopBackgroundMusic);
  $("#voice-amelie").addEventListener("change", event => {
    state.amelieVoiceURI = event.target.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  });
  $("#voice-thomas").addEventListener("change", event => {
    state.thomasVoiceURI = event.target.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  });
  $("#preview-amelie").addEventListener("click", () => speakFrench("Bonjour ! Comment tu t'appelles ?", null, null, "amelie"));
  $("#preview-thomas").addEventListener("click", () => speakFrench("Bonjour ! Je m'appelle Thomas.", null, null, "thomas"));
  $("#music-volume").addEventListener("input", event => {
    musicVolume = Math.max(0, Math.min(0.14, Number(event.target.value)));
    state.musicVolume = musicVolume;
    state.musicVolumeVersion = 2;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateMusicVolumeDisplay();
  });
  $("#check-mic").addEventListener("click", checkMicrophone);
  $("#open-profile").addEventListener("click", openProfile);
  $("#close-profile").addEventListener("click", () => $("#profile-dialog").close());
  $("#cancel-profile").addEventListener("click", () => $("#profile-dialog").close());
  $("#profile-form").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#name-input").value.trim();
    state.name = name;
    state.sessionMinutes = Number($("#session-length").value);
    state.amelieVoiceURI = $("#voice-amelie").value || state.amelieVoiceURI;
    state.thomasVoiceURI = $("#voice-thomas").value || state.thomasVoiceURI;
    state.musicVolume = musicVolume;
    state.musicVolumeVersion = 2;
    saveState();
    $("#profile-dialog").close();
    showToast(name ? `Enchantée, ${name}! ✨ Настройки сохранены.` : "Настройки сохранены.");
  });
  $("#profile-dialog").addEventListener("click", event => { if (event.target === $("#profile-dialog")) $("#profile-dialog").close(); });
  $("#vocab-dialog").addEventListener("click", event => { if (event.target === $("#vocab-dialog")) $("#vocab-dialog").close(); });
  $("#lesson-list").addEventListener("click", event => {
    const card = event.target.closest("[data-lesson]");
    if (card) openLesson(card.dataset.lesson);
  });
  document.addEventListener("click", event => {
    const sayButton = event.target.closest("[data-say]");
    if (sayButton) speakFrench(sayButton.dataset.say, null, null, sayButton.dataset.role || "amelie");
  });
  $("#play-dialogue").addEventListener("click", () => {
    const token = ++dialoguePlaybackToken;
    let index = 0;
    if (!currentLessonListenDone) {
      dialogueReadyToConfirm = false;
      dialoguePlaybackFallback = false;
      updateListeningGate();
    }
    $("#play-dialogue").textContent = "▶ Диалог звучит…";
    const playNext = () => {
      if (token !== dialoguePlaybackToken) return;
      if (index >= currentDialogue.length) {
        $("#play-dialogue").textContent = "↻ Послушать ещё раз";
        if (!currentLessonListenDone) {
          dialogueReadyToConfirm = true;
          dialoguePlaybackFallback = false;
          updateListeningGate();
        }
        return;
      }
      const line = currentDialogue[index++];
      const speaker = line.who === "C" ? "amelie" : "thomas";
      speakFrench(line.fr, () => setTimeout(playNext, 460), null, speaker, () => {
        if (token !== dialoguePlaybackToken) return;
        $("#play-dialogue").textContent = "▶ Озвучка недоступна";
        if (!currentLessonListenDone) {
          dialogueReadyToConfirm = true;
          dialoguePlaybackFallback = true;
          updateListeningGate();
        }
      });
    };
    playNext();
  });
  $("#mark-listen").addEventListener("click", () => {
    if (!dialogueReadyToConfirm) {
      showToast("Сначала дослушай диалог целиком.");
      return;
    }
    currentLessonListenDone = true;
    markPractice("listen", "listening", "Диалог пройден. Следующее задание открыто ✨");
    updateListeningGate();
  });
  $("#mark-speak").addEventListener("click", () => markPractice("speak", "speaking", "Разговорная практика отмечена!"));
  $("#record-speech").addEventListener("click", startSpeechRecognition);
  $("#record-local").addEventListener("click", recordPracticeAudio);
  $("#check-dictation").addEventListener("click", checkKeyboardDictation);
  $("#quiz-options").addEventListener("click", event => {
    const option = event.target.closest("[data-answer]");
    if (option) answerQuiz(Number(option.dataset.answer), option);
  });
  $("#flashcard").addEventListener("click", () => $("#flashcard").classList.toggle("revealed"));
  $("#flashcard").addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); $("#flashcard").classList.toggle("revealed"); } });
  $("#word-known").addEventListener("click", () => nextWord(true));
  $("#word-hard").addEventListener("click", () => { showToast("Хорошо, это слово встретится ещё раз."); currentWordIndex = (currentWordIndex + 1) % allWords().length; renderWord(); });
  $("#add-vocab").addEventListener("click", () => $("#vocab-dialog").showModal());
  $("#close-vocab").addEventListener("click", () => $("#vocab-dialog").close());
  $("#cancel-vocab").addEventListener("click", () => $("#vocab-dialog").close());
  $("#vocab-form").addEventListener("submit", event => {
    event.preventDefault();
    const fr = $("#vocab-fr").value.trim();
    const ru = $("#vocab-ru").value.trim();
    if (!fr || !ru) return;
    state.customWords.push({ fr, ru, say: fr });
    currentWordIndex = allWords().length - 1;
    saveState();
    $("#vocab-form").reset();
    $("#vocab-dialog").close();
    showToast("Новое слово добавлено в карточки.");
  });
  $("#export-data").addEventListener("click", exportProgress);
  $("#import-file").addEventListener("change", event => { const file = event.target.files[0]; if (file) importProgress(file); event.target.value = ""; });
}

function init() {
  renderDailyQuote();
  renderPracticeContent();
  bindEvents();
  renderAll();
  renderPracticeStep();
  renderSpeakerSettings();
  if (location.hash === "#learn") setView("learn");
  if (!state.name) setTimeout(openProfile, 450);
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", renderSpeakerSettings);
  }
  updateMicrophoneStatus();
  updateMusicVolumeDisplay();
}

init();
