import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PaymentWebScreen() {
  const router = useRouter();
  // Lấy URL thanh toán và URL callback từ params truyền sang
  const { url, returnUrl } = useLocalSearchParams<{ url: string, returnUrl: string }>();

  // Hàm xử lý khi URL trong WebView thay đổi
  const handleNavigationStateChange = (navState: any) => {
    const currentUrl = navState.url;

    // Logic quan trọng: Kiểm tra xem WebView đã redirect về URL callback của mình chưa
    // Ví dụ: https://ecommerce-mobile.local/payment-callback?status=success...
    if (returnUrl && currentUrl.startsWith(returnUrl)) {
        
        // Phân tích kết quả từ URL (Mock backend trả về ?status=success)
        const isSuccess = currentUrl.includes('status=success');
        
        // Chuyển hướng sang màn hình Kết quả (Dùng replace để không back lại được trang này)
        router.replace({
            pathname: '/checkout/result',
            params: { status: isSuccess ? 'success' : 'fail' }
        });
        
        // Trả về false để WebView ngừng load tiếp
        return false; 
    }
    return true;
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Cổng thanh toán', headerBackTitle: 'Hủy' }} />
      
      <WebView
        source={{ uri: url }}
        startInLoadingState={true}
        renderLoading={() => (
            <View className="absolute inset-0 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        )}
        onNavigationStateChange={handleNavigationStateChange}
        onError={() => Alert.alert("Lỗi", "Không thể tải trang thanh toán")}
      />
    </View>
  );
}