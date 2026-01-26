import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiHelpers } from '@/lib/api';

const hostelBuildingSchema = z.object({
  name: z.string().min(1, 'Building name is required'),
  type: z.enum(['BOYS', 'GIRLS', 'CO_ED'], {
    required_error: 'Building type is required',
  }),
  address: z.string().optional(),
  totalRooms: z.number().min(1, 'Total rooms must be at least 1'),
  wardenName: z.string().optional(),
  wardenPhone: z.string().optional(),
  wardenEmail: z.string().email('Invalid email').optional().or(z.literal('')),
});

type HostelBuildingInput = z.infer<typeof hostelBuildingSchema>;

export default function AddHostelBuildingScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<HostelBuildingInput>({
    resolver: zodResolver(hostelBuildingSchema),
    defaultValues: {
      name: '',
      type: 'BOYS',
      address: '',
      totalRooms: 0,
      wardenName: '',
      wardenPhone: '',
      wardenEmail: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: HostelBuildingInput) => apiHelpers.addHostelBuilding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-buildings'] });
      Alert.alert('Success', 'Hostel building added successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add building');
    },
  });

  const onSubmit = (data: HostelBuildingInput) => {
    createMutation.mutate(data);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Add Hostel Building</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Basic Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Basic Information</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Building Name *"
                value={value}
                onChangeText={onChange}
                placeholder="Enter building name"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Building Type *</Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { label: 'Boys', value: 'BOYS' },
                    { label: 'Girls', value: 'GIRLS' },
                    { label: 'Co-Ed', value: 'CO_ED' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => onChange(option.value)}
                      className={`px-4 py-2 rounded-lg ${
                        value === option.value ? 'bg-blue-500' : 'bg-gray-100'
                      }`}
                    >
                      <Text className={value === option.value ? 'text-white' : 'text-gray-700'}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.type && (
                  <Text className="text-sm text-red-500 mt-1">{errors.type.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Address"
                value={value || ''}
                onChangeText={onChange}
                placeholder="Enter building address"
                multiline
                error={errors.address?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="totalRooms"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Total Rooms *"
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                placeholder="Enter total number of rooms"
                keyboardType="numeric"
                error={errors.totalRooms?.message}
              />
            )}
          />
        </View>

        {/* Warden Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Warden Information</Text>

          <Controller
            control={control}
            name="wardenName"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Warden Name"
                value={value || ''}
                onChangeText={onChange}
                placeholder="Enter warden name"
                error={errors.wardenName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="wardenPhone"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Warden Phone"
                value={value || ''}
                onChangeText={onChange}
                placeholder="+91 9876543210"
                keyboardType="phone-pad"
                error={errors.wardenPhone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="wardenEmail"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Warden Email"
                value={value || ''}
                onChangeText={onChange}
                placeholder="warden@example.com"
                keyboardType="email-address"
                error={errors.wardenEmail?.message}
              />
            )}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={createMutation.isPending}
          className={`py-4 rounded-xl items-center mb-6 ${
            createMutation.isPending ? 'bg-blue-300' : 'bg-blue-500'
          }`}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">Add Building</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
  error?: string;
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
        placeholderTextColor="#9CA3AF"
      />
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
