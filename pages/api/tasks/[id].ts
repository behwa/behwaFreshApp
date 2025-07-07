import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../database/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method === 'DELETE') {
    try {
      await db.query('DELETE FROM tasks WHERE id = $1', [id]);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  } else if (method === 'PUT') {
    const { title, description, status, assignee } = req.body;
    try {
      const { rows } = await db.query(
        `UPDATE tasks SET title=$1, description=$2, status=$3, assignee=$4 WHERE id=$5 RETURNING *`,
        [title, description, status, assignee, id]
      );
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
