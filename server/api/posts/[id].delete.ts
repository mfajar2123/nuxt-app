import { db } from '~/server/utils/db';
import { posts } from '~/server/db/schema';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const authUser = event.context.user as { id: number; email: string } | undefined;

  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Tidak terautentikasi untuk menghapus post.'
    });
  }

  const postId = parseInt(event.context.params?.id as string, 10);
  if (isNaN(postId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID post tidak valid.'
    });
  }

  try {
    const deletedPost = await db
      .delete(posts)
      .where(
        and(
          eq(posts.id, postId),
          eq(posts.userId, authUser.id) 
        )
      )
      .returning(); 

    if (!deletedPost || deletedPost.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post tidak ditemukan atau bukan milik Anda.'
      });
    }

    setResponseStatus(event, 200);
    return {
      message: 'Post berhasil dihapus',
      deletedPost: deletedPost[0]
    };
  } catch (e: any) {
    if (e.statusCode) throw e;
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal menghapus post: ' + e.message
    });
  }
});
