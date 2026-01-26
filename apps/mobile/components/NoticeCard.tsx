import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shareNotice } from '@/lib/share';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'GENERAL' | 'ACADEMIC' | 'EVENT' | 'HOLIDAY' | 'URGENT';
  date: string;
  author: {
    name: string;
    role: string;
  };
  isRead?: boolean;
}

interface NoticeCardProps {
  notice: Notice;
  onPress: () => void;
}

export default function NoticeCard({ notice, onPress }: NoticeCardProps) {
  const handleShare = async (e: any) => {
    e.stopPropagation();
    await shareNotice({
      title: notice.title,
      content: notice.content,
      date: notice.date,
    });
  };

  const getCategoryColor = () => {
    switch (notice.category) {
      case 'URGENT':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'ACADEMIC':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'EVENT':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'HOLIDAY':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = () => {
    switch (notice.category) {
      case 'URGENT':
        return 'alert-circle';
      case 'ACADEMIC':
        return 'school';
      case 'EVENT':
        return 'calendar';
      case 'HOLIDAY':
        return 'sunny';
      default:
        return 'information-circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-xl p-4 mb-3 shadow-sm ${
        !notice.isRead ? 'border-l-4 border-blue-500' : ''
      }`}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <View className={`px-2 py-1 rounded-lg border ${getCategoryColor()}`}>
              <View className="flex-row items-center">
                <Ionicons
                  name={getCategoryIcon()}
                  size={12}
                  color={
                    notice.category === 'URGENT'
                      ? '#B91C1C'
                      : notice.category === 'ACADEMIC'
                      ? '#1D4ED8'
                      : notice.category === 'EVENT'
                      ? '#7C3AED'
                      : notice.category === 'HOLIDAY'
                      ? '#15803D'
                      : '#374151'
                  }
                />
                <Text
                  className={`ml-1 text-xs font-medium ${
                    notice.category === 'URGENT'
                      ? 'text-red-700'
                      : notice.category === 'ACADEMIC'
                      ? 'text-blue-700'
                      : notice.category === 'EVENT'
                      ? 'text-purple-700'
                      : notice.category === 'HOLIDAY'
                      ? 'text-green-700'
                      : 'text-gray-700'
                  }`}
                >
                  {notice.category}
                </Text>
              </View>
            </View>
            {!notice.isRead && (
              <View className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
            )}
          </View>
          <Text className="text-base font-semibold text-gray-900 mt-1">
            {notice.title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleShare}
          className="ml-2 w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
        >
          <Ionicons name="share-social-outline" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Content Preview */}
      <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
        {notice.content}
      </Text>

      {/* Footer */}
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
            <Text className="text-blue-600 font-semibold text-xs">
              {notice.author.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="ml-2">
            <Text className="text-xs font-medium text-gray-900">
              {notice.author.name}
            </Text>
            <Text className="text-xs text-gray-500">{notice.author.role}</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-500 ml-1">
            {formatDate(notice.date)}
          </Text>
        </View>
      </View>

      {notice.category === 'URGENT' && (
        <View className="mt-3 bg-red-50 rounded-lg p-2 border border-red-200">
          <Text className="text-xs text-red-700 text-center font-medium">
            This is an urgent notice. Please read carefully.
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
