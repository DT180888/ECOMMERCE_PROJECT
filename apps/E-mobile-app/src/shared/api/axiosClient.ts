import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://10.0.2.2:5152';

export const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. Lấy Token (Async)
export const getAccessToken = async () => {
  return await SecureStore.getItemAsync('accessToken');
};

// 2. Lưu Token (Async)
export const setAccessToken = async (token: string | null) => {
  if (token) {
    await SecureStore.setItemAsync('accessToken', token);
  } else {
    await SecureStore.deleteItemAsync('accessToken');
  }
};

// 3. Logout (Xóa token)
export const clientSideLogout = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('user');
};

// --- Interceptors ---
axiosClient.interceptors.request.use(async (config) => {
    // Gọi hàm async lấy token
    const token = await getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//  Phần Interceptors 
axiosClient.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.message, error?.response?.data);
        return Promise.reject(error);
    }
);