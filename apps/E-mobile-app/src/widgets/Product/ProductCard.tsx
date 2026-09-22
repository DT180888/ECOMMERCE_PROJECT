import type { ProductCard as ProductCardType } from '@entities/product/types';
import { buildImgSrc } from '@shared/lib/url';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  item: ProductCardType;
  onPress?: () => void;
}

export const ProductCard = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 bg-white rounded-2xl m-1 shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* 1. Ảnh sản phẩm (Vuông) */}
      <View className="aspect-square bg-gray-100">
        <Image
          source={{ uri: buildImgSrc(item.primaryImageUrl) }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* 2. Thông tin */}
      <View className="p-3 space-y-1">
        {/* Brand Badge */}
        <View className="self-start bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            <Text className="text-[10px] font-bold text-blue-600 uppercase">
                {item.brandName || 'NO BRAND'}
            </Text>
        </View>

        {/* Tên SP */}
        <Text numberOfLines={2} className="text-xl font-medium text-gray-800 min-h-[40px]">
          {item.name}
        </Text>

        {/* Giá */}
        <Text className="text-base font-bold text-pink-600 mt-1">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.minPriceMinor)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};