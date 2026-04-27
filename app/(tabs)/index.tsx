import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TransactionItem } from '@/components/ui/transaction-item';
import { Colors } from '@/constants/theme';
import { useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
	const { 
    transactions, 
    totalBalance, 
    totalIncome, 
    totalExpenses, 
    user,
    expectedIncome,
    savingsTarget,
    budgets
  } = useFinance();
	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? 'light'];
	const router = useRouter();

  // Planning logic for summary
  const totalAllocated = Object.values(budgets).reduce((acc, val) => acc + val, 0);
  const unallocated = expectedIncome - savingsTarget - totalAllocated;
  const isPlanPerfect = unallocated === 0;

  // Budget Health Tracking Logic
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const monthProgress = dayOfMonth / daysInMonth; // 0.0 to 1.0

  const totalBudgeted = Object.values(budgets).reduce((acc, v) => acc + v, 0);
  const spendingProgress = totalBudgeted > 0 ? totalExpenses / totalBudgeted : 0;
  
  // 5% buffer for flexible spending
  const isOffTrack = spendingProgress > (monthProgress + 0.05) && totalBudgeted > 0;
  
  // Find top overspending category
  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const worstCategory = Object.keys(budgets)
    .map(cat => ({
      name: cat,
      spent: categorySpending[cat] || 0,
      budget: budgets[cat],
      ratio: budgets[cat] > 0 ? (categorySpending[cat] || 0) / budgets[cat] : 0
    }))
    .sort((a, b) => b.ratio - a.ratio)[0];

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: theme.background }]}>
			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header ... */}
				<View style={styles.header}>
					<View>
						<ThemedText style={styles.greeting}>
							Hello, {user.name.split(' ')[0]}
						</ThemedText>
						<ThemedText style={styles.date}>
							{new Date().toLocaleDateString('id-ID', {
								weekday: 'long',
								day: 'numeric',
								month: 'long',
							})}
						</ThemedText>
					</View>
					<Pressable
						onPress={() => router.push('/(tabs)/settings')}
						style={[
							styles.profileButton,
							{ backgroundColor: theme.surface },
						]}>
						<IconSymbol name='User' size={24} color={theme.tint} />
					</Pressable>
				</View>

        {/* Balance Card ... */}
				<View
					style={[
						styles.balanceCard,
						{ backgroundColor: theme.tint },
					]}>
					<ThemedText style={styles.balanceLabel}>
						Total Saldo
					</ThemedText>
					<ThemedText style={styles.balanceAmount}>
						Rp {totalBalance.toLocaleString('id-ID')}
					</ThemedText>
					<View style={styles.statsRow}>
						<View style={styles.statItem}>
							<View style={styles.statIconContainer}>
								<IconSymbol
									name='ArrowDownLeft'
									size={16}
									color='#fff'
								/>
							</View>
							<View>
								<ThemedText style={styles.statLabel}>
									Pemasukan
								</ThemedText>
								<ThemedText style={styles.statAmount}>
									Rp {totalIncome.toLocaleString('id-ID')}
								</ThemedText>
							</View>
						</View>
						<View style={styles.statItem}>
							<View
								style={[
									styles.statIconContainer,
									{
										backgroundColor:
											'rgba(255,255,255,0.2)',
									},
								]}>
								<IconSymbol
									name='ArrowUpRight'
									size={16}
									color='#fff'
								/>
							</View>
							<View>
								<ThemedText style={styles.statLabel}>
									Pengeluaran
								</ThemedText>
								<ThemedText style={styles.statAmount}>
									Rp {totalExpenses.toLocaleString('id-ID')}
								</ThemedText>
							</View>
						</View>
					</View>
				</View>

        {/* Budget Health Reminder */}
        <View style={[
          styles.healthCard, 
          { backgroundColor: isOffTrack ? theme.expense + '10' : theme.income + '10', borderColor: isOffTrack ? theme.expense + '30' : theme.income + '30' }
        ]}>
          <View style={styles.healthHeader}>
            <View style={[styles.healthIcon, { backgroundColor: isOffTrack ? theme.expense : theme.income }]}>
              <IconSymbol name={isOffTrack ? "Bell" : "Shield"} size={16} color="#FFF" />
            </View>
            <ThemedText style={[styles.healthStatus, { color: isOffTrack ? theme.expense : theme.income }]}>
              {isOffTrack ? 'STATUS: OFF TRACK' : 'STATUS: ON TRACK'}
            </ThemedText>
          </View>
          <ThemedText style={styles.healthDesc}>
            {isOffTrack 
              ? `Pengeluaran Anda terlalu cepat! Anda sudah memakai ${(spendingProgress * 100).toFixed(0)}% budget di ${(monthProgress * 100).toFixed(0)}% waktu bulan ini.`
              : 'Bagus! Pengeluaran Anda terkendali dan sesuai dengan rencana bulan ini.'}
          </ThemedText>
          {isOffTrack && worstCategory && (
            <View style={styles.dangerZone}>
              <ThemedText style={styles.dangerText}>
                ⚠️ Kurangi pengeluaran di kategori <ThemedText style={{fontWeight: '800'}}>{worstCategory.name}</ThemedText>
              </ThemedText>
            </View>
          )}
        </View>

        {/* Planning Summary Section */}
        <View style={styles.sectionHeader}>
					<ThemedText style={styles.sectionTitle}>
						Plan Bulan Ini
					</ThemedText>
					<Pressable onPress={() => router.push('/(tabs)/plan')}>
						<ThemedText style={{ color: theme.tint }}>
							Detail Plan
						</ThemedText>
					</Pressable>
				</View>

        <Pressable 
          onPress={() => router.push('/(tabs)/plan')}
          style={[styles.planCard, { backgroundColor: theme.surface }]}>
          <View style={[styles.planIcon, { backgroundColor: theme.tint + '15' }]}>
            <IconSymbol name="Wallet" size={24} color={theme.tint} />
          </View>
          <View style={styles.planContent}>
            <ThemedText style={styles.planTitle}>
              {isPlanPerfect ? 'Plan Sempurna!' : 'Belum Teralokasi'}
            </ThemedText>
            <ThemedText style={styles.planValue}>
              Rp {Math.abs(unallocated).toLocaleString('id-ID')}
            </ThemedText>
          </View>
          <View style={[styles.planBadge, { backgroundColor: isPlanPerfect ? theme.income + '20' : theme.tint + '20' }]}>
             <ThemedText style={[styles.planBadgeText, { color: isPlanPerfect ? theme.income : theme.tint }]}>
               {isPlanPerfect ? 'Zero-Based' : 'Butuh Aksi'}
             </ThemedText>
          </View>
        </Pressable>

				<View style={styles.sectionHeader}>
					<ThemedText style={styles.sectionTitle}>
						Transaksi Terakhir
					</ThemedText>
					<Pressable>
						<ThemedText style={{ color: theme.tint }}>
							Lihat Semua
						</ThemedText>
					</Pressable>
				</View>

				<View style={styles.transactionList}>
					{transactions.length > 0 ? (
						transactions
							.slice(0, 5)
							.map((t) => (
								<TransactionItem key={t.id} transaction={t} />
							))
					) : (
						<ThemedText style={styles.emptyText}>
							No transactions yet.
						</ThemedText>
					)}
				</View>
			</ScrollView>

			<Pressable
				style={[styles.fab, { backgroundColor: theme.tint }]}
				onPress={() => router.push('/add-transaction')}>
				<IconSymbol name='Plus' size={32} color='#fff' />
			</Pressable>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 100,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
	},
	greeting: {
		fontSize: 16,
		opacity: 0.6,
	},
	date: {
		fontSize: 20,
		fontWeight: '700',
	},
	profileButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	balanceCard: {
		padding: 24,
		borderRadius: 24,
		marginBottom: 32,
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
	},
	balanceLabel: {
		color: 'rgba(255,255,255,0.8)',
		fontSize: 16,
		marginBottom: 8,
	},
	balanceAmount: {
		color: '#fff',
		fontSize: 36,
		fontWeight: '800',
		marginBottom: 24,
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	statItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	statIconContainer: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: 'rgba(255,255,255,0.3)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	statLabel: {
		color: 'rgba(255,255,255,0.8)',
		fontSize: 12,
	},
	statAmount: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '700',
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '700',
	},
	transactionList: {
	gap: 4,
	},
	planCard: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  padding: 16,
	  borderRadius: 24,
	  marginBottom: 32,
	},
	planIcon: {
	  width: 48,
	  height: 48,
	  borderRadius: 16,
	  alignItems: 'center',
	  justifyContent: 'center',
	  marginRight: 16,
	},
	planContent: {
	  flex: 1,
	},
	planTitle: {
	  fontSize: 13,
	  opacity: 0.5,
	  fontWeight: '600',
	  marginBottom: 2,
	},
	planValue: {
	  fontSize: 18,
	  fontWeight: '700',
	},
	planBadge: {
	  paddingHorizontal: 12,
	  paddingVertical: 6,
	  borderRadius: 12,
	},
	planBadgeText: {
	fontSize: 11,
	fontWeight: '800',
	},
	healthCard: {
	  padding: 16,
	  borderRadius: 24,
	  marginBottom: 32,
	  borderWidth: 1,
	},
	healthHeader: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  gap: 10,
	  marginBottom: 10,
	},
	healthIcon: {
	  width: 28,
	  height: 28,
	  borderRadius: 14,
	  alignItems: 'center',
	  justifyContent: 'center',
	},
	healthStatus: {
	  fontSize: 13,
	  fontWeight: '800',
	  letterSpacing: 0.5,
	},
	healthDesc: {
	  fontSize: 14,
	  lineHeight: 20,
	  opacity: 0.8,
	  fontWeight: '500',
	},
	dangerZone: {
	  marginTop: 12,
	  paddingTop: 12,
	  borderTopWidth: 1,
	  borderTopColor: 'rgba(0,0,0,0.05)',
	},
	dangerText: {
	  fontSize: 13,
	  opacity: 0.9,
	},
	emptyText: {
		textAlign: 'center',
		opacity: 0.5,
		marginTop: 20,
	},
	fab: {
		position: 'absolute',
		bottom: 24,
		right: 24,
		width: 64,
		height: 64,
		borderRadius: 32,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
});
