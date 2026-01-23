import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)/dashboard');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-blue-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Logo */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-primary-500 rounded-2xl items-center justify-center mb-4">
              <Ionicons name="school" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-900">EduNexus</Text>
            <Text className="text-gray-500 mt-2">School Management System</Text>
          </View>

          {/* Login Form */}
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <Text className="text-xl font-semibold text-gray-900 mb-6">
              Welcome Back
            </Text>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`bg-primary-500 rounded-xl py-4 items-center ${
                isLoading ? 'opacity-70' : ''
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity className="mt-4 items-center">
              <Text className="text-primary-500 font-medium">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Demo Credentials */}
          <View className="mt-6 p-4 bg-blue-100 rounded-xl">
            <Text className="text-sm font-medium text-blue-800 mb-2">
              Demo Credentials:
            </Text>
            <Text className="text-sm text-blue-700">Email: admin@edunexus.com</Text>
            <Text className="text-sm text-blue-700">Password: admin123</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
