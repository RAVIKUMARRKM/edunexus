import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppearanceSettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('dark_mode');
      if (saved) {
        setDarkMode(saved === 'true');
      }
    } catch (error) {
      console.error('Error loading appearance settings:', error);
    }
  };

  const toggleDarkMode = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('dark_mode', value.toString());
      setDarkMode(value);
    } catch (error) {
      console.error('Error saving dark mode setting:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Appearance</Text>
        <Text className="text-white/80 mt-2">Customize your app theme</Text>
      </View>

      <View className="px-4 py-4">
        {/* Dark Mode Setting */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                <Ionicons name="moon" size={20} color="#6B7280" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-base font-medium text-gray-900">
                  Dark Mode
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Coming soon - Dark theme support
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              disabled={true}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Theme Preview */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Theme Preview
          </Text>

          <View className="border border-gray-200 rounded-lg p-4 mb-3">
            <View className="bg-blue-500 rounded-lg p-4 mb-3">
              <Text className="text-white font-semibold">Light Theme (Current)</Text>
              <Text className="text-white/80 text-sm mt-1">
                Clean and bright interface
              </Text>
            </View>
            <View className="flex-row space-x-2">
              <View className="flex-1 bg-gray-100 rounded-lg p-3">
                <Text className="text-gray-900 text-xs font-medium">Card</Text>
              </View>
              <View className="flex-1 bg-gray-100 rounded-lg p-3">
                <Text className="text-gray-900 text-xs font-medium">Card</Text>
              </View>
            </View>
          </View>

          <View className="border border-gray-300 rounded-lg p-4 opacity-50">
            <View className="bg-gray-800 rounded-lg p-4 mb-3">
              <Text className="text-white font-semibold">Dark Theme (Coming Soon)</Text>
              <Text className="text-white/80 text-sm mt-1">
                Easy on the eyes at night
              </Text>
            </View>
            <View className="flex-row space-x-2">
              <View className="flex-1 bg-gray-700 rounded-lg p-3">
                <Text className="text-white text-xs font-medium">Card</Text>
              </View>
              <View className="flex-1 bg-gray-700 rounded-lg p-3">
                <Text className="text-white text-xs font-medium">Card</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View className="bg-purple-50 rounded-xl p-4">
          <View className="flex-row items-start">
            <Ionicons name="sparkles" size={20} color="#8B5CF6" />
            <View className="flex-1 ml-2">
              <Text className="text-purple-900 font-semibold">
                Coming in Next Update
              </Text>
              <Text className="text-purple-800 text-sm mt-1">
                Dark mode will be available in the next version of EduNexus.
                Stay tuned for more customization options including custom
                accent colors and font sizes.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
