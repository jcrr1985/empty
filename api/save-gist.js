// api/save-gist.js
export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Token not configured' });
  }

  const gist = {
    description: "Paste Angular - " + new Date().toLocaleString(),
    public: false,
    files: { "code.ts": { content: code } }
  };

  try {
    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Paste-Ninja'
      },
      body: JSON.stringify(gist)
    });

    const data = await response.json();
    if (data.id) {
      res.status(200).json({ id: data.id });
    } else {
      res.status(500).json({ error: data.message || 'Gist creation failed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
