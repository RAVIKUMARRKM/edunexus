import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { apiHelpers } from '@/lib/api';
import NoticeCard from '@/components/NoticeCard';

export default function NoticesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: noticesData, isLoading, refetch } = useQuery({
    queryKey: ['notices', selectedCategory],
    queryFn: () =>
      apiHelpers.getNotices(
        selectedCategory !== 'ALL' ? { category: selectedCategory } : undefined
      ),
  });

  const categories = [
    { value: 'ALL', label: 'All', icon: 'apps', color: '#6B7280' },
    { value: 'URGENT', label: 'Urgent', icon: 'alert-circle', color: '#EF4444' },
    { value: 'ACADEMIC', label: 'Academic', icon: 'school', color: '#3B82F6' },
    { value: 'EVENT', label: 'Events', icon: 'calendar', color: '#8B5CF6' },
    { value: 'HOLIDAY', label: 'Holidays', icon: 'sunny', color: '#10B981' },
    { value: 'GENERAL', label: 'General', icon: 'information-circle', color: '#F59E0B' },
  ];

  const handleNoticePress = (notice: any) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text className="text-white text-xl font-bold">Notices</Text>
          <View className="flex-1" />
        </View>
        <View className="mt-4">
          <Text className="text-white text-sm opacity-80">
            {noticesData?.data?.unreadCount || 0} unread notices
          </Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white px-4 py-3 border-b border-gray-200"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.value}
            onPress={() => setSelectedCategory(category.value)}
            className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
              selectedCategory === category.value
                ? 'bg-blue-500'
                : 'bg-gray-100'
            }`}
          >
            <Ionicons
              name={category.icon as any}
              size={16}
              color={
                selectedCategory === category.value ? '#FFFFFF' : category.color
              }
            />
            <Text
              className={`ml-2 font-medium ${
                selectedCategory === category.value
                  ? 'text-white'
                  : 'text-gray-700'
              }`}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notices List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View className="p-4">
          {isLoading ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-500 mt-4">Loading notices...</Text>
            </View>
          ) : noticesData?.data?.notices?.length > 0 ? (
            noticesData.data.notices.map((notice: any) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onPress={() => handleNoticePress(notice)}
              />
            ))
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 text-center mt-4 text-base">
                No notices available
              </Text>
              <Text className="text-gray-400 text-center mt-2 text-sm">
                {selectedCategory !== 'ALL'
                  ? `No ${selectedCategory.toLowerCase()} notices at the moment`
                  : 'Check back later for new notices'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Notice Detail Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[85%]">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">Notice Details</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedNotice && (
              <ScrollView className="flex-1">
                <View className="p-6">
                  {/* Category Badge */}
                  <View className="flex-row items-center mb-4">
                    <View
                      className={`px-3 py-1 rounded-lg ${
                        selectedNotice.category === 'URGENT'
                          ? 'bg-red-100'
                          : selectedNotice.category === 'ACADEMIC'
                          ? 'bg-blue-100'
                          : selectedNotice.category === 'EVENT'
                          ? 'bg-purple-100'
                          : selectedNotice.category === 'HOLIDAY'
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selectedNotice.category === 'URGENT'
                            ? 'text-red-700'
                            : selectedNotice.category === 'ACADEMIC'
                            ? 'text-blue-700'
                            : selectedNotice.category === 'EVENT'
                            ? 'text-purple-700'
                            : selectedNotice.category === 'HOLIDAY'
                            ? 'text-green-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {selectedNotice.category}
                      </Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedNotice.title}
                  </Text>

                  {/* Meta Info */}
                  <View className="flex-row items-center mb-6">
                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                      <Text className="text-blue-600 font-semibold">
                        {selectedNotice.author.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View className="ml-3">
                      <Text className="text-sm font-medium text-gray-900">
                        {selectedNotice.author.name}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {selectedNotice.author.role} • {formatDate(selectedNotice.date)}
                      </Text>
                    </View>
                  </View>

                  {/* Content */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-6">
                    <Text className="text-base text-gray-700 leading-6">
                      {selectedNotice.content}
                    </Text>
                  </View>

                  {/* Attachments (if any) */}
                  {selectedNotice.attachments?.length > 0 && (
                    <View>
                      <Text className="text-base font-semibold text-gray-900 mb-3">
                        Attachments
                      </Text>
                      {selectedNotice.attachments.map((attachment: any, index: number) => (
                        <TouchableOpacity
                          key={index}
                          className="bg-blue-50 rounded-lg p-3 mb-2 flex-row items-center"
                        >
                          <Ionicons name="document-attach" size={20} color="#3B82F6" />
                          <Text className="flex-1 text-blue-600 ml-2">
                            {attachment.name}
                          </Text>
                          <Ionicons name="download" size={20} color="#3B82F6" />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Actions */}
                  <View className="flex-row space-x-3 mt-6">
                    <TouchableOpacity className="flex-1 bg-blue-500 rounded-xl py-4">
                      <View className="flex-row items-center justify-center">
                        <Ionicons name="share-social" size={20} color="#FFFFFF" />
                        <Text className="text-white font-semibold ml-2">Share</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-gray-100 rounded-xl py-4">
                      <View className="flex-row items-center justify-center">
                        <Ionicons name="bookmark" size={20} color="#6B7280" />
                        <Text className="text-gray-700 font-semibold ml-2">
                          Save
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
