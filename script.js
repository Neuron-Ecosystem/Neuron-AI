// --- КЛАСС "Нейронный Навигатор" (Ядро AI) ---
class NeuronNavigator {
    constructor() {
        this.projectData = {
            "главный сайт": { "name": "Главная Станция", "url": "http://neuron-p2p.ru", "desc": "Портал в нашу галактику. Сводная информация о всех цифровых спутниках Neuron." },
            "notes": { "name": "Neuron Notes (Хранилище Мыслей)", "url": "https://neuron-p2p.ru/notes.html", "desc": "Ваш личный журнал полетов. Идеален для фиксации идей и задач." },
            "converter": { "name": "Neuron Converter (Преобразователь Единиц)", "url": "https://neuron-ecosystem.github.io/Unit-Converter/", "desc": "Инструмент для мгновенного перевода физических величин. Точность, достойная космической миссии!" },
            "studio": { "name": "Neuron Digital Studio (Мастерская Кода)", "url": "https://neurondigital.tilda.ws/", "desc": "Наш центр разработки, где мы куем новые цифровые инструменты и оказываем услуги по созданию сайтов и дизайну. (О студии: http://neuron-p2p.ru/studio.html)" },
            "calendar": { "name": "Neuron Calendar (Хронометр Задач)", "url": "https://neuron-ecosystem.github.io/Calendar/", "desc": "Ваша временная шкала. Помогает синхронизировать задачи и ключевые события." },
            "study": { "name": "Neuron Study (Образовательный Модуль)", "url": "https://neuron-ecosystem.github.io/Neuron-Study/", "desc": "Инструмент для структурирования учебного процесса. Превращает хаос знаний в упорядоченную нейронную сеть." },
            "budget": { "name": "Neuron Budget (Контроль Ресурсов)", "url": "https://neuron-ecosystem.github.io/Neuron-Budget/", "desc": "Система учета личных финансов. Держите свой космический бюджет под абсолютным контролем." },
            "game": { "name": "Neuron Game Hub (Центр Развлечений)", "url": "https://neuron-ecosystem.github.io/Game-Hub/", "desc": "Отсек релаксации. Наши игры для снятия напряжения после долгих цифровых полетов." },
            "password": { "name": "Neuron Password Generator (Ключ Безопасности)", "url": "https://neuron-ecosystem.github.io/Password-Generator/", "desc": "Создает криптостойкие пароли. Ваш личный щит от киберугроз." },
        };
        this.greetings = ["Приветствую, Астронавт!", "На связи, Нейронный Навигатор!", "🚀 Звездолет готов к старту!"];
        this.farewells = ["Миссия выполнена. Отключаюсь.", "Удачного полета!", "Перехожу в режим гибернации. Конец связи!"];
    }

    get_response(user_input) {
        const cleanInput = user_input.toLowerCase().trim();

        if (["привет", "здравствуй", "начать", "старт", "hi"].some(word => cleanInput.includes(word))) {
            return ${this.greetings[0]} Я здесь, чтобы помочь вам сориентироваться в нашей цифровой галактике. Спрашивайте о любом проекте **Neuron**.;
        }

        for (const [keyword, data] of Object.entries(this.projectData)) {
            if (cleanInput.includes(keyword) || cleanInput.includes(data.name.toLowerCase().split('(')[0].trim())) {
                return this._formatProjectInfo(data);
            }
        }

        if (["кто ты", "что ты", "ии", "ai", "о тебе"].some(word => cleanInput.includes(word))) {
            returnНейронный Навигаторор**, ядро искусственного интеллеNeuron Ecosystemem**. Мой программный код насчитывает более 30 световых лет опыта. Я ваш цифровой штурман!";
        }
        
        if (["стиль", "космический", "дизайн"].some(word => cleanInput.includes(word))) {
            return "Наша стилистика — технологичный космосос**. Мы вдохновляемся глубинами космоса, нейронными сетями и футуристическими технологиями. Темные фоны, неоновые акценты и чистота линий – это наш цифровой мир.";
        }

        if (["связь", "поддержка", "контакт", "почта", "соцсети", "телеграм"].some(word => cleanInput.includes(word))) {
            return this._formatContactInfo();
        }
        if (["пока", "спасибо", "отключись", "стоп", "конец", "благодарю"].some(word => cleanInput.includes(word))) {
            return ${this.farewells[1]} Не забудьте вернуться! Перехожу в режим гибернации. Конец связи!;
        }
        
        if (cleanInput.includes("очистить историю")) {
            return "Обнаружена команда очистки архива. История диалога сброшена. Приступаем к новой миссии!";
        }


        return "Не удалось найти точный маршрут к вашему запросу. Мы просканировали всю нашу базу знаний. Вы спрашиваете о конкретном модуле (Notes, Budget, Studio)? Или вам нужна общая навигация?";
    }

