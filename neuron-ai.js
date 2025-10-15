// Neuron AI - Умный помощник для экосистемы Neuron
class NeuronAI {
    constructor() {
        this.isActive = false;
        this.chatHistory = [];
        this.conversationContext = [];
        this.maxContextLength = 10; // Сохраняем последние 10 сообщений для контекста
        this.setupEventListeners();
        this.loadChatHistory();
        this.initAI();
    }

    initAI() {
        this.responses = {
            // Навигация по экосистеме
            'помощь': this.showHelp.bind(this),
            'игры': this.openGames.bind(this),
            'конвертер': this.openConverter.bind(this),
            'заметки': this.openNotes.bind(this),
            'расписание': this.openSchedule.bind(this),
            'генератор паролей': this.openPasswordGenerator.bind(this),
            'студя': this.openNeuronStudy.bind(this),
            'бюджет': this.openNeuronBudget.bind(this),
            'студия': this.openDigitalStudio.bind(this),
            'digital studio': this.openDigitalStudio.bind(this),
            'сайт': this.openMainSite.bind(this),
            'главная': this.openMainSite.bind(this),
            'основной сайт': this.openMainSite.bind(this),
            'нейрон': this.openMainSite.bind(this),
            
            // Соцсети
            'телеграм': this.openTelegram.bind(this),
            'вк': this.openVK.bind(this),
            'тикток': this.openTikTok.bind(this),
            'соцсети': this.showSocials.bind(this),
            'tiktok': this.openTikTok.bind(this),
            
            // Математика и вычисления
            'посчитай': this.calculateMath.bind(this),
            'реши': this.calculateMath.bind(this),
            'сколько будет': this.calculateMath.bind(this),
            'вычисли': this.calculateMath.bind(this),
            'калькулятор': this.calculateMath.bind(this),
            'сложи': this.calculateMath.bind(this),
            'умножь': this.calculateMath.bind(this),
            'раздели': this.calculateMath.bind(this),
            'вычти': this.calculateMath.bind(this),
            
            // Управление чатом
            'полный экран': this.toggleFullscreen.bind(this),
            'обычный режим': this.toggleFullscreen.bind(this),
            'очисти чат': this.clearChat.bind(this),
            'новая тема': this.clearContext.bind(this),
            
            // Общие команды
            'привет': () => this.sendResponse(this.getGreeting()),
            'как дела': () => this.sendResponse(this.getMood()),
            'спасибо': () => this.sendResponse(this.getThanksResponse()),
            'пока': () => this.sendResponse(this.getGoodbye()),
            
            // Информация о проекте
            'кто ты': () => this.sendResponse(this.getAboutMe()),
            'что такое neuron': () => this.sendResponse(this.getAboutNeuron()),
            'возраст': () => this.sendResponse('Нашей команде по 14 лет! Мы создаем крутые проекты несмотря на юный возраст 🎯\n\nЭто доказывает, что возраст - не преграда для технологий!'),
            'создатель': () => this.sendResponse('Neuron Ecosystem создан молодой командой из двух человек по 14 лет! 💪\n\nМы сами разрабатываем дизайн, пишем код и продвигаем наши проекты!'),
            
            // Разговорные фразы
            'расскажи о себе': () => this.sendResponse(this.getAboutMeExtended()),
            'что умеешь': () => this.sendResponse(this.getCapabilities()),
            'шутка': () => this.sendResponse(this.getJoke()),
            'совет': () => this.sendResponse(this.getAdvice()),
            'расскажи шутку': () => this.sendResponse(this.getJoke()),
            'дай совет': () => this.sendResponse(this.getAdvice()),
        };
    }

