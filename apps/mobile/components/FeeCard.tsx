import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Fee {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidAmount?: number;
  category: string;
}

interface FeeCardProps {
  fee: Fee;
  onPress: () => void;
}

export default function FeeCard({ fee, onPress }: FeeCardProps) {
  const getStatusColor = () => {
    switch (fee.status) {
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'OVERDUE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = () => {
    switch (fee.status) {
      case 'PAID':
        return 'checkmark-circle';
      case 'PENDING':
        return 'time';
      case 'OVERDUE':
        return 'alert-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const remainingAmount = fee.amount - (fee.paidAmount || 0);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm"
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {fee.title}
          </Text>
          <Text className="text-sm text-gray-500">{fee.category}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor()}`}>
          <View className="flex-row items-center">
            <Ionicons
              name={getStatusIcon()}
              size={14}
              color={
                fee.status === 'PAID'
                  ? '#15803D'
                  : fee.status === 'PENDING'
                  ? '#A16207'
                  : '#B91C1C'
              }
            />
            <Text
              className={`ml-1 text-xs font-medium ${
                fee.status === 'PAID'
                  ? 'text-green-700'
                  : fee.status === 'PENDING'
                  ? 'text-yellow-700'
                  : 'text-red-700'
              }`}
            >
              {fee.status}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="text-xs text-gray-500 mb-1">Total Amount</Text>
          <Text className="text-lg font-bold text-gray-900">
            {formatCurrency(fee.amount)}
          </Text>
        </View>
        {fee.paidAmount && fee.paidAmount > 0 && (
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">Paid</Text>
            <Text className="text-base font-semibold text-green-600">
              {formatCurrency(fee.paidAmount)}
            </Text>
          </View>
        )}
        {remainingAmount > 0 && fee.status !== 'PAID' && (
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">Remaining</Text>
            <Text className="text-base font-semibold text-red-600">
              {formatCurrency(remainingAmount)}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center pt-3 border-t border-gray-100">
        <Ionicons name="calendar-outline" size={14} color="#6B7280" />
        <Text className="text-sm text-gray-600 ml-2">
          Due Date: {formatDate(fee.dueDate)}
        </Text>
      </View>

      {fee.status === 'OVERDUE' && (
        <View className="mt-2 bg-red-50 rounded-lg p-2">
          <Text className="text-xs text-red-700 text-center">
            Payment is overdue. Please pay as soon as possible.
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
