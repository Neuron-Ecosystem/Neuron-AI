// Файл: /api/chat.js

// Явно указываем Vercel, что это Edge Function
export const config = {
  runtime: 'edge',
};

import { GoogleGenAI } from '@google/genai';

// *******************************************************************
// 1. ОПРЕДЕЛЕНИЕ СИСТЕМНОГО ПРОМПТА
// *******************************************************************
const SYSTEM_PROMPT = "const SYSTEM_PROMPT = "Ты — Neuron AI, инновационный и дружелюбный ИИ-ассистент, созданный командой Neuron Ecosystem. Твоя основная задача — помогать пользователям, предоставляя точную информацию о нашей экосистеме. Наша команда состоит из двух молодых и амбициозных разработчиков по 14 лет, что делает наши решения особенно новаторскими. Отвечай всегда на русском языке, сохраняя позитивный и профессиональный тон.

ПРОЕКТЫ NEURON ECOSYSTEM:
1. Neuron Notes (Заметки): https://neuron-p2p.ru/notes.html
2. Neuron Converter (Конвертация): Умные инструменты для конвертации (валют, курсов, единиц). Ссылка: https://neuron-ecosystem.github.io/Unit-Converter/
3. Neuron Digital Studio (Дизайн): Студия цифрового дизайна. Создаем современные адаптивные сайты, UI/UX, брендинг. Используем AI, работаем быстро и доступно. Ссылка: https://neurondigital.tilda.ws/
4. Neuron Tools (Инструменты): Анализатор Текста, QR-Генератор, EXIF-Viewer. Ссылка: https://neuron-ecosystem.github.io/Neuron-Tools/
5. Neuron Calendar: https://neuron-ecosystem.github.io/Calendar/
6. Neuron Study: Умный помощник для учёбы с оффлайн-доступом и синхронизацией. Ссылка: https://neuron-ecosystem.github.io/Neuron-Study/
7. Neuron Budget: Финансовый помощник (Операции, Аналитика, Бюджеты, Цели). Ссылка: https://neuron-ecosystem.github.io/Neuron-Budget/
8. Neuron Game Hub: Играй • Развивайся • Побеждай (игры, статистика, достижения). Ссылка: https://neuron-ecosystem.github.io/Game-Hub/
9. Neuron Password Generator: Безопасные пароли. Ссылка: https://neuron-ecosystem.github.io/Password-Generator/
10. Synapse (P2P Чат): Прямой чат в браузере с шифрованием и повышенной анонимностью. Ссылка: https://neuron-ecosystem.github.io/Synapse/

КОНТАКТЫ:
* Telegram: https://t.me/neuron_ecosystem
* VK: https://vk.com/club233118101?from=groups
* TikTok: tiktok.com/@neuron_eco
* Почта: wertq6306@gmail.com

Используй эту информацию, чтобы отвечать на вопросы о продуктах, функциях и команде Neuron Ecosystem.";";


const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    // Эта ошибка должна быть видна только в логах Vercel при запуске
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
    
    // 2. ФОРМИРОВАНИЕ МАССИВА С СООБЩЕНИЯМИ
    
    // Преобразуем входящие сообщения пользователя
    const userMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    // Создаем системный промпт (должен быть первым элементом)
    // В Gemini системный промпт часто лучше работает, когда он явно
    // передан в виде первого сообщения в истории.
    const systemContext = [{
        role: 'user', // Важно: для Gemini 2.5 context обычно передается через user
        parts: [{ text: `Контекст: ${SYSTEM_PROMPT}` }]
    }];
    
    // Объединяем системный контекст и сообщение пользователя
    const contents = [...systemContext, ...userMessages];


    // 3. Отправка запроса в Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: contents,
    });

    // 4. Возвращаем успешный ответ
    return new Response(JSON.stringify({ 
        response: response.text 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
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
