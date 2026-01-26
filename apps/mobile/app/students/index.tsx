import { useState, useEffect } from 'react';
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
import StudentCard from '@/components/students/StudentCard';

export default function StudentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  const { data: students, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['students', searchQuery, statusFilter, classFilter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (classFilter !== 'all') params.classId = classFilter;

      const response = await apiHelpers.getStudents(params);
      return response.data;
    },
  });

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await apiHelpers.getClasses();
      return response.data;
    },
  });

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
  ];

  const classOptions = [
    { label: 'All Classes', value: 'all' },
    ...(classes?.map((c: any) => ({
      label: c.name,
      value: c.id,
    })) || []),
  ];

  const canAddStudent = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading students...</Text>
      </View>
    );
  }

  const studentsList = students?.data || [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Students</Text>
        <Text className="text-white/80 mt-1">
          {studentsList.length} student{studentsList.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search and Filters */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name or admission no..."
        />

        <View className="mt-3">
          <FilterChips
            options={statusOptions}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />
        </View>

        {classes && classes.length > 0 && (
          <View className="mt-3">
            <FilterChips
              options={classOptions}
              selected={classFilter}
              onSelect={setClassFilter}
            />
          </View>
        )}
      </View>

      {/* Students List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {studentsList.length > 0 ? (
          studentsList.map((student: any) => (
            <StudentCard
              key={student.id}
              student={student}
              onPress={() => router.push(`/students/${student.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="people-outline"
            title="No Students Found"
            message={
              searchQuery
                ? `No students match "${searchQuery}"`
                : 'No students have been added yet'
            }
            actionLabel={canAddStudent ? 'Add Student' : undefined}
            onAction={canAddStudent ? () => router.push('/students/add') : undefined}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {canAddStudent && (
        <ActionButton
          icon="add"
          onPress={() => router.push('/students/add')}
        />
      )}
    </View>
  );
}
