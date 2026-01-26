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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiHelpers } from '@/lib/api';

const hostelAllocationSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  roomId: z.string().min(1, 'Room is required'),
  bedNumber: z.number().min(1, 'Bed number must be at least 1'),
  allocationDate: z.string().min(1, 'Allocation date is required'),
});

type HostelAllocationInput = z.infer<typeof hostelAllocationSchema>;

export default function ManageHostelAllocationScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<HostelAllocationInput>({
    resolver: zodResolver(hostelAllocationSchema),
    defaultValues: {
      studentId: '',
      roomId: '',
      bedNumber: 1,
      allocationDate: new Date().toISOString().split('T')[0],
    },
  });

  const allocationDate = watch('allocationDate');
  const selectedStudentId = watch('studentId');
  const selectedRoomId = watch('roomId');

  // Fetch students for selection
  const { data: studentsData } = useQuery({
    queryKey: ['students', studentSearch],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (studentSearch) params.search = studentSearch;
      const response = await apiHelpers.getStudents(params);
      return response.data;
    },
  });

  // Fetch buildings
  const { data: buildingsData } = useQuery({
    queryKey: ['hostel-buildings'],
    queryFn: async () => {
      const response = await apiHelpers.getHostelBuildings();
      return response.data;
    },
  });

  // Fetch rooms (filtered by building and availability)
  const { data: roomsData } = useQuery({
    queryKey: ['hostel-rooms', selectedBuildingId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (selectedBuildingId) params.buildingId = selectedBuildingId;
      const response = await apiHelpers.getHostelRooms(params);
      return response.data;
    },
    enabled: !!selectedBuildingId,
  });

  const createMutation = useMutation({
    mutationFn: (data: HostelAllocationInput) => apiHelpers.addHostelAllocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['hostel-rooms'] });
      Alert.alert('Success', 'Hostel allocation created successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create allocation');
    },
  });

  const onSubmit = (data: HostelAllocationInput) => {
    createMutation.mutate(data);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setValue('allocationDate', formattedDate);
    }
  };

  const students = studentsData?.data || [];
  const buildings = buildingsData?.data || [];
  const rooms = roomsData?.data || [];
  const availableRooms = rooms.filter((r: any) => r.currentOccupancy < r.capacity);

  const selectedStudent = students.find((s: any) => s.id === selectedStudentId);
  const selectedRoom = rooms.find((r: any) => r.id === selectedRoomId);

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

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Student *</Text>
            <TouchableOpacity
              onPress={() => setShowStudentDropdown(!showStudentDropdown)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-between"
            >
              <Text className={selectedStudent ? 'text-gray-900' : 'text-gray-400'}>
                {selectedStudent
                  ? `${selectedStudent.firstName} ${selectedStudent.lastName} (${selectedStudent.admissionNo})`
                  : 'Select a student'}
              </Text>
              <Ionicons
                name={showStudentDropdown ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
            {errors.studentId && (
              <Text className="text-sm text-red-500 mt-1">{errors.studentId.message}</Text>
            )}
          </View>

          {showStudentDropdown && (
            <View className="mb-4">
              <TextInput
                value={studentSearch}
                onChangeText={setStudentSearch}
                placeholder="Search students..."
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 mb-2"
                placeholderTextColor="#9CA3AF"
              />
              <ScrollView className="max-h-48 bg-gray-50 border border-gray-200 rounded-lg">
                {students.length > 0 ? (
                  students.map((student: any) => (
                    <TouchableOpacity
                      key={student.id}
                      onPress={() => {
                        setValue('studentId', student.id);
                        setShowStudentDropdown(false);
                        setStudentSearch('');
                      }}
                      className="px-4 py-3 border-b border-gray-200"
                    >
                      <Text className="text-gray-900 font-medium">
                        {student.firstName} {student.lastName}
                      </Text>
                      <Text className="text-sm text-gray-600">{student.admissionNo}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="px-4 py-3">
                    <Text className="text-gray-400">No students found</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Building & Room Selection */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Select Room</Text>

          {/* Building Selection */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Building *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-2"
            >
              {buildings.map((building: any) => (
                <TouchableOpacity
                  key={building.id}
                  onPress={() => {
                    setSelectedBuildingId(building.id);
                    setValue('roomId', '');
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    selectedBuildingId === building.id ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={
                      selectedBuildingId === building.id ? 'text-white' : 'text-gray-700'
                    }
                  >
                    {building.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Room Selection */}
          <Controller
            control={control}
            name="roomId"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Room *</Text>
                {!selectedBuildingId ? (
                  <View className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                    <Text className="text-gray-400">Select a building first</Text>
                  </View>
                ) : availableRooms.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row gap-2"
                  >
                    {availableRooms.map((room: any) => (
                      <TouchableOpacity
                        key={room.id}
                        onPress={() => onChange(room.id)}
                        className={`px-4 py-3 rounded-lg border ${
                          value === room.id
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <Text
                          className={`font-medium ${
                            value === room.id ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          Room {room.roomNumber}
                        </Text>
                        <Text className={`text-xs mt-1 ${value === room.id ? 'text-white/80' : 'text-gray-600'}`}>
                          {room.currentOccupancy}/{room.capacity} beds
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                    <Text className="text-gray-400">No available rooms in this building</Text>
                  </View>
                )}
                {errors.roomId && (
                  <Text className="text-sm text-red-500 mt-1">{errors.roomId.message}</Text>
                )}
              </View>
            )}
          />

          {/* Bed Number */}
          <Controller
            control={control}
            name="bedNumber"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Bed Number *"
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 1)}
                placeholder="Enter bed number"
                keyboardType="numeric"
                error={errors.bedNumber?.message}
                hint={
                  selectedRoom
                    ? `Room capacity: ${selectedRoom.capacity} beds, ${selectedRoom.currentOccupancy} occupied`
                    : undefined
                }
              />
            )}
          />
        </View>

        {/* Allocation Date */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Allocation Details</Text>

          <Controller
            control={control}
            name="allocationDate"
            render={({ field: { value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Allocation Date *</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className={value ? 'text-gray-900' : 'text-gray-400'}>
                    {value || 'Select allocation date'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                {errors.allocationDate && (
                  <Text className="text-sm text-red-500 mt-1">{errors.allocationDate.message}</Text>
                )}
              </View>
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
            <Text className="text-white font-semibold text-lg">Create Allocation</Text>
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
  hint,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: any;
  error?: string;
  hint?: string;
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
        placeholderTextColor="#9CA3AF"
      />
      {hint && <Text className="text-xs text-gray-500 mt-1">{hint}</Text>}
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
