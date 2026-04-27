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
	const { transactions, totalBalance, totalIncome, totalExpenses } =
		useFinance();
	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? 'light'];
	const router = useRouter();

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: theme.background }]}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.header}>
					<View>
						<ThemedText style={styles.greeting}>
							Hello, User
						</ThemedText>
						<ThemedText style={styles.date}>
							{new Date().toLocaleDateString(undefined, {
								weekday: 'long',
								day: 'numeric',
								month: 'long',
							})}
						</ThemedText>
					</View>
					<Pressable
						style={[
							styles.profileButton,
							{ backgroundColor: theme.surface },
						]}>
						<IconSymbol name='User' size={24} color={theme.tint} />
					</Pressable>
				</View>

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
