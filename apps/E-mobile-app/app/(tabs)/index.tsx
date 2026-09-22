import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
// Hooks & Components
import PromoBanner from '@/widgets/Promo/PromoBanner';
import { useProductList } from '@entities/product/hooks';
import CategoryRibbon from '@widgets/CategoryGrid/CategoryRibbon'; // Widget mới
import Hero from '@widgets/Hero/Hero';
import { ProductCard } from '@widgets/Product/ProductCard';

export default function HomeScreen() {
  const router = useRouter();
  
  // Lấy danh sách sản phẩm (Lấy nhiều để user cuộn đã tay)
  const { data, isLoading } = useProductList({ size: 20 });
  const products = data?.items || [];

  // --- Header của FlatList ---
  // Chứa tất cả các thành phần KHÔNG phải là danh sách sản phẩm
const renderHeader = () => (
    <View className="bg-gray-900 pb-2">
      {/* 1. Banner chính (Slider) */}
      <Hero />

      {/* 2. Voucher (Kích thích user ở lại) */}
      <PromoBanner />
      
      {/* 3. Danh mục icon tròn (Điều hướng) */}
      <CategoryRibbon />

      {/* 4. Tiêu đề danh sách */}
      <View className="px-4 pt-4 pb-2 flex-row justify-between items-end">
         <Text className="text-lg font-bold text-red-600 uppercase">Gợi ý hôm nay 🔥</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return <View className="flex-1 justify-center bg-gray-50"><ActivityIndicator size="large" color="#2563eb"/></View>;
  }

  return (
    <View className="flex-1 bg-gray-900">
      <FlatList
        data={products}
        keyExtractor={(item) => item.productId.toString()}
        numColumns={2}
        
        // Header (Banner, Category...)
        ListHeaderComponent={renderHeader}
        
        // Style cho Grid
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }} // Để không bị che bởi tab bar
        columnWrapperStyle={{ paddingHorizontal: 8, gap: 8 }} // Gap giữa 2 cột
        
        // Item separator (Khoảng cách dọc giữa các hàng)
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}

        renderItem={({ item }) => (
            // ProductCard đã có flex-1 nên sẽ tự chia đôi
            <ProductCard 
                item={item} 
                onPress={() => router.push(`/product/${item.slug}-${item.productId}`)} 
            />
        )}
      />
    </View>
  );
}