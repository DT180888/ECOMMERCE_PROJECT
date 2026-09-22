import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { MeRes } from '../api'; // Import type user từ api.ts

interface AuthState {
  user: MeRes | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // Cờ kiểm tra xem đã load xong dữ liệu từ bộ nhớ chưa

  // Actions
  signIn: (token: string, user: MeRes) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>; // Hàm nạp lại trạng thái khi mở app
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  signIn: async (token, user) => {
    try {
      // 1. Lưu vào bộ nhớ máy (Bất đồng bộ)
      await SecureStore.setItemAsync('accessToken', token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      // 2. Cập nhật State (Để UI nhận biết ngay lập tức)
      set({ token, user, isAuthenticated: true });
    } catch (error) {
      console.error('Lỗi khi lưu thông tin đăng nhập:', error);
    }
  },

  signOut: async () => {
    try {
      // 1. Xóa khỏi bộ nhớ máy
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('user');

      // 2. Reset State
      set({ token: null, user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  },

  // Hàm này sẽ được gọi ở _layout.tsx khi App vừa khởi động
  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      const userStr = await SecureStore.getItemAsync('user');

      if (token && userStr) {
        set({ 
          token, 
          user: JSON.parse(userStr), 
          isAuthenticated: true,
          isHydrated: true 
        });
      } else {
        set({ isHydrated: true, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Lỗi khi khôi phục phiên đăng nhập:', error);
      set({ isHydrated: true, isAuthenticated: false });
    }
  },
}));