import { z } from 'zod';
import { db } from '~/server/utils/db';
import { users } from '~/server/db/schema';
import { hashPassword } from '~/server/utils/password';
import { eq } from 'drizzle-orm';

const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").optional(),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: validation.error.errors,
      });
    }

    const { name, email, password } = validation.data;

    // Cek jika email sudah ada
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      throw createError({
        statusCode: 409, 
        statusMessage: 'Email sudah terdaftar.',
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUserArr = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning({ id: users.id, email: users.email, name: users.name });

    if (!newUserArr || newUserArr.length === 0) {
        throw createError({ statusCode: 500, statusMessage: 'Gagal membuat pengguna'});
    }
    const newUser = newUserArr[0];

    
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      message: 'Registrasi berhasil!',
    };

  } catch (error: any) {
   
    if (error.data || error.statusCode === 409) throw error;

    console.error('Register error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan saat registrasi: ' + error.message,
    });
  }
});