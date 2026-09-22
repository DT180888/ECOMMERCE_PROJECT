import type { Address } from '@entities/address/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon, MapPinIcon, PlusIcon } from "react-native-heroicons/outline";

interface Props {
  selectedAddress: Address | null;
  onPress: () => void; // Hàm mở danh sách địa chỉ để chọn
}

export const AddressSelector = ({ selectedAddress, onPress }: Props) => {
  return (
    <View className="bg-white p-4 mb-3">
      <View className="flex-row items-center gap-2 mb-2">
        <MapPinIcon size={20} color="#2563eb" />
        <Text className="text-gray-900 font-bold text-base">Địa chỉ nhận hàng</Text>
      </View>

      {selectedAddress ? (
        <TouchableOpacity onPress={onPress} className="flex-row justify-between items-center mt-2">
          <View className="flex-1 pr-4">
            <View className="flex-row items-center gap-2 mb-1">
                <Text className="font-bold text-gray-800">{selectedAddress.recipientName}</Text>
                <Text className="text-gray-500">|</Text>
                <Text className="text-gray-600">{selectedAddress.phone}</Text>
            </View>
            <Text className="text-gray-600 text-sm leading-5" numberOfLines={2}>
              {selectedAddress.line1}, {selectedAddress.city}
            </Text>
          </View>
          <ChevronRightIcon size={20} color="#9ca3af" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
            onPress={onPress}
            className="flex-row items-center justify-center py-3 border border-dashed border-blue-300 rounded-xl bg-blue-50 mt-2"
        >
            <PlusIcon size={20} color="#2563eb" />
            <Text className="text-blue-600 font-medium ml-2">Thêm địa chỉ nhận hàng</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};