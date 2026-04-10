import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set, get) => ({
  usuario: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: false,
  isLoading: false,
  isAdmin: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { access_token, refresh_token, usuario } = res.data;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      set({
        usuario,
        accessToken: access_token,
        refreshToken: refresh_token,
        isAuthenticated: true,
        isAdmin: usuario.roles?.some(r => r.nombre === 'Administrador') || false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ usuario: null, accessToken: null, refreshToken: null, isAuthenticated: false, isAdmin: false });
    window.location.href = '/login';
  },

  refreshToken: async () => {
    try {
      const res = await api.post('/api/auth/refresh', {
        refresh_token: get().refreshToken,
      });
      const { access_token } = res.data;
      localStorage.setItem('accessToken', access_token);
      set({ accessToken: access_token });
      return access_token;
    } catch (error) {
      get().logout();
      throw error;
    }
  },

  checkAuth: async () => {
    const token = get().accessToken;
    if (!token) {
      set({ isAuthenticated: false, usuario: null, isAdmin: false });
      return false;
    }
    set({ isLoading: true });
    try {
      const res = await api.get('/api/auth/me');
      const usuario = res.data;
      set({
        usuario,
        isAuthenticated: true,
        isAdmin: usuario.roles?.some(r => r.nombre === 'Administrador') || false,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({ isAuthenticated: false, usuario: null, isAdmin: false, isLoading: false });
      return false;
    }
  },
}));
