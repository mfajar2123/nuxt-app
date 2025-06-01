import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET environment variable is not set!');
}

interface JwtPayload {
  userId: number;
  email: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, secret!, { expiresIn: '7d' }); 
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, secret!) as JwtPayload;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}