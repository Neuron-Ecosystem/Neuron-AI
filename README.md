# Neuron AI — frontend + Vercel proxy

## Что внутри
- `index.html` — фронтенд (запросы отправляются на `/api/deepseek`)
- `api/deepseek.js` — serverless функция (Vercel). Проксирует запросы к DeepSeek и хранит ключ в env.

## Как развернуть на Vercel (рекомендуется)
1. Создай репозиторий на GitHub и запушь этот код.
2. Зарегистрируйся на https://vercel.com и подключи GitHub-репозиторий (Import Project).
3. В `Project Settings` -> `Environment Variables` добавь:
   - `DEEPSEEK_KEY` = `sk-...` (твой ключ)
4. Деплой закончится автоматически — зайди на `https://<project>.vercel.app`:
   - фронт доступен по корню,
   - прокси — `https://<project>.vercel.app/api/deepseek`.

## Локальная проверка
- Для локального теста можно использовать `vercel dev` (если установлен Vercel CLI) — команда поднимет локальный dev-сервер с функциями.
- Убедись, что локально установлен DEEPSEEK_KEY как переменная окружения.

## Безопасность
- Никогда не коммить ключ в публичный репозиторий.
- После тестов — ротируй ключ (создай новый в DeepSeek и удалите старый).
