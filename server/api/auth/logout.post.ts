export default defineEventHandler(async (event) => {
  // Hapus HttpOnly cookie
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { message: 'Logout berhasil!' };
});