import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinance } from '@/context/FinanceContext';
import { ThemedText } from '@/components/themed-text';
import { DonutChart } from '@/components/ui/donut-chart';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BudgetModal } from '@/components/ui/budget-modal';

const { width } = Dimensions.get('window');

type TabType = 'Daily' | 'Weekly' | 'Monthly';

export default function AnalyticsScreen() {
  const { transactions, categories, totalExpenses, budgets, setBudget } = useFinance();
  const [activeTab, setActiveTab] = useState<TabType>('Monthly');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  // Calculate totals by category for expenses
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const categoryData = categories
    .filter((cat) => cat.name !== 'Gaji') // Salary is income
    .map((cat) => {
      const value = expenseTransactions
        .filter((t) => t.category === cat.name)
        .reduce((acc, t) => acc + t.amount, 0);
      const budget = budgets[cat.name] || 0;
      return {
        name: cat.name,
        value,
        budget,
        color: cat.color,
        icon: cat.icon,
      };
    })
    .filter((data) => data.value > 0 || data.budget > 0)
    .sort((a, b) => b.value - a.value);

  const tabs: TabType[] = ['Daily', 'Weekly', 'Monthly'];

  const handleOpenBudget = (catName: string) => {
    setSelectedCategory(catName);
    setShowBudgetModal(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Spending</ThemedText>
        <Pressable style={[styles.periodPicker, { backgroundColor: theme.surface }]}>
          <ThemedText style={styles.periodText}>February 2024</ThemedText>
          <IconSymbol name="ChevronDown" size={16} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Chart Card */}
        <View style={[styles.chartCard, { backgroundColor: theme.surface }]}>
          <DonutChart
            data={categoryData}
            size={220}
            strokeWidth={24}
            centerLabel="Total Spend"
            centerValue={`Rp ${(totalExpenses / 1000).toFixed(0)}k`}
          />
        </View>

        {/* Tab Selector */}
        <View style={[styles.tabContainer, { backgroundColor: theme.surface }]}>
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && { backgroundColor: theme.background },
              ]}>
              <ThemedText
                style={[
                  styles.tabText,
                  activeTab === tab ? { fontWeight: '700', opacity: 1 } : { opacity: 0.5 },
                ]}>
                {tab}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Category List */}
        <View style={styles.categoryList}>
          {categoryData.map((item, index) => {
            const hasBudget = item.budget > 0;
            const percentage = hasBudget ? (item.value / item.budget) * 100 : 0;
            const isOverBudget = hasBudget && item.value > item.budget;

            return (
              <Pressable 
                key={index} 
                style={styles.categoryItem}
                onPress={() => handleOpenBudget(item.name)}>
                <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                  <IconSymbol name={item.icon} size={22} color={item.color} />
                </View>
                
                <View style={styles.itemMain}>
                  <View style={styles.itemHeader}>
                    <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                    <View style={{ alignItems: 'flex-end' }}>
                      <ThemedText style={[styles.categoryValue, isOverBudget && { color: theme.expense }]}>
                        Rp {item.value.toLocaleString('id-ID')}
                      </ThemedText>
                      {hasBudget && (
                        <ThemedText style={styles.budgetLimit}>
                          of Rp {item.budget.toLocaleString('id-ID')}
                        </ThemedText>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.progressContainer}>
                    <ThemedText style={styles.dateText}>
                      {hasBudget ? `${Math.min(percentage, 100).toFixed(0)}% used` : 'Set budget'}
                    </ThemedText>
                    <View style={styles.progressTrack}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            backgroundColor: isOverBudget ? theme.expense : item.color, 
                            width: hasBudget ? `${Math.min(percentage, 100)}%` : '0%' 
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
          {categoryData.length === 0 && (
            <ThemedText style={styles.emptyText}>No expense data to analyze yet.</ThemedText>
          )}
        </View>
      </ScrollView>

      <BudgetModal
        visible={showBudgetModal}
        categoryName={selectedCategory || ''}
        currentBudget={selectedCategory ? budgets[selectedCategory] || 0 : 0}
        onClose={() => setShowBudgetModal(false)}
        onSave={(amt) => {
          if (selectedCategory) setBudget(selectedCategory, amt);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  periodPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  chartCard: {
    borderRadius: 32,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    marginBottom: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabText: {
    fontSize: 14,
  },
  categoryList: {
    gap: 20,
    marginBottom: 40,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemMain: {
    flex: 1,
    justifyContent: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '700',
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  budgetLimit: {
    fontSize: 11,
    opacity: 0.4,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 13,
    opacity: 0.5,
    width: 80,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5E520',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 40,
  },
});
