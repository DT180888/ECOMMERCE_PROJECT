import { useProductDetail } from "@entities/product/hooks";
import { useSmartCart } from "@features/cart/useSmartCart";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@shared/constants";
import { buildImgSrc } from "@shared/lib/url";
import { useToast } from "@shared/ui/Toast";
import { AppHeader } from "@widgets/Header/AppHeader";
import SkuSelector from "@widgets/Product/SkuSelector";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BoltIcon, ChevronRightIcon, ShoppingCartIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

// Utils
const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(minor);

function parseIdFromSlugId(slugId?: string | string[]) {
  if (!slugId) return undefined;
  const slugStr = Array.isArray(slugId) ? slugId[0] : slugId;
  const m = slugStr.match(/-(\d+)$/);
  if (!m) return undefined;
  return Number(m[1]);
}

export default function ProductDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const toast = useToast();
  const id = parseIdFromSlugId(slug);
  
  // Hook data
  const { data: p, isLoading, isError } = useProductDetail(id);
  const { addToCart, isActionPending } = useSmartCart();

  // State
  const [selectedSkuId, setSelectedSkuId] = useState<number | null>(null);
  const [selectedSkuPrice, setSelectedSkuPrice] = useState<number | undefined>(undefined);
  const [selectedSkuCode, setSelectedSkuCode] = useState<string | undefined>(undefined);
  const [activeImageId, setActiveImageId] = useState<number | null>(null);

  // Effects & Logic
  useEffect(() => {
    setActiveImageId(null);
    setSelectedSkuId(null);
    setSelectedSkuPrice(undefined);
    setSelectedSkuCode(undefined);
  }, [id]);

  const displayImageUrl = useMemo(() => {
    if (!p?.images?.length) return DEFAULT_PRODUCT_IMAGE_URL;
    if (activeImageId != null) {
      const chosen = p.images.find((i) => i.imageId === activeImageId);
      if (chosen) return buildImgSrc(chosen.url);
    }
    const prim = p.images.find((i) => i.isPrimary) ?? p.images[0];
    return buildImgSrc(prim?.url) || DEFAULT_PRODUCT_IMAGE_URL;
  }, [p, activeImageId]);

  const priceFrom = useMemo(() => {
    if (!p?.skus?.length) return 0;
    const actives = p.skus.filter((s) => s.isActive);
    if (!actives.length) return 0;
    return Math.min(...actives.map((s) => s.priceMinor));
  }, [p]);

  const handleSkuChange = useCallback((skuId: number | null, price?: number, code?: string) => {
      setSelectedSkuId(skuId);
      setSelectedSkuPrice(price);
      setSelectedSkuCode(code);
  }, []);

  const handleAddToCart = async () => {
    if (!selectedSkuId || !p) return;
    try {
      await addToCart({
        skuId: selectedSkuId,
        quantity: 1,
        name: p.name,
        skuCode: selectedSkuCode,
        priceMinor: selectedSkuPrice,
        primaryImageUrl: displayImageUrl,
      });
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      toast.error("Lỗi thêm giỏ hàng");
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSkuId) {
      toast.info("Vui lòng chọn phân loại");
      return;
    }
    try {
        await addToCart({
            skuId: selectedSkuId,
            quantity: 1,
            name: p.name,
            skuCode: selectedSkuCode,
            priceMinor: selectedSkuPrice,
            primaryImageUrl: displayImageUrl,
        });
        router.push("/(tabs)/cart");
    } catch (error) {
        toast.error("Lỗi xử lý");
    }
  };

  // --- RENDER CONTENT ---
  // Hàm render nội dung chính để code gọn hơn
  const renderContent = () => {
    if (isLoading && !p) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (isError || !p) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500">Sản phẩm không tồn tại</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                {/* Breadcrumb */}
                <View className="hidden md:flex flex-row items-center gap-2 px-6 pt-4 pb-2">
                    <Text className="text-gray-500 text-xs">Home</Text>
                    <ChevronRightIcon size={12} color="gray" />
                    <Text className="text-gray-900 text-xs font-medium">{p.name}</Text>
                </View>

                <View className="flex flex-col lg:flex-row lg:gap-8 lg:px-6 lg:pt-4">
                    {/* LEFT: Images */}
                    <View className="w-full lg:w-5/12 ">
                        <View className="w-full bg-gray-900 lg:rounded-2xl overflow-hidden relative">
                            <Image source={{ uri: displayImageUrl }} className="my-9 w-full h-[300px]" resizeMode="contain" />
                        </View>
                        {p.images && p.images.length > 1 && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="  px-4 lg:px-0 space-x-3 pb-2 pt-2">
                                {p.images.map(img => (
                                    <TouchableOpacity 
                                        key={img.imageId} 
                                        onPress={() => setActiveImageId(img.imageId)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImageId === img.imageId ? 'border-blue-600' : 'border-gray-300'}`}
                                    >
                                        <Image source={{ uri: buildImgSrc(img.url) }} className="w-full h-full" resizeMode="cover" />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    {/* RIGHT: Info */}
                    <View className="flex-1 px-4 lg:px-0 space-y-6 pt-2">
                        <View>
                            <Text className="text-blue-600 font-bold text-xs uppercase mb-1">{p.brandName}</Text>
                            <Text className="text-2xl font-bold text-gray-900 leading-tight">{p.name}</Text>
                            <View className="mt-3 flex-row items-baseline gap-2">
                                <Text className="text-3xl font-bold text-red-600">
                                    {selectedSkuPrice !== undefined ? formatVND(selectedSkuPrice) : formatVND(p.productId)}
                                </Text>
                                {!selectedSkuPrice && <Text className="text-gray-500 text-sm">trở lên</Text>}
                            </View>
                        </View>

                        <View className="border-t border-b border-gray-100 py-4">
                            <SkuSelector productId={p.productId} onChange={handleSkuChange} />
                        </View>

                        <View>
                            <Text className="font-bold text-lg mb-2 text-gray-900">Mô tả</Text>
                            <Text className="text-gray-600 leading-6 text-sm">{p.description}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 pb-4 shadow-2xl flex-row gap-3 z-50">
                <TouchableOpacity 
                    className="flex-1 bg-blue-50 py-3.5 rounded-xl flex-row items-center justify-center gap-2 border border-blue-100"
                    onPress={handleAddToCart}
                    disabled={isActionPending}
                >
                    <ShoppingCartIcon size={20} color="#2563eb" />
                    <Text className="text-blue-700 font-bold text-base">Thêm giỏ</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className={`flex-1 py-3.5 rounded-xl flex-row items-center justify-center gap-2 ${!selectedSkuId ? 'bg-gray-200' : 'bg-blue-600'}`}
                    disabled={!selectedSkuId || isActionPending}
                    onPress={handleBuyNow}
                >
                    <BoltIcon size={20} color={!selectedSkuId ? "#9ca3af" : "white"} />
                    <Text className={`${!selectedSkuId ? 'text-gray-500' : 'text-white'} font-bold text-base`}>Mua ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  };

  // --- MAIN RETURN: GIỮ NGUYÊN KHUNG (SHELL) KHÔNG BAO GIỜ THAY ĐỔI ---
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header luôn cố định, không bị unmount khi content thay đổi */}
      <AppHeader showBackButton={true} />

      {/* Content thay đổi bên trong */}
      {renderContent()}
      
    </SafeAreaView>
  );
}