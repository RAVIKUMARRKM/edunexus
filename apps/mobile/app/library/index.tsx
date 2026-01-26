import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { apiHelpers } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function LibraryScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const isLibrarian = ['LIBRARIAN', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

  // Fetch stats
  const { data: booksData } = useQuery({
    queryKey: ['books-stats'],
    queryFn: async () => {
      const response = await apiHelpers.getBooks();
      return response.data;
    },
  });

  const { data: issuesData } = useQuery({
    queryKey: ['issues-stats'],
    queryFn: async () => {
      const response = await apiHelpers.getBookIssues();
      return response.data;
    },
  });

  const totalBooks = booksData?.data?.length || 0;
  const totalCopies = booksData?.data?.reduce((sum: number, book: any) => sum + book.totalCopies, 0) || 0;
  const availableCopies = booksData?.data?.reduce((sum: number, book: any) => sum + book.availableCopies, 0) || 0;
  const totalIssued = issuesData?.data?.filter((issue: any) => issue.status === 'ISSUED').length || 0;
  const overdueIssues = issuesData?.data?.filter((issue: any) => issue.status === 'OVERDUE').length || 0;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Library</Text>
        <Text className="text-white/80 mt-1">Manage books and issues</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Statistics Cards */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Library Statistics</Text>

          <View className="flex-row flex-wrap gap-4">
            <StatCard
              icon="library"
              label="Total Books"
              value={totalBooks.toString()}
              color="blue"
            />
            <StatCard
              icon="albums"
              label="Total Copies"
              value={totalCopies.toString()}
              color="indigo"
            />
            <StatCard
              icon="checkmark-circle"
              label="Available"
              value={availableCopies.toString()}
              color="green"
            />
            <StatCard
              icon="book"
              label="Issued"
              value={totalIssued.toString()}
              color="yellow"
            />
            {overdueIssues > 0 && (
              <StatCard
                icon="alert-circle"
                label="Overdue"
                value={overdueIssues.toString()}
                color="red"
              />
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>

          <TouchableOpacity
            onPress={() => router.push('/library/books')}
            className="flex-row items-center p-4 bg-blue-50 rounded-xl mb-3"
          >
            <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
              <Ionicons name="library" size={24} color="white" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-base font-semibold text-gray-900">Books Catalog</Text>
              <Text className="text-sm text-gray-600">Browse and search books</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/library/issues')}
            className="flex-row items-center p-4 bg-yellow-50 rounded-xl mb-3"
          >
            <View className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center">
              <Ionicons name="book" size={24} color="white" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-base font-semibold text-gray-900">Issued Books</Text>
              <Text className="text-sm text-gray-600">View issued and returned books</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {isLibrarian && (
            <>
              <TouchableOpacity
                onPress={() => router.push('/library/books/add')}
                className="flex-row items-center p-4 bg-green-50 rounded-xl mb-3"
              >
                <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center">
                  <Ionicons name="add-circle" size={24} color="white" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-base font-semibold text-gray-900">Add Book</Text>
                  <Text className="text-sm text-gray-600">Add new book to library</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/library/issues/issue')}
                className="flex-row items-center p-4 bg-purple-50 rounded-xl"
              >
                <View className="w-12 h-12 bg-purple-500 rounded-full items-center justify-center">
                  <Ionicons name="checkmark-done" size={24} color="white" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-base font-semibold text-gray-900">Issue Book</Text>
                  <Text className="text-sm text-gray-600">Issue book to student</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: 'blue' | 'indigo' | 'green' | 'yellow' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-100',
    indigo: 'bg-indigo-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
  };

  const iconColors = {
    blue: '#3B82F6',
    indigo: '#6366F1',
    green: '#10B981',
    yellow: '#F59E0B',
    red: '#EF4444',
  };

  return (
    <View className="flex-1 min-w-[45%]">
      <View className="bg-gray-50 rounded-xl p-4">
        <View className={`w-10 h-10 ${colorClasses[color]} rounded-full items-center justify-center mb-2`}>
          <Ionicons name={icon} size={20} color={iconColors[color]} />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-1">{value}</Text>
        <Text className="text-sm text-gray-600">{label}</Text>
      </View>
    </View>
  );
}
