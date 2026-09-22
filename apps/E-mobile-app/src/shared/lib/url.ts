import { axiosClient } from "../api/axiosClient";

export const buildImgSrc = (path?: string | null) => {
  if (!path) return 'https://via.placeholder.com/300'; // Ảnh mặc định nếu null
  
  if (path.startsWith('http')) return path; // Nếu là link online thì giữ nguyên

  // Lấy BaseURL từ axiosClient (đã config 10.0.2.2 hoặc localhost)
  const baseUrl = axiosClient.defaults.baseURL?.replace('/api/v1', '');
  
  return `${baseUrl}${path}`;
};