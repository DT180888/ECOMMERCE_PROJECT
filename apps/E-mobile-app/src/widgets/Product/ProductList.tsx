import { useProductList } from '@entities/product/hooks';
import type { ProductListParams } from '@entities/product/types';
import { useRouter } from 'expo-router'; // Import chuẩn thay vì require
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { ProductCard } from './ProductCard';

interface Props {
  params?: ProductListParams;
}

export const ProductList = ({ params }: Props) => {
  const router = useRouter();
  
  // Gọi API
  const { data, isLoading, isError } = useProductList({ size: 10, ...params });
  const products = data?.items || [];

  if (isLoading) return <ActivityIndicator size="large" color="#2563eb" className="mt-20" />;

  if (!products.length && !isError) {
      return (
          <View className="items-center justify-center mt-20">
              <Text className="text-gray-500">Không tìm thấy sản phẩm nào.</Text>
          </View>
      )
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.productId.toString()}
      
      // ✅ CẤU HÌNH 2 CỘT
      numColumns={2}
      
      // Padding tổng thể của List (trên/dưới/trái/phải)
      className="flex-1 bg-gray-900"
      contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 100, paddingTop: 8 }}
      
      // ✅ QUAN TRỌNG: Khoảng cách giữa các cột
      // Không dùng 'space-between' để tránh item cuối bị đẩy xa khi lẻ hàng
      columnWrapperStyle={{ gap: 8 }} 
      
      renderItem={({ item }) => (
        // Wrapper View này giúp ProductCard giãn đều (flex-1) trong cột của nó
        <View className="flex-1">
            <ProductCard 
                item={item} 
                onPress={() => router.push(`/product/${item.slug}-${item.productId}`)} 
            />
        </View>
      )}
    />
  );
};