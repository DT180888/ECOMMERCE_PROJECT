import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CalendarIcon, UserCircleIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Logic
import { useMyProfile, useUpdateProfile } from '@entities/user/hooks';
import type { UpdateProfilePayload } from '@entities/user/types';
import { useToast } from '@shared/ui/Toast';
import { AppHeader } from '@widgets/Header/AppHeader';

export default function UserInfoScreen() {
  const router = useRouter();
  const toast = useToast();
  
  // 1. Hooks API
  const { data: profile, isLoading } = useMyProfile();
  const updateMut = useUpdateProfile();

  // 2. Form Setup
  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<UpdateProfilePayload>({
    defaultValues: {
      fullName: '',
      phone: '',
      dateOfBirth: null,
    }
  });

  // 3. State cho DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  // 4. Load dữ liệu ban đầu vào Form
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth,
      });
      if (profile.dateOfBirth) {
        setDate(new Date(profile.dateOfBirth));
      }
    }
  }, [profile]);

  // 5. Xử lý lưu
  const onSubmit = async (data: UpdateProfilePayload) => {
    try {
      // Format lại Date sang ISO string (YYYY-MM-DD...) để gửi BE
      const payload = {
        ...data,
        dateOfBirth: date ? date.toISOString().split('T')[0] : null
      };

      await updateMut.mutateAsync(payload);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error("Lỗi cập nhật thông tin.");
    }
  };

  // Helper render Input
  const renderInput = (name: keyof UpdateProfilePayload, label: string, placeholder: string, keyboardType: 'default' | 'phone-pad' = 'default') => (
    <View className="mb-4">
      <Text className="text-gray-700 mb-1 font-medium">{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={{ required: name === 'fullName' ? 'Họ tên là bắt buộc' : false }}
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

  if (isLoading) {
    return <View className="flex-1 justify-center"><ActivityIndicator size="large" color="#2563eb" /></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader showBackButton={true} />

      <ScrollView className="flex-1 p-4">
        
        {/* Avatar Section */}
        <View className="items-center mb-6 mt-2">
            <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center border-4 border-white shadow-sm">
                <UserCircleIcon size={60} color="#2563eb" />
            </View>
            <Text className="text-gray-300 text-base mt-2">{profile?.email}</Text>
        </View>

        {/* Form Section */}
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-20">
            {renderInput('fullName', 'Họ và tên', 'Nhập họ tên của bạn')}
            {renderInput('phone', 'Số điện thoại', '0912...', 'phone-pad')}

            {/* Date Picker Field */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1 font-medium">Ngày sinh</Text>
                <TouchableOpacity 
                    onPress={() => setShowDatePicker(true)}
                    className="flex-row items-center bg-white border border-gray-200 rounded-xl p-3"
                >
                    <CalendarIcon size={20} color="gray" />
                    <Text className="ml-2 text-gray-800">
                        {date ? date.toLocaleDateString('vi-VN') : "Chọn ngày sinh"}
                    </Text>
                </TouchableOpacity>
                
                {showDatePicker && (
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setDate(selectedDate);
                        }}
                    />
                )}
            </View>
        </View>

      </ScrollView>

      {/* Footer Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
         <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={updateMut.isPending}
            className={`w-full py-4 rounded-xl items-center justify-center ${updateMut.isPending ? 'bg-blue-400' : 'bg-blue-600'}`}
         >
            {updateMut.isPending ? (
               <ActivityIndicator color="white" />
            ) : (
               <Text className="text-white font-bold text-lg">Lưu thay đổi</Text>
            )}
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}