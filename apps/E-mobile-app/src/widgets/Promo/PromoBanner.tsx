import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { TicketIcon } from "react-native-heroicons/outline";

const VOUCHERS = [
    { code: "FREESHIP", label: "Miễn phí vận chuyển", color: "bg-green-100 border-green-200 text-green-700" },
    { code: "SALE50", label: "Giảm 50%", color: "bg-red-100 border-red-200 text-red-700" },
    { code: "NEWMEMBER", label: "Giảm 20k đơn 0đ", color: "bg-blue-100 border-blue-200 text-blue-700" },
];

export default function PromoBanner() {
  return (
    <View className="mb-4">
      <View className="px-4 mb-2 flex-row items-center gap-2">
         <TicketIcon size={18} color="#ef4444" />
         <Text className="font-bold text-white text-base">Mã giảm giá</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        {VOUCHERS.map((v) => (
          <View 
            key={v.code} 
            className={`flex-row items-center p-3 rounded-lg border ${v.color} min-w-[200px]`}
          >
            <View className="flex-1 mr-2">
                <Text className="font-bold text-sm text-gray-800">{v.code}</Text>
                <Text className="text-xs text-gray-600">{v.label}</Text>
            </View>
            <TouchableOpacity className="bg-white px-3 py-1 rounded border border-gray-200 shadow-sm">
                <Text className="text-xs font-bold text-blue-600">Lưu</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}