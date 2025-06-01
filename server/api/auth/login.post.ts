import { z } from 'zod';
import { db } from '~/server/utils/db';
import { users } from '~/server/db/schema';
import { comparePassword } from '~/server/utils/password';
import { generateToken } from '~/server/utils/jwt';
import { eq } from 'drizzle-orm';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: validation.error.errors });
    }

    const { email, password } = validation.data;

    const userArr = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userArr.length === 0) {
      throw createError({ statusCode: 401, statusMessage: 'Email atau password salah.' });
    }
    const user = userArr[0];

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      throw createError({ statusCode: 401, statusMessage: 'Email atau password salah.' });
    }

    const token = generateToken({ userId: user.id, email: user.email });

 
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Hanya secure di production
      sameSite: 'lax', // Atau 'strict'
      maxAge: 60 * 60 * 24 * 7, // 7 hari (dalam detik)
      path: '/',
    });

    return {
      message: 'Login berhasil!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error: any) {
    if (error.data || error.statusCode === 401) throw error;
    console.error('Login error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Terjadi kesalahan saat login: ' + error.message });
  }
});