import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Building {
  id: string;
  name: string;
  type: 'BOYS' | 'GIRLS' | 'CO_ED';
  totalRooms: number;
  wardenName?: string;
}

interface BuildingCardProps {
  building: Building;
  onPress: () => void;
}

export default function BuildingCard({ building, onPress }: BuildingCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BOYS':
        return 'bg-blue-100 text-blue-800';
      case 'GIRLS':
        return 'bg-pink-100 text-pink-800';
      case 'CO_ED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'BOYS':
        return 'Boys';
      case 'GIRLS':
        return 'Girls';
      case 'CO_ED':
        return 'Co-Ed';
      default:
        return type;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center">
        {/* Icon */}
        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
          <Ionicons name="business" size={24} color="#3B82F6" />
        </View>

        {/* Building Info */}
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-gray-900">{building.name}</Text>
          <View className="flex-row items-center mt-1">
            <View className={`px-2 py-0.5 rounded-full ${getTypeColor(building.type)}`}>
              <Text className="text-xs font-medium">{getTypeLabel(building.type)}</Text>
            </View>
            <View className="flex-row items-center ml-3">
              <Ionicons name="bed-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">
                {building.totalRooms} {building.totalRooms === 1 ? 'room' : 'rooms'}
              </Text>
            </View>
          </View>
          {building.wardenName && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">Warden: {building.wardenName}</Text>
            </View>
          )}
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}
