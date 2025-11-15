// Файл: /api/chat.js (ФИНАЛЬНАЯ ИСПРАВЛЕННАЯ ВЕРСИЯ для Gemini)

// Явно указываем Vercel, что это Edge Function
export const config = {
  runtime: 'edge',
};

import { GoogleGenAI } from '@google/genai';

// *******************************************************************
// ИСПРАВЛЕНИЕ: Явно считываем ключ из Vercel Environment Variables
// *******************************************************************
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error('Ключ GEMINI_API_KEY не найден в переменных окружения.');
}

// Передаем ключ в конструктор, чтобы избежать ошибки "ключ API должен быть установлен"
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
    
    // Преобразование формата сообщений
    const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

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

    // Возвращаем понятное сообщение об ошибке в браузер
    return new Response(JSON.stringify({ 
      error: `Ошибка API ${status}. Проверьте ключ Gemini.`,
      details: errorMessage
    }), {
      status: status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
