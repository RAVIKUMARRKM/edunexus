import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiHelpers } from '@/lib/api';

const issueSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  bookId: z.string().min(1, 'Book is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});

type IssueInput = z.infer<typeof issueSchema>;

export default function IssueBookScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showStudentPicker, setShowStudentPicker] = useState(false);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showIssueDatePicker, setShowIssueDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 14 days from now

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IssueInput>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      studentId: '',
      bookId: '',
      issueDate: today,
      dueDate: defaultDueDate,
    },
  });

  const selectedStudentId = watch('studentId');
  const selectedBookId = watch('bookId');
  const issueDate = watch('issueDate');
  const dueDate = watch('dueDate');

  // Fetch students
  const { data: studentsData } = useQuery({
    queryKey: ['students', studentSearch],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (studentSearch) params.search = studentSearch;
      const response = await apiHelpers.getStudents(params);
      return response.data;
    },
  });

  // Fetch available books
  const { data: booksData } = useQuery({
    queryKey: ['books', bookSearch],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (bookSearch) params.search = bookSearch;
      const response = await apiHelpers.getBooks(params);
      return response.data;
    },
  });

  const students = studentsData?.data || [];
  const books = (booksData?.data || []).filter((book: any) => book.availableCopies > 0);

  const selectedStudent = students.find((s: any) => s.id === selectedStudentId);
  const selectedBook = books.find((b: any) => b.id === selectedBookId);

  const issueMutation = useMutation({
    mutationFn: (data: IssueInput) => apiHelpers.issueBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      Alert.alert('Success', 'Book issued successfully');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Failed to issue book');
    },
  });

  const onSubmit = (data: IssueInput) => {
    issueMutation.mutate(data);
  };

  const handleIssueDateChange = (event: any, selectedDate?: Date) => {
    setShowIssueDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setValue('issueDate', formattedDate);
    }
  };

  const handleDueDateChange = (event: any, selectedDate?: Date) => {
    setShowDueDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setValue('dueDate', formattedDate);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Issue Book</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Student Selection */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Select Student</Text>

          <Controller
            control={control}
            name="studentId"
            render={({ field: { value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Student *</Text>
                <TouchableOpacity
                  onPress={() => setShowStudentPicker(true)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className={value ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedStudent
                      ? `${selectedStudent.firstName} ${selectedStudent.lastName} (${selectedStudent.admissionNo})`
                      : 'Select student'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
                {errors.studentId && (
                  <Text className="text-sm text-red-500 mt-1">{errors.studentId.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Book Selection */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Select Book</Text>

          <Controller
            control={control}
            name="bookId"
            render={({ field: { value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Book *</Text>
                <TouchableOpacity
                  onPress={() => setShowBookPicker(true)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className={value ? 'text-gray-900' : 'text-gray-400'} numberOfLines={1}>
                    {selectedBook ? `${selectedBook.title} - ${selectedBook.author}` : 'Select book'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
                {errors.bookId && (
                  <Text className="text-sm text-red-500 mt-1">{errors.bookId.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Date Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Date Information</Text>

          <Controller
            control={control}
            name="issueDate"
            render={({ field: { value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Issue Date *</Text>
                <TouchableOpacity
                  onPress={() => setShowIssueDatePicker(true)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                >
                  <Text className={value ? 'text-gray-900' : 'text-gray-400'}>{value || 'Select issue date'}</Text>
                </TouchableOpacity>
                {showIssueDatePicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleIssueDateChange}
                    maximumDate={new Date()}
                  />
                )}
                {errors.issueDate && (
                  <Text className="text-sm text-red-500 mt-1">{errors.issueDate.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="dueDate"
            render={({ field: { value } }) => (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Due Date *</Text>
                <TouchableOpacity
                  onPress={() => setShowDueDatePicker(true)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                >
                  <Text className={value ? 'text-gray-900' : 'text-gray-400'}>{value || 'Select due date'}</Text>
                </TouchableOpacity>
                {showDueDatePicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDueDateChange}
                    minimumDate={new Date()}
                  />
                )}
                {errors.dueDate && (
                  <Text className="text-sm text-red-500 mt-1">{errors.dueDate.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={issueMutation.isPending}
          className={`py-4 rounded-xl items-center mb-6 ${
            issueMutation.isPending ? 'bg-blue-300' : 'bg-blue-500'
          }`}
        >
          {issueMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">Issue Book</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Student Picker Modal */}
      <Modal visible={showStudentPicker} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: '80%' }}>
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold">Select Student</Text>
                <TouchableOpacity onPress={() => setShowStudentPicker(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <TextInput
                value={studentSearch}
                onChangeText={setStudentSearch}
                placeholder="Search students..."
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              />
            </View>
            <ScrollView className="p-4">
              {students.length > 0 ? (
                students.map((student: any) => (
                  <TouchableOpacity
                    key={student.id}
                    onPress={() => {
                      setValue('studentId', student.id);
                      setShowStudentPicker(false);
                      setStudentSearch('');
                    }}
                    className="p-4 border-b border-gray-100"
                  >
                    <Text className="text-base font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </Text>
                    <Text className="text-sm text-gray-600">{student.admissionNo}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-center text-gray-500 py-8">No students found</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Book Picker Modal */}
      <Modal visible={showBookPicker} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: '80%' }}>
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold">Select Book</Text>
                <TouchableOpacity onPress={() => setShowBookPicker(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <TextInput
                value={bookSearch}
                onChangeText={setBookSearch}
                placeholder="Search books..."
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              />
            </View>
            <ScrollView className="p-4">
              {books.length > 0 ? (
                books.map((book: any) => (
                  <TouchableOpacity
                    key={book.id}
                    onPress={() => {
                      setValue('bookId', book.id);
                      setShowBookPicker(false);
                      setBookSearch('');
                    }}
                    className="p-4 border-b border-gray-100"
                  >
                    <Text className="text-base font-medium text-gray-900">{book.title}</Text>
                    <Text className="text-sm text-gray-600">by {book.author}</Text>
                    <Text className="text-xs text-green-600 mt-1">
                      {book.availableCopies} available
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-center text-gray-500 py-8">No available books found</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
