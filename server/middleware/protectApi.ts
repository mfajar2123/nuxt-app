import { verifyToken } from '~/server/utils/jwt';
import { type User } from '~/server/db/schema'; 

const protectedApiPaths = [
  '/api/posts', 
];

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  const isProtected = protectedApiPaths.some(protectedPath =>
    url.pathname.startsWith(protectedPath)
  );

  if (url.pathname.startsWith('/api/auth/') || !isProtected) {
    return;
  }

  const token = getCookie(event, 'auth_token');

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Akses ditolak: Tidak ada token.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    deleteCookie(event, 'auth_token'); 
    throw createError({ statusCode: 401, statusMessage: 'Akses ditolak: Token tidak valid.' });
  }
  event.context.user = { id: decoded.userId, email: decoded.email } as Pick<User, 'id' | 'email'>; 
});