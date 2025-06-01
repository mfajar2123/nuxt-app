import { db } from '~/server/utils/db';
import { posts } from '~/server/db/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {

  const authUser = event.context.user as { id: number; email: string } | undefined;

  if (!authUser) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi untuk melihat post.' });
  }

  try {
    const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return allPosts;
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts: ' + e.message,
    });
  }
});