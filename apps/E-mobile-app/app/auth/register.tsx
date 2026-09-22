import { RegisterForm } from '@features/auth/ui/RegisterForm';
import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ MỚI: Import từ react-native-heroicons
// "outline" tương ứng với @heroicons/react/24/outline bên Web
import { ChevronLeftIcon } from "react-native-heroicons/outline";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      <View className="flex-1 px-6">
        {/* Header có nút Back */}
        <View className="pt-4 mb-6">
            <TouchableOpacity 
                onPress={() => router.back()} 
                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            >
                {/* ✅ MỚI: Sử dụng Heroicon */}
                <ChevronLeftIcon size={24} color="black" />
            </TouchableOpacity>
        </View>

        <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản</Text>
            <Text className="text-gray-500">Tham gia cùng chúng tôi ngay hôm nay.</Text>
        </View>

        <RegisterForm />
      </View>
    </SafeAreaView>
  );
}