// Файл: /api/chat.js

// Явно указываем Vercel, что это Edge Function для обеспечения совместимости с request.json()
export const config = {
  runtime: 'edge',
};

import { GoogleGenAI } from '@google/genai';

// Инициализируем клиента Gemini. Он использует GEMINI_API_KEY из настроек Vercel.
const ai = new GoogleGenAI({}); 

export default async function handler(request) {
  
  // Проверка метода запроса
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Метод не разрешен' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Получаем тело запроса (работает с Edge Config)
    const body = await request.json();
    const { messages } = body;
    
    // Преобразование формата сообщений из Frontend (OpenAI style) в формат Gemini
    const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    // Отправка запроса в Gemini Pro Flash
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
