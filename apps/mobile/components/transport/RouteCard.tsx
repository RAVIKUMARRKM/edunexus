import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Route {
  id: string;
  name: string;
  stops?: any[];
  distance?: number;
}

interface RouteCardProps {
  route: Route;
  onPress: () => void;
}

export default function RouteCard({ route, onPress }: RouteCardProps) {
  const stopsCount = route.stops?.length || 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center">
        {/* Route Icon */}
        <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
          <Ionicons name="map-outline" size={24} color="#10B981" />
        </View>

        {/* Route Info */}
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-gray-900">{route.name}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">
              {stopsCount} stop{stopsCount !== 1 ? 's' : ''}
            </Text>
          </View>
          {route.distance && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="speedometer-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">{route.distance} km</Text>
            </View>
          )}
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}