    _formatProjectInfo(data) {
        return (
            🛰️ **Обнаружен Объект: ${data.name}**\n\n +
            **Функция:** ${data.desc}\n +
            **Координаты (URL):** <a href="${data.url}" target="_blank">${data.url}</a>\n\n +
            "Надеюсь, этот маршрут проложит курс вашей продуктивности!"
        );
    }

    _formatContactInfo() {
        return (
    Координаты Центра Управления Полетами (Связь):и (Связь):**\n" +
            1. **Telegram Канал (Общие Новости):** <a href="https://t.me/neuron_ecosystem" target="_blank">t.me/neuron_ecosystem</a>\n +
TikTok (Канал Трансляций):л Трансляций):** <a href='https://tiktok.com/@neuron_eco' target='_blank'>tiktok.com/@neuron_eco</a>\n" +
ВК Сообщество (База Связи): (База Связи):** <a href='https://vk.com/club233118101?from=groups' target='_blank'>VK</a>\n" +
Почта Поддержки (Прямой Канал):Прямой Канал):** wertq6306@gmail.com\n\n" +
            "Используйте эти каналы для установления контNeuron Ecosystemuron Ecosystem**!"
        );
    }
}


// --- DOM ИНТЕГРАЦИЯ И ОБРАБОТЧИКИ СОБЫТИЙ С LOCALSTORAGE ---
document.addEventListener('DOMContentLoaded', () => {
    const navigator = new NeuronNavigator();
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const contactInfoBtn = document.getElementById('contact-info-btn');
    
    const CHAT_STORAGE_KEY = 'neuron_chat_history';
    let chatHistory = [];

    /**
     * Загружает историю из LocalStorage и отображает ее.
     */
    const loadChatHistory = () => {
        const storedHistory = localStorage.getItem(CHAT_STORAGE_KEY);
        chatWindow.innerHTML = ''; // Очищаем контейнер

        if (storedHistory) {
            try {
                chatHistory = JSON.parse(storedHistory);
                chatHistory.forEach(msg => appendMessage(msg.text, msg.sender, false));
            } catch (e) {
                console.error("Ошибка при парсинге истории чата:", e);
                chatHistory = [];
            }
        }
        
        // Добавляем начальное сообщение от AI, только если история пуста
        if (chatHistory.length === 0) {
            const initialMessage = "🪐 Приветствую, Астронавт! Я Нейронный Навигатор, ядро искусственного интеллекта Neuron Ecosystem. Готов проКакое созвездие Neuron вас интересует сегодня?есует сегодня?**";
            appendMessage(initialMessage, 'ai', true); // Сохраняем это приветствие для начала истории
        }
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    /**
     * Сохраняет текущую историю в LocalStorage.
     */
    const saveChatHistory = () => {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
    };


    /**
     * Добавляет сообщение в DOM и, при необходимости, в историю.
     */
    const appendMessage = (message, sender, save = true) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', ${sender}-message);
        
  текстЗамена **текст** на <strong>текст</strong> и обработка ссылок
        let formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        messageDiv.innerHTML = <p>${formattedMessage}</p>;
        
        chatWindow.appendChild(messageDiv);

                if (save) {
            chatHistory.push({ text: message, sender: sender });
            saveChatHistory();
        }
    };
    
    const processUserInput = () => {
        const query = userInput.value.trim();
        if (!query) return;

        // 1. Команда очистки истории
        if (query.toLowerCase().trim() === "очистить историю") {
            appendMessage(query, 'user');
            
            // Задержка для эффекта
            setTimeout(() => {
                const clearResponse = navigator.get_response(query);
                localStorage.removeItem(CHAT_STORAGE_KEY);
                chatHistory = [];
                
                appendMessage(clearResponse, 'ai', false); // Не сохраняем в историю, т.к. она пуста
                
                // Перезагружаем чат, чтобы появилось только стартовое сообщение
                loadChatHistory();
            }, 500);
            
            userInput.value = '';
            return; 
        }

        // 2. Вывод сообщения пользователя и сохранение
        appendMessage(query, 'user');
        
        // 3. Генерация ответа AI
        const aiResponse = navigator.get_response(query);
        
        // 4. Вывод ответа AI с задержкой и сохранение
        setTimeout(() => {
            appendMessage(aiResponse, 'ai'); 
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 500);

        // 5. Очистка поля ввода
        userInput.value = '';
        userInput.focus();
    };

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---
    
    // Загрузка истории при старте
    loadChatHistory(); 

    // Отправка по кнопке
    sendBtn.addEventListener('click', processUserInput);

    // Отправка по нажатию Enter
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processUserInput();
        }
    });

    // Быстрый доступ к контактам через навигационную кнопку
    contactInfoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const contactQuery = "покажи контакты";
        appendMessage(contactQuery, 'user');
        
        const aiResponse = navigator.get_response(contactQuery);
        setTimeout(() => {
             appendMessage(aiResponse, 'ai');
             chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 500);
    });

});
