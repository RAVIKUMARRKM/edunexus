import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiHelpers } from '@/lib/api';

const FINE_PER_DAY = 5; // ₹5 per day

export default function ReturnBookScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: issue, isLoading } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const response = await apiHelpers.getBookIssues({ id: id as string });
      const issues = response.data.data;
      return issues.find((i: any) => i.id === id);
    },
    enabled: !!id,
  });

  const returnMutation = useMutation({
    mutationFn: (data: { returnDate: string; fine?: number }) =>
      apiHelpers.returnBook(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      Alert.alert('Success', 'Book returned successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to return book');
    },
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setReturnDate(formattedDate);
    }
  };

  const calculateFine = () => {
    if (!issue) return 0;

    const dueDate = new Date(issue.dueDate);
    const actualReturnDate = new Date(returnDate);

    if (actualReturnDate <= dueDate) return 0;

    const daysOverdue = Math.ceil(
      (actualReturnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysOverdue * FINE_PER_DAY;
  };

  const fine = calculateFine();

  const handleReturn = () => {
    const data: { returnDate: string; fine?: number } = {
      returnDate,
    };

    if (fine > 0) {
      data.fine = fine;
    }

    Alert.alert(
      'Confirm Return',
      `Are you sure you want to return this book?${fine > 0 ? `\n\nFine: ₹${fine.toFixed(2)}` : ''}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => returnMutation.mutate(data),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading issue details...</Text>
      </View>
    );
  }

  if (!issue) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Issue not found</Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = new Date(returnDate) > new Date(issue.dueDate);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Return Book</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Issue Details */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Issue Details</Text>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Student</Text>
            <Text className="text-base font-medium text-gray-900">
              {issue.student.firstName} {issue.student.lastName}
            </Text>
            {issue.student.admissionNo && (
              <Text className="text-sm text-gray-600">{issue.student.admissionNo}</Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-1">Book</Text>
            <Text className="text-base font-medium text-gray-900">{issue.book.title}</Text>
            {issue.book.isbn && (
              <Text className="text-sm text-gray-600">ISBN: {issue.book.isbn}</Text>
            )}
          </View>

          <View className="flex-row justify-between mb-2">
            <View>
              <Text className="text-sm text-gray-600 mb-1">Issue Date</Text>
              <Text className="text-base font-medium text-gray-900">
                {formatDate(issue.issueDate)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-gray-600 mb-1">Due Date</Text>
              <Text
                className={`text-base font-medium ${
                  isOverdue ? 'text-red-600' : 'text-gray-900'
                }`}
              >
                {formatDate(issue.dueDate)}
              </Text>
            </View>
          </View>

          {isOverdue && (
            <View className="bg-red-50 p-3 rounded-lg mt-2">
              <View className="flex-row items-center">
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text className="text-sm text-red-800 ml-2 font-medium">Overdue Book</Text>
              </View>
            </View>
          )}
        </View>

        {/* Return Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Return Information</Text>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Return Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
            >
              <Text className="text-gray-900">{returnDate}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(returnDate)}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View className="bg-gray-50 p-4 rounded-lg">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">Fine per day:</Text>
              <Text className="text-sm font-medium text-gray-900">₹{FINE_PER_DAY}</Text>
            </View>
            {isOverdue && (
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-sm text-gray-600">Days overdue:</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {Math.ceil(
                    (new Date(returnDate).getTime() - new Date(issue.dueDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Fine Display */}
        {fine > 0 && (
          <View className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="alert-circle" size={24} color="#EF4444" />
                <Text className="text-lg font-semibold text-red-900 ml-2">Fine Amount</Text>
              </View>
              <Text className="text-2xl font-bold text-red-600">₹{fine.toFixed(2)}</Text>
            </View>
            <Text className="text-sm text-red-700 mt-2">
              This fine will be recorded and must be paid by the student.
            </Text>
          </View>
        )}

        {/* No Fine Display */}
        {fine === 0 && (
          <View className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text className="text-lg font-semibold text-green-900 ml-2">No Fine</Text>
            </View>
            <Text className="text-sm text-green-700 mt-1">
              Book is being returned on time.
            </Text>
          </View>
        )}

        {/* Return Button */}
        <TouchableOpacity
          onPress={handleReturn}
          disabled={returnMutation.isPending}
          className={`py-4 rounded-xl items-center mb-6 ${
            returnMutation.isPending ? 'bg-blue-300' : 'bg-blue-500'
          }`}
        >
          {returnMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-done" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">Confirm Return</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
