import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiHelpers } from '@/lib/api';
import EmptyState from '@/components/base/EmptyState';
import ActionButton from '@/components/base/ActionButton';
import MessageCard from '@/components/messages/MessageCard';

export default function MessagesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['messages', activeTab],
    queryFn: async () => {
      const response = await apiHelpers.getMessages(activeTab);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading messages...</Text>
      </View>
    );
  }

  const messages = data?.messages || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Messages</Text>
        {unreadCount > 0 && activeTab === 'received' && (
          <Text className="text-white/80 mt-1">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {/* Tabs */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('received')}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'received' ? 'bg-blue-500' : ''
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Text
                className={`font-semibold ${
                  activeTab === 'received' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Received
              </Text>
              {unreadCount > 0 && activeTab === 'received' && (
                <View className="ml-2 bg-white px-2 py-0.5 rounded-full">
                  <Text className="text-blue-500 text-xs font-bold">
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('sent')}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'sent' ? 'bg-blue-500' : ''
            }`}
          >
            <Text
              className={`font-semibold text-center ${
                activeTab === 'sent' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Sent
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {messages.length > 0 ? (
          messages.map((message: any) => (
            <MessageCard
              key={message.id}
              message={message}
              type={activeTab}
              onPress={() => router.push(`/messages/${message.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="mail-outline"
            title={activeTab === 'received' ? 'No Messages' : 'No Sent Messages'}
            message={
              activeTab === 'received'
                ? 'Your inbox is empty'
                : "You haven't sent any messages yet"
            }
            actionLabel="Compose Message"
            onAction={() => router.push('/messages/compose')}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <ActionButton icon="create" onPress={() => router.push('/messages/compose')} />
    </View>
  );
}
