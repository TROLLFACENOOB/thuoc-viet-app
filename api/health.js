// ============================================
// SERVERLESS FUNCTION: HEALTH CHECK
// ============================================

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const hasToken = !!process.env.GROQ_API_KEY;
  const tokenValid = process.env.GROQ_API_KEY?.startsWith('gsk_');
  
  res.status(200).json({ 
    status: 'ok',
    api: 'Groq AI',
    model: 'Llama 3.3 70B Versatile',
    timestamp: new Date().toISOString(),
    token: hasToken && tokenValid ? '✅ Valid' : '❌ Invalid/Missing',
    environment: 'Vercel Serverless'
  });
}