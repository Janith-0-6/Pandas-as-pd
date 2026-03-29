import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = Number(process.env.PORT) || 8787;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const AI_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (curl/postman) with no origin header.
      if (!origin) {
        callback(null, true);
        return;
      }

      const isConfiguredOrigin = origin === FRONTEND_ORIGIN;
      const isLocalhostDevOrigin = /^http:\/\/localhost:\d+$/.test(origin);

      if (isConfiguredOrigin || isLocalhostDevOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    }
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'future-you-api' });
});

app.post('/api/plan', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Missing OPENAI_API_KEY on the backend environment.'
      });
    }

    const { age, income, expenses, interests, risk } = req.body ?? {};

    if (
      !Number.isFinite(Number(age)) ||
      !Number.isFinite(Number(income)) ||
      !Number.isFinite(Number(expenses)) ||
      !Array.isArray(interests) ||
      interests.length === 0 ||
      typeof risk !== 'string' ||
      risk.trim().length === 0
    ) {
      return res.status(400).json({
        error: 'Invalid request payload for generating plan.'
      });
    }

    const openai = new OpenAI({ 
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1'
    });

    const prompt = `User Data:
Age: ${age}
Income: INR ${income}
Baseline Monthly Expenses: INR ${expenses}
Interests: ${interests.join(', ')}
Risk Appetite: ${risk}

Instructions:
Create a tailored financial plan for this user taking into account their unique baseline expenses.
Mandatory personalization rules:
- You MUST explicitly reference at least two of the exact selected interests by name in BOTH life_at_60_with_investing and life_at_60_without_investing.
- You MUST avoid generic placeholders like "hobbies" or "lifestyle" when interests are available.
- In each investment_ideas[i].why_suits_user, mention a concrete link to this user's data (risk appetite, income/expenses capacity, and/or selected interests).
Output ONLY valid JSON, with nothing before or after. The JSON MUST use the exact structure:
{
  "monthly_budget": {
    "needs_percentage": number,
    "wants_percentage": number,
    "savings_percentage": number,
    "investment_percentage": number
  },
  "investment_ideas": [
    {
      "name": "string",
      "expected_annual_return": "string",
      "why_suits_user": "string",
      "min_monthly_amount": "string"
    }
  ],
  "life_at_60_with_investing": "string (2 vivid sentences)",
  "life_at_60_without_investing": "string (2 vivid sentences)",
  "key_insight": "string (one punchy sentence)"
}`;

    const msg = await openai.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: 'You are a professional wealth advisor targeting Gen Z. Give astute, sharp advice. Return pure JSON.' },
        { role: 'user', content: prompt }
      ]
    });

    const text = msg.choices?.[0]?.message?.content ?? '';
    if (!text || typeof text !== 'string') {
      return res.status(502).json({ error: 'AI provider returned an empty response.' });
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(502).json({ error: 'AI response did not include valid JSON.' });
    }

    let data;
    try {
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(502).json({ error: 'AI response JSON could not be parsed.' });
    }

    return res.json({ plan: data });
  } catch (error) {
    const upstreamMessage = error?.error?.message || error?.message || null;
    const status = Number(error?.status);

    console.error('Plan generation failed:', {
      status: Number.isFinite(status) ? status : 'unknown',
      message: upstreamMessage
    });

    return res.status(502).json({
      error: upstreamMessage
        ? `AI provider error: ${upstreamMessage}`
        : 'Failed to generate plan from AI model.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`FutureYou API running on http://localhost:${PORT}`);
});
