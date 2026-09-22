import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

// 1. Import Logic
import { apiMe } from "@entities/auth/api"; // API lấy info user
import { useLogin } from "@entities/auth/hooks"; // React Query Hook
import { useAuthStore } from "@entities/auth/model/store"; // Zustand Store

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFetchingProfile, setIsFetchingProfile] = useState(false); // Loading state riêng cho bước lấy profile

  // Lấy hàm signIn từ store
  const signIn = useAuthStore((state) => state.signIn);

  // Hook Login từ React Query
  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const isLoading = isLoggingIn || isFetchingProfile;

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập email và mật khẩu");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: async (data) => {
          // data là LoginRes { access_token, ... }
          // Lưu ý: apiLogin trong api.ts của bạn đã tự động gọi setAccessToken rồi.
          
          try {
            setIsFetchingProfile(true);
            
            // 1. Gọi API lấy thông tin user (vì login chỉ trả về token)
            const user = await apiMe();

            // 2. Lưu vào Store & SecureStore
            await signIn(data.access_token, user);

            // 3. Chuyển hướng
            Alert.alert("Thành công", `Xin chào, ${user.email}`);
            router.replace('/(tabs)');
            
          } catch (error) {
            console.error("Get Profile Error:", error);
            Alert.alert("Lỗi", "Đăng nhập thành công nhưng không lấy được thông tin người dùng.");
          } finally {
            setIsFetchingProfile(false);
          }
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message || "Email hoặc mật khẩu không đúng";
          Alert.alert("Đăng nhập thất bại", msg);
        },
      }
    );
  };

  return (
    <View className="w-full">
      {/* Email Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-medium">Email</Text>
        <TextInput
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
          placeholder="name@example.com"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Password Input */}
      <View className="mb-8">
        <Text className="text-gray-700 mb-2 font-medium">Mật khẩu</Text>
        <TextInput
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base"
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity 
            onPress={() => Alert.alert("Tính năng đang phát triển", "Vui lòng liên hệ Admin để reset mật khẩu.")}
            className="self-end mt-2"
        >
            <Text className="text-blue-600 font-medium">Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      {/* Button Login */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        className={`w-full bg-blue-600 rounded-xl p-4 flex-row justify-center items-center shadow-md shadow-blue-200 ${isLoading ? "opacity-70" : ""}`}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">Đăng Nhập</Text>
        )}
      </TouchableOpacity>

      {/* Footer Link */}
      <View className="flex-row justify-center mt-8 gap-1">
        <Text className="text-gray-500 text-base">Chưa có tài khoản?</Text>
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text className="text-blue-600 font-bold text-base">Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};