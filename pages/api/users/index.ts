import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../database'; // adjust path if needed
import { verifyToken } from '../../../lib/auth'; // if you want to check auth

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  try {
    const user = await verifyToken(token);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await pool.query('SELECT id, userid AS name FROM users');
    console.log('GET /api/users called');
    return res.status(200).json({ users: result.rows });
  } catch (err) {
    console.error('GET /api/users error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
