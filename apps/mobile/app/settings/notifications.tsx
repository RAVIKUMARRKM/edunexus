import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationSettings {
  pushEnabled: boolean;
  attendance: boolean;
  examResults: boolean;
  feeReminders: boolean;
  notices: boolean;
  messages: boolean;
}

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    attendance: true,
    examResults: true,
    feeReminders: true,
    notices: true,
    messages: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('notification_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(
        'notification_settings',
        JSON.stringify(newSettings)
      );
      setSettings(newSettings);
      Alert.alert('Success', 'Notification settings saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save notification settings');
      console.error('Error saving notification settings:', error);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };

    // If disabling push notifications, disable all others
    if (key === 'pushEnabled' && !newSettings.pushEnabled) {
      newSettings.attendance = false;
      newSettings.examResults = false;
      newSettings.feeReminders = false;
      newSettings.notices = false;
      newSettings.messages = false;
    }

    saveSettings(newSettings);
  };

  const notificationOptions = [
    {
      key: 'pushEnabled',
      title: 'Push Notifications',
      description: 'Master toggle for all notifications',
      icon: 'notifications',
      color: '#3B82F6',
    },
    {
      key: 'attendance',
      title: 'Attendance Notifications',
      description: 'Get notified about attendance updates',
      icon: 'calendar',
      color: '#10B981',
      disabled: !settings.pushEnabled,
    },
    {
      key: 'examResults',
      title: 'Exam Results',
      description: 'Receive exam results notifications',
      icon: 'school',
      color: '#8B5CF6',
      disabled: !settings.pushEnabled,
    },
    {
      key: 'feeReminders',
      title: 'Fee Reminders',
      description: 'Get reminders for pending fees',
      icon: 'cash',
      color: '#F59E0B',
      disabled: !settings.pushEnabled,
    },
    {
      key: 'notices',
      title: 'Notice Updates',
      description: 'Receive notifications for new notices',
      icon: 'newspaper',
      color: '#EF4444',
      disabled: !settings.pushEnabled,
    },
    {
      key: 'messages',
      title: 'Messages',
      description: 'Get notified about new messages',
      icon: 'mail',
      color: '#06B6D4',
      disabled: !settings.pushEnabled,
    },
  ];

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500">Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Notifications</Text>
        <Text className="text-white/80 mt-2">Manage notification preferences</Text>
      </View>

      <View className="px-4 py-4">
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          {notificationOptions.map((option, index) => (
            <View key={option.key}>
              <View
                className={`flex-row items-center justify-between py-3 ${
                  index !== notificationOptions.length - 1
                    ? 'border-b border-gray-100'
                    : ''
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${option.color}15` }}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={option.disabled ? '#9CA3AF' : option.color}
                    />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text
                      className={`text-base font-medium ${
                        option.disabled ? 'text-gray-400' : 'text-gray-900'
                      }`}
                    >
                      {option.title}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {option.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings[option.key as keyof NotificationSettings]}
                  onValueChange={() =>
                    toggleSetting(option.key as keyof NotificationSettings)
                  }
                  disabled={option.disabled}
                  trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Info Card */}
        <View className="bg-blue-50 rounded-xl p-4">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <Text className="text-blue-800 text-sm ml-2 flex-1">
              Disabling push notifications will turn off all notification types.
              You can enable individual notifications after turning on push
              notifications.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
