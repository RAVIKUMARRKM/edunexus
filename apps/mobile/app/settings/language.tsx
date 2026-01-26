import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
];

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem('app_language');
      if (saved) {
        setSelectedLanguage(saved);
      }
    } catch (error) {
      console.error('Error loading language setting:', error);
    }
  };

  const selectLanguage = async (code: string) => {
    try {
      await AsyncStorage.setItem('app_language', code);
      setSelectedLanguage(code);
      Alert.alert(
        'Language Changed',
        'Language preference saved successfully. Full translations will be available in the next update.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save language preference');
      console.error('Error saving language setting:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Language</Text>
        <Text className="text-white/80 mt-2">Choose your preferred language</Text>
      </View>

      <View className="px-4 py-4">
        {/* Language List */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          {languages.map((language, index) => (
            <TouchableOpacity
              key={language.code}
              onPress={() => selectLanguage(language.code)}
              className={`flex-row items-center justify-between py-4 ${
                index !== languages.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-3xl mr-3">{language.flag}</Text>
                <View>
                  <Text className="text-base font-medium text-gray-900">
                    {language.name}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {language.nativeName}
                  </Text>
                </View>
              </View>
              {selectedLanguage === language.code ? (
                <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              ) : (
                <View className="w-6 h-6 border-2 border-gray-300 rounded-full" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Card */}
        <View className="bg-green-50 rounded-xl p-4 mb-4">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#10B981" />
            <View className="flex-1 ml-2">
              <Text className="text-green-900 font-semibold">
                Translations Coming Soon
              </Text>
              <Text className="text-green-800 text-sm mt-1">
                Full app translations for all supported languages will be
                available in upcoming updates. Currently, the app is available
                in English.
              </Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Coming Features
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-start">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#10B981"
                style={{ marginTop: 2 }}
              />
              <View className="flex-1 ml-3">
                <Text className="text-gray-900 font-medium">
                  Complete UI Translation
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  All screens, buttons, and labels
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#10B981"
                style={{ marginTop: 2 }}
              />
              <View className="flex-1 ml-3">
                <Text className="text-gray-900 font-medium">
                  Localized Date & Time
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Format dates according to your locale
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#10B981"
                style={{ marginTop: 2 }}
              />
              <View className="flex-1 ml-3">
                <Text className="text-gray-900 font-medium">
                  Right-to-Left Support
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  For Arabic, Hebrew, and other RTL languages
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
