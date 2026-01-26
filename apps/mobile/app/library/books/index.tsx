import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';
import SearchBar from '@/components/base/SearchBar';
import FilterChips from '@/components/base/FilterChips';
import EmptyState from '@/components/base/EmptyState';
import ActionButton from '@/components/base/ActionButton';
import BookCard from '@/components/library/BookCard';

export default function BooksScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: books, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['books', searchQuery, categoryFilter, statusFilter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await apiHelpers.getBooks(params);
      return response.data;
    },
  });

  const canAddBook = ['LIBRARIAN', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

  // Extract unique categories from books
  const categories = Array.from(
    new Set(books?.data?.map((book: any) => book.category).filter(Boolean))
  );

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...categories.map((cat: any) => ({ label: cat, value: cat })),
  ];

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Not Available', value: 'not_available' },
  ];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading books...</Text>
      </View>
    );
  }

  let booksList = books?.data || [];

  // Client-side filter by availability status
  if (statusFilter === 'available') {
    booksList = booksList.filter((book: any) => book.availableCopies > 0);
  } else if (statusFilter === 'not_available') {
    booksList = booksList.filter((book: any) => book.availableCopies === 0);
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <Text className="text-white text-2xl font-bold">Books Catalog</Text>
        <Text className="text-white/80 mt-1">
          {booksList.length} book{booksList.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search and Filters */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by title, author, or ISBN..."
        />

        <View className="mt-3">
          <FilterChips
            options={statusOptions}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />
        </View>

        {categories.length > 0 && (
          <View className="mt-3">
            <FilterChips
              options={categoryOptions}
              selected={categoryFilter}
              onSelect={setCategoryFilter}
            />
          </View>
        )}
      </View>

      {/* Books List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {booksList.length > 0 ? (
          booksList.map((book: any) => (
            <BookCard
              key={book.id}
              book={book}
              onPress={() => router.push(`/library/books/${book.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="library-outline"
            title="No Books Found"
            message={
              searchQuery
                ? `No books match "${searchQuery}"`
                : 'No books have been added yet'
            }
            actionLabel={canAddBook ? 'Add Book' : undefined}
            onAction={canAddBook ? () => router.push('/library/books/add') : undefined}
          />
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {canAddBook && (
        <ActionButton
          icon="add"
          onPress={() => router.push('/library/books/add')}
        />
      )}
    </View>
  );
}
