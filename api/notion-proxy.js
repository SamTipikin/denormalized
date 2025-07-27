export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { database_id, query } = req.body;
  const notion_token = process.env.NOTION_TOKEN;

  if (!database_id || !notion_token) {
    return res.status(400).json({ error: 'Missing database_id or NOTION_TOKEN' });
  }

  const notionRes = await fetch(`https://api.notion.com/v1/databases/${database_id}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${notion_token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(query || {})
  });

  const data = await notionRes.json();
  return res.status(notionRes.status).json(data);
}
