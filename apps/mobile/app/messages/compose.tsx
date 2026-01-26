import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { apiHelpers } from '@/lib/api';
import RecipientSelector from '@/components/messages/RecipientSelector';

export default function ComposeMessageScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userId } = useLocalSearchParams();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRecipientSelector, setShowRecipientSelector] = useState(true);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });

  useEffect(() => {
    // If userId is provided in URL params, pre-select that user
    if (userId && !selectedUser) {
      fetchUserById(userId as string);
    }
  }, [userId]);

  const fetchUserById = async (id: string) => {
    try {
      const response = await apiHelpers.getUsers({ id });
      const users = response.data.users || [];
      if (users.length > 0) {
        setSelectedUser(users[0]);
        setShowRecipientSelector(false);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: (data: any) => apiHelpers.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      Alert.alert('Success', 'Message sent successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to send message'
      );
    },
  });

  const handleSend = () => {
    if (!selectedUser) {
      Alert.alert('Error', 'Please select a recipient');
      return;
    }

    if (!formData.content.trim()) {
      Alert.alert('Error', 'Message content is required');
      return;
    }

    if (formData.content.trim().length < 10) {
      Alert.alert('Error', 'Message must be at least 10 characters long');
      return;
    }

    sendMessageMutation.mutate({
      receiverId: selectedUser.id,
      subject: formData.subject.trim() || undefined,
      content: formData.content.trim(),
    });
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setShowRecipientSelector(false);
  };

  const handleChangeRecipient = () => {
    setSelectedUser(null);
    setShowRecipientSelector(true);
  };

  const isValid = selectedUser && formData.content.trim().length >= 10;

  if (showRecipientSelector) {
    return (
      <RecipientSelector
        onSelect={handleSelectUser}
        onCancel={() => router.back()}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Compose Message</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Selected Recipient */}
          <View className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-blue-900 text-xs font-semibold uppercase">
                Recipient
              </Text>
              <TouchableOpacity
                onPress={handleChangeRecipient}
                className="bg-blue-500 px-3 py-1 rounded-full"
              >
                <Text className="text-white text-xs font-semibold">Change</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
                <Text className="text-white text-lg font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">
                  {selectedUser.name}
                </Text>
                <Text className="text-gray-600 text-sm">{selectedUser.email}</Text>
                <View className="mt-1 bg-blue-100 self-start px-2 py-0.5 rounded-full">
                  <Text className="text-blue-700 text-xs font-medium">
                    {selectedUser.role}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Subject Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">
              Subject (Optional)
            </Text>
            <View className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <TextInput
                value={formData.subject}
                onChangeText={(text) =>
                  setFormData({ ...formData, subject: text })
                }
                placeholder="Enter message subject"
                placeholderTextColor="#9CA3AF"
                className="text-gray-900 text-base"
              />
            </View>
          </View>

          {/* Message Content */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-700 font-semibold">
                Message <Text className="text-red-500">*</Text>
              </Text>
              <Text
                className={`text-sm ${
                  formData.content.length < 10
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {formData.content.length} characters
                {formData.content.length < 10 && ' (min 10)'}
              </Text>
            </View>
            <View className="bg-white border border-gray-200 rounded-lg p-4">
              <TextInput
                value={formData.content}
                onChangeText={(text) =>
                  setFormData({ ...formData, content: text })
                }
                placeholder="Type your message here..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                className="text-gray-900 text-base min-h-[200px]"
              />
            </View>
            {formData.content.length > 0 && formData.content.length < 10 && (
              <Text className="text-red-500 text-sm mt-1">
                Message must be at least 10 characters long
              </Text>
            )}
          </View>

          {/* Help Text */}
          <View className="bg-gray-100 rounded-lg p-4 mb-6">
            <View className="flex-row items-start">
              <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2 flex-1">
                Your message will be sent directly to {selectedUser.name}. They
                will receive a notification.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Send Button */}
      <View className="bg-white border-t border-gray-200 px-6 py-4">
        <TouchableOpacity
          onPress={handleSend}
          disabled={!isValid || sendMessageMutation.isPending}
          className={`py-4 rounded-lg flex-row items-center justify-center ${
            isValid && !sendMessageMutation.isPending
              ? 'bg-blue-500'
              : 'bg-gray-300'
          }`}
        >
          {sendMessageMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons
                name="send"
                size={20}
                color={isValid ? 'white' : '#9CA3AF'}
              />
              <Text
                className={`font-semibold ml-2 ${
                  isValid ? 'text-white' : 'text-gray-500'
                }`}
              >
                Send Message
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
