// pages/api/tasks/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../database';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
      if (rows.length === 0) return res.status(404).json({ message: 'Task not found' });
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error(`GET /api/tasks/${id} error:`, err);
      res.status(500).json({ message: 'Failed to retrieve task' });
    }
  } else if (req.method === 'PUT') {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await verifyToken(token);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { title, description, status, assignee } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    try {
      const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const { rows } = await pool.query(
        `UPDATE tasks 
          SET title = $1, description = $2, status = $3, assignee = $4
          WHERE id = $5 
          RETURNING *`,
        [title, description, status, assignee || 'Unknown', id]
      );

      res.status(200).json(rows[0]);
    } catch (err) {
      console.error(`PUT /api/tasks/${id} error:`, err);
      res.status(500).json({ message: 'Failed to update task' });
    }
  } else if (req.method === 'DELETE') {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await verifyToken(token);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const { rowCount } = await pool.query(
        'DELETE FROM tasks WHERE id = $1',
        [id]
      );

      if (rowCount === 0) return res.status(404).json({ message: 'Task not found' });

      res.status(204).end();
    } catch (err) {
      console.error(`DELETE /api/tasks/${id} error:`, err);
      res.status(500).json({ message: 'Failed to delete task' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
