// middleware/authMiddleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: { userId: string; userid: string; role: string };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || 'secretJTW_TEST_DEMO');
    req.user = decoded as AuthRequest['user'];
    next();
  } catch (err) {
    console.log('test Error Auth')
    return res.status(401).json({ message: 'Invalid token - Please Login' });
  }
};
