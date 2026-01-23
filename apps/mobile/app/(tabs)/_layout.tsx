import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';

export default function TabLayout() {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: 'Exams',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fees"
        options={{
          title: 'Fees',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
