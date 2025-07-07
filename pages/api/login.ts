// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../database/index'; // adjust if your db path is different

type Data =
  | { userid: string; role: string; token: string }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userid, password } = req.body;

  if (!userid || !password) {
    return res.status(400).json({ message: 'userid and password are required' });
  }

  try {
    // 1. Find user by userid
    const result = await pool.query('SELECT * FROM users WHERE userid = $1', [userid]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid userid or password' });
    }

    const user = result.rows[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid userid or password' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { userId: user.id, userid: user.userid, role: user.role },
      process.env.JWT_KEY || 'secretJTW_TEST_DEMO',
      { expiresIn: '1h' }
    );

    // 4. Send response
    res.status(200).json({
      userid: user.userid,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
