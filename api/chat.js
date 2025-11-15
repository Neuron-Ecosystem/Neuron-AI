// Файл: /api/chat.js

import { GoogleGenAI } from '@google/genai';

// Клиент автоматически использует переменную GEMINI_API_KEY, 
// установленную в настройках Vercel.
const ai = new GoogleGenAI({}); 

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Метод не разрешен' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages } = await request.json();
    
    // Преобразование формата сообщений OpenAI в формат Gemini
    const contents = messages.map(msg => ({
        // Роль 'system' будет проигнорирована, но 'user' и 'model' работают
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    // Отправляем запрос в Gemini Pro Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Быстрая и бесплатная модель
      contents: contents,
    });

    // Возвращаем ответ модели
    return new Response(JSON.stringify({ 
        response: response.text 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    // Возвращаем понятное сообщение об ошибке в браузер
    return new Response(JSON.stringify({ 
      error: `Ошибка API: ${error.message}.`,
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
