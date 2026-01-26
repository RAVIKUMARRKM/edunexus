import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiHelpers } from '@/lib/api';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  publisher: z.string().optional(),
  category: z.string().optional(),
  totalCopies: z.number().min(1, 'Total copies must be at least 1'),
  availableCopies: z.number().min(0, 'Available copies cannot be negative'),
  description: z.string().optional(),
});

type BookInput = z.infer<typeof bookSchema>;

export default function AddBookScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BookInput>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      category: '',
      totalCopies: 1,
      availableCopies: 1,
      description: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: BookInput) => apiHelpers.addBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      Alert.alert('Success', 'Book added successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add book');
    },
  });

  const onSubmit = (data: BookInput) => {
    createMutation.mutate(data);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Add Book</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Basic Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Basic Information</Text>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Title *"
                value={value}
                onChangeText={onChange}
                placeholder="Enter book title"
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="author"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Author *"
                value={value}
                onChangeText={onChange}
                placeholder="Enter author name"
                error={errors.author?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="isbn"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="ISBN *"
                value={value}
                onChangeText={onChange}
                placeholder="Enter ISBN number"
                error={errors.isbn?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="publisher"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Publisher"
                value={value || ''}
                onChangeText={onChange}
                placeholder="Enter publisher name"
                error={errors.publisher?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Category"
                value={value || ''}
                onChangeText={onChange}
                placeholder="e.g., Fiction, Science, History"
                error={errors.category?.message}
              />
            )}
          />
        </View>

        {/* Copies Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Copies Information</Text>

          <Controller
            control={control}
            name="totalCopies"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Total Copies *"
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                placeholder="Enter total number of copies"
                keyboardType="numeric"
                error={errors.totalCopies?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="availableCopies"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Available Copies *"
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                placeholder="Enter available copies"
                keyboardType="numeric"
                error={errors.availableCopies?.message}
              />
            )}
          />

          <View className="bg-blue-50 p-3 rounded-lg">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className="text-sm text-blue-800 ml-2 flex-1">
                Available copies should be less than or equal to total copies
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Description</Text>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Description"
                value={value || ''}
                onChangeText={onChange}
                placeholder="Enter book description (optional)"
                multiline
                error={errors.description?.message}
              />
            )}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={createMutation.isPending}
          className={`py-4 rounded-xl items-center mb-6 ${
            createMutation.isPending ? 'bg-blue-300' : 'bg-blue-500'
          }`}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">Add Book</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
  error?: string;
}) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
        placeholderTextColor="#9CA3AF"
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
