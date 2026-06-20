export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = process.env.ODDS_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'ODDS_API_KEY no configurada en Vercel' });
  }

  try {
    const apiRes = await fetch(
      `https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds/?apiKey=${key}&regions=us,eu&markets=h2h&oddsFormat=decimal`
    );
    const data = await apiRes.json();
    const remaining = apiRes.headers.get('x-requests-remaining') || '';
    res.setHeader('x-requests-remaining', remaining);
    res.status(apiRes.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
