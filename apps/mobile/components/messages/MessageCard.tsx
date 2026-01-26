import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  subject?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

interface MessageCardProps {
  message: Message;
  type: 'received' | 'sent';
  onPress: () => void;
}

export default function MessageCard({ message, type, onPress }: MessageCardProps) {
  const otherUser = type === 'received' ? message.sender : message.receiver;
  const isUnread = !message.isRead && type === 'received';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-lg p-4 mb-3 shadow-sm border ${
        isUnread ? 'border-blue-200 bg-blue-50' : 'border-gray-100'
      }`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        {/* Avatar */}
        <View
          className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
            isUnread ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <Text
            className={`text-lg font-bold ${
              isUnread ? 'text-white' : 'text-gray-600'
            }`}
          >
            {otherUser.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Message Info */}
        <View className="flex-1 pr-2">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className={`text-base ${
                isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'
              }`}
            >
              {otherUser.name}
            </Text>
            <Text className="text-xs text-gray-500">
              {formatDate(message.createdAt)}
            </Text>
          </View>

          {/* Role Badge */}
          <View className="mb-2">
            <View className="bg-gray-100 self-start px-2 py-0.5 rounded-full">
              <Text className="text-gray-600 text-xs">{otherUser.role}</Text>
            </View>
          </View>

          {/* Subject */}
          {message.subject && (
            <Text
              className={`text-sm mb-1 ${
                isUnread ? 'font-semibold text-gray-900' : 'text-gray-700'
              }`}
            >
              {truncateText(message.subject, 40)}
            </Text>
          )}

          {/* Content Preview */}
          <Text className="text-sm text-gray-600 leading-5">
            {truncateText(message.content, 80)}
          </Text>
        </View>

        {/* Unread Indicator */}
        {isUnread && (
          <View className="w-3 h-3 bg-blue-500 rounded-full ml-2 mt-1" />
        )}
      </View>

      {/* Footer Icons */}
      <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
        <View className="flex-row items-center mr-4">
          <Ionicons
            name={type === 'received' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
            size={16}
            color={type === 'received' ? '#3B82F6' : '#10B981'}
          />
          <Text className="text-xs text-gray-600 ml-1">
            {type === 'received' ? 'Received' : 'Sent'}
          </Text>
        </View>
        {message.subject && (
          <View className="flex-row items-center">
            <Ionicons name="document-text-outline" size={16} color="#6B7280" />
            <Text className="text-xs text-gray-600 ml-1">Has subject</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
