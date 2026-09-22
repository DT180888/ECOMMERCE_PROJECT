import { UserProfile } from '@/widgets/User/UserProfile';
import { Text, View } from 'react-native';

export default function AccountScreen() {
  return (
    <View className="flex-1 bg-gray-900">
      <View className="p-4 bg-white border-b border-gray-200 mb-2">
        <Text className="text-xl font-bold text-gray-900">Tài khoản</Text>
      </View>
      
      {/* Widget hiển thị thông tin User & nút Đăng xuất */}
      <UserProfile />
    </View>
  );
}