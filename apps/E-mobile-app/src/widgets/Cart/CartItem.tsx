import type { CartItem as CartItemType } from '@entities/cart/types';
import { buildImgSrc } from '@shared/lib/url';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { MinusIcon, PlusIcon, TrashIcon } from "react-native-heroicons/outline";

interface Props {
  item: CartItemType;
  onUpdateQuantity: (newQty: number) => void;
  onRemove: () => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: Props) => {
  return (
    <View className="flex-row bg-white p-3 mb-3 rounded-2xl shadow-sm border border-gray-100">
      {/* 1. Ảnh sản phẩm */}
      <View className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
        <Image
          source={{ uri: buildImgSrc(item.primaryImageUrl) }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* 2. Thông tin chi tiết */}
      <View className="flex-1 ml-3 justify-between py-1">
        <View>
            <View className="flex-row justify-between items-start">
                <Text numberOfLines={2} className="flex-1 text-sm font-medium text-gray-800 mr-2 leading-5">
                    {item.name}
                </Text>
                {/* Nút xóa */}
                <TouchableOpacity onPress={onRemove} className="p-1 -mt-1 -mr-1">
                    <TrashIcon size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
            
            {/* Phân loại hàng (SKU Code) */}
            <View className="bg-gray-100 self-start px-2 py-0.5 rounded-md mt-1">
                <Text className="text-[10px] text-gray-500 font-medium">
                    SKU: {item.skuCode}
                </Text>
            </View>
        </View>

        {/* Giá & Tăng giảm số lượng */}
        <View className="flex-row justify-between items-end mt-2">
            <Text className="text-base font-bold text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.priceMinor)}
            </Text>

            {/* Stepper (Trừ - Số - Cộng) */}
            <View className="flex-row items-center border border-gray-200 rounded-lg bg-gray-50">
                <TouchableOpacity 
                    onPress={() => onUpdateQuantity(item.quantity - 1)}
                    className="p-1.5 border-r border-gray-200 bg-white rounded-l-lg active:bg-gray-100"
                >
                    <MinusIcon size={14} color="black" />
                </TouchableOpacity>
                
                <View className="w-8 items-center justify-center bg-white">
                    <Text className="text-xs font-bold text-gray-900">{item.quantity}</Text>
                </View>

                <TouchableOpacity 
                    onPress={() => onUpdateQuantity(item.quantity + 1)}
                    className="p-1.5 border-l border-gray-200 bg-white rounded-r-lg active:bg-gray-100"
                >
                    <PlusIcon size={14} color="black" />
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  );
};