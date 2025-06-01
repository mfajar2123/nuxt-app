// import { describe, it, expect, beforeEach, vi } from 'vitest';
// import { setActivePinia, createPinia } from 'pinia';
// import { useAuthStore, type AuthUser } from '~/store/authStore';

// const mockApiPost = vi.fn();
// const mockApiGet = vi.fn();

// vi.mock('#app', async (importOriginal) => {
//   const actual = await importOriginal() as Record<string, unknown>;
//   return {
//     ...actual,
//     useNuxtApp: () => ({
//       $api: {
//         post: mockApiPost,
//         get: mockApiGet,
//       },
//     }),
//   };
// });

// describe('Auth Store - Async Unit Tests', () => {
//   beforeEach(() => {
//     setActivePinia(createPinia());
//     mockApiPost.mockReset();
//     mockApiGet.mockReset();
//   });

//   describe('login action', () => {
//     it('login berhasil', async () => {
//       const authStore = useAuthStore();
//       const mockLoginResponse = {
//         data: {
//           message: 'Login berhasil!',
//           user: { id: 1, email: 'test@example.com', name: 'Test User' } as AuthUser,
//         }
//       };
//       mockApiPost.mockResolvedValueOnce(mockLoginResponse);

//       const success = await authStore.login({ email: 'test@example.com', password: 'password123' });

//       expect(success).toBe(true);
//       expect(authStore.isAuthenticated).toBe(true);
//       expect(authStore.user).toEqual(mockLoginResponse.data.user);
//       expect(authStore.error).toBeNull();
//       expect(authStore.loading).toBe(false);
//       expect(mockApiPost).toHaveBeenCalledWith('/auth/login', { email: 'test@example.com', password: 'password123' });
//     });

//     it('login gagal - error dari axios', async () => {
//       const authStore = useAuthStore();
//       const mockErrorResponse = {
//         isAxiosError: true,
//         response: { data: { message: 'Email atau password salah.' } },
//         message: 'Request failed with status code 401'
//       };
//       mockApiPost.mockRejectedValueOnce(mockErrorResponse);

//       const success = await authStore.login({ email: 'test@example.com', password: 'wrongpassword' });

//       expect(success).toBe(false);
//       expect(authStore.isAuthenticated).toBe(false);
//       expect(authStore.user).toBeNull();
//       expect(authStore.error).toBe('Email atau password salah.');
//       expect(authStore.loading).toBe(false);
//       expect(mockApiPost).toHaveBeenCalledWith('/auth/login', { email: 'test@example.com', password: 'wrongpassword' });
//     });

//     it('login gagal - generic error', async () => {
//       const authStore = useAuthStore();
//       mockApiPost.mockRejectedValueOnce(new Error('Network error'));

//       const success = await authStore.login({ email: 'test@example.com', password: 'password123' });

//       expect(success).toBe(false);
//       expect(authStore.isAuthenticated).toBe(false);
//       expect(authStore.user).toBeNull();
//       expect(authStore.error).toBe('Network error');
//       expect(authStore.loading).toBe(false);
//     });
//   });

//   describe('register action', () => {
//     it('register berhasil', async () => {
//       const authStore = useAuthStore();
//       mockApiPost.mockResolvedValueOnce({ data: { message: 'Registrasi berhasil!' } });

//       const success = await authStore.register({ name: 'New User', email: 'new@example.com', password: 'password123' });

//       expect(success).toBe(true);
//       expect(authStore.error).toBeNull();
//       expect(authStore.loading).toBe(false);
//       expect(mockApiPost).toHaveBeenCalledWith('/auth/register', { name: 'New User', email: 'new@example.com', password: 'password123' });
//     });

//     it('register gagal', async () => {
//       const authStore = useAuthStore();
//       const mockErrorResponse = {
//         isAxiosError: true,
//         response: { data: { message: 'Email sudah terdaftar.' } },
//         message: 'Request failed with status code 409'
//       };
//       mockApiPost.mockRejectedValueOnce(mockErrorResponse);

//       const success = await authStore.register({ name: 'New User', email: 'new@example.com', password: 'password123' });

//       expect(success).toBe(false);
//       expect(authStore.error).toBe('Email sudah terdaftar.');
//       expect(authStore.loading).toBe(false);
//     });
//   });

//   describe('fetchCurrentUser action', () => {
//     it('fetch berhasil', async () => {
//       const authStore = useAuthStore();
//       const mockUserResponse = {
//         data: { id: 1, email: 'current@example.com', name: 'Current User' } as AuthUser
//       };
//       mockApiGet.mockResolvedValueOnce(mockUserResponse);

//       await authStore.fetchCurrentUser();

//       expect(authStore.isAuthenticated).toBe(true);
//       expect(authStore.user).toEqual(mockUserResponse.data);
//       expect(authStore.error).toBeNull();
//       expect(authStore.loading).toBe(false);
//       expect(mockApiGet).toHaveBeenCalledWith('/auth/me');
//     });

//     it('fetch gagal - token tidak valid', async () => {
//       const authStore = useAuthStore();
//       const mockErrorResponse = {
//         isAxiosError: true,
//         response: { status: 401, data: { message: 'Token tidak valid.' } },
//         message: 'Request failed with status code 401'
//       };
//       mockApiGet.mockRejectedValueOnce(mockErrorResponse);

//       await authStore.fetchCurrentUser();

//       expect(authStore.isAuthenticated).toBe(false);
//       expect(authStore.user).toBeNull();
//       expect(authStore.error).toBeNull();
//       expect(authStore.loading).toBe(false);
//       expect(mockApiGet).toHaveBeenCalledWith('/auth/me');
//     });
//   });

//   describe('logout action', () => {
//     it('logout seharusnya reset state', () => {
//       const authStore = useAuthStore();
//       authStore.user = { id: 1, name: 'Test', email: 'test@example.com' };
//       authStore.isAuthenticated = true;

//       authStore.logout();

//       expect(authStore.user).toBeNull();
//       expect(authStore.isAuthenticated).toBe(false);
//     });
//   });
// });
