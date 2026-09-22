import type { Address } from '@entities/address/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MapPinIcon, PencilIcon, TrashIcon } from "react-native-heroicons/outline";

interface Props {
  item: Address;
  onEdit: () => void;
  onDelete: () => void;
}

export const AddressCard = ({ item, onEdit, onDelete }: Props) => {
  // Gộp các dòng địa chỉ lại cho gọn
  const fullAddress = [
    item.line1,
    item.line2,
    item.city,
    item.state,
    item.country
  ].filter(Boolean).join(', ');

  return (
    <View className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm">
      
      {/* 1. Header: Icon + Tên + Badge Mặc định */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1 gap-3">
            {/* Icon tròn đẹp */}
            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center border border-blue-100">
                <MapPinIcon size={20} color="#2563eb" />
            </View>
            
            <View>
                <Text className="font-bold text-gray-900 text-base">
                    {item.recipientName}
                </Text>
                <Text className="text-gray-400 text-xs font-medium uppercase">
                    {item.label} {/* VD: Nhà riêng, Công ty */}
                </Text>
            </View>
        </View>

        {/* Badge Mặc định */}
        {item.isDefault && (
            <View className="bg-blue-600 px-2 py-1 rounded-md">
                <Text className="text-white text-[10px] font-bold uppercase">Mặc định</Text>
            </View>
        )}
      </View>
      
      {/* 2. Thông tin chi tiết (Thụt vào 1 chút cho thẳng hàng với text trên) */}
      <View className="ml-12 space-y-1">
          <Text className="text-gray-900 text-sm font-medium">{item.phone}</Text>
          <Text className="text-gray-500 text-sm leading-5">
            {fullAddress}
          </Text>
      </View>

      {/* 3. Nút thao tác (Footer) */}
      <View className="flex-row justify-end gap-3 mt-4 pt-3 border-t border-gray-50">
        <TouchableOpacity 
            onPress={onEdit} 
            className="flex-row items-center bg-gray-50 px-3 py-2 rounded-lg active:bg-gray-200"
        >
            <PencilIcon size={14} color="#4b5563" />
            <Text className="text-gray-600 text-xs ml-1.5 font-bold">Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={onDelete} 
            className="flex-row items-center bg-red-50 px-3 py-2 rounded-lg active:bg-red-100"
        >
            <TrashIcon size={14} color="#ef4444" />
            <Text className="text-red-600 text-xs ml-1.5 font-bold">Xóa</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};