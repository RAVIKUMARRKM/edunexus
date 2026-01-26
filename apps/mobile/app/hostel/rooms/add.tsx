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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiHelpers } from '@/lib/api';

const hostelRoomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  buildingId: z.string().min(1, 'Building is required'),
  floor: z.number().min(0, 'Floor must be 0 or greater'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  amenities: z.string().optional(),
});

type HostelRoomInput = z.infer<typeof hostelRoomSchema>;

export default function AddHostelRoomScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<HostelRoomInput>({
    resolver: zodResolver(hostelRoomSchema),
    defaultValues: {
      roomNumber: '',
      buildingId: '',
      floor: 0,
      capacity: 1,
      amenities: '',
    },
  });

  const { data: buildingsData } = useQuery({
    queryKey: ['hostel-buildings'],
    queryFn: async () => {
      const response = await apiHelpers.getHostelBuildings();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiHelpers.addHostelRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-rooms'] });
      Alert.alert('Success', 'Hostel room added successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add room');
    },
  });

  const onSubmit = (data: HostelRoomInput) => {
    // Convert amenities string to array
    const amenitiesArray = data.amenities
      ? data.amenities.split(',').map((a) => a.trim()).filter((a) => a.length > 0)
      : [];

    createMutation.mutate({
      ...data,
      amenities: amenitiesArray,
    });
  };

  const buildings = buildingsData?.data || [];
  const selectedBuildingId = watch('buildingId');

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Add Hostel Room</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Room Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Room Information</Text>

          <Controller
            control={control}
            name="roomNumber"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Room Number *"
                value={value}
                onChangeText={onChange}
                placeholder="Enter room number (e.g., 101, A-201)"
                error={errors.roomNumber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="buildingId"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Building *</Text>
                {buildings.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row gap-2"
                  >
                    {buildings.map((building: any) => (
                      <TouchableOpacity
                        key={building.id}
                        onPress={() => onChange(building.id)}
                        className={`px-4 py-2 rounded-lg ${
                          value === building.id ? 'bg-blue-500' : 'bg-gray-100'
                        }`}
                      >
                        <Text className={value === building.id ? 'text-white' : 'text-gray-700'}>
                          {building.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                    <Text className="text-gray-400">No buildings available</Text>
                  </View>
                )}
                {errors.buildingId && (
                  <Text className="text-sm text-red-500 mt-1">{errors.buildingId.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="floor"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Floor *"
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                placeholder="Enter floor number (0 for ground floor)"
                keyboardType="numeric"
                error={errors.floor?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="capacity"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Capacity (Beds) *"
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 1)}
                placeholder="Enter number of beds"
                keyboardType="numeric"
                error={errors.capacity?.message}
              />
            )}
          />
        </View>

        {/* Amenities */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Amenities</Text>

          <Controller
            control={control}
            name="amenities"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Amenities (comma-separated)
                </Text>
                <TextInput
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="e.g., AC, WiFi, Attached Bathroom, Study Table"
                  multiline
                  numberOfLines={3}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
                <Text className="text-xs text-gray-500 mt-1">
                  Separate multiple amenities with commas
                </Text>
                {errors.amenities && (
                  <Text className="text-sm text-red-500 mt-1">{errors.amenities.message}</Text>
                )}
              </View>
            )}
          />

          {/* Common Amenities Quick Add */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Quick Add</Text>
            <View className="flex-row flex-wrap gap-2">
              {['AC', 'WiFi', 'Attached Bathroom', 'Study Table', 'Wardrobe', 'Fan'].map(
                (amenity) => (
                  <TouchableOpacity
                    key={amenity}
                    onPress={() => {
                      const current = watch('amenities') || '';
                      const amenitiesList = current
                        .split(',')
                        .map((a) => a.trim())
                        .filter((a) => a.length > 0);

                      if (amenitiesList.includes(amenity)) {
                        // Remove amenity
                        const updated = amenitiesList.filter((a) => a !== amenity).join(', ');
                        control._formValues.amenities = updated;
                        control._subjects.state.next({ name: 'amenities' });
                      } else {
                        // Add amenity
                        amenitiesList.push(amenity);
                        const updated = amenitiesList.join(', ');
                        control._formValues.amenities = updated;
                        control._subjects.state.next({ name: 'amenities' });
                      }
                    }}
                    className={`px-3 py-2 rounded-lg ${
                      (watch('amenities') || '').includes(amenity)
                        ? 'bg-blue-500'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={
                        (watch('amenities') || '').includes(amenity)
                          ? 'text-white'
                          : 'text-gray-700'
                      }
                    >
                      {amenity}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
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
            <Text className="text-white font-semibold text-lg">Add Room</Text>
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
