// Neuron AI - Умный помощник для экосистемы Neuron
class NeuronAI {
    constructor() {
        this.isActive = false;
        this.chatHistory = [];
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
            
            // Общие команды
            'привет': () => this.sendResponse('Привет! Я Neuron AI. Чем могу помочь?'),
            'как дела': () => this.sendResponse('Отлично! Готов помочь вам с экосистемой Neuron! 🚀'),
            'спасибо': () => this.sendResponse('Всегда рад помочь! 😊'),
            
            // Информация о проекте
            'кто ты': () => this.sendResponse('Я Neuron AI - умный помощник экосистемы Neuron. Создан чтобы помогать пользователям ориентироваться во всех наших сервисах!'),
            'что такое neuron': () => this.sendResponse('Neuron Ecosystem - это коллекция полезных инструментов и игр, созданных молодой командой. Включает конвертер валют, игры, образовательные инструменты и многое другое!'),
            'возраст': () => this.sendResponse('Нашей команде по 14 лет! Мы создаем крутые проекты несмотря на юный возраст 🎯'),
            'создатель': () => this.sendResponse('Neuron Ecosystem создан молодой командой из двух человек по 14 лет! Мы развиваем проект с любовью ❤️'),
        };
    }

    async processMessage(input) {
        const message = input.toLowerCase().trim();
        this.addMessage(message, 'user');
        
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
            const aiResponse = this.generateSmartResponse(message);
            this.sendResponse(aiResponse);
        }, 1500);
    }

    findLocalResponse(message) {
        for (const [key, response] of Object.entries(this.responses)) {
            if (message.includes(key)) {
                return response;
            }
        }
        return null;
    }

    generateSmartResponse(message) {
        if (message.includes('погода')) {
            return 'К сожалению, я не могу получить данные о погоде. Рекомендую использовать специализированные сервисы!';
        }
        
        if (message.includes('время')) {
            return `Сейчас ${new Date().toLocaleTimeString('ru-RU')}`;
        }
        
        if (this.containsQuestion(message)) {
            const responses = [
                "Интересный вопрос! Как AI-помощник, я специализируюсь на помощи с экосистемой Neuron. Могу помочь с нашими инструментами!",
                "Пока я лучше всего разбираюсь в сервисах Neuron Ecosystem. Спросите о играх, конвертере или других наших инструментах!",
                "Отличный вопрос! Рекомендую воспользоваться нашими инструментами - они бесплатны и очень полезны!",
                "Как AI Neuron, я постоянно учусь. А пока могу помочь вам с нашими сервисами - просто спросите! 🚀"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        return "Извините, сейчас у меня ограниченные возможности. Но я отлично разбираюсь в экосистеме Neuron! Спросите о наших сервисах 🎯";
    }

    containsQuestion(text) {
        const questionWords = ['как', 'что', 'где', 'когда', 'почему', 'зачем', 'кто', 'чей', 'который'];
        return questionWords.some(word => text.toLowerCase().includes(word)) || text.includes('?');
    }

    // Навигация по экосистеме
    showHelp() {
        const helpText = `
🎯 **Neuron Ecosystem - Полный гид:**

📱 **Основные сервисы:**
• 🎮 Game Hub - коллекция игр
• 💱 Конвертер валют 
• 📝 Заметки и органайзер
• 🎓 Neuron Study - учеба и расписание
• 🔐 Генератор паролей

💡 **Просто спросите:**
"открой игры", "покажи конвертер", "заметки"

🔧 **Команды:**
"помощь" - показать это сообщение
"привет" - поздороваться

Создано с ❤️ командой Neuron (14 лет)
        `;
        this.sendResponse(helpText);
    }

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
    }

    renderChatHistory() {
        const chat = document.getElementById('aiChat');
        chat.innerHTML = '';
        
        // Добавляем приветственное сообщение
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
                </div>
            </div>
        `;
        chat.appendChild(welcomeMsg);
        
        // Восстанавливаем историю
        this.chatHistory.forEach(msg => {
            this.renderMessage(msg.text, msg.sender);
        });
    }

    setupEventListeners() {
        // Авто-фокус на input при открытии
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
        
        // Показываем статус записи
        neuronAI.sendResponse('🎤 Слушаю... Говорите!');
    } else {
        neuronAI.sendResponse('Голосовой ввод не поддерживается в вашем браузере');
    }
}

function clearChat() {
    if (confirm('Очистить историю чата?')) {
        neuronAI.chatHistory = [];
        neuronAI.saveChatHistory();
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
                    </div>
                </div>
            </div>
        `;
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    neuronAI = new NeuronAI();
});
