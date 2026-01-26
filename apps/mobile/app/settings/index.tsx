import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();

  const settingsOptions = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification preferences',
      icon: 'notifications',
      route: '/settings/notifications',
      color: '#3B82F6',
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Theme and display settings',
      icon: 'color-palette',
      route: '/settings/appearance',
      color: '#8B5CF6',
    },
    {
      id: 'language',
      title: 'Language',
      description: 'Change app language',
      icon: 'globe',
      route: '/settings/language',
      color: '#10B981',
    },
    {
      id: 'password',
      title: 'Change Password',
      description: 'Update your password',
      icon: 'lock-closed',
      route: '/settings/password',
      color: '#F59E0B',
    },
    {
      id: 'about',
      title: 'About App',
      description: 'Version and app information',
      icon: 'information-circle',
      route: '/settings/about',
      color: '#6B7280',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Settings</Text>
        <Text className="text-white/80 mt-2">Manage your preferences</Text>
      </View>

      <View className="px-4 py-4">
        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => router.push(option.route as any)}
            className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm"
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: `${option.color}15` }}
            >
              <Ionicons
                name={option.icon as any}
                size={24}
                color={option.color}
              />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-gray-900 text-base font-semibold">
                {option.title}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {option.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
