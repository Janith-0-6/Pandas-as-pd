const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function getPortfolioData(req) {
  if (!req?.body) return null;

  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      return parsed?.portfolioData ?? null;
    } catch {
      return null;
    }
  }

  return req.body?.portfolioData ?? null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const portfolioData = getPortfolioData(req);

    if (!portfolioData) {
      return res.status(400).json({ error: 'Missing portfolioData in request body.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfiguration: GEMINI_API_KEY is not set.' });
    }

    const prompt = [
      'Act as a Gen Z financial advisor.',
      `The user has this portfolio allocation: ${JSON.stringify(portfolioData)}.`,
      'Give them a short, 3-sentence action plan using modern Gen Z slang.'
    ].join(' ');

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 220
        }
      })
    });

    if (!response.ok) {
      const providerError = await response.text().catch(() => 'Unknown provider error');
      throw new Error(`Gemini API request failed: ${response.status} ${providerError}`);
    }

    const data = await response.json();
    const plan = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || '')
      .join('')
      .trim();

    if (!plan) {
      throw new Error('Gemini API returned an empty plan.');
    }

    return res.status(200).json({ plan });
  } catch (error) {
    console.error('generate-plan error:', error);
    return res.status(500).json({ error: 'Failed to generate plan.' });
  }
}
