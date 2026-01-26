import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { apiHelpers } from '@/lib/api';

export default function VehicleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const response = await apiHelpers.getVehicle(id as string);
      return response.data;
    },
  });

  const canEdit = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role || '');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Vehicle not found</Text>
      </View>
    );
  }

  const vehicleIcons: Record<string, any> = {
    BUS: 'bus-outline',
    VAN: 'car-outline',
    CAR: 'car-sport-outline',
  };

  const iconName = vehicleIcons[vehicle.type] || 'bus-outline';

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 px-6 pt-12 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Vehicle Header */}
        <View className="items-center">
          <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-3">
            <Ionicons name={iconName} size={40} color="#3B82F6" />
          </View>
          <Text className="text-white text-2xl font-bold">{vehicle.vehicleNumber}</Text>
          <View className="bg-white/20 px-3 py-1 rounded-full mt-2">
            <Text className="text-white text-sm font-medium">{vehicle.type}</Text>
          </View>
        </View>
      </View>

      {/* Info Sections */}
      <View className="px-4 py-4">
        {/* Vehicle Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</Text>

          <InfoRow icon="car-outline" label="Vehicle Number" value={vehicle.vehicleNumber} />
          <InfoRow icon="apps-outline" label="Type" value={vehicle.type} />
          <InfoRow icon="people-outline" label="Capacity" value={`${vehicle.capacity} seats`} />
          <InfoRow icon="document-text-outline" label="Registration Number" value={vehicle.registrationNumber || 'N/A'} />
          <InfoRow
            icon="shield-checkmark-outline"
            label="Insurance Expiry"
            value={vehicle.insuranceExpiryDate ? new Date(vehicle.insuranceExpiryDate).toLocaleDateString() : 'N/A'}
          />
        </View>

        {/* Driver Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Driver Information</Text>

          <InfoRow icon="person-outline" label="Driver Name" value={vehicle.driverName} />
          <InfoRow icon="call-outline" label="Driver Phone" value={vehicle.driverPhone || 'N/A'} />
          <InfoRow icon="card-outline" label="Driver License" value={vehicle.driverLicense || 'N/A'} />
        </View>

        {/* Allocated Students */}
        {vehicle.allocations && vehicle.allocations.length > 0 && (
          <View className="bg-white rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Allocated Students ({vehicle.allocations.length})
            </Text>
            {vehicle.allocations.map((allocation: any, index: number) => (
              <View
                key={allocation.id}
                className={`flex-row items-center py-3 ${
                  index !== vehicle.allocations.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                  <Ionicons name="person-outline" size={20} color="#8B5CF6" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-base font-medium text-gray-900">
                    {allocation.student.firstName} {allocation.student.lastName}
                  </Text>
                  {allocation.pickupPoint && (
                    <Text className="text-sm text-gray-600 mt-0.5">{allocation.pickupPoint}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        {canEdit && (
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={() => router.push(`/transport/vehicles/edit/${id}`)}
              className="flex-1 bg-blue-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="create-outline" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Edit Vehicle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View className="flex-row items-start py-2 border-b border-gray-100 last:border-b-0">
      <View className="w-8">
        <Ionicons name={icon as any} size={18} color="#6B7280" />
      </View>
      <View className="flex-1">
        <Text className="text-sm text-gray-600">{label}</Text>
        <Text className="text-base text-gray-900 mt-1">{value}</Text>
      </View>
    </View>
  );
}
