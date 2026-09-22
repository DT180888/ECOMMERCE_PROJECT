import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = width * 0.5; // Tỉ lệ 2:1 (Ví dụ rộng 400 thì cao 200)

const BANNERS = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000",
];

export default function Hero() {
  const router = useRouter();

  return (
    <View className="mb-4">
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        className="bg-gray-200"
      >
        {BANNERS.map((img, index) => (
          <TouchableOpacity 
            key={index}
            activeOpacity={0.9}
            onPress={() => router.push('/(tabs)/catalog')}
            style={{ width, height: BANNER_HEIGHT }}
          >
            <Image
              source={{ uri: img }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Overlay Text (Optional) */}
            {/* <View className="absolute bottom-4 left-4 bg-gray-900/50 px-3 py-1 rounded">
                <Text className="text-white font-bold text-xs">BST MỚI {index + 1}</Text>
            </View> */}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}