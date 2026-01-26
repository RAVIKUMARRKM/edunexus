import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function FilterChips({
  options,
  selected,
  onSelect,
}: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row gap-2"
      contentContainerStyle={{ paddingHorizontal: 4 }}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onSelect(option.value)}
          className={`px-4 py-2 rounded-full ${
            selected === option.value
              ? 'bg-blue-500'
              : 'bg-gray-100'
          }`}
        >
          <Text
            className={`font-medium ${
              selected === option.value
                ? 'text-white'
                : 'text-gray-700'
            }`}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
