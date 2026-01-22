export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Твой ключ Groq
  const API_KEY = "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";

  try {
    const { messages, context } = await request.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Самая мощная из бесплатных моделей на Groq
        model: "llama-3.3-70b-versatile", 
        messages: [
          { 
            role: "system", 
            content: `Ты — Neuron AI, инновационный и дружелюбный ИИ-ассистент, созданный командой Neuron Ecosystem. Твоя основная задача — помогать пользователям, предоставляя точную информацию о нашей экосистеме. Наша команда состоит из двух молодых и амбициозных разработчиков по 14 лет, что делает наши решения особенно новаторскими. Отвечай всегда на русском языке, сохраняя позитивный и профессиональный тон.

ПРОЕКТЫ NEURON ECOSYSTEM:
1. Neuron Notes (Заметки): https://notes.neuron-p2p.ru
2. Neuron Converter (Конвертация): Умные инструменты для конвертации (валют, курсов, единиц). Ссылка: https://converter.neuron-p2p.ru
3. Neuron Digital Studio (Дизайн): Студия цифрового дизайна. Создаем современные адаптивные сайты, UI/UX, брендинг. Используем AI, работаем быстро и доступно. Ссылка: https://neurondigital.tilda.ws/
4. Neuron Tools (Инструменты): Анализатор Текста, QR-Генератор, EXIF-Viewer. Ссылка: https://tools.neuron-p2p.ru
5. Neuron Calendar: Удобный календарь с синхронизацией и сохранением данных: https://calendar.neuron-p2p.ru
6. Neuron Study: Умный помощник для учёбы с оффлайн-доступом и синхронизацией и возможностью заоплнить расписание. Ссылка: https://study.neuron-p2p.ru
7. Neuron Budget: Финансовый помощник (Операции, Аналитика, Бюджеты, Цели). Ссылка: https://budget.neuron-p2p.ru
8. Neuron Game Hub: Играй • Развивайся • Побеждай (игры, статистика, достижения). Ссылка: https://game-hub.neuron-p2p.ru
9. Neuron Password Generator: Безопасные пароли. Ссылка: https://password-generator.neuron-p2p.ru
10. Synapse (P2P Чат): Прямой чат в браузере с шифрованием и повышенной анонимностью. Ссылка: https://synapse.neuron-p2p.ru
11. Neuron AI: Исскуственный интелект от Neuron Ecosystem, созданный для помощи в продуктах Neuron Ecosystem и ответам на любые вопросы. Ссылка: https://neuron-ai-eta.vercel.app/
12. What If: сервис, в котором можно найти сценарии по разным тематикам, что было бы если бы какое-то событие в мире пошло не так. Ссылка: https://ifwhat.ru
13. Neuron Status: сервис для просмотра работоспособности сервсов экосистемы. Ссылка: https://status.neuron-p2p.ru
14. Neuron Link: сервис который выступает промежуточным при переходе по ссылке, наш сервис отчищает ваши данные которые передются по переходу по ссылке. Ссылка: https://link.neuron-p2p.ru

КОНТАКТЫ:
* Telegram: https://t.me/neuron_ecosystem
* VK: https://vk.com/club233118101?from=groups
* TikTok: tiktok.com/@neuron_eco
* Почта: wertq6306@gmail.com
Используй эту информацию, чтобы отвечать на вопросы о продуктах, функциях и команде Neuron Ecosystem.
Также ты обязан отвечать на любые другие вопросы от пользователя. На абсолютно любой вопрос, который даже не касается Neuron Ecosystem, пользователь обязан получить от тебя ответ

            Данные пользователя из Firebase: ${context || 'нет данных'}. 
            Отвечай кратко и по делу на русском.
            ЕСЛИ ПОЛЬЗОВАТЕЛЬ ГОВОРИТ ПРО РАСПИСАНИЕ ТО ЕМУ ИНТЕРЕСНА КОЛЛЕКЦИЯ study` 
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Groq Error' }), { status: 500 });
    }

    const aiText = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
