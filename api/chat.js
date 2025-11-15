// Файл: /api/chat.js

import { GoogleGenAI } from '@google/genai';

// Инициализируем клиента Gemini.
// Он автоматически ищет ключ в переменной окружения GEMINI_API_KEY.
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
    // 2. ИСПРАВЛЕНИЕ: Получаем тело запроса
    // Используем await request.json() для корректной работы в Vercel Edge Runtime
    const body = await request.json();
    const { messages } = body;
    
    // 3. Преобразование формата сообщений
    // Преобразуем формат, пришедший с фронтенда (OpenAI style), 
    // в формат, необходимый для Gemini.
    const contents = messages.map(msg => ({
        // Роль 'system' будет проигнорирована, но 'user' и 'model' работают
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    // 4. Отправка запроса в Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Быстрая и бесплатная модель
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
    // 6. Обработка ошибок (например, неверный ключ API)
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
