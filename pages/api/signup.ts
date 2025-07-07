// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../database/index';  // Adjust this path based on your project structure

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

  const { userid, password, role } = req.body;

  if (!userid || !password || !role) {
    return res.status(400).json({ message: 'userid, password, and role are required' });
  }

  try {
    // 1. Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE userid = $1', [userid]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert user
    const result = await pool.query(
      'INSERT INTO users (userid, password, role) VALUES ($1, $2, $3) RETURNING id, userid, role',
      [userid, hashedPassword, role]
    );
    const newUser = result.rows[0];

    // 4. Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, userid: newUser.userid, role: newUser.role },
      process.env.JWT_KEY || 'secretJTW_TEST_DEMO',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      userid: newUser.userid,
      role: newUser.role,
      token,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
