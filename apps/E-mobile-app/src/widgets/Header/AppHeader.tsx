import { useSmartCart } from '@features/cart/useSmartCart';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
// 1. Import thêm ArrowLeftIcon
import { ArrowLeftIcon, MagnifyingGlassIcon, ShoppingCartIcon } from "react-native-heroicons/outline";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 2. Thêm interface Props
interface Props {
  showBackButton?: boolean;
}

export const AppHeader = ({ showBackButton = false }: Props) => {
  const router = useRouter();
  const { cartCount } = useSmartCart();
  const [keyword, setKeyword] = useState("");
  const insets = useSafeAreaInsets();

  const handleSearch = () => {
    if (keyword.trim()) {
        // Nếu đang ở trang detail, push sang catalog vẫn hoạt động tốt
        router.push({
            pathname: '/(tabs)/catalog',
            params: { keyword: keyword.trim() }
        });
    }
  };

  return (
    <View 
      className="bg-white shadow-sm z-50 border-b border-gray-100"
      style={{ paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0) }}
    >
      <View className="flex-row items-center px-4 pb-3 gap-3">
        
        {/* 3. LOGIC ĐIỀU HƯỚNG: BACK hoặc HOME */}
        {showBackButton ? (
             <TouchableOpacity onPress={() => router.back()} className="p-1">
                 <ArrowLeftIcon size={24} color="#374151" />
             </TouchableOpacity>
        ) : (
            <TouchableOpacity onPress={() => router.push('/(tabs)')} activeOpacity={0.8}>
                <View className="w-10 h-10 bg-blue-600 rounded-xl items-center justify-center shadow-sm">
                    <Text className="text-white font-bold text-2xl">E</Text>
                </View>
            </TouchableOpacity>
        )}

        {/* Thanh tìm kiếm */}
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 h-10 border border-gray-200">
          <MagnifyingGlassIcon size={20} color="#9ca3af" />
          <TextInput 
            className="flex-1 ml-2 text-gray-800 text-base h-full"
            placeholder="Tìm kiếm..." 
            placeholderTextColor="#9ca3af"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        {/* Nút Giỏ hàng */}
        <TouchableOpacity 
            className="relative p-1"
            onPress={() => router.push('/(tabs)/cart')}
        >
          <ShoppingCartIcon size={28} color="#2563eb" />
          {cartCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 min-w-[18px] h-[18px] rounded-full items-center justify-center px-1 border border-white">
              <Text className="text-white text-[10px] font-bold">
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
};