import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { apiHelpers } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function MessageDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [hasMarkedRead, setHasMarkedRead] = useState(false);

  const { data: message, isLoading } = useQuery({
    queryKey: ['message', id],
    queryFn: async () => {
      const response = await apiHelpers.getMessage(id as string);
      return response.data;
    },
    enabled: !!id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => apiHelpers.markMessageRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message', id] });
    },
  });

  useEffect(() => {
    // Mark as read when opened (only for received messages)
    if (message && !hasMarkedRead && message.receiverId === user?.id && !message.isRead) {
      markAsReadMutation.mutate(id as string);
      setHasMarkedRead(true);
    }
  }, [message, hasMarkedRead, user, id]);

  const handleReply = () => {
    if (message) {
      const recipientId = message.senderId === user?.id ? message.receiverId : message.senderId;
      router.push(`/messages/compose?userId=${recipientId}`);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => apiHelpers.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      router.back();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to delete message');
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(id as string),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading message...</Text>
      </View>
    );
  }

  if (!message) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Ionicons name="mail-outline" size={64} color="#9CA3AF" />
        <Text className="mt-4 text-gray-600">Message not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isReceived = message.receiverId === user?.id;
  const otherUser = isReceived ? message.sender : message.receiver;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">
              {isReceived ? 'From' : 'To'}: {otherUser.name}
            </Text>
            <Text className="text-white/80 text-sm">{otherUser.email}</Text>
          </View>
        </View>
      </View>

      {/* Message Content */}
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Metadata */}
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-blue-600 text-lg font-bold">
                    {otherUser.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold">
                    {otherUser.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">{otherUser.role}</Text>
                </View>
              </View>
              {!message.isRead && isReceived && (
                <View className="bg-blue-500 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">New</Text>
                </View>
              )}
            </View>

            <View className="border-t border-gray-100 pt-3">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm ml-2">
                  {formatDate(message.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* Subject */}
          {message.subject && (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-gray-500 text-xs uppercase mb-1">
                Subject
              </Text>
              <Text className="text-gray-900 text-lg font-semibold">
                {message.subject}
              </Text>
            </View>
          )}

          {/* Message Body */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-gray-500 text-xs uppercase mb-3">
              Message
            </Text>
            <Text className="text-gray-900 text-base leading-6">
              {message.content}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="bg-white border-t border-gray-200 px-6 py-4">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleReply}
            className="flex-1 bg-blue-500 py-4 rounded-lg flex-row items-center justify-center"
          >
            <Ionicons name="arrow-undo-outline" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Reply</Text>
          </TouchableOpacity>

          {isReceived && (
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-500 px-6 py-4 rounded-lg flex-row items-center justify-center"
            >
              <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
