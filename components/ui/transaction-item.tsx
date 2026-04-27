import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFinance, Transaction, Category } from '@/context/FinanceContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { categories } = useFinance();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const category = categories.find((c) => c.name === transaction.category) || categories[categories.length - 1];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
        <IconSymbol name={category.icon as any} size={24} color={category.color} />
      </View>
      <View style={styles.details}>
        <ThemedText style={styles.title}>{transaction.title}</ThemedText>
        <ThemedText style={styles.category}>{transaction.category}</ThemedText>
      </View>
      <View style={styles.amountContainer}>
        <ThemedText
          style={[
            styles.amount,
            { color: transaction.type === 'income' ? theme.income : theme.expense },
          ]}>
          {transaction.type === 'income' ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
        </ThemedText>
        <ThemedText style={styles.date}>
          {new Date(transaction.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    fontSize: 14,
    opacity: 0.6,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
  },
});
