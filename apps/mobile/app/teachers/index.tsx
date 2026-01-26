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
import { apiHelpers } from '@/lib/api';
import SearchBar from '@/components/base/SearchBar';
import FilterChips from '@/components/base/FilterChips';
import EmptyState from '@/components/base/EmptyState';
import TeacherCard from '@/components/teachers/TeacherCard';

export default function TeachersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const { data: teachers, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['teachers', searchQuery, statusFilter, departmentFilter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (departmentFilter !== 'all') params.departmentId = departmentFilter;

      const response = await apiHelpers.getTeachers(params);
      return response.data;
    },
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await apiHelpers.getDepartments();
      return response.data;
    },
  });

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ];

  const departmentOptions = [
    { label: 'All Departments', value: 'all' },
    ...(departments?.map((d: any) => ({
      label: d.name,
      value: d.id,
    })) || []),
  ];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading teachers...</Text>
      </View>
    );
  }

  const teachersList = teachers?.teachers || [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Teachers</Text>
        <Text className="text-white/80 mt-1">
          {teachersList.length} teacher{teachersList.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search and Filters */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name or employee ID..."
        />

        <View className="mt-3">
          <FilterChips
            options={statusOptions}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />
        </View>

        {departments && departments.length > 0 && (
          <View className="mt-3">
            <FilterChips
              options={departmentOptions}
              selected={departmentFilter}
              onSelect={setDepartmentFilter}
            />
          </View>
        )}
      </View>

      {/* Teachers List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {teachersList.length > 0 ? (
          teachersList.map((teacher: any) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onPress={() => router.push(`/teachers/${teacher.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="people-outline"
            title="No Teachers Found"
            message={
              searchQuery
                ? `No teachers match "${searchQuery}"`
                : 'No teachers have been added yet'
            }
          />
        )}
      </ScrollView>
    </View>
  );
}
