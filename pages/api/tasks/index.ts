// pages/api/tasks/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../database'; // adjust your path
import { verifyToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
      res.status(200).json(rows);
    } catch (err) {
      console.error('GET /api/tasks error:', err);
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  } else if (req.method === 'POST') {
    // Example JWT auth check - you implement verifyToken yourself
    const token = req.headers.authorization?.split(' ')[1];
    const user = await verifyToken(token);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { title, description, status, assignee = 'Unknown' } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    try {
      const { rows } = await pool.query(
        'INSERT INTO tasks (title, description, status, createdBy, assignee) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description, status, user.userid, assignee]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error('POST /api/tasks error:', err);
      res.status(500).json({ message: 'Failed to create task' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
