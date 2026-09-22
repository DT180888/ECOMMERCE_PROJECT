import { LoginForm } from '@features/auth/ui/LoginForm';
import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      <View className="flex-1 justify-center px-6">
        {/* Logo hoặc Header */}
        <View className="items-center mb-10">
            <View className="w-20 h-20 bg-blue-600 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-blue-200">
                <Text className="text-white text-3xl font-bold">E</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900">Chào mừng trở lại!</Text>
            <Text className="text-gray-500 mt-2 text-center">Đăng nhập để tiếp tục mua sắm các sản phẩm yêu thích.</Text>
        </View>

        {/* Form */}
        <LoginForm />
      </View>
    </SafeAreaView>
  );
}