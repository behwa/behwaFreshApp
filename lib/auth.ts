import jwt from 'jsonwebtoken';

export interface UserPayload {
  userId: string;
  userid: string;  // if you use both
  role: string;
}

export function verifyToken(token?: string): UserPayload | null {
  if (!token) return null;

  try {
    const secret = process.env.JWT_KEY || 'secretJTW_TEST_DEMO';
    const decoded = jwt.verify(token, secret);

    // jwt.verify returns string | object, cast to UserPayload if object
    if (typeof decoded === 'string') return null;

    return decoded as UserPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
