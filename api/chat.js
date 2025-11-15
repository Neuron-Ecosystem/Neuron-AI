// api/deepseek.js
// Vercel serverless function — прокси для DeepSeek
// Требует переменной окружения DEEPSEEK_KEY в настройках Vercel (не хранить в коде)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const DEEPSEEK_KEY = process.env.DEEPSEEK_KEY;
  if (!DEEPSEEK_KEY) {
    return res.status(500).json({ error: 'DEEPSEEK_KEY not configured on the server' });
  }

  const body = req.body || {};
  // Валидация минимальная
  if (!body.prompt) return res.status(400).json({ error: 'prompt is required' });

  try {
    // Подготовка к вызову DeepSeek
    const apiUrl = 'https://api.deepseek.ai/v1/completions'; // предполагаемый URL
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_KEY}`
      },
      body: JSON.stringify(body),
      // не ставим mode/cors — это на сервере
    });

    const text = await resp.text();
    // Пробуем вернуть как JSON, если можно
    try {
      const json = JSON.parse(text);
      // пробрасываем код ответа от API
      return res.status(resp.status).json(json);
    } catch (e) {
      // если не JSON — вернём сырое тело
      res.status(resp.status).send(text);
    }
  } catch (err) {
    console.error('Proxy error', err);
    return res.status(500).json({ error: 'Proxy error: ' + (err.message || err) });
  }
}
