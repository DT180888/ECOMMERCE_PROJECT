import { useMyOrders } from '@entities/order/hooks';
import { OrderStatusBadge } from '@entities/order/ui/OrderStatusBadge';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ShoppingBagIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ 1. IMPORT HEADER
import { AppHeader } from "@widgets/Header/AppHeader";

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { data, isLoading } = useMyOrders({ page: 1, size: 20 });
  const orders = data?.items || [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom', 'left', 'right']}>
      
      {/* ✅ 2. TẮT HEADER MẶC ĐỊNH */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* ✅ 3. THÊM HEADER CỦA CHÚNG TA */}
      <AppHeader showBackButton={true} />

      <View className="flex-1">
        <View className="px-4 pt-4 pb-2 border-b border-gray-100 bg-white">
            <Text className="text-2xl font-bold text-gray-900">Đơn mua</Text>
            <Text className="text-gray-500 text-sm">Lịch sử giao dịch của bạn</Text>
        </View>

        {isLoading ? (
            <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
        ) : orders.length === 0 ? (
            <View className="flex-1 justify-center items-center p-10">
                <ShoppingBagIcon size={64} color="#d1d5db" />
                <Text className="text-gray-500 mt-4 text-center">Bạn chưa có đơn hàng nào.</Text>
            </View>
        ) : (
            <FlatList
            data={orders}
            keyExtractor={(item) => item.orderId.toString()}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={({ item }) => (
                <TouchableOpacity 
                    activeOpacity={0.7}
                    // Link tới chi tiết (nếu có)
                    onPress={() => router.push(`/order/${item.orderId}`)}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                >
                    <View className="flex-row justify-between items-start mb-3">
                        <View>
                            <Text className="font-bold text-gray-900 text-base">#{item.orderNumber}</Text>
                            <Text className="text-gray-400 text-xs mt-1">
                                {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                            </Text>
                        </View>
                        <OrderStatusBadge status={item.status} />
                    </View>

                    <View className="border-t border-gray-50 pt-2 flex-row justify-between items-end">
                        <Text className="text-gray-500 text-sm">{item.itemCount ?? 0} sản phẩm</Text>
                        <Text className="text-blue-600 font-bold text-base">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalMinor)}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
            />
        )}
      </View>
    </SafeAreaView>
  );
}