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
import FilterChips from '@/components/base/FilterChips';
import EmptyState from '@/components/base/EmptyState';
import ActionButton from '@/components/base/ActionButton';
import IssueCard from '@/components/library/IssueCard';

export default function IssuesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: issues, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['issues', searchQuery, statusFilter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await apiHelpers.getBookIssues(params);
      return response.data;
    },
  });

  const isLibrarian = ['LIBRARIAN', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Issued', value: 'ISSUED' },
    { label: 'Returned', value: 'RETURNED' },
    { label: 'Overdue', value: 'OVERDUE' },
  ];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading issues...</Text>
      </View>
    );
  }

  const issuesList = issues?.data || [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Issued Books</Text>
        <Text className="text-white/80 mt-1">
          {issuesList.length} issue{issuesList.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search and Filters */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by student or book name..."
        />

        <View className="mt-3">
          <FilterChips
            options={statusOptions}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />
        </View>
      </View>

      {/* Issues List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {issuesList.length > 0 ? (
          issuesList.map((issue: any) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onPress={() => {
                if (isLibrarian && issue.status !== 'RETURNED') {
                  router.push(`/library/issues/return/${issue.id}`);
                }
              }}
            />
          ))
        ) : (
          <EmptyState
            icon="book-outline"
            title="No Issues Found"
            message={
              searchQuery
                ? `No issues match "${searchQuery}"`
                : 'No books have been issued yet'
            }
            actionLabel={isLibrarian ? 'Issue Book' : undefined}
            onAction={isLibrarian ? () => router.push('/library/issues/issue') : undefined}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {isLibrarian && (
        <ActionButton
          icon="add"
          onPress={() => router.push('/library/issues/issue')}
        />
      )}
    </View>
  );
}
