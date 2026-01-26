import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  position?: 'bottom-right' | 'bottom-center';
}

export default function ActionButton({
  icon,
  onPress,
  position = 'bottom-right',
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`absolute ${
        position === 'bottom-right'
          ? 'bottom-6 right-6'
          : 'bottom-6 left-0 right-0 mx-auto'
      } w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg`}
      style={{
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      }}
    >
      <Ionicons name={icon} size={24} color="white" />
    </TouchableOpacity>
  );
}
