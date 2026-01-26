import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { apiHelpers } from '@/lib/api';

export default function TeacherDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teacher', id],
    queryFn: async () => {
      const response = await apiHelpers.getTeacher(id as string);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!teacher) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Teacher not found</Text>
      </View>
    );
  }

  const fullName = `${teacher.firstName} ${teacher.lastName}`;
  const initials = `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`;
  const subjects = teacher.subjectAssignments?.map((sa: any) => sa.subject) || [];
  const classes = teacher.classTeacher ? [teacher.classTeacher] : [];

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
            {teacher.user?.avatar ? (
              <Text className="text-3xl">{teacher.user.avatar}</Text>
            ) : (
              <Text className="text-blue-500 text-2xl font-bold">{initials}</Text>
            )}
          </View>
          <Text className="text-white text-2xl font-bold">{fullName}</Text>
          <Text className="text-white/80 mt-1">{teacher.employeeId}</Text>
          <View className="flex-row items-center mt-2">
            <View className={`px-3 py-1 rounded-full ${
              teacher.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'
            }`}>
              <Text className="text-white text-sm font-medium">{teacher.status}</Text>
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
            teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString() : 'N/A'
          } />
          <InfoRow icon="male-female-outline" label="Gender" value={teacher.gender || 'N/A'} />
          <InfoRow icon="water-outline" label="Blood Group" value={teacher.bloodGroup || 'N/A'} />
          <InfoRow icon="call-outline" label="Emergency Contact" value={teacher.emergencyContact || 'N/A'} />
        </View>

        {/* Professional Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Professional Information</Text>

          <InfoRow icon="id-card-outline" label="Employee ID" value={teacher.employeeId} />
          <InfoRow icon="business-outline" label="Department" value={teacher.department?.name || 'N/A'} />
          <InfoRow icon="briefcase-outline" label="Designation" value={teacher.designation || 'N/A'} />
          <InfoRow icon="school-outline" label="Qualification" value={teacher.qualification || 'N/A'} />
          <InfoRow icon="ribbon-outline" label="Specialization" value={teacher.specialization || 'N/A'} />
          <InfoRow icon="trending-up-outline" label="Experience" value={
            teacher.experience ? `${teacher.experience} years` : 'N/A'
          } />
          <InfoRow icon="calendar-outline" label="Joining Date" value={
            teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : 'N/A'
          } />
        </View>

        {/* Contact Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Contact Information</Text>

          <InfoRow icon="mail-outline" label="Email" value={teacher.user?.email || 'N/A'} />
          <InfoRow icon="call-outline" label="Phone" value={teacher.user?.phone || 'N/A'} />
          <InfoRow icon="location-outline" label="Address" value={teacher.address || 'N/A'} />
          <InfoRow icon="business-outline" label="City" value={teacher.city || 'N/A'} />
          <InfoRow icon="map-outline" label="State" value={teacher.state || 'N/A'} />
          <InfoRow icon="pin-outline" label="Pincode" value={teacher.pincode || 'N/A'} />
        </View>

        {/* Subjects Taught */}
        {subjects.length > 0 && (
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Subjects Taught</Text>
            {subjects.map((subject: any, index: number) => (
              <View
                key={subject.id}
                className={`flex-row items-center py-3 ${
                  index !== subjects.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons name="book-outline" size={20} color="#3B82F6" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base font-medium text-gray-900">{subject.name}</Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    Code: {subject.code}
                    {subject.class && ` - ${subject.class.name}`}
                  </Text>
                </View>
                <View className="bg-blue-50 px-3 py-1 rounded-full">
                  <Text className="text-xs text-blue-700 font-medium">{subject.code}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Classes Assigned */}
        {classes.length > 0 && (
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Class Teacher</Text>
            {classes.map((cls: any) => (
              <View key={cls.id} className="flex-row items-center py-3">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                  <Ionicons name="people-outline" size={20} color="#9333EA" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base font-medium text-gray-900">{cls.name}</Text>
                  {cls.academicYear && (
                    <Text className="text-sm text-gray-600 mt-1">
                      {cls.academicYear.year}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Message Button */}
        <TouchableOpacity
          onPress={() => router.push(`/messages/compose?userId=${teacher.user?.id}`)}
          className="bg-blue-500 py-4 rounded-xl flex-row items-center justify-center mb-6"
        >
          <Ionicons name="mail-outline" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Send Message</Text>
        </TouchableOpacity>
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
