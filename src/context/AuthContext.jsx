'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = '/api/auth';

async function fetchAPI(endpoint, options = {}) {
  const token = useAuthStore.getState().token;
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  
  return data;
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,

      initialize: async () => {
        const token = get().token;
        if (!token) {
          set({ isInitialized: true });
          return;
        }

        try {
          const data = await fetchAPI('/session', { method: 'GET' });
          set({ user: data.user, isInitialized: true });
        } catch (error) {
          set({ user: null, token: null, isInitialized: true });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        
        try {
          const data = await fetchAPI('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          
          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        
        try {
          const data = await fetchAPI('/register', {
            method: 'POST',
            body: JSON.stringify(userData),
          });
          
          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await fetchAPI('/logout', { method: 'POST' });
        } catch (error) {
          console.error('Logout error:', error);
        }
        
        set({ user: null, token: null });
      },

      forgotPassword: async (email) => {
        set({ isLoading: true });
        
        try {
          const data = await fetchAPI('/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
          });
          
          set({ isLoading: false });
          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (token, newPassword) => {
        set({ isLoading: true });
        
        try {
          const data = await fetchAPI('/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
          });
          
          set({ isLoading: false });
          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verifyOTP: async (otp) => {
        const user = get().user;
        if (!user) throw new Error('No user found');
        
        set({ isLoading: true });
        
        try {
          const data = await fetchAPI('/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ otp, userId: user._id }),
          });
          
          set({
            user: { ...user, isVerified: true },
            token: data.token,
            isLoading: false,
          });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resendOTP: async (email) => {
        set({ isLoading: true });
        
        try {
          const data = await fetchAPI('/resend-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
          });
          
          set({ isLoading: false });
          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export default useAuthStore;