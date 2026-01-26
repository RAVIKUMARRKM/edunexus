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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { apiHelpers } from '@/lib/api';

export default function EditStudentScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    admissionNo: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodGroup: '',
    nationality: 'Indian',
    religion: '',
    caste: '',
    motherTongue: '',
    email: '',
    phone: '',
    classId: '',
    sectionId: '',
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
  });

  // Fetch student data
  const { data: studentData, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      const response = await apiHelpers.getStudent(id);
      return response.data;
    },
  });

  // Fetch classes
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await apiHelpers.getClasses();
      return response.data;
    },
  });

  // Fetch sections based on selected class
  const { data: sections } = useQuery({
    queryKey: ['sections', formData.classId],
    queryFn: async () => {
      if (!formData.classId) return [];
      const response = await apiHelpers.getSections(formData.classId);
      return response.data;
    },
    enabled: !!formData.classId,
  });

  // Pre-fill form with student data
  useEffect(() => {
    if (studentData) {
      setFormData({
        firstName: studentData.firstName || '',
        lastName: studentData.lastName || '',
        admissionNo: studentData.admissionNo || '',
        dateOfBirth: studentData.dateOfBirth
          ? new Date(studentData.dateOfBirth).toISOString().split('T')[0]
          : '',
        gender: studentData.gender || 'MALE',
        bloodGroup: studentData.bloodGroup || '',
        nationality: studentData.nationality || 'Indian',
        religion: studentData.religion || '',
        caste: studentData.caste || '',
        motherTongue: studentData.motherTongue || '',
        email: studentData.user?.email || '',
        phone: studentData.user?.phone || '',
        classId: studentData.classId || '',
        sectionId: studentData.sectionId || '',
        address: studentData.address || '',
        city: studentData.city || '',
        state: studentData.state || '',
        pincode: studentData.pincode || '',
        fatherName: studentData.parents?.[0]?.parent?.fatherName || '',
        fatherPhone: studentData.parents?.[0]?.parent?.fatherPhone || '',
        fatherEmail: studentData.parents?.[0]?.parent?.fatherEmail || '',
        fatherOccupation: studentData.parents?.[0]?.parent?.fatherOccupation || '',
        motherName: studentData.parents?.[0]?.parent?.motherName || '',
        motherPhone: studentData.parents?.[0]?.parent?.motherPhone || '',
        motherEmail: studentData.parents?.[0]?.parent?.motherEmail || '',
        motherOccupation: studentData.parents?.[0]?.parent?.motherOccupation || '',
      });
    }
  }, [studentData]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiHelpers.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', id] });
      Alert.alert('Success', 'Student updated successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to update student');
    },
  });

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.admissionNo) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    updateMutation.mutate(formData);
  };

  if (isLoadingStudent) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading student data...</Text>
      </View>
    );
  }

  if (!studentData) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-blue-500 px-6 pt-12 pb-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Edit Student</Text>
        </View>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-gray-600 text-center">Student not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Edit Student</Text>
        <Text className="text-white/80 text-sm mt-1">
          Update information for {studentData.firstName} {studentData.lastName}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Basic Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Basic Information</Text>

          <FormInput
            label="Admission Number *"
            value={formData.admissionNo}
            onChangeText={(text) => setFormData({ ...formData, admissionNo: text })}
            placeholder="Enter admission number"
            editable={false}
          />

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
            label="Date of Birth (YYYY-MM-DD) *"
            value={formData.dateOfBirth}
            onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
            placeholder="2010-01-01"
          />

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Gender *</Text>
            <View className="flex-row gap-2">
              {['MALE', 'FEMALE', 'OTHER'].map((genderOption) => (
                <TouchableOpacity
                  key={genderOption}
                  onPress={() => setFormData({ ...formData, gender: genderOption })}
                  className={`px-4 py-2 rounded-lg ${
                    formData.gender === genderOption ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={formData.gender === genderOption ? 'text-white' : 'text-gray-700'}
                  >
                    {genderOption === 'MALE' ? 'Male' : genderOption === 'FEMALE' ? 'Female' : 'Other'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Blood Group</Text>
            <View className="flex-row flex-wrap gap-2">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bloodOption) => (
                <TouchableOpacity
                  key={bloodOption}
                  onPress={() => setFormData({ ...formData, bloodGroup: bloodOption })}
                  className={`px-3 py-2 rounded-lg ${
                    formData.bloodGroup === bloodOption ? 'bg-blue-500' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={
                      formData.bloodGroup === bloodOption ? 'text-white' : 'text-gray-700'
                    }
                  >
                    {bloodOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <FormInput
            label="Nationality"
            value={formData.nationality}
            onChangeText={(text) => setFormData({ ...formData, nationality: text })}
            placeholder="Indian"
          />

          <FormInput
            label="Religion"
            value={formData.religion}
            onChangeText={(text) => setFormData({ ...formData, religion: text })}
            placeholder="Hindu"
          />

          <FormInput
            label="Caste"
            value={formData.caste}
            onChangeText={(text) => setFormData({ ...formData, caste: text })}
            placeholder="General"
          />

          <FormInput
            label="Mother Tongue"
            value={formData.motherTongue}
            onChangeText={(text) => setFormData({ ...formData, motherTongue: text })}
            placeholder="Hindi"
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
                      formData.classId === cls.id ? 'bg-blue-500' : 'bg-gray-100'
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
                      formData.sectionId === section.id ? 'bg-blue-500' : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={formData.sectionId === section.id ? 'text-white' : 'text-gray-700'}
                    >
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

          <FormInput
            label="State"
            value={formData.state}
            onChangeText={(text) => setFormData({ ...formData, state: text })}
            placeholder="Enter state"
          />

          <FormInput
            label="Pincode"
            value={formData.pincode}
            onChangeText={(text) => setFormData({ ...formData, pincode: text })}
            placeholder="400001"
            keyboardType="numeric"
          />
        </View>

        {/* Parent Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Parent Information</Text>

          {/* Father Details */}
          <View className="mb-4">
            <Text className="text-md font-medium text-gray-800 mb-3">Father Details</Text>

            <FormInput
              label="Father Name"
              value={formData.fatherName}
              onChangeText={(text) => setFormData({ ...formData, fatherName: text })}
              placeholder="John Doe Sr."
            />

            <FormInput
              label="Father Phone"
              value={formData.fatherPhone}
              onChangeText={(text) => setFormData({ ...formData, fatherPhone: text })}
              placeholder="+91 9876543210"
              keyboardType="phone-pad"
            />

            <FormInput
              label="Father Email"
              value={formData.fatherEmail}
              onChangeText={(text) => setFormData({ ...formData, fatherEmail: text })}
              placeholder="father@example.com"
              keyboardType="email-address"
            />

            <FormInput
              label="Father Occupation"
              value={formData.fatherOccupation}
              onChangeText={(text) => setFormData({ ...formData, fatherOccupation: text })}
              placeholder="Business"
            />
          </View>

          {/* Mother Details */}
          <View>
            <Text className="text-md font-medium text-gray-800 mb-3">Mother Details</Text>

            <FormInput
              label="Mother Name"
              value={formData.motherName}
              onChangeText={(text) => setFormData({ ...formData, motherName: text })}
              placeholder="Jane Doe"
            />

            <FormInput
              label="Mother Phone"
              value={formData.motherPhone}
              onChangeText={(text) => setFormData({ ...formData, motherPhone: text })}
              placeholder="+91 9876543210"
              keyboardType="phone-pad"
            />

            <FormInput
              label="Mother Email"
              value={formData.motherEmail}
              onChangeText={(text) => setFormData({ ...formData, motherEmail: text })}
              placeholder="mother@example.com"
              keyboardType="email-address"
            />

            <FormInput
              label="Mother Occupation"
              value={formData.motherOccupation}
              onChangeText={(text) => setFormData({ ...formData, motherOccupation: text })}
              placeholder="Teacher"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={updateMutation.isPending}
          className="bg-blue-500 py-4 rounded-xl items-center mb-6"
        >
          {updateMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">Update Student</Text>
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
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
  editable?: boolean;
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
        editable={editable}
        className={`border border-gray-200 rounded-lg px-4 py-3 text-gray-900 ${
          editable ? 'bg-gray-50' : 'bg-gray-100'
        }`}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}
