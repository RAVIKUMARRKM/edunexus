import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { apiHelpers } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function BookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isLibrarian = ['LIBRARIAN', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const response = await apiHelpers.getBook(id as string);
      return response.data;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiHelpers.deleteBook(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      Alert.alert('Success', 'Book deleted successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to delete book');
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading book details...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Book not found</Text>
      </View>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Book Details</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Book Cover & Basic Info */}
        <View className="bg-white rounded-xl p-6 mb-4 items-center">
          <View className="w-32 h-40 bg-blue-100 rounded-lg items-center justify-center mb-4">
            <Ionicons name="book" size={64} color="#3B82F6" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            {book.title}
          </Text>

          <Text className="text-lg text-gray-600 text-center mb-4">
            by {book.author}
          </Text>

          {/* Availability Badge */}
          <View
            className={`px-4 py-2 rounded-full ${
              isAvailable ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <Text
              className={`font-semibold ${
                isAvailable ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {isAvailable ? 'Available' : 'Not Available'}
            </Text>
          </View>
        </View>

        {/* Book Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Book Information</Text>

          <InfoRow icon="barcode-outline" label="ISBN" value={book.isbn} />
          {book.publisher && (
            <InfoRow icon="business-outline" label="Publisher" value={book.publisher} />
          )}
          {book.category && (
            <InfoRow icon="pricetag-outline" label="Category" value={book.category} />
          )}
          <InfoRow
            icon="albums-outline"
            label="Total Copies"
            value={book.totalCopies.toString()}
          />
          <InfoRow
            icon="checkmark-circle-outline"
            label="Available Copies"
            value={book.availableCopies.toString()}
            valueColor={isAvailable ? 'text-green-600' : 'text-red-600'}
          />
        </View>

        {/* Description */}
        {book.description && (
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">Description</Text>
            <Text className="text-gray-700 leading-6">{book.description}</Text>
          </View>
        )}

        {/* Action Buttons */}
        {isLibrarian && (
          <View className="mb-6">
            {isAvailable && (
              <TouchableOpacity
                onPress={() => router.push('/library/issues/issue')}
                className="bg-blue-500 py-4 rounded-xl items-center mb-3"
              >
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-done" size={20} color="white" />
                  <Text className="text-white font-semibold text-base ml-2">Issue Book</Text>
                </View>
              </TouchableOpacity>
            )}

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => router.push(`/library/books/edit/${id}`)}
                className="flex-1 bg-yellow-500 py-4 rounded-xl items-center"
              >
                <View className="flex-row items-center">
                  <Ionicons name="create" size={20} color="white" />
                  <Text className="text-white font-semibold text-base ml-2">Edit</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-red-500 py-4 rounded-xl items-center"
              >
                {deleteMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View className="flex-row items-center">
                    <Ionicons name="trash" size={20} color="white" />
                    <Text className="text-white font-semibold text-base ml-2">Delete</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  valueColor = 'text-gray-900',
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
      <Ionicons name={icon} size={20} color="#6B7280" />
      <Text className="text-sm text-gray-600 ml-3 flex-1">{label}</Text>
      <Text className={`text-sm font-medium ${valueColor}`}>{value}</Text>
    </View>
  );
}
