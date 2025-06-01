import { verifyToken } from '~/server/utils/jwt';
import { db } from '~/server/utils/db';
import { users } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token');

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi: Tidak ada token.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    deleteCookie(event, 'auth_token');
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi: Token tidak valid.' });
  }

  try {
    const userArr = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
      }).from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (userArr.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan.' });
    }

    return userArr[0];

  } catch (error: any) {
    console.error('Error fetching current user (/api/auth/me):', error);
    deleteCookie(event, 'auth_token');
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil data pengguna.' });
  }
});