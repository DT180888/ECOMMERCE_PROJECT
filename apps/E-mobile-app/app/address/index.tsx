import { useAddressList, useDeleteAddress } from '@entities/address/hooks';
import { AddressCard } from '@widgets/Address/AddressCard';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { PlusIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Header chung
import { AppHeader } from "@widgets/Header/AppHeader";

export default function AddressListScreen() {
  const router = useRouter();
  
  // Gọi API lấy danh sách
  const { data: addresses, isLoading, refetch } = useAddressList();
  const deleteMut = useDeleteAddress();

  // Hàm xử lý xóa
  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa địa chỉ này?", [
      { text: "Hủy", style: "cancel" },
      { 
        text: "Xóa", 
        style: 'destructive', 
        onPress: () => deleteMut.mutate(id, { onSuccess: () => refetch() }) 
      }
    ]);
  };

  return (
    // edges: chỉ cần bottom/left/right, vì top đã có AppHeader xử lý padding
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom', 'left', 'right']}>
      
      {/* 1. Tắt Header mặc định của Expo Router */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* 2. Sử dụng AppHeader của chúng ta (Có nút Back) */}
      <AppHeader showBackButton={true} />

      <View className="flex-1">
        {/* Tiêu đề màn hình */}
        <View className="px-4 pt-4 pb-2 border-b border-gray-100 bg-white">
            <Text className="text-2xl font-bold text-gray-900">Sổ địa chỉ</Text>
            <Text className="text-gray-500 text-sm">Quản lý địa chỉ nhận hàng</Text>
        </View>

        {/* Nội dung danh sách */}
        {isLoading ? (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        ) : (
            <FlatList
                data={addresses?.items || []}
                keyExtractor={(item) => item.addressId.toString()}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }} // Padding bottom lớn để không bị nút FAB che
                renderItem={({ item }) => (
                    <AddressCard 
                        item={item} 
                        // Chuyển sang form sửa
                        onEdit={() => router.push({ pathname: '/address/form', params: { id: item.addressId } } as any)}
                        onDelete={() => handleDelete(item.addressId)}
                    />
                )}
                ListEmptyComponent={
                    <View className="items-center justify-center mt-20 opacity-50">
                        <Text className="text-gray-500 text-lg">Chưa có địa chỉ nào</Text>
                        <Text className="text-gray-400 text-sm mt-2">Thêm địa chỉ mới để nhận hàng nhé</Text>
                    </View>
                }
            />
        )}
      </View>

      {/* Nút Thêm Mới (Floating Action Button) */}
      <TouchableOpacity 
        onPress={() => router.push('/address/form' as any)}
        className="absolute bottom-8 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-300 z-50 active:bg-blue-700"
      >
        <PlusIcon size={28} color="white" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}