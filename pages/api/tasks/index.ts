import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../database/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { rows } = await db.query('SELECT * FROM tasks ORDER BY createdtime DESC');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  } else if (req.method === 'POST') {
    const { title, description, status, createdby, assignee } = req.body;
    try {
      const { rows } = await db.query(
        `INSERT INTO tasks (title, description, status, createdtime, createdby, assignee)
         VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *`,
        [title, description, status, createdby, assignee]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
