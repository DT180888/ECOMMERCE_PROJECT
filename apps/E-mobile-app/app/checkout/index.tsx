import { useAddressList } from '@entities/address/hooks';
import { useCheckoutOrder, useCheckoutPreview } from '@entities/order/hooks'; // 1. Import hook Preview
import { useCreatePaymentUrl } from '@entities/payment/hooks';
import { useSmartCart } from '@features/cart/useSmartCart';
import { useToast } from '@shared/ui/Toast';
import { AppHeader } from '@widgets/Header/AppHeader';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BanknotesIcon, ChevronRightIcon, MapPinIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from 'react-native-safe-area-context';

const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

export default function CheckoutScreen() {
  const router = useRouter();
  const toast = useToast();
  
  // Data
  const { cart, cartCount } = useSmartCart();
  const { data: addresses } = useAddressList();
  
  // State
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. Tự động chọn địa chỉ mặc định
  useEffect(() => {
    if (addresses?.items?.length && !selectedAddressId) {
      const defaultAddr = addresses.items.find(a => a.isDefault) || addresses.items[0];
      setSelectedAddressId(defaultAddr.addressId);
    }
  }, [addresses]);

  const selectedAddress = addresses?.items?.find(a => a.addressId === selectedAddressId);

  // 2. GỌI API PREVIEW (Tính toán phí ship/thuế)
  // Chỉ gọi khi đã chọn địa chỉ và có hàng trong giỏ
  const { data: preview, isLoading: isPreviewLoading } = useCheckoutPreview({
    shipToAddressId: selectedAddressId,
    billToAddressId: selectedAddressId, // Tạm thời Bill = Ship
  });

  // Mutations
  const createOrderMut = useCheckoutOrder();
  const createPaymentMut = useCreatePaymentUrl();

  // Xử lý Đặt hàng
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
        toast.error("Vui lòng thêm địa chỉ nhận hàng");
        return;
    }

    setIsLoading(true);
    try {
        // Tạo đơn hàng
        const orderRes = await createOrderMut.mutateAsync({
            shipToAddressId: selectedAddressId,
            billToAddressId: selectedAddressId,
            currency: 'VND',
            notes: note
        });
        
        // Tạo URL thanh toán
        const returnUrl = "https://ecommerce-mobile.local/payment-callback"; 
        const paymentRes = await createPaymentMut.mutateAsync({
            orderId: orderRes.orderId,
            returnUrl: returnUrl
        });

        if (paymentRes.paymentUrl) {
            router.push({
                pathname: '/checkout/payment',
                params: { url: paymentRes.paymentUrl, returnUrl: returnUrl }
            });
        } else {
            router.replace({ pathname: '/checkout/result', params: { status: 'success' } });
        }

    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Đặt hàng thất bại");
    } finally {
        setIsLoading(false);
    }
  };

  if (!cartCount) return <View className='flex-1 justify-center items-center'><Text>Giỏ hàng trống</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader showBackButton={true} />

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 144 }}>
        
        {/* --- ĐỊA CHỈ --- */}
        <Text className="text-sm font-bold text-gray-300 mb-2 uppercase">Địa chỉ nhận hàng</Text>
        <TouchableOpacity 
            onPress={() => router.push('/address')} 
            className="bg-white p-4 rounded-xl border border-gray-200 mb-4 flex-row items-center shadow-sm"
        >
            <MapPinIcon size={24} color="#2563eb" />
            <View className="flex-1 ml-3">
                {selectedAddress ? (
                    <>
                        <Text className="font-bold text-gray-900">{selectedAddress.recipientName} | {selectedAddress.phone}</Text>
                        <Text className="text-gray-500 text-xs mt-1 leading-5">
                            {selectedAddress.line1}, {selectedAddress.city}
                        </Text>
                    </>
                ) : (
                    <Text className="text-gray-400 italic">Chưa có địa chỉ. Bấm để thêm.</Text>
                )}
            </View>
            <ChevronRightIcon size={20} color="gray" />
        </TouchableOpacity>

        {/* --- DANH SÁCH SP --- */}
        <View className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden shadow-sm">
            {cart?.items.map((item, idx) => (
                <View key={item.skuId} className={`p-3 flex-row justify-between ${idx > 0 ? 'border-t border-gray-100' : ''}`}>
                    <View className="flex-1 mr-4">
                        <Text numberOfLines={1} className="text-sm font-medium">{item.name}</Text>
                        <Text className="text-xs text-gray-400">x{item.quantity}</Text>
                    </View>
                    <Text className="text-sm font-bold">{formatVND(item.priceMinor * item.quantity)}</Text>
                </View>
            ))}
        </View>

        {/* --- PHƯƠNG THỨC THANH TOÁN --- */}
        <View className=" p-4 rounded-xl border border-blue-200 mb-4 flex-row items-center bg-blue-50">
            <BanknotesIcon size={24} color="#2563eb" />
            <Text className="ml-3 font-bold text-blue-700 text-base">Ví điện tử VNPAY / Momo</Text>
            <View className="flex-1 items-end">
                <View className="w-5 h-5 rounded-full border-[5px] border-blue-600 bg-white" />
            </View>
        </View>

        {/* --- GHI CHÚ --- */}
        <View className="mb-6">
            <Text className="text-sm font-bold text-gray-300 mb-2 uppercase">Ghi chú</Text>
            <TextInput 
                className="bg-white p-3 rounded-xl border border-gray-200 text-gray-800"
                placeholder="Lời nhắn cho người bán..."
                value={note}
                onChangeText={setNote}
            />
        </View>

        {/* --- 3. CHI TIẾT THANH TOÁN (Dữ liệu từ Preview) --- */}
        <View className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <Text className="font-bold text-gray-900 mb-2">Chi tiết thanh toán</Text>
            
            <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">Tổng tiền hàng</Text>
                <Text className="text-gray-900 text-sm">{formatVND(preview?.subtotalMinor || cart?.subtotalMinor || 0)}</Text>
            </View>

            <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">Phí vận chuyển</Text>
                <Text className="text-gray-900 text-sm">{formatVND(preview?.shippingMinor || 0)}</Text>
            </View>

            <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">Thuế (VAT)</Text>
                <Text className="text-gray-900 text-sm">{formatVND(preview?.taxMinor || 0)}</Text>
            </View>

            <View className="h-[1px] bg-gray-100 my-1" />

            <View className="flex-row justify-between items-center">
                <Text className="text-gray-900 font-bold text-base">Tổng thanh toán</Text>
                {isPreviewLoading ? (
                    <ActivityIndicator size="small" color="#2563eb" />
                ) : (
                    <Text className="text-blue-600 font-bold text-xl">
                        {formatVND(preview?.totalMinor || 0)}
                    </Text>
                )}
            </View>
        </View>

      </ScrollView>

      {/* --- FOOTER --- */}
      <View className="bg-white p-4 border-t border-gray-100 shadow-xl absolute bottom-0 left-0 right-0">
         <View className="flex-row justify-between mb-2 items-center">
             <Text className="text-gray-500 font-medium">Tổng cộng</Text>
             {isPreviewLoading ? (
                 <ActivityIndicator size="small" />
             ) : (
                 <Text className="text-xl font-bold text-red-600">
                    {formatVND(preview?.totalMinor || 0)}
                 </Text>
             )}
         </View>
         <TouchableOpacity 
            onPress={handlePlaceOrder}
            // Disable nếu đang load, đang tạo đơn, hoặc chưa có preview (chưa chọn địa chỉ)
            disabled={isLoading || isPreviewLoading || !preview}
            className={`py-4 rounded-xl items-center shadow-lg ${
                (isLoading || isPreviewLoading || !preview) ? 'bg-gray-300' : 'bg-red-600 shadow-red-200'
            }`}
         >
             {isLoading ? (
                <ActivityIndicator color="white" />
             ) : (
                <Text className="text-white font-bold text-lg">Đặt hàng</Text>
             )}
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}