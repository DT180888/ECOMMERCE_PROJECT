import React from 'react';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

// 1. Cấu hình giao diện Custom (cho đẹp hơn mặc định)
export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#22c55e', backgroundColor: 'white', height: 70, borderLeftWidth: 8 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#15803d' }}
      text2Style={{ fontSize: 13, color: '#374151' }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#ef4444', backgroundColor: 'white', height: 70, borderLeftWidth: 8 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#b91c1c' }}
      text2Style={{ fontSize: 13, color: '#374151' }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#3b82f6', backgroundColor: 'white', height: 70, borderLeftWidth: 8 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#1d4ed8' }}
      text2Style={{ fontSize: 13, color: '#374151' }}
    />
  )
};

// 2. Component để nhúng vào Layout (Nơi hiển thị Toast)
export const GlobalToast = () => {
  return <Toast config={toastConfig} />;
};

// 3. Hook để sử dụng trong logic
export const useToast = () => {
  return {
    success: (message: string, title = 'Thành công') => {
      Toast.show({
        type: 'success',
        text1: title,
        text2: message,
        position: 'top',
        visibilityTime: 3000,
      });
    },
    error: (message: string, title = 'Thất bại') => {
      Toast.show({
        type: 'error',
        text1: title,
        text2: message,
        position: 'top',
        visibilityTime: 4000,
      });
    },
    info: (message: string, title = 'Thông báo') => {
      Toast.show({
        type: 'info',
        text1: title,
        text2: message,
        position: 'top',
      });
    },
  };
};