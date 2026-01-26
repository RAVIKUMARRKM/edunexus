import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';

export default function StudentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      const response = await apiHelpers.getStudent(id as string);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiHelpers.deleteStudent(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      router.back();
      Alert.alert('Success', 'Student deleted successfully');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to delete student');
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  const canEdit = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!student) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Student not found</Text>
      </View>
    );
  }

  const fullName = `${student.firstName} ${student.lastName}`;
  const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Profile Header */}
        <View className="items-center">
          <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-3">
            <Text className="text-blue-500 text-2xl font-bold">{initials}</Text>
          </View>
          <Text className="text-white text-2xl font-bold">{fullName}</Text>
          <Text className="text-white/80 mt-1">{student.admissionNo}</Text>
          <View className="flex-row items-center mt-2">
            <View className={`px-3 py-1 rounded-full ${
              student.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'
            }`}>
              <Text className="text-white text-sm font-medium">{student.status}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Info Sections */}
      <View className="px-4 py-4">
        {/* Personal Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Personal Information</Text>

          <InfoRow icon="person-outline" label="Full Name" value={fullName} />
          <InfoRow icon="calendar-outline" label="Date of Birth" value={
            student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'
          } />
          <InfoRow icon="male-female-outline" label="Gender" value={student.gender || 'N/A'} />
          <InfoRow icon="water-outline" label="Blood Group" value={student.bloodGroup || 'N/A'} />
        </View>

        {/* Academic Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Academic Information</Text>

          <InfoRow icon="id-card-outline" label="Admission No" value={student.admissionNo} />
          <InfoRow icon="school-outline" label="Class" value={student.class?.name || 'N/A'} />
          <InfoRow icon="copy-outline" label="Section" value={student.section?.name || 'N/A'} />
          <InfoRow icon="bookmark-outline" label="Roll No" value={student.rollNo || 'N/A'} />
        </View>

        {/* Contact Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Contact Information</Text>

          <InfoRow icon="mail-outline" label="Email" value={student.user?.email || 'N/A'} />
          <InfoRow icon="call-outline" label="Phone" value={student.user?.phone || 'N/A'} />
          <InfoRow icon="location-outline" label="Address" value={student.address || 'N/A'} />
          <InfoRow icon="business-outline" label="City" value={student.city || 'N/A'} />
        </View>

        {/* Action Buttons */}
        {canEdit && (
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={() => router.push(`/students/edit/${id}`)}
              className="flex-1 bg-blue-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="create-outline" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 bg-red-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              {deleteMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View className="flex-row items-start py-2 border-b border-gray-100 last:border-b-0">
      <View className="w-8">
        <Ionicons name={icon as any} size={18} color="#6B7280" />
      </View>
      <View className="flex-1">
        <Text className="text-sm text-gray-600">{label}</Text>
        <Text className="text-base text-gray-900 mt-1">{value}</Text>
      </View>
    </View>
  );
}
