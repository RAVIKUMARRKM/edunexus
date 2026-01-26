import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category?: string;
  totalCopies: number;
  availableCopies: number;
  publisher?: string;
}

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

export default function BookCard({ book, onPress }: BookCardProps) {
  const isAvailable = book.availableCopies > 0;
  const availabilityColor = isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const availabilityText = isAvailable ? 'Available' : 'Not Available';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row">
        {/* Book Icon */}
        <View className="w-16 h-20 bg-blue-100 rounded-lg items-center justify-center mr-4">
          <Ionicons name="book" size={32} color="#3B82F6" />
        </View>

        {/* Book Info */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={2}>
            {book.title}
          </Text>

          <View className="flex-row items-center mb-1">
            <Ionicons name="person-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1" numberOfLines={1}>
              {book.author}
            </Text>
          </View>

          <View className="flex-row items-center mb-1">
            <Ionicons name="barcode-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{book.isbn}</Text>
          </View>

          {book.category && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="pricetag-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">{book.category}</Text>
            </View>
          )}

          {/* Availability Info */}
          <View className="flex-row items-center justify-between">
            <View className={`px-2 py-1 rounded-full ${availabilityColor}`}>
              <Text className="text-xs font-medium">{availabilityText}</Text>
            </View>
            <Text className="text-sm text-gray-600">
              {book.availableCopies}/{book.totalCopies} copies
            </Text>
          </View>
        </View>

        {/* Arrow */}
        <View className="justify-center ml-2">
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
