import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Parent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  _count?: {
    children: number;
  };
}

interface ParentCardProps {
  parent: Parent;
  onPress: () => void;
}

export default function ParentCard({ parent, onPress }: ParentCardProps) {
  const initials = parent.name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const childrenCount = parent._count?.children || 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center">
        {/* Avatar */}
        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
          {parent.avatar ? (
            <Text className="text-xl">{parent.avatar}</Text>
          ) : (
            <Text className="text-blue-600 font-semibold">{initials}</Text>
          )}
        </View>

        {/* Parent Info */}
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-gray-900">{parent.name}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="mail-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1" numberOfLines={1}>
              {parent.email}
            </Text>
          </View>
          {parent.phone && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="call-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">{parent.phone}</Text>
            </View>
          )}
        </View>

        {/* Children Badge */}
        <View className="items-center ml-2">
          {childrenCount > 0 && (
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-600 text-xs font-medium">
                {childrenCount} {childrenCount === 1 ? 'child' : 'children'}
              </Text>
            </View>
          )}
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-2" />
      </View>
    </TouchableOpacity>
  );
}
