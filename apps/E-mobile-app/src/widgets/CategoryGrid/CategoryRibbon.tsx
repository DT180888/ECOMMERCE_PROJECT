import { useFeaturedCategories } from '@entities/category/hooks';
import { buildImgSrc } from '@shared/lib/url';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CategoryRibbon() {
  const { data: categories } = useFeaturedCategories();
  const router = useRouter();
  
  const list = categories || [];
  if (list.length === 0) return null;

  return (
    <View className="py-4 bg-gray-900 mb-2">
      <View className="px-4 mb-2 flex-row justify-between items-center">
        <Text className="font-bold text-base text-white">Danh mục</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/catalog')}>
            <Text className="text-xs text-blue-600">Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
      >
        {list.map((cat) => (
          <TouchableOpacity 
            key={cat.categoryId}
            className="items-center w-16 space-y-2"
            onPress={() => router.push({ pathname: '/(tabs)/catalog', params: { categoryId: cat.categoryId } })}
          >
            {/* Icon tròn có viền */}
            <View className="w-16 h-16 rounded-full border border-gray-100 p-1 overflow-hidden bg-gray-50 shadow-sm">
               <Image 
                  source={{ uri: buildImgSrc(cat.imageUrl) }} 
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
               />
            </View>
            {/* Tên danh mục (giới hạn 1 dòng) */}
            <Text numberOfLines={1} className="text-xs text-center text-gray-400 font-medium">
                {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}