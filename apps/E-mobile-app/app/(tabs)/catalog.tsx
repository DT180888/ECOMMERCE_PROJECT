import { ProductList } from '@widgets/Product/ProductList'; // Nhớ import đúng ProductList của mobile
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';

export default function CatalogScreen() {
  const router = useRouter();
  // Lấy params từ URL (ví dụ: catalog?keyword=áo)
  const { keyword, categoryId } = useLocalSearchParams<{ keyword: string, categoryId: string }>();

  return (
    <View className="flex-1 bg-gray-900">
      
      {/* Header riêng của Catalog (Hiển thị tiêu đề tìm kiếm) */}
      <View className="px-4 py-3 bg-white border-b border-gray-200 flex-row justify-between items-center">
         <Text className="text-lg font-bold text-gray-800">
            {keyword ? `Kết quả: "${keyword}"` : 'Tất cả sản phẩm'}
         </Text>
         
         {/* Nút xóa bộ lọc (nếu đang tìm kiếm) */}
         {(keyword || categoryId) && (
             <TouchableOpacity 
                onPress={() => router.setParams({ keyword: '', categoryId: '' })}
                className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full"
             >
                 <Text className="text-xs text-gray-500 mr-1">Xóa lọc</Text>
                 <XMarkIcon size={14} color="gray" />
             </TouchableOpacity>
         )}
      </View>

      {/* Grid Sản Phẩm */}
      <View className="flex-1 pt-2">
         <ProductList 
            params={{
                keyword: keyword, // Truyền keyword xuống hook
                categoryId: categoryId ? Number(categoryId) : undefined
            }} 
         />
      </View>
    </View>
  );
}