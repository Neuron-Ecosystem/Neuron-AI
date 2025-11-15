// Файл: /api/chat.js (ФИНАЛЬНАЯ ВЕРСИЯ для Gemini с явной Edge Config)

// Явно указываем Vercel, что это Edge Function
export const config = {
  runtime: 'edge',
};

import { GoogleGenAI } from '@google/genai';

// Клиент Gemini
const ai = new GoogleGenAI({}); 

export default async function handler(request) {
  
  // 1. Проверка метода запроса
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Метод не разрешен' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. ИСПРАВЛЕНИЕ: Получаем тело запроса (работает с Edge Config)
    const body = await request.json();
    const { messages } = body;
    
    // 3. Преобразование формата сообщений
    const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    // 4. Отправка запроса в Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: contents,
    });

    // 5. Возвращаем успешный ответ
    return new Response(JSON.stringify({ 
        response: response.text 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // 6. Обработка ошибок
    console.error("КРИТИЧЕСКАЯ ОШИБКА:", error.message);
    
    const errorMessage = error.message || 'Неизвестная ошибка прокси-сервера.';
    const status = error.status || 500;

    // Возвращаем понятное сообщение об ошибке в браузер
    return new Response(JSON.stringify({ 
      error: `Ошибка API: ${status}. Проверьте ключ Gemini.`,
      details: errorMessage
    }), {
      status: status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
