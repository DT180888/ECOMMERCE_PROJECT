import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon, HomeIcon, ShoppingBagIcon, XCircleIcon } from "react-native-heroicons/solid";

export default function PaymentResultScreen() {
  const router = useRouter();
  const { status } = useLocalSearchParams();
  const isSuccess = status === 'success';

  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      {/* Ẩn nút back và header để user không quay lại được */}
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      
      <View className="items-center mb-8">
        {isSuccess ? (
            <CheckCircleIcon size={120} color="#22c55e" />
        ) : (
            <XCircleIcon size={120} color="#ef4444" />
        )}
      </View>

      <Text className="text-3xl font-bold text-gray-900 mb-2">
        {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
      </Text>
      
      <Text className="text-gray-500 text-center mb-10 text-base px-4">
        {isSuccess 
            ? 'Đơn hàng của bạn đã được hệ thống ghi nhận và sẽ sớm được giao.' 
            : 'Giao dịch bị hủy hoặc xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại.'}
      </Text>

      <View className="w-full gap-4">
        <TouchableOpacity 
            onPress={() => router.replace('/(tabs)')}
            className="w-full bg-blue-600 py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-200"
        >
            <HomeIcon size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Về trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={() => router.replace('/order')}
            className="w-full bg-gray-100 py-4 rounded-2xl flex-row items-center justify-center"
        >
            <ShoppingBagIcon size={20} color="#4b5563" />
            <Text className="text-gray-700 font-bold text-lg ml-2">Xem đơn hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}