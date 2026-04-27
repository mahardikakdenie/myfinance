import React from 'react';
import { StyleSheet, View, Pressable, FlatList, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BottomSheet } from '@/components/ui/bottom-sheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export function DatePickerModal({ visible, onClose, selectedDate, onSelect }: DatePickerModalProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  // Generate dates for a simple calendar view
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(currentYear, currentMonth, i + 1);
    return d;
  });

  const renderDay = ({ item }: { item: Date }) => {
    const isSelected = item.toDateString() === selectedDate.toDateString();
    const isToday = item.toDateString() === today.toDateString();

    return (
      <Pressable
        onPress={() => {
          onSelect(item);
          onClose();
        }}
        style={[
          styles.dayCell,
          isSelected && { backgroundColor: theme.tint },
          !isSelected && isToday && { borderColor: theme.tint, borderWidth: 1 }
        ]}>
        <ThemedText
          style={[
            styles.dayText,
            isSelected && { color: '#FFF', fontWeight: '700' },
            !isSelected && isToday && { color: theme.tint, fontWeight: '700' }
          ]}>
          {item.getDate()}
        </ThemedText>
        <ThemedText
          style={[
            styles.dayName,
            isSelected && { color: '#FFF' },
            !isSelected && { opacity: 0.5 }
          ]}>
          {item.toLocaleDateString('id-ID', { weekday: 'short' })}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={SCREEN_HEIGHT * 0.7}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Pilih Tanggal</ThemedText>
        </View>

        <View style={styles.presets}>
          <Pressable 
            style={[styles.presetButton, { backgroundColor: theme.surface }]}
            onPress={() => { onSelect(new Date()); onClose(); }}>
            <ThemedText>Hari Ini</ThemedText>
          </Pressable>
          <Pressable 
            style={[styles.presetButton, { backgroundColor: theme.surface }]}
            onPress={() => { 
              const d = new Date();
              d.setDate(d.getDate() - 1);
              onSelect(d); 
              onClose(); 
            }}>
            <ThemedText>Kemarin</ThemedText>
          </Pressable>
        </View>

        <View style={styles.calendarContainer}>
          <ThemedText style={styles.monthLabel}>
            {today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </ThemedText>
          <FlatList
            data={days}
            renderItem={renderDay}
            keyExtractor={(item) => item.toISOString()}
            numColumns={7}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 0,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  presets: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
  },
  calendarContainer: {
    flex: 1,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    gap: 8,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dayName: {
    fontSize: 10,
    marginTop: 2,
  },
});
