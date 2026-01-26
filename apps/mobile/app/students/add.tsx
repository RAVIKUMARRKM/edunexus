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
import { studentSchema, type StudentInput } from '@edunexus/shared';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiHelpers } from '@/lib/api';

export default function AddStudentScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      admissionNo: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'MALE',
      bloodGroup: '',
      nationality: 'Indian',
      religion: '',
      caste: '',
      motherTongue: '',
      classId: '',
      sectionId: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      fatherName: '',
      fatherPhone: '',
      fatherEmail: '',
      fatherOccupation: '',
      motherName: '',
      motherPhone: '',
      motherEmail: '',
      motherOccupation: '',
    },
  });

  const selectedClassId = watch('classId');
  const dateOfBirth = watch('dateOfBirth');

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await apiHelpers.getClasses();
      return response.data;
    },
  });

  const { data: sections } = useQuery({
    queryKey: ['sections', selectedClassId],
    queryFn: async () => {
      if (!selectedClassId) return [];
      const response = await apiHelpers.getSections(selectedClassId);
      return response.data;
    },
    enabled: !!selectedClassId,
  });

  const createMutation = useMutation({
    mutationFn: (data: StudentInput) => apiHelpers.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      Alert.alert('Success', 'Student added successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add student');
    },
  });

  const onSubmit = (data: StudentInput) => {
    createMutation.mutate(data);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setValue('dateOfBirth', formattedDate);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Add Student</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* 1. Basic Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Basic Information</Text>

          <Controller
            control={control}
            name="admissionNo"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Admission Number *"
                value={value}
                onChangeText={onChange}
                placeholder="Enter admission number"
                error={errors.admissionNo?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="First Name *"
                value={value}
                onChangeText={onChange}
                placeholder="Enter first name"
                error={errors.firstName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Last Name *"
                value={value}
                onChangeText={onChange}
                placeholder="Enter last name"
                error={errors.lastName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Date of Birth *</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                >
                  <Text className={value ? 'text-gray-900' : 'text-gray-400'}>
                    {value || 'Select date of birth'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
                {errors.dateOfBirth && (
                  <Text className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <FormPicker
                label="Gender *"
                value={value}
                onValueChange={onChange}
                options={[
                  { label: 'Male', value: 'MALE' },
                  { label: 'Female', value: 'FEMALE' },
                  { label: 'Other', value: 'OTHER' },
                ]}
                error={errors.gender?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="bloodGroup"
            render={({ field: { onChange, value } }) => (
              <FormPicker
                label="Blood Group"
                value={value || ''}
                onValueChange={onChange}
                options={[
                  { label: 'Select Blood Group', value: '' },
                  { label: 'A+', value: 'A+' },
                  { label: 'A-', value: 'A-' },
                  { label: 'B+', value: 'B+' },
                  { label: 'B-', value: 'B-' },
                  { label: 'O+', value: 'O+' },
                  { label: 'O-', value: 'O-' },
                  { label: 'AB+', value: 'AB+' },
                  { label: 'AB-', value: 'AB-' },
                ]}
                error={errors.bloodGroup?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="nationality"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Nationality"
                value={value}
                onChangeText={onChange}
                placeholder="Indian"
                error={errors.nationality?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="religion"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Religion"
                value={value || ''}
                onChangeText={onChange}
                placeholder="Enter religion"
                error={errors.religion?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="caste"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Caste"
                value={value || ''}
                onChangeText={onChange}
                placeholder="Enter caste"
                error={errors.caste?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="motherTongue"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Mother Tongue"
                value={value || ''}
                onChangeText={onChange}
                placeholder="Enter mother tongue"
                error={errors.motherTongue?.message}
              />
            )}
          />
        </View>

        {/* 2. Academic Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Academic Information</Text>

          <Controller
            control={control}
            name="classId"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Class *</Text>
                <View className="flex-row flex-wrap gap-2">
                  {classes && classes.length > 0 ? (
                    classes.map((cls: any) => (
                      <TouchableOpacity
                        key={cls.id}
                        onPress={() => {
                          onChange(cls.id);
                          setValue('sectionId', '');
                        }}
                        className={`px-4 py-2 rounded-lg ${
                          value === cls.id ? 'bg-blue-500' : 'bg-gray-100'
                        }`}
                      >
                        <Text className={value === cls.id ? 'text-white' : 'text-gray-700'}>
                          {cls.name}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text className="text-gray-400">Loading classes...</Text>
                  )}
                </View>
                {errors.classId && (
                  <Text className="text-sm text-red-500 mt-1">{errors.classId.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="sectionId"
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Section *</Text>
                {!selectedClassId ? (
                  <View className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                    <Text className="text-gray-400">Select a class first</Text>
                  </View>
                ) : sections && sections.length > 0 ? (
                  <View className="flex-row flex-wrap gap-2">
                    {sections.map((section: any) => (
                      <TouchableOpacity
                        key={section.id}
                        onPress={() => onChange(section.id)}
                        className={`px-4 py-2 rounded-lg ${
                          value === section.id ? 'bg-blue-500' : 'bg-gray-100'
                        }`}
                      >
                        <Text className={value === section.id ? 'text-white' : 'text-gray-700'}>
                          {section.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                    <Text className="text-gray-400">No sections available</Text>
                  </View>
                )}
                {errors.sectionId && (
                  <Text className="text-sm text-red-500 mt-1">{errors.sectionId.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* 3. Contact Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Contact Information</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Email"
                value={value || ''}
                onChangeText={onChange}
                placeholder="student@example.com"
                keyboardType="email-address"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Phone"
                value={value || ''}
                onChangeText={onChange}
                placeholder="+91 9876543210"
                keyboardType="phone-pad"
                error={errors.phone?.message}
              />
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
                placeholder="Enter address"
                multiline
                error={errors.address?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="City"
                value={value || ''}
                onChangeText={onChange}
                placeholder="Enter city"
                error={errors.city?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="state"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="State"
                value={value || ''}
                onChangeText={onChange}
                placeholder="Enter state"
                error={errors.state?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="pincode"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Pincode"
                value={value || ''}
                onChangeText={onChange}
                placeholder="400001"
                keyboardType="numeric"
                error={errors.pincode?.message}
              />
            )}
          />
        </View>

        {/* 4. Parent Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Parent Information</Text>

          {/* Father Details */}
          <View className="mb-6">
            <Text className="text-md font-medium text-gray-800 mb-3">Father Details</Text>

            <Controller
              control={control}
              name="fatherName"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  label="Father Name"
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="Enter father name"
                  error={errors.fatherName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="fatherPhone"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  label="Father Phone"
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="+91 9876543210"
                  keyboardType="phone-pad"
                  error={errors.fatherPhone?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="fatherEmail"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  label="Father Email"
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="father@example.com"
                  keyboardType="email-address"
                  error={errors.fatherEmail?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="fatherOccupation"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  label="Father Occupation"
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="Enter father occupation"
                  error={errors.fatherOccupation?.message}
                />
              )}
            />
          </View>

          {/* Mother Details */}
          <View>
            <Text className="text-md font-medium text-gray-800 mb-3">Mother Details</Text>

            <Controller
              control={control}
              name="motherName"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  label="Mother Name"
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="Enter mother name"
                  error={errors.motherName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="motherPhone"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  label="Mother Phone"
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="+91 9876543210"
                  keyboardType="phone-pad"
                  error={errors.motherPhone?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="motherEmail"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  label="Mother Email"
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="mother@example.com"
                  keyboardType="email-address"
                  error={errors.motherEmail?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="motherOccupation"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  label="Mother Occupation"
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="Enter mother occupation"
                  error={errors.motherOccupation?.message}
                />
              )}
            />
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
            <Text className="text-white font-semibold text-lg">Add Student</Text>
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
