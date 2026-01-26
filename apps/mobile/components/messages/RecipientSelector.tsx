import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { apiHelpers } from '@/lib/api';
import SearchBar from '@/components/base/SearchBar';
import FilterChips from '@/components/base/FilterChips';
import EmptyState from '@/components/base/EmptyState';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface RecipientSelectorProps {
  onSelect: (user: User) => void;
  onCancel: () => void;
}

export default function RecipientSelector({
  onSelect,
  onCancel,
}: RecipientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', searchQuery, roleFilter],
    queryFn: async () => {
      const params: Record<string, string> = { limit: '100' };
      if (searchQuery) params.search = searchQuery;
      if (roleFilter !== 'all') params.role = roleFilter;

      const response = await apiHelpers.getUsers(params);
      return response.data;
    },
  });

  const roleOptions = [
    { label: 'All', value: 'all' },
    { label: 'Teachers', value: 'TEACHER' },
    { label: 'Parents', value: 'PARENT' },
    { label: 'Students', value: 'STUDENT' },
    { label: 'Staff', value: 'STAFF' },
    { label: 'Admins', value: 'ADMIN' },
  ];

  const users = usersData?.users || [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={onCancel} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Select Recipient</Text>
          </View>
        </View>
        <Text className="text-white/80 mt-2">
          Choose a user to send your message to
        </Text>
      </View>

      {/* Search and Filters */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, email, or role..."
        />

        <View className="mt-3">
          <FilterChips
            options={roleOptions}
            selected={roleFilter}
            onSelect={setRoleFilter}
          />
        </View>
      </View>

      {/* Users List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-gray-600">Loading users...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 py-4">
          {users.length > 0 ? (
            <View>
              <Text className="text-gray-500 text-sm mb-3">
                {users.length} user{users.length !== 1 ? 's' : ''} found
              </Text>
              {users.map((user: User) => (
                <TouchableOpacity
                  key={user.id}
                  onPress={() => onSelect(user)}
                  className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    {/* Avatar */}
                    <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
                      <Text className="text-white text-lg font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    {/* User Info */}
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-base mb-1">
                        {user.name}
                      </Text>
                      <Text className="text-gray-600 text-sm mb-1">
                        {user.email}
                      </Text>
                      <View className="bg-blue-100 self-start px-2 py-0.5 rounded-full">
                        <Text className="text-blue-700 text-xs font-medium">
                          {user.role}
                        </Text>
                      </View>
                    </View>

                    {/* Arrow Icon */}
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color="#9CA3AF"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <EmptyState
              icon="people-outline"
              title="No Users Found"
              message={
                searchQuery
                  ? `No users match "${searchQuery}"`
                  : 'No users available'
              }
            />
          )}
        </ScrollView>
      )}

      {/* Help Text */}
      {!isLoading && users.length > 0 && (
        <View className="bg-white border-t border-gray-200 px-6 py-4">
          <View className="flex-row items-start">
            <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2 flex-1">
              Tap on a user to select them as the recipient for your message
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
