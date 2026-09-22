import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Giả sử bạn đã có hook useRegister (copy từ web sang)
import { useRegister } from '@entities/auth/hooks';

export const RegisterForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  
  // Hook đăng ký
  const { mutate: register, isPending } = useRegister();

  const handleRegister = () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    register(
      { email }, // Payload tùy theo API của bạn
      {
        onSuccess: (data) => {
          Alert.alert('Thành công', data.message || 'Vui lòng kiểm tra email để lấy mật khẩu.');
          router.replace('/auth/login');
        },
        onError: (error: any) => {
          Alert.alert('Lỗi', error?.response?.data?.message || 'Đăng ký thất bại');
        }
      }
    );
  };

  return (
    <View className="w-full">
      <View className="mb-6">
        <Text className="text-gray-600 mb-2 font-medium">Email</Text>
        <TextInput
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
          placeholder="Nhập email đăng ký"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        disabled={isPending}
        className={`w-full bg-blue-600 rounded-xl p-4 flex-row justify-center items-center ${isPending ? 'opacity-70' : ''}`}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">Đăng Ký</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center mt-6 gap-1">
        <Text className="text-gray-500">Đã có tài khoản?</Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text className="text-blue-600 font-bold">Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};