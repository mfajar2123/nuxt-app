import { db } from '~/server/utils/db';
import { posts } from '~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const updatePostSchema = z.object({
  title: z.string().min(3).max(256).optional(),
  content: z.string().min(10).optional(),
}).refine(data => data.title || data.content, {
  message: "Minimal title atau content harus diisi.",
});

export default defineEventHandler(async (event) => {
  const authUser = event.context.user as { id: number; email: string } | undefined;

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi.' });
  }

  const postId = parseInt(event.context.params?.id as string, 10);
  if (isNaN(postId)) {
    throw createError({ statusCode: 400, statusMessage: 'ID post tidak valid.' });
  }

  try {
    const body = await readBody(event);
    const validation = updatePostSchema.safeParse(body);

    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validasi gagal.',
        data: validation.error.flatten(),
      });
    }

  
    const existingPost = await db.query.posts.findFirst({
      where: and(eq(posts.id, postId), eq(posts.userId, authUser.id))
    });

    if (!existingPost) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post tidak ditemukan atau bukan milik Anda.',
      });
    }

    const { title, content } = validation.data;

    const updatedPost = await db
      .update(posts)
      .set({
        ...(title && { title }),
        ...(content && { content }),
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId))
      .returning();

    return updatedPost[0];
  } catch (e: any) {
    if (e.statusCode === 400 || e.statusCode === 404) throw e;
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengupdate post: ' + e.message,
    });
  }
});