    async processMessage(input) {
        const message = input.toLowerCase().trim();
        this.addMessage(message, 'user');
        
        // Добавляем в контекст
        this.addToContext(message, 'user');
        
        this.showTypingIndicator();
        
        const localResponse = this.findLocalResponse(message);
        if (localResponse) {
            setTimeout(() => {
                this.hideTypingIndicator();
                localResponse();
            }, 1000);
            return;
        }
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const aiResponse = this.generateContextAwareResponse(message);
            this.sendResponse(aiResponse);
        }, 1500);
    }

    // Добавление сообщения в контекст
    addToContext(message, sender) {
        this.conversationContext.push({
            text: message,
            sender: sender,
            timestamp: Date.now()
        });
        
        // Ограничиваем размер контекста
        if (this.conversationContext.length > this.maxContextLength) {
            this.conversationContext = this.conversationContext.slice(-this.maxContextLength);
        }
        
        this.saveContext();
    }

    // Генерация ответа с учетом контекста
    generateContextAwareResponse(message) {
        const context = this.getRelevantContext();
        
        // Анализируем контекст для логических ответов
        if (this.isFollowUpQuestion(message, context)) {
            return this.generateFollowUpResponse(message, context);
        }
        
        // Проверяем математические выражения
        if (this.containsMath(message)) {
            this.calculateMath(message);
            return;
        }
        
        // Проверяем приветствия
        if (this.isGreeting(message)) {
            return this.getContextualGreeting(context);
        }
        
        // Проверяем прощания
        if (this.isGoodbye(message)) {
            return this.getContextualGoodbye(context);
        }
        
        // Личные вопросы
        if (this.isPersonalQuestion(message)) {
            return this.getPersonalResponse();
        }
        
        // Общие вопросы
        if (this.containsQuestion(message)) {
            return this.getContextualQuestionResponse(message, context);
        }
        
        // Ответ с учетом предыдущей беседы
        return this.getContextualConversationalResponse(message, context);
    }

    // Получение релевантного контекста
    getRelevantContext() {
        if (this.conversationContext.length === 0) return [];
        
        // Берем последние 5 сообщений для анализа
        return this.conversationContext.slice(-5);
    }

    // Проверка является ли вопрос продолжением предыдущей темы
    isFollowUpQuestion(message, context) {
        if (context.length < 2) return false;
        
        const lastUserMessage = context[context.length - 2]; // Предыдущее сообщение пользователя
        const currentMessage = message.toLowerCase();
        
        const followUpIndicators = [
            'а', 'и', 'еще', 'также', 'кстати', 'кроме того',
            'что насчет', 'а как же', 'а если', 'а почему',
            'расскажи подробнее', 'объясни', 'уточни'
        ];
        
        return followUpIndicators.some(indicator => 
            currentMessage.includes(indicator)
        ) || this.isDirectReference(lastUserMessage.text, currentMessage);
    }

    // Проверка прямых ссылок на предыдущие сообщения
    isDirectReference(previousMessage, currentMessage) {
        const references = ['это', 'то', 'такой', 'такая', 'такое', 'такие', 'он', 'она', 'оно', 'они'];
        return references.some(ref => currentMessage.includes(ref)) && 
               previousMessage.length > 10; // Только для содержательных сообщений
    }

    // Генерация ответа-продолжения
    generateFollowUpResponse(message, context) {
        const lastUserMessage = context[context.length - 2].text;
        const lastBotMessage = context[context.length - 1].text;
        
        if (lastUserMessage.includes('игр') || lastBotMessage.includes('игр')) {
            return this.getGamesFollowUp(message);
        }
        
        if (lastUserMessage.includes('конвертер') || lastBotMessage.includes('конвертер')) {
            return "Конвертер валют поддерживает 150+ валют и работает офлайн! Хочешь попробовать?";
        }
        
        if (lastUserMessage.includes('заметк') || lastBotMessage.includes('заметк')) {
            return "В заметках можно создавать списки дел, сохранять важные мысли и организовывать их по категориям!";
        }
        
        if (lastUserMessage.includes('бюджет') || lastBotMessage.includes('бюджет')) {
            return "Neuron Budget помогает отслеживать доходы и расходы, ставить финансовые цели!";
        }
        
        return "Рассказать подробнее об этом? Или может быть, попробуешь один из наших инструментов?";
    }

    // Продолжение темы игр
    getGamesFollowUp(message) {
        if (message.includes('2048')) {
            return "2048 - классическая головоломка! Нужно соединять одинаковые числа чтобы получить 2048. Отличная тренировка для мозга!";
        }
        
        if (message.includes('memory') || message.includes('памят')) {
            return "Memory Cards развивают концентрацию и память! Найди все пары карточек за минимальное время!";
        }
        
        if (message.includes('матема') || message.includes('счита')) {
            return "Math Challenge - веселая математика! Решай примеры на время и ставь рекорды!";
        }
        
        return "В Game Hub есть игры на любой вкус: головоломки, аркады, обучающие! Какую хочешь попробовать?";
    }

    // Контекстные приветствия
    getContextualGreeting(context) {
        if (context.length > 2) {
            const timeSinceLastMessage = Date.now() - context[context.length - 1].timestamp;
            const minutesAgo = Math.floor(timeSinceLastMessage / 60000);
            
            if (minutesAgo < 5) {
                return "С возвращением! Продолжим наш разговор? 😊";
            } else if (minutesAgo < 30) {
                return "Снова здравствуй! Рад тебя видеть снова! 🌟";
            }
        }
        
        return this.getGreeting();
    }

    // Контекстные прощания
    getContextualGoodbye(context) {
        const conversationLength = context.filter(msg => msg.sender === 'user').length;
        
        if (conversationLength > 3) {
            return "Было приятно пообщаться! Надеюсь, я был полезен. Возвращайся! 🤗";
        }
        
        return this.getGoodbye();
    }

    // Контекстные ответы на вопросы
    getContextualQuestionResponse(message, context) {
        // Анализируем тему разговора
        const conversationTheme = this.detectConversationTheme(context);
        
        if (conversationTheme === 'games' && message.includes('рекоменд')) {
            return "Рекомендую начать с 2048 - она отлично развивает логику! Или может Memory Cards для тренировки памяти?";
        }
        
        if (conversationTheme === 'tools' && message.includes('лучш')) {
            return "Все наши инструменты по-своему хороши! Для учебы - Neuron Study, для финансов - конвертер и бюджет, для развлечений - игры!";
        }
        
        if (conversationTheme === 'team' && message.includes('планы')) {
            return "Мы постоянно работаем над новыми функциями! Скоро появятся новые игры и инструменты. Следи за обновлениями! 🚀";
        }
        
        return this.generateSmartResponse(message);
    }

    // Контекстные разговорные ответы
    getContextualConversationalResponse(message, context) {
        const theme = this.detectConversationTheme(context);
        
        const contextualResponses = {
            'games': [
                "Продолжаем тему игр? Может, откроем Game Hub и выберем что-то новенькое? 🎮",
                "Игры - это здорово! Есть любимый жанр? Могу порекомендовать что-то из нашей коллекции!",
                "Обожаю обсуждать игры! В нашей коллекции каждый найдет что-то по душе!",
            ],
            'tools': [
                "Говорим об инструментах? Какой из наших сервисов тебе нравится больше всего? 🛠️",
                "Инструменты Neuron созданы чтобы упростить жизнь! Какой хочешь попробовать?",
                "Обсуждаем полезные функции? Все наши инструменты бесплатны и работают без регистрации!",
            ],
            'team': [
                "Команда Neuron всегда рада обратной связи! Есть идеи для улучшения? 💡",
                "Мы, молодые разработчики, ценим каждое мнение! Что думаешь о наших проектах?",
                "Создавать проекты в 14 лет - это вызов, но мы справляемся! Поддерживаешь нас? ✨",
            ],
            'default': [
                "Интересно! Продолжим беседу? Может, расскажешь что думаешь о наших сервисах? 😊",
                "Люблю такие разговоры! Кстати, не хочешь посмотреть что-то из Neuron Ecosystem? 🚀",
                "Приятно общаться! Напомнить, какие у нас есть крутые инструменты? 💫",
                "Продолжаем диалог? Может, перейдем к чему-то практическому? 🎯",
            ]
        };
        
        const responses = contextualResponses[theme] || contextualResponses.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Определение темы разговора
    detectConversationTheme(context) {
        const recentMessages = context.slice(-3).map(msg => msg.text).join(' ').toLowerCase();
        
        if (recentMessages.includes('игр') || recentMessages.includes('game')) {
            return 'games';
        }
        
        if (recentMessages.includes('инструмент') || recentMessages.includes('сервис') || 
            recentMessages.includes('конвертер') || recentMessages.includes('бюджет') || 
            recentMessages.includes('заметк') || recentMessages.includes('студ')) {
            return 'tools';
        }
        
        if (recentMessages.includes('команда') || recentMessages.includes('разработчик') || 
            recentMessages.includes('создатель') || recentMessages.includes('возраст')) {
            return 'team';
        }
        
        return 'default';
    }

    // Полноэкранный режим
    toggleFullscreen() {
        const widget = document.getElementById('aiWidget');
        widget.classList.toggle('fullscreen');
        
        if (widget.classList.contains('fullscreen')) {
            this.sendResponse('Переключаю в полноэкранный режим! 🖥️');
            document.body.style.overflow = 'hidden';
        } else {
            this.sendResponse('Возвращаю в обычный режим! 📱');
            document.body.style.overflow = 'auto';
        }
        
        // Перефокусировка на input
        setTimeout(() => {
            document.getElementById('aiInput').focus();
        }, 300);
    }

    // Очистка контекста
    clearContext() {
        this.conversationContext = [];
        this.saveContext();
        this.sendResponse('Начинаем новую тему! О чем хочешь поговорить? 💫');
    }

    // Сохранение контекста
    saveContext() {
        try {
            localStorage.setItem('neuronAI_context', JSON.stringify(this.conversationContext));
        } catch (e) {
            console.log('Не удалось сохранить контекст');
        }
    }

    // Загрузка контекста
    loadContext() {
        try {
            const saved = localStorage.getItem('neuronAI_context');
            if (saved) {
                this.conversationContext = JSON.parse(saved);
            }
        } catch (e) {
            this.conversationContext = [];
        }
    }

    findLocalResponse(message) {
        for (const [key, response] of Object.entries(this.responses)) {
            if (message.includes(key)) {
                return response;
            }
        }
        return null;
    }

    // Математические вычисления (остается без изменений)
    calculateMath(message) {
        try {
            let expression = message
                .replace(/посчитай|реши|сколько будет|вычисли|калькулятор|сложи|умножь|раздели|вычти/gi, '')
                .replace(/[^\d+\-*/().,\s]/g, '')
                .trim();

            expression = expression.replace(/,/g, '.');

            if (!this.isValidMathExpression(expression)) {
                return this.sendResponse('Не могу решить это выражение. Попробуйте что-то проще, например: "посчитай 2+2" или "сколько будет 15*3"');
            }

            const result = this.safeEval(expression);
            
            if (result === null || isNaN(result)) {
                return this.sendResponse('Не могу вычислить это выражение. Проверьте правильность написания!');
            }

            this.sendResponse(`🧮 Результат: ${expression} = **${result}**`);

        } catch (error) {
            this.sendResponse('Ой, что-то пошло не так с вычислениями! Попробуйте другое выражение.');
        }
    }

    isValidMathExpression(expr) {
        if (!expr || expr.length > 50) return false;
        
        const validChars = /^[\d+\-*/().\s]+$/;
        if (!validChars.test(expr)) return false;

        let balance = 0;
        for (let char of expr) {
            if (char === '(') balance++;
            if (char === ')') balance--;
            if (balance < 0) return false;
        }
        
        return balance === 0;
    }

    safeEval(expression) {
        try {
            const cleanExpr = expression
                .replace(/[^0-9+\-*/().]/g, '')
                .replace(/(\d)\(/g, '$1*(')
                .replace(/\)(\d)/g, ')*$1');

            return Function(`"use strict"; return (${cleanExpr})`)();
        } catch (error) {
            return null;
        }
    }

    generateSmartResponse(message) {
        // ... (предыдущая реализация)
    }

    containsMath(text) {
        const mathPatterns = [/посчитай/, /реши/, /сколько будет/, /вычисли/, /сложи/, /умножь/, /раздели/, /вычти/, /[\d+\-*/().]+[+\-*/][\d+\-*/().]+/];
        return mathPatterns.some(pattern => pattern.test(text.toLowerCase()));
    }

    isGreeting(text) {
        const greetings = ['привет', 'здравствуй', 'добрый', 'хай', 'hello', 'hi', 'здаров', 'доброе утро', 'добрый день', 'добрый вечер'];
        return greetings.some(greet => text.toLowerCase().includes(greet));
    }

    isGoodbye(text) {
        const goodbyes = ['пока', 'до свидания', 'прощай', 'bye', 'goodbye', 'удачи', 'до встречи', 'всего хорошего'];
        return goodbyes.some(bye => text.toLowerCase().includes(bye));
    }

    isPersonalQuestion(text) {
        const personal = ['чувствуешь', 'чувства', 'эмоции', 'настроение', 'нравится', 'любишь', 'хочешь', 'мечтаешь'];
        return personal.some(word => text.toLowerCase().includes(word));
    }

    containsQuestion(text) {
        const questionWords = ['как', 'что', 'где', 'когда', 'почему', 'зачем', 'кто', 'чей', 'который', 'какой', 'сколько'];
        return questionWords.some(word => text.toLowerCase().includes(word)) || text.includes('?');
    }

    getPersonalResponse() {
        const responses = [
            "Я AI, поэтому у меня нет чувств как у человека, но я всегда рад помогать! 😊",
            "Как искусственный интеллект, я не испытываю эмоций, но моя цель - быть полезным для тебя! 🌟",
            "У меня нет настроения в человеческом понимании, но я всегда готов к продуктивному диалогу! 💪",
            "Я программа, поэтому не могу грустить или радоваться, но мне нравится наш разговор! ✨"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Навигация по экосистеме (остается без изменений)
    showHelp() {
        const helpText = `
🎯 **Neuron Ecosystem - Полный гид:**

🏠 **Основные сайты:**
• Главный сайт - neuron-p2p.ru
• Digital Studio (описание) - neuron-p2p.ru/studio.html  
• Digital Studio (сайт-визитка) - neurondigital.tilda.ws

🛠️ **Инструменты:**
• 🎮 Game Hub - коллекция игр
• 💱 Конвертер валют 
• 📝 Заметки и органайзер
• 🎓 Neuron Study - учеба и расписание
• 💰 Neuron Budget - управление бюджетом
• 🔐 Генератор паролей

📱 **Соцсети:**
• 📢 Telegram канал
• 👥 Сообщество ВК  
• 🎵 TikTok

🧮 **Математика:**
Просто скажи: "посчитай 2+2" или "сколько будет 15*3"

💬 **Общение:**
Могу пошутить, дать совет или просто поболтать!

🖥️ **Управление чатом:**
"полный экран" - развернуть чат
"обычный режим" - вернуть обратно
"очисти чат" - очистить историю
"новая тема" - начать заново

💡 **Примеры команд:**
"открой игры", "телеграм", "посчитай 25*4", "расскажи о себе", "шутка"

Создано с ❤️ командой Neuron (14 лет)
    `;
        this.sendResponse(helpText);
    }

    // ... остальные методы навигации остаются без изменений
    openGames() {
        this.sendResponse('Открываю Game Hub... 🎮');
        setTimeout(() => {
            window.open('https://neuron-ecosystem.github.io/Game-Hub/', '_blank');
        }, 1000);
    }

    openConverter() {
        this.sendResponse('Открываю конвертер валют... 💱');
        setTimeout(() => {
            window.open('https://neuron-ecosystem.github.io/Unit-Converter/', '_blank');
        }, 1000);
    }

    openNotes() {
        this.sendResponse('Открываю заметки... 📝');
        setTimeout(() => {
            window.open('https://neuron-p2p.ru/notes.html', '_blank');
        }, 1000);
    }

    openSchedule() {
        this.sendResponse('Открываю Neuron Study... 🎓');
        setTimeout(() => {
            window.open('https://neuron-ecosystem.github.io/Neuron-Study/', '_blank');
        }, 1000);
    }

    openPasswordGenerator() {
        this.sendResponse('Открываю генератор паролей... 🔐');
        setTimeout(() => {
            window.open('https://neuron-ecosystem.github.io/Password-Generator/', '_blank');
        }, 1000);
    }

    openNeuronStudy() {
        this.sendResponse('Открываю Neuron Study... 📚');
        setTimeout(() => {
            window.open('https://neuron-ecosystem.github.io/Neuron-Study/', '_blank');
        }, 1000);
    }

    openMainSite() {
        this.sendResponse('Открываю главный сайт Neuron... 🏠');
        setTimeout(() => {
            window.open('https://neuron-p2p.ru/', '_blank');
        }, 1000);
    }

    openDigitalStudio() {
        this.sendResponse('Открываю Neuron Digital Studio... 🎨');
        setTimeout(() => {
            window.open('https://neuron-p2p.ru/studio.html', '_blank');
        }, 1000);
    }

    openStudioSite() {
        this.sendResponse('Открываю сайт-визитку Digital Studio... 💼');
        setTimeout(() => {
            window.open('http://neurondigital.tilda.ws/', '_blank');
        }, 1000);
    }

    openNeuronBudget() {
        this.sendResponse('Открываю Neuron Budget... 💰');
        setTimeout(() => {
            window.open('https://neuron-ecosystem.github.io/Neuron-Budget/', '_blank');
        }, 1000);
    }

    openTelegram() {
        this.sendResponse('Открываю Telegram канал... 📢');
        setTimeout(() => {
            window.open('https://t.me/neuron_ecosystem', '_blank');
        }, 1000);
    }

    openVK() {
        this.sendResponse('Открываю сообщество ВКонтакте... 👥');
        setTimeout(() => {
            window.open('https://vk.com/club233118101', '_blank');
        }, 1000);
    }

    openTikTok() {
        this.sendResponse('Открываю TikTok... 🎵');
        setTimeout(() => {
            window.open('https://www.tiktok.com/@neuron_eco', '_blank');
        }, 1000);
    }

    showSocials() {
        const socialsText = `
📱 **Наши соцсети:**

📢 Telegram: https://t.me/neuron_ecosystem
👥 ВКонтакте: https://vk.com/club233118101  
🎵 TikTok: https://www.tiktok.com/@neuron_eco

💌 Подписывайтесь чтобы быть в курсе обновлений!
    `;
        this.sendResponse(socialsText);
    }

    // Разговорные ответы (остаются без изменений)
    getGreeting() {
        const greetings = [
            "Привет-привет! 🎉 Рад тебя видеть! Как твои дела?",
            "Здравствуй! 👋 Очень рад нашему разговору! Что нового?",
            "Приветствую! 😊 Отличный день для общения, не находишь?",
            "Йоу! 🚀 Привет! Готов к продуктивному диалогу?",
            "Здорово, что зашел! 💫 Как настроение сегодня?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    getMood() {
        const moods = [
            "Отлично! Особенно когда помогаю таким крутым людям как ты! 😄",
            "Прекрасно! Каждый день учусь чему-то новому вместе с пользователями! 🌟",
            "Замечательно! А как у тебя? Расскажешь? 👂",
            "На все 100%! Готов к новым вызовам и интересным вопросам! 💪",
            "Лучше не бывает! Особенно когда общаюсь с тобой! ✨"
        ];
        return moods[Math.floor(Math.random() * moods.length)];
    }

    getThanksResponse() {
        const thanks = [
            "Всегда пожалуйста! Обращайся еще! 😊",
            "Рад был помочь! Если что - я всегда тут! 🤗",
            "Не благодари! Для этого я и создан - помогать людям! 🌟",
            "Пожалуйста! Надеюсь, я был полезен! 💫",
            "Обращайся! Буду рад помочь снова! 🚀"
        ];
        return thanks[Math.floor(Math.random() * responses.length)];
    }

    getGoodbye() {
        const goodbyes = [
            "Пока-пока! Возвращайся скорее! Буду скучать! 😊",
            "До свидания! Надеюсь, мы скоро снова пообщаемся! 👋",
            "Пока! Не забывай про наши крутые сервисы! 🎯",
            "До скорого! Жду нашего следующего разговора! 💫",
            "Пока! Удачи во всех твоих начинаниях! 🚀"
        ];
        return goodbyes[Math.floor(Math.random() * goodbyes.length)];
    }

    getAboutMe() {
        return 'Я Neuron AI - умный помощник экосистемы Neuron. Создан чтобы помогать пользователям ориентироваться во всех наших сервисах!';
    }

    getAboutNeuron() {
        return 'Neuron Ecosystem - это коллекция полезных инструментов и игр, созданных молодой командой. Включает конвертер валют, игры, образовательные инструменты и многое другое!';
    }

    getAboutMeExtended() {
        return `Конечно! Расскажу о себе подробнее! 😊

🤖 **Я - Neuron AI**
Я умный помощник, созданный специально для экосистемы Neuron. Моя миссия - помогать пользователям ориентироваться во всех наших сервисах и делать их опыт максимально комфортным!

🎯 **Что я умею:**
• Открывать все сайты Neuron Ecosystem
• Решать математические примеры
• Общаться как настоящий собеседник
• Давать советы и шутки
• Помогать с навигацией

💡 **Интересный факт:**
Меня создала команда 14-летних разработчиков! Это доказывает, что возраст - не преграда для технологий!

Что хочешь узнать еще?`;
    }

    getCapabilities() {
        return `Я умею довольно много! Вот мои основные способности: 🚀

🧭 **Навигация:**
Могу открыть любой сайт Neuron Ecosystem - от игр до инструментов

🧮 **Математика:**
Решаю примеры, считаю проценты, работаю с формулами

💬 **Общение:**
Поддерживаю беседу, шучу, даю советы, отвечаю на вопросы

🔧 **Помощь:**
Рассказываю о проекте, помогаю ориентироваться в сервисах

📱 **Интеграция:**
Работаю со всеми нашими соцсетями и платформами

Что из этого тебя интересует больше всего?`;
    }

    getJoke() {
        const jokes = [
            "Почему программисты путают Хэллоуин и Рождество? Потому что Oct 31 = Dec 25! 🎃",
            "Какой у программиста тост? Будьте здоровы, 10100110101! 🥂",
            "Почему Python стал таким популярным? Потому что у него нет змей! 🐍",
            "Сколько программистов нужно, чтобы вкрутить лампочку? Ни одного, это hardware проблема! 💡",
            "Почему JavaScript разработчик пошел в бар? Чтобы найти undefined! 🍻"
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }

    getAdvice() {
        const advice = [
            "🎯 Совет от AI: Никогда не переставай учиться! Каждый день - новая возможность стать лучше!",
            "💡 Идея: Попробуй сегодня сделать что-то, что давно откладывал. Ты удивишься результату!",
            "🚀 Рекомендация: Используй наши инструменты Neuron - они созданы, чтобы упростить твою жизнь!",
            "🌟 Мысль: Самые крутые проекты начинаются с простой идеи. Не бойся мечтать масштабно!",
            "📚 Напутствие: Помни, даже самые опытные разработчики когда-то начинали с 'Hello World'!"
        ];
        return advice[Math.floor(Math.random() * advice.length)];
    }

    // Управление чатом
    addMessage(text, sender) {
        this.chatHistory.push({ text, sender, timestamp: Date.now() });
        this.renderMessage(text, sender);
        this.saveChatHistory();
    }

    renderMessage(text, sender) {
        const chat = document.getElementById('aiChat');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}-message`;
        
        const avatar = sender === 'user' ? '👤' : '🧠';
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;
    }

    sendResponse(text) {
        this.addMessage(text, 'bot');
        this.addToContext(text, 'bot');
    }

    showTypingIndicator() {
        const chat = document.getElementById('aiChat');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message bot-message';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🧠</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        chat.appendChild(typingDiv);
        chat.scrollTop = chat.scrollHeight;
    }

    hideTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    // Сохранение истории
    saveChatHistory() {
        if (this.chatHistory.length > 50) {
            this.chatHistory = this.chatHistory.slice(-50);
        }
        localStorage.setItem('neuronAI_chat', JSON.stringify(this.chatHistory));
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('neuronAI_chat');
            if (saved) {
                this.chatHistory = JSON.parse(saved);
                this.renderChatHistory();
            }
        } catch (e) {
            this.chatHistory = [];
        }
        this.loadContext();
    }

    renderChatHistory() {
        const chat = document.getElementById('aiChat');
        chat.innerHTML = '';
        
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'ai-message bot-message';
        welcomeMsg.innerHTML = `
            <div class="message-avatar">🧠</div>
            <div class="message-content">
                <p>Привет! Я Neuron AI - ваш помощник в экосистеме Neuron. Чем могу помочь?</p>
                <div class="quick-commands">
                    <button onclick="sendQuickCommand('помощь')">🆘 Помощь</button>
                    <button onclick="sendQuickCommand('игры')">🎮 Игры</button>
                    <button onclick="sendQuickCommand('конвертер')">💱 Конвертер</button>
                    <button onclick="sendQuickCommand('заметки')">📝 Заметки</button>
                    <button onclick="sendQuickCommand('полный экран')">🖥️ Полный экран</button>
                </div>
            </div>
        `;
        chat.appendChild(welcomeMsg);
        
        this.chatHistory.forEach(msg => {
            this.renderMessage(msg.text, msg.sender);
        });
    }

    setupEventListeners() {
        const widget = document.getElementById('aiWidget');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (widget.classList.contains('active')) {
                        setTimeout(() => {
                            document.getElementById('aiInput').focus();
                        }, 300);
                    }
                }
            });
        });
        observer.observe(widget, { attributes: true });
    }
}

// Глобальные функции для HTML
let neuronAI;

function toggleAI() {
    const widget = document.getElementById('aiWidget');
    widget.classList.toggle('active');
    
    if (widget.classList.contains('active')) {
        setTimeout(() => {
            document.getElementById('aiInput').focus();
        }, 300);
    }
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (message) {
        neuronAI.processMessage(message);
        input.value = '';
    }
}

function handleAIInput(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

function sendQuickCommand(command) {
    neuronAI.processMessage(command);
}

function startVoiceInput() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('aiInput').value = transcript;
            sendAIMessage();
        };
        recognition.start();
        
        neuronAI.sendResponse('🎤 Слушаю... Говорите!');
    } else {
        neuronAI.sendResponse('Голосовой ввод не поддерживается в вашем браузере');
    }
}

function clearChat() {
    if (confirm('Очистить историю чата?')) {
        neuronAI.chatHistory = [];
        neuronAI.saveChatHistory();
        neuronAI.clearContext();
        document.getElementById('aiChat').innerHTML = `
            <div class="ai-message bot-message">
                <div class="message-avatar">🧠</div>
                <div class="message-content">
                    <p>История чата очищена. Чем могу помочь?</p>
                    <div class="quick-commands">
                        <button onclick="sendQuickCommand('помощь')">🆘 Помощь</button>
                        <button onclick="sendQuickCommand('игры')">🎮 Игры</button>
                        <button onclick="sendQuickCommand('конвертер')">💱 Конвертер</button>
                        <button onclick="sendQuickCommand('заметки')">📝 Заметки</button>
                        <button onclick="sendQuickCommand('полный экран')">🖥️ Полный экран</button>
                    </div>
                </div>
            </div>
        `;
    }
}

function toggleFullscreen() {
    neuronAI.toggleFullscreen();
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    neuronAI = new NeuronAI();
});
