import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';
import { pickImageWithOptions } from '@/lib/image-picker';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });

  // Fetch full profile
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => apiHelpers.getProfile(),
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiHelpers.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile'
      );
    },
  });

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login' as any);
        },
      },
    ]);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editedProfile);
  };

  const handleChangePhoto = async () => {
    const result = await pickImageWithOptions({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result) {
      setAvatarUri(result.uri);
      // TODO: Upload to server when API is available
      Alert.alert('Success', 'Photo updated! (Local only - server upload coming soon)');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-500 mt-4">Loading profile...</Text>
      </View>
    );
  }

  const profile = profileData?.data || {};

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile Header */}
      <View className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 pt-6 pb-12">
        <View className="items-center">
          {avatarUri || profile.avatar ? (
            <Image
              source={{ uri: avatarUri || profile.avatar }}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-white items-center justify-center border-4 border-white">
              <Text className="text-blue-600 text-4xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={handleChangePhoto}
            className="absolute right-0 top-0 bg-white rounded-full p-2 shadow-lg"
          >
            <Ionicons name="camera" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 -mt-8">
        {/* Profile Info Card */}
        <View className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <View className="items-center mb-4">
            <Text className="text-2xl font-bold text-gray-900">{user?.name}</Text>
            <View className="bg-blue-100 px-3 py-1 rounded-full mt-2">
              <Text className="text-blue-700 text-sm font-medium">
                {user?.role?.replace('_', ' ')}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-center space-x-6 pt-4 border-t border-gray-200">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {profile.stats?.attendance || 0}%
              </Text>
              <Text className="text-xs text-gray-500">Attendance</Text>
            </View>
            <View className="w-px h-8 bg-gray-200" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {profile.stats?.exams || 0}
              </Text>
              <Text className="text-xs text-gray-500">Exams</Text>
            </View>
            <View className="w-px h-8 bg-gray-200" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">
                {profile.stats?.grade || 'N/A'}
              </Text>
              <Text className="text-xs text-gray-500">Grade</Text>
            </View>
          </View>
        </View>

        {/* Profile Details */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Personal Information
            </Text>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              className="bg-blue-100 rounded-lg px-3 py-2"
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={isEditing ? 'close' : 'pencil'}
                  size={16}
                  color="#3B82F6"
                />
                <Text className="text-blue-600 font-medium ml-1">
                  {isEditing ? 'Cancel' : 'Edit'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View className="space-y-4">
              <View>
                <Text className="text-sm text-gray-600 mb-2">Full Name</Text>
                <TextInput
                  value={editedProfile.name}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, name: text })
                  }
                  className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900"
                />
              </View>
              <View>
                <Text className="text-sm text-gray-600 mb-2">Email</Text>
                <TextInput
                  value={editedProfile.email}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, email: text })
                  }
                  keyboardType="email-address"
                  className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900"
                />
              </View>
              <View>
                <Text className="text-sm text-gray-600 mb-2">Phone</Text>
                <TextInput
                  value={editedProfile.phone}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, phone: text })
                  }
                  keyboardType="phone-pad"
                  className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900"
                />
              </View>
              <View>
                <Text className="text-sm text-gray-600 mb-2">Address</Text>
                <TextInput
                  value={editedProfile.address}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, address: text })
                  }
                  multiline
                  numberOfLines={3}
                  className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900"
                />
              </View>
              <TouchableOpacity
                onPress={handleSaveProfile}
                className="bg-blue-500 rounded-lg py-4"
                disabled={updateProfileMutation.isPending}
              >
                <Text className="text-white text-center font-semibold">
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="space-y-4">
              <InfoRow
                icon="mail"
                label="Email"
                value={profile.email || user?.email}
              />
              <InfoRow
                icon="call"
                label="Phone"
                value={profile.phone || 'Not provided'}
              />
              <InfoRow
                icon="location"
                label="Address"
                value={profile.address || 'Not provided'}
              />
              {user?.role === 'STUDENT' && (
                <>
                  <InfoRow
                    icon="school"
                    label="Class"
                    value={profile.class || 'N/A'}
                  />
                  <InfoRow
                    icon="folder"
                    label="Section"
                    value={profile.section || 'N/A'}
                  />
                  <InfoRow
                    icon="bookmark"
                    label="Roll Number"
                    value={profile.rollNumber || 'N/A'}
                  />
                  <InfoRow
                    icon="calendar"
                    label="Admission Date"
                    value={
                      profile.admissionDate
                        ? new Date(profile.admissionDate).toLocaleDateString('en-IN')
                        : 'N/A'
                    }
                  />
                </>
              )}
            </View>
          )}
        </View>

        {/* Settings Section */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Settings
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/settings' as any)}
              className="bg-blue-100 rounded-lg px-3 py-2"
            >
              <View className="flex-row items-center">
                <Text className="text-blue-600 font-medium mr-1">View All</Text>
                <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
              </View>
            </TouchableOpacity>
          </View>
          <SettingItem
            icon="notifications"
            label="Notifications"
            onPress={() => router.push('/settings/notifications' as any)}
            showArrow
          />
          <SettingItem
            icon="lock-closed"
            label="Change Password"
            onPress={() => router.push('/settings/password' as any)}
            showArrow
          />
          <SettingItem
            icon="language"
            label="Language"
            value="English"
            onPress={() => router.push('/settings/language' as any)}
            showArrow
          />
          <SettingItem
            icon="color-palette"
            label="Appearance"
            onPress={() => router.push('/settings/appearance' as any)}
            showArrow
          />
        </View>

        {/* Account Actions */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Account
          </Text>
          <SettingItem
            icon="information-circle"
            label="About"
            onPress={() => router.push('/settings/about' as any)}
            showArrow
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 rounded-xl py-4 mb-8 shadow-sm"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out" size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold text-base ml-2">
              Logout
            </Text>
          </View>
        </TouchableOpacity>

        {/* Version */}
        <Text className="text-center text-gray-400 text-sm mb-8">
          EduNexus v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center py-2">
      <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
        <Ionicons name={icon as any} size={20} color="#3B82F6" />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-xs text-gray-500">{label}</Text>
        <Text className="text-base text-gray-900 font-medium">{value}</Text>
      </View>
    </View>
  );
}

function SettingItem({
  icon,
  label,
  value,
  onPress,
  showArrow = false,
  hasSwitch = false,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
  showArrow?: boolean;
  hasSwitch?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-3 border-b border-gray-100"
    >
      <View className="flex-row items-center">
        <Ionicons name={icon as any} size={20} color="#6B7280" />
        <Text className="text-base text-gray-900 ml-3">{label}</Text>
      </View>
      <View className="flex-row items-center">
        {value && <Text className="text-gray-500 mr-2">{value}</Text>}
        {showArrow && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
        {hasSwitch && (
          <View className="w-12 h-6 bg-gray-300 rounded-full p-1">
            <View className="w-4 h-4 bg-white rounded-full" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
