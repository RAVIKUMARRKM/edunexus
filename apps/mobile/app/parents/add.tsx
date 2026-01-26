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

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionNo: string;
  class?: { name: string };
  section?: { name: string };
}

export default function AddParentScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await apiHelpers.getStudents({ limit: 1000 });
      return response.data.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiHelpers.createParent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      Alert.alert('Success', 'Parent account created successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create parent account');
    },
  });

  const filteredStudents = students?.filter(
    (student: Student) =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const toggleStudent = (student: Student) => {
    if (selectedStudents.find((s) => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
    setSearchQuery('');
    setShowStudentList(false);
  };

  const removeStudent = (studentId: string) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (selectedStudents.length === 0) {
      Alert.alert('Error', 'Please select at least one child');
      return;
    }

    createMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      childrenIds: selectedStudents.map((s) => s.id),
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Add Parent</Text>
        <Text className="text-white/80 mt-1">Create a new parent account</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Parent Details */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Parent Details</Text>

          <FormInput
            label="Full Name *"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="John Doe"
          />

          <FormInput
            label="Email *"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="parent@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormInput
            label="Phone"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="+91 9876543210"
            keyboardType="phone-pad"
          />

          <FormInput
            label="Password *"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            placeholder="Enter password (min 6 characters)"
            secureTextEntry
          />

          <FormInput
            label="Confirm Password *"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            placeholder="Re-enter password"
            secureTextEntry
          />
        </View>

        {/* Link Children */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Link Children</Text>

          {/* Search Students */}
          <View className="mb-4 relative z-50">
            <Text className="text-sm font-medium text-gray-700 mb-2">Search Students *</Text>
            <View className="relative">
              <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    setShowStudentList(text.length > 0);
                  }}
                  onFocus={() => setShowStudentList(searchQuery.length > 0)}
                  placeholder="Search by name or admission no..."
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-2 text-gray-900"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery('');
                      setShowStudentList(false);
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Student Dropdown */}
              {showStudentList && filteredStudents.length > 0 && (
                <View className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 z-50">
                  <ScrollView className="max-h-64">
                    {filteredStudents.slice(0, 10).map((student: Student) => {
                      const isSelected = selectedStudents.find((s) => s.id === student.id);
                      return (
                        <TouchableOpacity
                          key={student.id}
                          onPress={() => toggleStudent(student)}
                          className={`p-3 border-b border-gray-100 last:border-b-0 ${
                            isSelected ? 'bg-blue-50' : ''
                          }`}
                        >
                          <Text className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {student.admissionNo}
                            {student.class && student.section &&
                              ` • ${student.class.name} ${student.section.name}`}
                          </Text>
                          {isSelected && (
                            <View className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          {/* Selected Students */}
          {selectedStudents.length > 0 ? (
            <View className="mt-2">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Selected Children ({selectedStudents.length}):
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {selectedStudents.map((student) => (
                  <View
                    key={student.id}
                    className="flex-row items-center gap-2 px-3 py-2 bg-blue-100 rounded-full"
                  >
                    <Text className="text-sm text-blue-800">
                      {student.firstName} {student.lastName}
                    </Text>
                    <TouchableOpacity onPress={() => removeStudent(student.id)}>
                      <Ionicons name="close-circle" size={18} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="py-6 items-center">
              <Ionicons name="people-outline" size={40} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 text-center">
                No children selected
              </Text>
              <Text className="text-sm text-red-500 mt-1">
                Please select at least one child
              </Text>
            </View>
          )}
        </View>

        {/* Info Box */}
        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <View className="flex-1 ml-2">
              <Text className="text-sm font-medium text-blue-900 mb-1">
                About Parent Accounts
              </Text>
              <Text className="text-xs text-blue-800">
                Parent will receive login credentials and can view their children's information,
                messages, and notices.
              </Text>
            </View>
          </View>
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
            <Text className="text-white font-semibold text-lg">Create Parent Account</Text>
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
  secureTextEntry,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: any;
  secureTextEntry?: boolean;
  autoCapitalize?: any;
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}
