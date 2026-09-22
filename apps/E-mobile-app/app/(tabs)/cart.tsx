import { useAuthStore } from '@entities/auth/model/store';
import { useSmartCart } from '@features/cart/useSmartCart';
import { CartItem } from '@widgets/Cart/CartItem'; // Import Widget vừa tạo
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ShoppingBagIcon } from "react-native-heroicons/outline";

export default function CartScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  // Gọi logic giỏ hàng thông minh (Tự động lấy Local hoặc Server)
  const { cart, updateQuantity, removeFromCart, isLoading, cartCount } = useSmartCart();
  const cartItems = cart?.items || [];

  // Tính tổng tiền tạm tính
  const subtotal = cartItems.reduce((sum, item) => sum + (item.priceMinor * item.quantity), 0);

 const handleCheckout = () => {
  if (cartItems.length === 0) {
      Alert.alert("Giỏ hàng trống", "Vui lòng thêm sản phẩm vào giỏ hàng.");
      return;
  }

  if (!isAuthenticated) {
      Alert.alert(
          "Yêu cầu đăng nhập", 
          "Bạn cần đăng nhập để tiến hành thanh toán.",
          [
              { text: "Hủy", style: "cancel" },
              { text: "Đăng nhập", onPress: () => router.push('/auth/login') }
          ]
      );
      return;
  }

  // ✅ SỬA: Chuyển sang màn hình Checkout
  router.push('/checkout'); 
};

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-100 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-gray-900">Giỏ hàng</Text>
        <Text className="text-gray-500 font-medium">({cartCount} sản phẩm)</Text>
      </View>

      {/* Danh sách sản phẩm */}
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.skuId.toString()} // Dùng skuId làm key
          contentContainerStyle={{ padding: 16, paddingBottom: 150 }} // Padding dưới để không bị che bởi footer
          renderItem={({ item }) => (
            <CartItem 
                item={item} 
                onUpdateQuantity={(qty) => updateQuantity(item.skuId, qty)}
                onRemove={() => {
                    Alert.alert(
                        "Xóa sản phẩm", 
                        "Bạn có chắc muốn xóa sản phẩm này?",
                        [
                            { text: "Hủy", style: "cancel" },
                            { text: "Xóa", style: 'destructive', onPress: () => removeFromCart(item.skuId) }
                        ]
                    );
                }}
            />
          )}
        />
      ) : (
        // Empty State (Giỏ hàng trống)
        <View className="flex-1 justify-center items-center p-10">
            <View className="bg-gray-100 p-6 rounded-full mb-4">
                <ShoppingBagIcon size={64} color="#9ca3af" />
            </View>
            <Text className="text-lg font-bold text-gray-600">Giỏ hàng của bạn đang trống</Text>
            <Text className="text-gray-400 text-center mt-2 mb-6">Hãy dạo một vòng xem có gì ưng ý không nhé!</Text>
            
            <TouchableOpacity 
                onPress={() => router.push('/(tabs)')}
                className="bg-blue-600 px-8 py-3 rounded-full shadow-lg shadow-blue-200"
            >
                <Text className="text-white font-bold">Tiếp tục mua sắm</Text>
            </TouchableOpacity>
        </View>
      )}

      {/* Footer Thanh toán (Sticky Bottom) */}
      {cartItems.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-100 shadow-2xl rounded-t-3xl pb-3">
            <View className="flex-row justify-between mb-1">
                <Text className="text-gray-500 font-medium">Tạm tính</Text>
                <Text className="text-lg font-bold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}
                </Text>
            </View>
            
            <TouchableOpacity 
                onPress={handleCheckout}
                className="bg-blue-600 rounded-xl py-3 items-center mt-2 shadow-lg shadow-blue-200 active:scale-[0.98]"
            >
                <Text className="text-white font-bold text-lg">Tiến hành đặt hàng</Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
}