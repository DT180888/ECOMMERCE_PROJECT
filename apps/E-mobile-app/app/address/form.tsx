import { useAddressList, useCreateAddress, useUpdateAddress } from '@entities/address/hooks';
import type { AddressUpsertReq } from '@entities/address/types';
import { useToast } from '@shared/ui/Toast';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddressFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id ? Number(params.id) : undefined; // Nếu có ID -> Mode Edit
  const toast = useToast();

  // Hooks API
  const createMut = useCreateAddress();
  const updateMut = useUpdateAddress();
  const { data: addressList } = useAddressList(); // Lấy danh sách để tìm item cần sửa

  const isEditMode = !!id;
  const isSubmitting = createMut.isPending || updateMut.isPending;

  // React Hook Form
  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<AddressUpsertReq>({
    defaultValues: {
      label: 'Nhà riêng',
      recipientName: '',
      phone: '',
      line1: '',
      city: '',
      state: '', // Hoặc Quận/Huyện tùy backend
      country: 'Vietnam',
      isDefault: false,
    }
  });

  // Load dữ liệu cũ nếu đang Edit
  useEffect(() => {
    if (isEditMode && addressList?.items) {
      const existing = addressList.items.find(a => a.addressId === id);
      if (existing) {
        reset({
          label: existing.label,
          recipientName: existing.recipientName,
          phone: existing.phone,
          line1: existing.line1,
          city: existing.city,
          state: existing.state,
          country: existing.country,
          isDefault: existing.isDefault,
        });
      }
    }
  }, [id, addressList]);

  const onSubmit = async (data: AddressUpsertReq) => {
    try {
      if (isEditMode) {
        await updateMut.mutateAsync({ id, payload: data });
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        await createMut.mutateAsync(data);
        toast.success("Thêm địa chỉ mới thành công");
      }
      router.back();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Helper render Input để đỡ lặp code
  const renderInput = (name: keyof AddressUpsertReq, label: string, placeholder: string, required = true, keyboardType: 'default' | 'numeric' | 'phone-pad' = 'default') => (
    <View className="mb-4">
      <Text className="text-gray-700 mb-1 font-medium text-sm">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={{ required: required ? 'Trường này là bắt buộc' : false }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`bg-white border ${errors[name] ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 text-gray-800`}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value as string}
            keyboardType={keyboardType}
          />
        )}
      />
      {errors[name] && <Text className="text-red-500 text-xs mt-1">{errors[name]?.message}</Text>}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: isEditMode ? "Sửa địa chỉ" : "Thêm địa chỉ mới",
          headerShadowVisible: false 
        }} 
      />

      <ScrollView className="flex-1 p-4" keyboardShouldPersistTaps="handled">
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
            
            {renderInput('label', 'Tên gợi nhớ', 'Ví dụ: Nhà, Công ty...')}
            
            <View className="flex-row gap-3">
                <View className="flex-1">
                    {renderInput('recipientName', 'Tên người nhận', 'Nguyễn Văn A')}
                </View>
                <View className="flex-1">
                    {renderInput('phone', 'Số điện thoại', '09...', true, 'phone-pad')}
                </View>
            </View>

            {renderInput('line1', 'Địa chỉ cụ thể', 'Số nhà, tên đường...')}
            
            <View className="flex-row gap-3">
                <View className="flex-1">
                    {renderInput('city', 'Tỉnh / Thành phố', 'TP.HCM')}
                </View>
                <View className="flex-1">
                    {renderInput('state', 'Quận / Huyện', 'Quận 1')}
                </View>
            </View>

            {/* Switch Mặc định */}
            <View className="flex-row items-center justify-between mt-2 pt-4 border-t border-gray-100">
                <Text className="text-gray-700 font-medium">Đặt làm địa chỉ mặc định</Text>
                <Controller
                    control={control}
                    name="isDefault"
                    render={({ field: { onChange, value } }) => (
                        <Switch
                            trackColor={{ false: "#767577", true: "#bfdbfe" }}
                            thumbColor={value ? "#2563eb" : "#f4f3f4"}
                            onValueChange={onChange}
                            value={value}
                        />
                    )}
                />
            </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View className="p-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl items-center justify-center ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600'}`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Lưu địa chỉ</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}