import { useAuthStore } from '@entities/auth/model/store';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  MapPinIcon,
  ShoppingBagIcon,
  UserCircleIcon
} from 'react-native-heroicons/outline';

export const UserProfile = () => {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    router.replace('/auth/login' as any);
  };

  // --- RENDER: CHƯA ĐĂNG NHẬP ---
  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-gray-900">
        <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-6 shadow-sm">
            <UserCircleIcon size={60} color="#9ca3af" />
        </View>
        <Text className="text-gray-500 mb-8 text-lg font-medium text-center">
            Vui lòng đăng nhập để xem thông tin cá nhân và đơn hàng.
        </Text>
        <TouchableOpacity 
          onPress={() => router.push('/auth/login' as any)}
          className="bg-blue-600 px-10 py-4 rounded-2xl shadow-lg shadow-blue-300 active:bg-blue-700"
        >
          <Text className="text-white font-bold text-lg">Đăng nhập / Đăng ký</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- RENDER: ĐÃ ĐĂNG NHẬP ---
  return (
    <ScrollView className="flex-1 bg-gray-900" contentContainerStyle={{ padding: 16 }}>
      
      {/* 1. INFO CARD (Bấm vào để sửa thông tin) */}
      <TouchableOpacity 
        onPress={() => router.push('/account/info' as any)}
        className="flex-row items-center mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50"
      >
        <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mr-4 border border-blue-100">
            <UserCircleIcon size={40} color="#2563eb" />
        </View>
        
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900" numberOfLines={1}>
            {user?.id || user?.email?.split('@')[0] || 'Khách hàng'}
          </Text>
          <Text className="text-gray-500 text-sm mt-0.5">{user?.email}</Text>
          
          <View className="flex-row items-center mt-2">
            <Text className="text-blue-600 text-xs font-medium mr-1">Xem hồ sơ</Text>
            <ChevronRightIcon size={12} color="#2563eb" />
          </View>
        </View>
      </TouchableOpacity>

      {/* 2. MENU GROUP */}
      <View className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        
        {/* Đơn mua */}
        <TouchableOpacity 
            onPress={() => router.push('/order' as any)} 
            className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50"
        >
            <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mr-3">
                <ShoppingBagIcon size={22} color="#f97316" />
            </View>
            <Text className="flex-1 text-base font-medium text-gray-700">Đơn mua của tôi</Text>
            <ChevronRightIcon size={20} color="#d1d5db" />
        </TouchableOpacity>

        {/* Sổ địa chỉ */}
        <TouchableOpacity 
            onPress={() => router.push('/address' as any)} 
            className="flex-row items-center p-4 active:bg-gray-50"
        >
            <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mr-3">
                <MapPinIcon size={22} color="#10b981" />
            </View>
            <Text className="flex-1 text-base font-medium text-gray-700">Sổ địa chỉ</Text>
            <ChevronRightIcon size={20} color="#d1d5db" />
        </TouchableOpacity>
      </View>

      {/* 3. LOGOUT BUTTON */}
      <TouchableOpacity 
        onPress={handleLogout}
        className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm active:bg-red-50 active:border-red-100 mb-10"
      >
        <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-3">
            <ArrowRightOnRectangleIcon size={22} color="#ef4444" />
        </View>
        <Text className="text-red-600 font-bold text-base flex-1">Đăng xuất</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};