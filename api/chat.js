// Файл: /api/chat.js

import { OpenAI } from 'openai';

// Инициализируем клиента OpenAI.
// Vercel автоматически подставит значение OPENAI_API_KEY
// из настроек среды (Environment Variables)
const openai = new OpenAI();

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Метод не разрешен' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Получаем данные, которые пришли из браузера
    const { messages } = await request.json();

    // Отправляем запрос в OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Или "gpt-4-turbo" для лучшего качества
      messages: messages,
    });

    // Возвращаем ответ модели обратно в браузер
    return new Response(JSON.stringify({ response: completion.choices[0].message.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    return new Response(JSON.stringify({ error: 'Внутренняя ошибка сервера' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
