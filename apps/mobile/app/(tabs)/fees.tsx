import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';
import FeeCard from '@/components/FeeCard';

export default function FeesScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'paid'>('pending');

  const studentId = user?.role === 'STUDENT' ? user.id : user?.studentId;

  // Fetch fee status
  const { data: feeData, isLoading, refetch } = useQuery({
    queryKey: ['fees', studentId],
    queryFn: () => apiHelpers.getFeeStatus(studentId || ''),
    enabled: !!studentId,
  });

  // Fetch payment history
  const { data: paymentHistory } = useQuery({
    queryKey: ['payment-history', studentId],
    queryFn: () => apiHelpers.getPaymentHistory(studentId || ''),
    enabled: !!studentId && selectedTab === 'paid',
  });

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: (data: any) => apiHelpers.makePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      queryClient.invalidateQueries({ queryKey: ['payment-history'] });
      Alert.alert('Success', 'Payment processed successfully!');
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to process payment'
      );
    },
  });

  const pendingFees = feeData?.data?.fees?.filter(
    (fee: any) => fee.status === 'PENDING' || fee.status === 'OVERDUE'
  ) || [];

  const paidFees = feeData?.data?.fees?.filter(
    (fee: any) => fee.status === 'PAID'
  ) || [];

  const currentFees = selectedTab === 'pending' ? pendingFees : paidFees;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePayment = (feeId: string, amount: number) => {
    Alert.alert(
      'Confirm Payment',
      `Are you sure you want to pay ${formatCurrency(amount)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => {
            paymentMutation.mutate({
              feeId,
              amount,
              studentId,
              paymentMethod: 'ONLINE',
            });
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Summary Header */}
      <View className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-6">
        <Text className="text-white text-lg font-semibold mb-4">Fee Summary</Text>
        <View className="flex-row space-x-3">
          <View className="flex-1 bg-white/20 rounded-xl p-3">
            <Text className="text-white text-xs opacity-80 mb-1">Total Due</Text>
            <Text className="text-white text-xl font-bold">
              {formatCurrency(feeData?.data?.summary?.totalDue || 0)}
            </Text>
          </View>
          <View className="flex-1 bg-white/20 rounded-xl p-3">
            <Text className="text-white text-xs opacity-80 mb-1">Paid</Text>
            <Text className="text-white text-xl font-bold">
              {formatCurrency(feeData?.data?.summary?.totalPaid || 0)}
            </Text>
          </View>
          <View className="flex-1 bg-white/20 rounded-xl p-3">
            <Text className="text-white text-xs opacity-80 mb-1">Overdue</Text>
            <Text className="text-white text-xl font-bold">
              {formatCurrency(feeData?.data?.summary?.overdue || 0)}
            </Text>
          </View>
        </View>
      </View>

      {/* Tab Selector */}
      <View className="bg-white px-4 pt-4 pb-2 shadow-sm">
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'pending' ? 'bg-white' : ''
            }`}
            onPress={() => setSelectedTab('pending')}
          >
            <Text
              className={`text-center font-semibold ${
                selectedTab === 'pending' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'paid' ? 'bg-white' : ''
            }`}
            onPress={() => setSelectedTab('paid')}
          >
            <Text
              className={`text-center font-semibold ${
                selectedTab === 'paid' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Paid
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fees List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View className="p-4">
          {/* Overdue Alert */}
          {selectedTab === 'pending' && feeData?.data?.summary?.overdue > 0 && (
            <View className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200">
              <View className="flex-row items-center mb-2">
                <Ionicons name="alert-circle" size={24} color="#DC2626" />
                <Text className="text-red-900 font-semibold ml-2">
                  Overdue Payment Alert
                </Text>
              </View>
              <Text className="text-red-800 text-sm">
                You have overdue fees of {formatCurrency(feeData.data.summary.overdue)}.
                Please pay as soon as possible to avoid penalties.
              </Text>
            </View>
          )}

          {isLoading ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-500 mt-4">Loading fees...</Text>
            </View>
          ) : currentFees.length > 0 ? (
            currentFees.map((fee: any) => (
              <View key={fee.id}>
                <FeeCard fee={fee} onPress={() => {}} />
                {selectedTab === 'pending' && (
                  <TouchableOpacity
                    className="bg-blue-500 rounded-xl py-4 mb-4 -mt-1"
                    onPress={() =>
                      handlePayment(fee.id, fee.amount - (fee.paidAmount || 0))
                    }
                    disabled={paymentMutation.isPending}
                  >
                    <Text className="text-white text-center font-semibold">
                      {paymentMutation.isPending ? 'Processing...' : 'Pay Now'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <Ionicons
                name={selectedTab === 'pending' ? 'checkmark-circle' : 'card'}
                size={64}
                color="#D1D5DB"
              />
              <Text className="text-gray-500 text-center mt-4 text-base">
                {selectedTab === 'pending'
                  ? 'No pending fees'
                  : 'No payment history'}
              </Text>
              <Text className="text-gray-400 text-center mt-2 text-sm">
                {selectedTab === 'pending'
                  ? 'All your fees are up to date'
                  : 'You have not made any payments yet'}
              </Text>
            </View>
          )}

          {/* Payment Methods (for pending tab) */}
          {selectedTab === 'pending' && pendingFees.length > 0 && (
            <View className="bg-white rounded-xl p-4 mt-4 shadow-sm">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Payment Methods
              </Text>
              <View className="space-y-3">
                <PaymentMethodItem
                  icon="card"
                  label="Credit/Debit Card"
                  color="#3B82F6"
                />
                <PaymentMethodItem
                  icon="logo-paypal"
                  label="UPI Payment"
                  color="#10B981"
                />
                <PaymentMethodItem
                  icon="wallet"
                  label="Net Banking"
                  color="#F59E0B"
                />
                <PaymentMethodItem
                  icon="business"
                  label="Pay at Office"
                  color="#8B5CF6"
                />
              </View>
            </View>
          )}

          {/* Payment History Details */}
          {selectedTab === 'paid' && paymentHistory?.data?.payments?.length > 0 && (
            <View className="bg-white rounded-xl p-4 mt-4 shadow-sm">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Recent Payments
              </Text>
              {paymentHistory.data.payments.slice(0, 5).map((payment: any, index: number) => (
                <View
                  key={payment.id}
                  className={`flex-row items-center justify-between py-3 ${
                    index !== 4 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <View>
                    <Text className="text-sm font-medium text-gray-900">
                      {payment.title}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {new Date(payment.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-base font-semibold text-green-600">
                      {formatCurrency(payment.amount)}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {payment.method}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Help Section */}
          <View className="bg-blue-50 rounded-xl p-4 mt-4 border border-blue-200">
            <View className="flex-row items-center mb-2">
              <Ionicons name="help-circle" size={24} color="#3B82F6" />
              <Text className="text-blue-900 font-semibold ml-2">Need Help?</Text>
            </View>
            <Text className="text-blue-800 text-sm mb-3">
              For any payment-related queries, please contact the accounts department.
            </Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity className="flex-1 bg-blue-500 rounded-lg py-3">
                <Text className="text-white text-center font-medium">
                  Call Support
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-white rounded-lg py-3 border border-blue-500">
                <Text className="text-blue-500 text-center font-medium">
                  Send Email
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function PaymentMethodItem({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <View className="flex-row items-center py-2">
      <View
        className="w-10 h-10 rounded-lg items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text className="text-sm text-gray-700 ml-3">{label}</Text>
    </View>
  );
}
