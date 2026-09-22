import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text>Màn hình không tồn tại.</Text>
      <Link href="/(tabs)">Về trang chủ</Link>
    </View>
  );
}