import { useState, useEffect } from 'react';
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

const allocationSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  routeId: z.string().min(1, 'Route is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  pickupPoint: z.string().optional(),
});

type AllocationInput = z.infer<typeof allocationSchema>;

export default function ManageAllocationScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AllocationInput>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      studentId: '',
      routeId: '',
      vehicleId: '',
      pickupPoint: '',
    },
  });

  const selectedRouteId = watch('routeId');
  const selectedStudentId = watch('studentId');

  // Fetch students with search
  const { data: students } = useQuery({
    queryKey: ['students', studentSearch],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (studentSearch) params.search = studentSearch;
      const response = await apiHelpers.getStudents(params);
      return response.data;
    },
  });

  // Fetch routes
  const { data: routes } = useQuery({
    queryKey: ['transport-routes'],
    queryFn: async () => {
      const response = await apiHelpers.getTransportRoutes();
      return response.data;
    },
  });

  // Fetch vehicles (filtered by route if selected)
  const { data: vehicles } = useQuery({
    queryKey: ['vehicles', selectedRouteId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (selectedRouteId) params.routeId = selectedRouteId;
      const response = await apiHelpers.getVehicles(params);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: AllocationInput) => apiHelpers.addTransportAllocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-allocations'] });
      Alert.alert('Success', 'Transport allocation added successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add allocation');
    },
  });

  const onSubmit = (data: AllocationInput) => {
    createMutation.mutate(data);
  };

  const selectedStudent = students?.data?.find((s: any) => s.id === selectedStudentId);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Manage Allocation</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Student Selection */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Select Student</Text>

          <Controller
            control={control}
            name="studentId"
            render={({ field: { value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Student *</Text>

                {/* Search Input */}
                <TextInput
                  value={studentSearch}
                  onChangeText={(text) => {
                    setStudentSearch(text);
                    setShowStudentDropdown(true);
                  }}
                  onFocus={() => setShowStudentDropdown(true)}
                  placeholder="Search student by name..."
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 mb-2"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Selected Student */}
                {selectedStudent && !showStudentDropdown && (
                  <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                        <Ionicons name="person-outline" size={20} color="#3B82F6" />
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="text-base font-medium text-gray-900">
                          {selectedStudent.firstName} {selectedStudent.lastName}
                        </Text>
                        <Text className="text-sm text-gray-600">{selectedStudent.admissionNo}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setValue('studentId', '');
                        setStudentSearch('');
                      }}
                    >
                      <Ionicons name="close-circle" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Student Dropdown */}
                {showStudentDropdown && students?.data && students.data.length > 0 && (
                  <View className="bg-white border border-gray-200 rounded-lg max-h-60">
                    <ScrollView>
                      {students.data.slice(0, 10).map((student: any) => (
                        <TouchableOpacity
                          key={student.id}
                          onPress={() => {
                            setValue('studentId', student.id);
                            setStudentSearch(`${student.firstName} ${student.lastName}`);
                            setShowStudentDropdown(false);
                          }}
                          className="flex-row items-center p-3 border-b border-gray-100"
                        >
                          <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                            <Ionicons name="person-outline" size={20} color="#3B82F6" />
                          </View>
                          <View className="flex-1 ml-3">
                            <Text className="text-base font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </Text>
                            <Text className="text-sm text-gray-600">{student.admissionNo}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {errors.studentId && (
                  <Text className="text-sm text-red-500 mt-1">{errors.studentId.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Route Selection */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Select Route & Vehicle</Text>

          <Controller
            control={control}
            name="routeId"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Route *</Text>
                {routes && routes.data && routes.data.length > 0 ? (
                  <View className="space-y-2">
                    {routes.data.map((route: any) => (
                      <TouchableOpacity
                        key={route.id}
                        onPress={() => {
                          onChange(route.id);
                          setValue('vehicleId', ''); // Reset vehicle when route changes
                        }}
                        className={`p-3 rounded-lg border ${
                          value === route.id
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <View className="flex-row items-center">
                          <Ionicons
                            name="map-outline"
                            size={20}
                            color={value === route.id ? '#3B82F6' : '#6B7280'}
                          />
                          <Text
                            className={`text-base font-medium ml-2 ${
                              value === route.id ? 'text-blue-600' : 'text-gray-900'
                            }`}
                          >
                            {route.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text className="text-gray-400">No routes available</Text>
                )}
                {errors.routeId && (
                  <Text className="text-sm text-red-500 mt-1">{errors.routeId.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="vehicleId"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Vehicle *</Text>
                {!selectedRouteId ? (
                  <View className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                    <Text className="text-gray-400">Select a route first</Text>
                  </View>
                ) : vehicles && vehicles.data && vehicles.data.length > 0 ? (
                  <View className="space-y-2">
                    {vehicles.data.map((vehicle: any) => (
                      <TouchableOpacity
                        key={vehicle.id}
                        onPress={() => onChange(vehicle.id)}
                        className={`p-3 rounded-lg border ${
                          value === vehicle.id
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <View className="flex-row items-center">
                          <Ionicons
                            name="bus-outline"
                            size={20}
                            color={value === vehicle.id ? '#3B82F6' : '#6B7280'}
                          />
                          <View className="flex-1 ml-2">
                            <Text
                              className={`text-base font-medium ${
                                value === vehicle.id ? 'text-blue-600' : 'text-gray-900'
                              }`}
                            >
                              {vehicle.vehicleNumber}
                            </Text>
                            <Text className="text-sm text-gray-600">
                              {vehicle.type} - {vehicle.capacity} seats
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                    <Text className="text-gray-400">No vehicles available for this route</Text>
                  </View>
                )}
                {errors.vehicleId && (
                  <Text className="text-sm text-red-500 mt-1">{errors.vehicleId.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Pickup Point */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Pickup Details</Text>

          <Controller
            control={control}
            name="pickupPoint"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Pickup Point (Optional)"
                value={value || ''}
                onChangeText={onChange}
                placeholder="e.g., Main Gate, Bus Stand"
                error={errors.pickupPoint?.message}
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
            <Text className="text-white font-semibold text-lg">Add Allocation</Text>
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
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
        placeholderTextColor="#9CA3AF"
      />
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
