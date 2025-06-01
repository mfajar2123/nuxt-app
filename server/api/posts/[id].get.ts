import { db } from '~/server/utils/db';
import { posts } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {

  const authUser = event.context.user as { id: number; email: string } | undefined;

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi untuk melihat post.' });
  }

  const postId = parseInt(event.context.params?.id as string, 10);

  if (isNaN(postId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid post ID',
    });
  }

  try {
    const post = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

    if (!post || post.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found',
      });
    }
    return post[0];
  } catch (e: any) {
    if (e.statusCode === 404 || e.statusCode === 400) throw e;
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post: ' + e.message,
    });
  }
});