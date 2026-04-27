import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface AmountModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  initialValue: number;
  onSave: (amount: number) => void;
  icon?: string;
  iconColor?: string;
}

export function AmountModal({ 
  visible, 
  onClose, 
  title, 
  initialValue, 
  onSave,
  icon,
  iconColor
}: AmountModalProps) {
  const [amount, setAmount] = useState('');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (visible) {
      setAmount(initialValue > 0 ? formatCurrencyInput(initialValue.toString()) : '');
    }
  }, [visible, initialValue]);

  const formatCurrencyInput = (val: string) => {
    const cleanValue = val.replace(/\D/g, '');
    if (!cleanValue) return '';
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (text: string) => {
    setAmount(formatCurrencyInput(text));
  };

  const handleSave = () => {
    const numericAmount = parseFloat(amount.replace(/\./g, '')) || 0;
    onSave(numericAmount);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={350}>
      <View style={styles.container}>
        <View style={styles.header}>
          {icon && (
            <View style={[styles.iconCircle, { backgroundColor: (iconColor || theme.tint) + '15' }]}>
              <IconSymbol name={icon} size={24} color={iconColor || theme.tint} />
            </View>
          )}
          <ThemedText style={styles.title}>{title}</ThemedText>
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.currency}>Rp</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0"
            placeholderTextColor={theme.secondaryText}
            keyboardType="decimal-pad"
            autoFocus
          />
        </View>

        <View style={styles.actions}>
          <Pressable 
            style={[styles.button, { backgroundColor: theme.surface }]} 
            onPress={onClose}>
            <ThemedText style={{ fontWeight: '600' }}>Batal</ThemedText>
          </Pressable>
          <Pressable 
            style={[styles.button, { backgroundColor: theme.tint }]} 
            onPress={handleSave}>
            <ThemedText style={{ color: '#FFF', fontWeight: '700' }}>Simpan</ThemedText>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E530',
    paddingBottom: 10,
  },
  currency: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 8,
  },
  input: {
    fontSize: 32,
    fontWeight: '800',
    minWidth: 100,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
