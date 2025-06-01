import { db } from '~/server/utils/db';
import { posts } from '~/server/db/schema';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(256),
  content: z.string().min(10, "Konten minimal 10 karakter"),
});

export default defineEventHandler(async (event) => {
  const authUser = event.context.user as { id: number; email: string } | undefined;

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi untuk membuat post.' });
  }

  try {
    const body = await readBody(event);
    const validation = createPostSchema.safeParse(body);

    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validasi gagal',
        data: validation.error.flatten(),
      });
    }

    const { title, content } = validation.data;
    const now = new Date();

    const newPost = await db.insert(posts).values({
      title,
      content,
      userId: authUser.id,
      createdAt: now,
      updatedAt: now,
    }).returning();

    return newPost[0];
  } catch (e: any) {
    if (e.data && e.statusCode === 400) throw e;

    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal membuat post: ' + (e?.message || 'Unknown error'),
    });
  }
});
