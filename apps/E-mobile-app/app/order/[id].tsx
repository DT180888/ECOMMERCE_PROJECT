import { useOrderDetail } from '@entities/order/hooks';
import { OrderStatusBadge } from '@entities/order/ui/OrderStatusBadge';
import { AppHeader } from '@widgets/Header/AppHeader';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MapPinIcon, ShoppingBagIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from 'react-native-safe-area-context';

const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Gọi API lấy chi tiết
  const orderId = Number(id);
  const { data: order, isLoading, isError } = useOrderDetail(orderId, { enabled: !!orderId });

  if (isLoading) return <View className="flex-1 justify-center"><ActivityIndicator size="large" color="#2563eb" /></View>;
  if (isError || !order) return <View className="flex-1 justify-center items-center"><Text>Không tìm thấy đơn hàng</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader showBackButton={true} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* 1. Header Đơn Hàng */}
        <View className="bg-white p-4 mb-3 border-b border-gray-100">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-bold text-gray-900">#{order.orderNumber}</Text>
                <OrderStatusBadge status={order.status} />
            </View>
            <Text className="text-gray-500 text-xs">Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</Text>
        </View>

        {/* 2. Địa chỉ nhận hàng */}
        {order.shipTo && (
            <View className="bg-white p-4 mb-3 border-y border-gray-100">
                <View className="flex-row items-center gap-2 mb-2">
                    <MapPinIcon size={20} color="#2563eb" />
                    <Text className="font-bold text-gray-800">Địa chỉ nhận hàng</Text>
                </View>
                <Text className="text-gray-900 font-medium mb-1">
                    {order.shipTo.recipientName} | {order.shipTo.phone}
                </Text>
                <Text className="text-gray-600 text-sm leading-5">
                    {order.shipTo.line1}, {order.shipTo.city}, {order.shipTo.country}
                </Text>
            </View>
        )}

        {/* 3. Danh sách sản phẩm */}
        <View className="bg-white border-y border-gray-100 mb-3">
            <View className="p-4 border-b border-gray-50 flex-row items-center gap-2">
                <ShoppingBagIcon size={20} color="#f97316" />
                <Text className="font-bold text-gray-800">Sản phẩm</Text>
            </View>
            {order.items.map((item, idx) => (
                <View key={item.orderItemId} className={`p-4 flex-row ${idx > 0 ? 'border-t border-gray-50' : ''}`}>
                    {/* Ảnh (Nếu có API trả về ảnh thì dùng, không thì placeholder) */}
                    {/* <Image source={{ uri: buildImgSrc(item.productImage) }} className="w-16 h-16 rounded bg-gray-100 mr-3" /> */}
                    
                    <View className="flex-1">
                        <Text numberOfLines={2} className="text-sm font-medium text-gray-900 mb-1">{item.productName}</Text>
                        <Text className="text-xs text-gray-500 mb-1">Phân loại: {item.skuName || 'Mặc định'}</Text>
                        <View className="flex-row justify-between items-end">
                            <Text className="text-xs text-gray-600">x{item.qty}</Text>
                            <Text className="text-sm font-bold text-gray-900">{formatVND(item.lineTotalMinor || 0)}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>

        {/* 4. Tổng tiền */}
        <View className="bg-white p-4 border-y border-gray-100 space-y-2">
            <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">Tổng tiền hàng</Text>
                <Text className="text-gray-900 text-sm">{formatVND(order.subtotalMinor)}</Text>
            </View>
            <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">Phí vận chuyển</Text>
                <Text className="text-gray-900 text-sm">{formatVND(order.shippingMinor)}</Text>
            </View>
            <View className="flex-row justify-between border-t border-gray-100 pt-3 mt-1">
                <Text className="text-gray-900 font-bold text-base">Thành tiền</Text>
                <Text className="text-red-600 font-bold text-lg">{formatVND(order.totalMinor)}</Text>
            </View>
        </View>
        
        {/* Nút hành động (Ví dụ: Mua lại) */}
        <View className="p-4">
             <TouchableOpacity 
                onPress={() => router.push(`/(tabs)/catalog`)}
                className="w-full bg-blue-600 py-3 rounded-xl items-center shadow-sm"
             >
                 <Text className="text-white font-bold text-base">Mua lại</Text>
             </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}