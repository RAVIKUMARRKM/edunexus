import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiHelpers } from '@/lib/api';

const vehicleSchema = z.object({
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  type: z.enum(['BUS', 'VAN', 'CAR']),
  capacity: z.string().min(1, 'Capacity is required'),
  registrationNumber: z.string().optional(),
  insuranceExpiryDate: z.string().optional(),
  driverName: z.string().min(1, 'Driver name is required'),
  driverPhone: z.string().optional(),
  driverLicense: z.string().optional(),
});

type VehicleInput = z.infer<typeof vehicleSchema>;

export default function AddVehicleScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicleNumber: '',
      type: 'BUS',
      capacity: '',
      registrationNumber: '',
      insuranceExpiryDate: '',
      driverName: '',
      driverPhone: '',
      driverLicense: '',
    },
  });

  const insuranceExpiryDate = watch('insuranceExpiryDate');

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = {
        ...data,
        capacity: parseInt(data.capacity),
      };
      return apiHelpers.addVehicle(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      Alert.alert('Success', 'Vehicle added successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add vehicle');
    },
  });

  const onSubmit = (data: VehicleInput) => {
    createMutation.mutate(data);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setValue('insuranceExpiryDate', formattedDate);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Add Vehicle</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Vehicle Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</Text>

          <Controller
            control={control}
            name="vehicleNumber"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Vehicle Number *"
                value={value}
                onChangeText={onChange}
                placeholder="e.g., MH-01-AB-1234"
                error={errors.vehicleNumber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <FormPicker
                label="Vehicle Type *"
                value={value}
                onValueChange={onChange}
                options={[
                  { label: 'Bus', value: 'BUS' },
                  { label: 'Van', value: 'VAN' },
                  { label: 'Car', value: 'CAR' },
                ]}
                error={errors.type?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="capacity"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Capacity (Number of Seats) *"
                value={value}
                onChangeText={onChange}
                placeholder="e.g., 50"
                keyboardType="numeric"
                error={errors.capacity?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="registrationNumber"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Registration Number"
                value={value || ''}
                onChangeText={onChange}
                placeholder="Enter registration number"
                error={errors.registrationNumber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="insuranceExpiryDate"
            render={({ field: { value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Insurance Expiry Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                >
                  <Text className={value ? 'text-gray-900' : 'text-gray-400'}>
                    {value || 'Select insurance expiry date'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}
                {errors.insuranceExpiryDate && (
                  <Text className="text-sm text-red-500 mt-1">{errors.insuranceExpiryDate.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Driver Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Driver Information</Text>

          <Controller
            control={control}
            name="driverName"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Driver Name *"
                value={value}
                onChangeText={onChange}
                placeholder="Enter driver name"
                error={errors.driverName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="driverPhone"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Driver Phone"
                value={value || ''}
                onChangeText={onChange}
                placeholder="+91 9876543210"
                keyboardType="phone-pad"
                error={errors.driverPhone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="driverLicense"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Driver License"
                value={value || ''}
                onChangeText={onChange}
                placeholder="Enter driver license number"
                error={errors.driverLicense?.message}
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
            <Text className="text-white font-semibold text-lg">Add Vehicle</Text>
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

function FormPicker({
  label,
  value,
  onValueChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  error?: string;
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onValueChange(option.value)}
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
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
