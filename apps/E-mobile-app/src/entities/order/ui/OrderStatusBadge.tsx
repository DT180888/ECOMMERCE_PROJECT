import { getOrderStatusConfig } from '@shared/utils/orderStatus'; // Copy file này từ web sang shared/utils
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  status: number;
}

export const OrderStatusBadge = ({ status }: Props) => {
  const config = getOrderStatusConfig(status);

  // NativeWind mapping màu sắc
  // Lưu ý: Các class bg-xxx, text-xxx từ web có thể dùng trực tiếp trên mobile nhờ NativeWind
  // Nhưng border thì cần cẩn thận hơn. Ở đây mình dùng style inline động để dễ control.
  
  return (
    <View 
      className={`flex-row items-center px-2 py-1 rounded-full border ${config.colorClass}`}
      style={{ alignSelf: 'flex-start' }}
    >
      <Text className="mr-1 text-xs">{config.icon}</Text>
      <Text className={`text-xs font-bold ${config.colorClass.split(' ')[1]}`}>
          {config.label}
      </Text>
    </View>
  );
};