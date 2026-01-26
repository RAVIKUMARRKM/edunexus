import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const router = useRouter();

  const appInfo = {
    name: 'EduNexus',
    version: '1.0.0',
    buildNumber: '1',
    developer: 'EduNexus Team',
    description:
      'A comprehensive school management system designed to streamline administrative tasks, enhance communication, and improve educational outcomes.',
  };

  const links = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'How we handle your data',
      icon: 'shield-checkmark',
      color: '#10B981',
      url: 'https://edunexus.example.com/privacy',
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      description: 'Terms and conditions',
      icon: 'document-text',
      color: '#3B82F6',
      url: 'https://edunexus.example.com/terms',
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Get help and contact us',
      icon: 'help-circle',
      color: '#F59E0B',
      url: 'mailto:support@edunexus.example.com',
    },
    {
      id: 'website',
      title: 'Website',
      description: 'Visit our website',
      icon: 'globe',
      color: '#8B5CF6',
      url: 'https://edunexus.example.com',
    },
  ];

  const features = [
    { icon: 'people', title: 'Student Management', color: '#3B82F6' },
    { icon: 'school', title: 'Attendance Tracking', color: '#10B981' },
    { icon: 'document-text', title: 'Exam Management', color: '#8B5CF6' },
    { icon: 'cash', title: 'Fee Management', color: '#F59E0B' },
    { icon: 'book', title: 'Library System', color: '#EF4444' },
    { icon: 'bus', title: 'Transport Management', color: '#06B6D4' },
    { icon: 'home', title: 'Hostel Management', color: '#EC4899' },
    { icon: 'chatbubbles', title: 'Communication', color: '#14B8A6' },
  ];

  const handleLinkPress = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to open this link');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">About</Text>
        <Text className="text-white/80 mt-2">App information and details</Text>
      </View>

      <View className="px-4 py-4">
        {/* App Info Card */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm items-center">
          <View className="w-20 h-20 bg-blue-500 rounded-2xl items-center justify-center mb-4">
            <Text className="text-white text-4xl font-bold">E</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {appInfo.name}
          </Text>
          <Text className="text-gray-500 mt-1">
            Version {appInfo.version} ({appInfo.buildNumber})
          </Text>
          <Text className="text-center text-gray-600 mt-4 leading-6">
            {appInfo.description}
          </Text>
          <View className="bg-blue-50 rounded-lg px-4 py-2 mt-4">
            <Text className="text-blue-700 font-medium">
              Developed by {appInfo.developer}
            </Text>
          </View>
        </View>

        {/* Features */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Key Features
          </Text>
          <View className="flex-row flex-wrap">
            {features.map((feature, index) => (
              <View
                key={index}
                className="w-1/2 p-2"
              >
                <View className="bg-gray-50 rounded-lg p-3">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Ionicons
                      name={feature.icon as any}
                      size={20}
                      color={feature.color}
                    />
                  </View>
                  <Text className="text-gray-900 text-sm font-medium">
                    {feature.title}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Links */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Important Links
          </Text>
          {links.map((link, index) => (
            <TouchableOpacity
              key={link.id}
              onPress={() => handleLinkPress(link.url)}
              className={`flex-row items-center py-3 ${
                index !== links.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: `${link.color}15` }}
              >
                <Ionicons
                  name={link.icon as any}
                  size={20}
                  color={link.color}
                />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-base font-medium text-gray-900">
                  {link.title}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  {link.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* System Info */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            System Information
          </Text>
          <InfoRow label="App Version" value={appInfo.version} />
          <InfoRow label="Build Number" value={appInfo.buildNumber} />
          <InfoRow label="Platform" value="React Native / Expo" />
          <InfoRow label="License" value="Proprietary" />
        </View>

        {/* Copyright */}
        <View className="items-center py-6">
          <Text className="text-gray-500 text-sm text-center">
            © 2024 EduNexus. All rights reserved.
          </Text>
          <Text className="text-gray-400 text-xs mt-2 text-center">
            Made with ❤️ for education
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2 border-b border-gray-100 last:border-b-0">
      <Text className="text-gray-600">{label}</Text>
      <Text className="text-gray-900 font-medium">{value}</Text>
    </View>
  );
}
