import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function assertAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || (token as { role: string }).role !== 'ADMIN') {
    const error = new Error('Unauthorized');
    (error as unknown as { status: number }).status = 401;
    throw error;
  }
  return token;
}


