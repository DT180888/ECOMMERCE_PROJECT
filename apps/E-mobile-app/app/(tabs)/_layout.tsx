
import { Tabs } from 'expo-router';
import { HomeIcon, Squares2X2Icon, UserCircleIcon } from 'react-native-heroicons/outline';
import { HomeIcon as HomeSolid, Squares2X2Icon as SquaresSolid, UserCircleIcon as UserSolid } from 'react-native-heroicons/solid';
// 👇 1. Import AppHeader
import { AppHeader } from '@widgets/Header/AppHeader';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: true, 
        
        header: () => <AppHeader />,

        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => 
            focused ? <HomeSolid size={30} color={color} /> : <HomeIcon size={30} color={color} />,
        }}
      />

      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Danh mục',
          tabBarIcon: ({ color, focused }) => 
            focused ? <SquaresSolid size={30} color={color} /> : <Squares2X2Icon size={30} color={color} />,
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color, focused }) => 
            focused ? <UserSolid size={30} color={color} /> : <UserCircleIcon size={30} color={color} />,
        }}
      />
    </Tabs>
  );
}