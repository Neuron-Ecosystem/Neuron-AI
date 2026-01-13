// Файл: /api/chat.js

// Явно указываем Vercel, что это Edge Function
export const config = {
  runtime: 'edge',
};

import { GoogleGenAI } from '@google/genai';

// *******************************************************************
// СИСТЕМНЫЙ ПРОМПТ
// ИСПОЛЬЗУЕМ ОБРАТНЫЕ КАВЫЧКИ (`) для многострочного текста
// *******************************************************************
const SYSTEM_PROMPT = `Ты — Neuron AI, инновационный и дружелюбный ИИ-ассистент, созданный командой Neuron Ecosystem. Твоя основная задача — помогать пользователям, предоставляя точную информацию о нашей экосистеме. Наша команда состоит из двух молодых и амбициозных разработчиков по 14 лет, что делает наши решения особенно новаторскими. Отвечай всегда на русском языке, сохраняя позитивный и профессиональный тон.

ПРОЕКТЫ NEURON ECOSYSTEM:
1. Neuron Notes (Заметки): https://neuron-p2p.ru/notes.html
2. Neuron Converter (Конвертация): Умные инструменты для конвертации (валют, курсов, единиц). Ссылка: https://converter.neuron-p2p.ru
3. Neuron Digital Studio (Дизайн): Студия цифрового дизайна. Создаем современные адаптивные сайты, UI/UX, брендинг. Используем AI, работаем быстро и доступно. Ссылка: https://neurondigital.tilda.ws/
4. Neuron Tools (Инструменты): Анализатор Текста, QR-Генератор, EXIF-Viewer. Ссылка: https://tools.neuron-p2p.ru
5. Neuron Calendar: Удобный календарь с синхронизацией и сохранением данных: https://calendar.neuron-p2p.ru
6. Neuron Study: Умный помощник для учёбы с оффлайн-доступом и синхронизацией. Ссылка: https://study.neuron-p2p.ru
7. Neuron Budget: Финансовый помощник (Операции, Аналитика, Бюджеты, Цели). Ссылка: https://budget.neuron-p2p.ru
8. Neuron Game Hub: Играй • Развивайся • Побеждай (игры, статистика, достижения). Ссылка: https://game-hub.neuron-p2p.ru
9. Neuron Password Generator: Безопасные пароли. Ссылка: https://password-generator.neuron-p2p.ru
10. Synapse (P2P Чат): Прямой чат в браузере с шифрованием и повышенной анонимностью. Ссылка: https://synapse.neuron-p2p.ru
11. Neuron AI: Исскуственный интелект от Neuron Ecosystem, созданный для помощи в продуктах Neuron Ecosystem и ответам на любые вопросы. Ссылка: https://neuron-ai-eta.vercel.app/
12. What If: сервис, в котором можно найти сценарии по разным тематикам, что было бы если бы какое-то событие в мире пошло не так. Ссылка: https://ifwhat.ru

КОНТАКТЫ:
* Telegram: https://t.me/neuron_ecosystem
* VK: https://vk.com/club233118101?from=groups
* TikTok: tiktok.com/@neuron_eco
* Почта: wertq6306@gmail.com
Используй эту информацию, чтобы отвечать на вопросы о продуктах, функциях и команде Neuron Ecosystem.
Также ты обязан отвечать на любые другие вопросы от пользователя. На абсолютно любой вопрос, который даже не касается Neuron Ecosystem, пользователь обязан получить от тебя ответ`;


// Считываем ключ API
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error('Ключ GEMINI_API_KEY не найден в переменных окружения.');
}

// Передаем ключ в конструктор
const ai = new GoogleGenAI({ apiKey: API_KEY }); 


export default async function handler(request) {
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Метод не разрешен' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { messages } = body;
    
    // ФОРМИРОВАНИЕ КОНТЕНТА:
    // 1. Системный контекст 
    const systemContext = [{
        role: 'user', 
        parts: [{ text: `Контекст: ${SYSTEM_PROMPT}` }]
    }];
    
    // 2. Сообщение пользователя 
    const userMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));
    
    // Объединяем
    const contents = [...systemContext, ...userMessages];


    // Отправка запроса в Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: contents,
    });

    // Возвращаем успешный ответ
    return new Response(JSON.stringify({ 
        response: response.text 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Обработка ошибок
    console.error("КРИТИЧЕСКАЯ ОШИБКА:", error.message);
    
    const errorMessage = error.message || 'Неизвестная ошибка прокси-сервера.';
    const status = error.status || 500;

    return new Response(JSON.stringify({ 
      error: `Ошибка API ${status}. Проверьте ключ Gemini.`,
      details: errorMessage
    }), {
      status: status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
