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
import { apiHelpers } from '@/lib/api';

export default function AddStudentScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    admissionNo: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodGroup: '',
    email: '',
    phone: '',
    classId: '',
    sectionId: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await apiHelpers.getClasses();
      return response.data;
    },
  });

  const { data: sections } = useQuery({
    queryKey: ['sections', formData.classId],
    queryFn: async () => {
      if (!formData.classId) return [];
      const response = await apiHelpers.getSections(formData.classId);
      return response.data;
    },
    enabled: !!formData.classId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiHelpers.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      Alert.alert('Success', 'Student added successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add student');
    },
  });

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.admissionNo) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    createMutation.mutate(formData);
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
        {/* Personal Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Personal Information</Text>

          <FormInput
            label="First Name *"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            placeholder="Enter first name"
          />

          <FormInput
            label="Last Name *"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            placeholder="Enter last name"
          />

          <FormInput
            label="Admission Number *"
            value={formData.admissionNo}
            onChangeText={(text) => setFormData({ ...formData, admissionNo: text })}
            placeholder="Enter admission number"
          />

          <FormInput
            label="Date of Birth (YYYY-MM-DD)"
            value={formData.dateOfBirth}
            onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
            placeholder="2010-01-01"
          />

          <FormInput
            label="Blood Group"
            value={formData.bloodGroup}
            onChangeText={(text) => setFormData({ ...formData, bloodGroup: text })}
            placeholder="A+, B+, O+, etc."
          />
        </View>

        {/* Academic Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Academic Information</Text>

          {classes && classes.length > 0 && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Class *</Text>
              <View className="flex-row flex-wrap gap-2">
                {classes.map((cls: any) => (
                  <TouchableOpacity
                    key={cls.id}
                    onPress={() => setFormData({ ...formData, classId: cls.id, sectionId: '' })}
                    className={`px-4 py-2 rounded-lg ${
                      formData.classId === cls.id
                        ? 'bg-blue-500'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text className={formData.classId === cls.id ? 'text-white' : 'text-gray-700'}>
                      {cls.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {sections && sections.length > 0 && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Section *</Text>
              <View className="flex-row flex-wrap gap-2">
                {sections.map((section: any) => (
                  <TouchableOpacity
                    key={section.id}
                    onPress={() => setFormData({ ...formData, sectionId: section.id })}
                    className={`px-4 py-2 rounded-lg ${
                      formData.sectionId === section.id
                        ? 'bg-blue-500'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text className={formData.sectionId === section.id ? 'text-white' : 'text-gray-700'}>
                      {section.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Contact Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Contact Information</Text>

          <FormInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="student@example.com"
            keyboardType="email-address"
          />

          <FormInput
            label="Phone"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="+91 9876543210"
            keyboardType="phone-pad"
          />

          <FormInput
            label="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="Enter address"
            multiline
          />

          <FormInput
            label="City"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            placeholder="Enter city"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={createMutation.isPending}
          className="bg-blue-500 py-4 rounded-xl items-center mb-6"
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
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
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
    </View>
  );
}
