// pages/api/saveData.js
import { query } from '../../database/index';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Missing name or email' });
    }

    try {
      const insertText = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
      const result = await query(insertText, [name, email]);
      res.status(200).json({ success: true, user: result.rows[0] });
    } catch (error) {
      console.error('DB insert error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
