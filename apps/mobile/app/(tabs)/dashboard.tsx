import { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiHelpers.getDashboardStats(),
  });

  const quickActions = [
    { icon: 'people', label: 'Students', route: '/students', color: '#3B82F6', roles: ['ADMIN', 'TEACHER'] },
    { icon: 'school', label: 'Classes', route: '/classes', color: '#10B981', roles: ['ADMIN', 'TEACHER'] },
    { icon: 'document-text', label: 'Exams', route: '/exams', color: '#F59E0B', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
    { icon: 'card', label: 'Fees', route: '/fees', color: '#EF4444', roles: ['ADMIN', 'ACCOUNTANT', 'STUDENT', 'PARENT'] },
    { icon: 'book', label: 'Library', route: '/library', color: '#8B5CF6', roles: ['ADMIN', 'LIBRARIAN', 'STUDENT', 'TEACHER'] },
    { icon: 'bus', label: 'Transport', route: '/transport', color: '#06B6D4', roles: ['ADMIN', 'TRANSPORT_MANAGER', 'STUDENT', 'PARENT'] },
    { icon: 'notifications', label: 'Notices', route: '/notices', color: '#EC4899', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
    { icon: 'calendar', label: 'Timetable', route: '/timetable', color: '#6366F1', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
  ];

  const filteredActions = quickActions.filter(
    (action) => action.roles.includes(user?.role || 'STUDENT')
  );

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {/* Welcome Header */}
      <View className="bg-primary-500 px-6 pt-6 pb-12 rounded-b-3xl">
        <Text className="text-white text-lg">Welcome back,</Text>
        <Text className="text-white text-2xl font-bold">{user?.name || 'User'}</Text>
        <View className="flex-row items-center mt-2">
          <View className="bg-white/20 px-3 py-1 rounded-full">
            <Text className="text-white text-sm">{user?.role?.replace('_', ' ')}</Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="px-4 -mt-8">
        <View className="bg-white rounded-2xl p-4 shadow-lg">
          <View className="flex-row flex-wrap">
            <StatCard
              icon="people"
              label="Total Students"
              value={stats?.data?.totalStudents || '0'}
              color="#3B82F6"
            />
            <StatCard
              icon="school"
              label="Total Teachers"
              value={stats?.data?.totalTeachers || '0'}
              color="#10B981"
            />
            <StatCard
              icon="checkmark-circle"
              label="Today's Attendance"
              value={`${stats?.data?.todayAttendance?.percentage || 0}%`}
              color="#F59E0B"
            />
            <StatCard
              icon="cash"
              label="Fee Collection"
              value={`₹${stats?.data?.feeCollection?.thisMonth || 0}`}
              color="#EF4444"
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-4 mt-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
        <View className="flex-row flex-wrap">
          {filteredActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              className="w-1/4 p-2"
              onPress={() => router.push(action.route as any)}
            >
              <View className="items-center">
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center mb-2"
                  style={{ backgroundColor: `${action.color}20` }}
                >
                  <Ionicons
                    name={action.icon as any}
                    size={28}
                    color={action.color}
                  />
                </View>
                <Text className="text-xs text-gray-600 text-center">{action.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activities */}
      <View className="px-4 mt-6 mb-8">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</Text>
        <View className="bg-white rounded-2xl p-4 shadow">
          {stats?.data?.recentActivities?.length > 0 ? (
            stats.data.recentActivities.slice(0, 5).map((activity: any, index: number) => (
              <View
                key={index}
                className={`flex-row items-center py-3 ${
                  index !== stats.data.recentActivities.length - 1
                    ? 'border-b border-gray-100'
                    : ''
                }`}
              >
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons name="time-outline" size={20} color="#3B82F6" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-gray-900 font-medium">{activity.message}</Text>
                  <Text className="text-gray-500 text-sm">{activity.timestamp}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-center py-4">No recent activities</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View className="w-1/2 p-2">
      <View className="flex-row items-center">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <View className="ml-3">
          <Text className="text-xl font-bold text-gray-900">{value}</Text>
          <Text className="text-xs text-gray-500">{label}</Text>
        </View>
      </View>
    </View>
  );
}
