import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';

export default function ParentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const { data: parent, isLoading } = useQuery({
    queryKey: ['parent', id],
    queryFn: async () => {
      const response = await apiHelpers.getParent(id as string);
      return response.data;
    },
  });

  const canEdit = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!parent) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Parent not found</Text>
      </View>
    );
  }

  const initials = parent.name
    .split(' ')
    .map((n: string) => n.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const children = parent.children || [];

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
            {parent.avatar ? (
              <Text className="text-3xl">{parent.avatar}</Text>
            ) : (
              <Text className="text-blue-500 text-2xl font-bold">{initials}</Text>
            )}
          </View>
          <Text className="text-white text-2xl font-bold">{parent.name}</Text>
          <View className="flex-row items-center mt-2">
            <View className="px-3 py-1 rounded-full bg-white/20">
              <Text className="text-white text-sm font-medium">PARENT</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Info Sections */}
      <View className="px-4 py-4">
        {/* Contact Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Contact Information</Text>

          <InfoRow icon="mail-outline" label="Email" value={parent.email} />
          {parent.phone && (
            <InfoRow icon="call-outline" label="Phone" value={parent.phone} />
          )}
        </View>

        {/* Linked Children */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Linked Children ({children.length})
          </Text>

          {children.length > 0 ? (
            children.map((child: any) => (
              <TouchableOpacity
                key={child.id}
                onPress={() => router.push(`/students/${child.id}`)}
                className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                  <Text className="text-blue-600 font-semibold">
                    {child.firstName.charAt(0)}{child.lastName.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base font-medium text-gray-900">
                    {child.firstName} {child.lastName}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {child.admissionNo}
                    {child.class && child.section &&
                      ` • ${child.class.name} ${child.section.name}`
                    }
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))
          ) : (
            <View className="py-8 items-center">
              <Ionicons name="people-outline" size={40} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">No children linked</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => router.push(`/messages/compose?userId=${parent.id}`)}
            className="flex-1 bg-blue-500 py-4 rounded-xl flex-row items-center justify-center"
          >
            <Ionicons name="mail-outline" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Message</Text>
          </TouchableOpacity>

          {canEdit && (
            <TouchableOpacity
              onPress={() => router.push(`/parents/edit/${id}`)}
              className="flex-1 bg-gray-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="create-outline" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Edit</Text>
            </TouchableOpacity>
          )}
        </View>
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
