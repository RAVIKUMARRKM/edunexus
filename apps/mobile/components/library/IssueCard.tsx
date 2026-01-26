import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Issue {
  id: string;
  student: {
    firstName: string;
    lastName: string;
    admissionNo?: string;
  };
  book: {
    title: string;
    isbn?: string;
  };
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fine?: number;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
}

interface IssueCardProps {
  issue: Issue;
  onPress: () => void;
}

export default function IssueCard({ issue, onPress }: IssueCardProps) {
  const studentName = `${issue.student.firstName} ${issue.student.lastName}`;
  const isOverdue = issue.status === 'OVERDUE';
  const isReturned = issue.status === 'RETURNED';

  const statusColor = isReturned
    ? 'bg-gray-100 text-gray-800'
    : isOverdue
    ? 'bg-red-100 text-red-800'
    : 'bg-yellow-100 text-yellow-800';

  const statusText = isReturned ? 'RETURNED' : isOverdue ? 'OVERDUE' : 'ISSUED';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-xl p-4 mb-3 shadow-sm border ${
        isOverdue ? 'border-red-200' : 'border-gray-100'
      }`}
    >
      {/* Student and Book Info */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {studentName}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="book-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1 flex-1" numberOfLines={1}>
              {issue.book.title}
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        <View className={`px-2 py-1 rounded-full ${statusColor} ml-2`}>
          <Text className="text-xs font-medium">{statusText}</Text>
        </View>
      </View>

      {/* Date Information */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-1">
            Issued: {formatDate(issue.issueDate)}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color={isOverdue ? '#EF4444' : '#6B7280'} />
          <Text className={`text-xs ml-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
            Due: {formatDate(issue.dueDate)}
          </Text>
        </View>
      </View>

      {/* Return Date */}
      {isReturned && issue.returnDate && (
        <View className="flex-row items-center mb-2">
          <Ionicons name="checkmark-circle-outline" size={14} color="#10B981" />
          <Text className="text-xs text-gray-600 ml-1">
            Returned: {formatDate(issue.returnDate)}
          </Text>
        </View>
      )}

      {/* Fine Information */}
      {issue.fine && issue.fine > 0 && (
        <View className="flex-row items-center mt-2 pt-2 border-t border-gray-100">
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text className="text-sm font-semibold text-red-600 ml-1">
            Fine: ₹{issue.fine.toFixed(2)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
