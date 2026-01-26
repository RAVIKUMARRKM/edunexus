import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';
import SearchBar from '@/components/base/SearchBar';
import EmptyState from '@/components/base/EmptyState';
import ActionButton from '@/components/base/ActionButton';
import ParentCard from '@/components/parents/ParentCard';

export default function ParentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: parents, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['parents', searchQuery],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;

      const response = await apiHelpers.getParents(params);
      return response.data;
    },
  });

  const canAddParent = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading parents...</Text>
      </View>
    );
  }

  const parentsList = parents?.parents || [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Parents</Text>
        <Text className="text-white/80 mt-1">
          {parentsList.length} parent{parentsList.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, email, or phone..."
        />
      </View>

      {/* Parents List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {parentsList.length > 0 ? (
          parentsList.map((parent: any) => (
            <ParentCard
              key={parent.id}
              parent={parent}
              onPress={() => router.push(`/parents/${parent.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="people-outline"
            title="No Parents Found"
            message={
              searchQuery
                ? `No parents match "${searchQuery}"`
                : 'No parents have been added yet'
            }
            actionLabel={canAddParent ? 'Add Parent' : undefined}
            onAction={canAddParent ? () => router.push('/parents/add') : undefined}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {canAddParent && (
        <ActionButton
          icon="add"
          onPress={() => router.push('/parents/add')}
        />
      )}
    </View>
  );
}
