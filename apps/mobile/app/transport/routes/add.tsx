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
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiHelpers } from '@/lib/api';

const stopSchema = z.object({
  name: z.string().min(1, 'Stop name is required'),
  time: z.string().optional(),
});

const routeSchema = z.object({
  name: z.string().min(1, 'Route name is required'),
  stops: z.array(stopSchema).min(1, 'At least one stop is required'),
  distance: z.string().optional(),
});

type RouteInput = z.infer<typeof routeSchema>;

export default function AddRouteScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RouteInput>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      name: '',
      stops: [{ name: '', time: '' }],
      distance: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'stops',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = {
        ...data,
        distance: data.distance ? parseFloat(data.distance) : undefined,
      };
      return apiHelpers.addTransportRoute(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-routes'] });
      Alert.alert('Success', 'Route added successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add route');
    },
  });

  const onSubmit = (data: RouteInput) => {
    createMutation.mutate(data);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Add Route</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Route Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Route Information</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Route Name *"
                value={value}
                onChangeText={onChange}
                placeholder="e.g., North Route, South Route"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="distance"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Distance (km)"
                value={value || ''}
                onChangeText={onChange}
                placeholder="e.g., 15.5"
                keyboardType="decimal-pad"
                error={errors.distance?.message}
              />
            )}
          />
        </View>

        {/* Stops */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">Stops & Timings</Text>
            <TouchableOpacity
              onPress={() => append({ name: '', time: '' })}
              className="bg-blue-500 px-3 py-1.5 rounded-lg flex-row items-center"
            >
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-white text-sm font-medium ml-1">Add Stop</Text>
            </TouchableOpacity>
          </View>

          {fields.map((field, index) => (
            <View
              key={field.id}
              className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-medium text-gray-700">Stop {index + 1}</Text>
                {fields.length > 1 && (
                  <TouchableOpacity onPress={() => remove(index)}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>

              <Controller
                control={control}
                name={`stops.${index}.name`}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Stop Name *"
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g., Main Gate, Bus Stand"
                    error={errors.stops?.[index]?.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name={`stops.${index}.time`}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    label="Time (Optional)"
                    value={value || ''}
                    onChangeText={onChange}
                    placeholder="e.g., 07:30 AM"
                    error={errors.stops?.[index]?.time?.message}
                  />
                )}
              />
            </View>
          ))}

          {errors.stops && typeof errors.stops === 'object' && 'message' in errors.stops && (
            <Text className="text-sm text-red-500 mt-1">{errors.stops.message as string}</Text>
          )}
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
            <Text className="text-white font-semibold text-lg">Add Route</Text>
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
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: any;
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
        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
        placeholderTextColor="#9CA3AF"
      />
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
