import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiHelpers } from '@/lib/api';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiHelpers.changePassword(data),
    onSuccess: () => {
      Alert.alert(
        'Success',
        'Password changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
              router.back();
            },
          },
        ]
      );
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to change password'
      );
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Change Password</Text>
        <Text className="text-white/80 mt-2">Update your account password</Text>
      </View>

      <View className="px-4 py-4">
        {/* Form Card */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          {/* Current Password */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Current Password
            </Text>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                  <Ionicons name="lock-closed" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900"
                    placeholder="Enter current password"
                    secureTextEntry={!showCurrentPassword}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Ionicons
                      name={showCurrentPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.currentPassword && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </Text>
            )}
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              New Password
            </Text>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                  <Ionicons name="key" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900"
                    placeholder="Enter new password"
                    secureTextEntry={!showNewPassword}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Ionicons
                      name={showNewPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.newPassword && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </Text>
            )}
            <Text className="text-gray-500 text-xs mt-2">
              Password must be at least 6 characters long
            </Text>
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                  <Ionicons name="checkmark-circle" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900"
                    placeholder="Confirm new password"
                    secureTextEntry={!showConfirmPassword}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={changePasswordMutation.isPending}
            className="bg-blue-500 rounded-lg py-4 flex-row items-center justify-center"
          >
            {changePasswordMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="shield-checkmark" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Change Password
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Security Tips */}
        <View className="bg-amber-50 rounded-xl p-4">
          <View className="flex-row items-start mb-3">
            <Ionicons name="shield-checkmark" size={20} color="#F59E0B" />
            <Text className="text-amber-900 font-semibold ml-2">
              Password Security Tips
            </Text>
          </View>
          <View className="space-y-2">
            <View className="flex-row items-start">
              <Text className="text-amber-800 mr-2">•</Text>
              <Text className="text-amber-800 text-sm flex-1">
                Use a strong password with a mix of letters, numbers, and symbols
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-amber-800 mr-2">•</Text>
              <Text className="text-amber-800 text-sm flex-1">
                Avoid using common words or personal information
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-amber-800 mr-2">•</Text>
              <Text className="text-amber-800 text-sm flex-1">
                Never share your password with anyone
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-amber-800 mr-2">•</Text>
              <Text className="text-amber-800 text-sm flex-1">
                Change your password regularly
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
