import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BottomSheet } from '@/components/ui/bottom-sheet';

interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
  categoryName: string;
  currentBudget: number;
  onSave: (amount: number) => void;
}

export function BudgetModal({ visible, onClose, categoryName, currentBudget, onSave }: BudgetModalProps) {
  const [amount, setAmount] = useState('');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (visible) {
      setAmount(currentBudget > 0 ? formatCurrencyInput(currentBudget.toString()) : '');
    }
  }, [visible, currentBudget]);

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
          <ThemedText style={styles.title}>Atur Budget</ThemedText>
          <ThemedText style={styles.subtitle}>{categoryName}</ThemedText>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 4,
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
