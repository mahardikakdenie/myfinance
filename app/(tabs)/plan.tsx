import { ThemedText } from '@/components/themed-text';
import { AmountModal } from '@/components/ui/amount-modal';
import { BudgetModal } from '@/components/ui/budget-modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

Dimensions.get('window');

export default function PlanScreen() {
	const {
		categories,
		budgets,
		setBudget,
		expectedIncome,
		setExpectedIncome,
		savingsTarget,
		setSavingsTarget,
	} = useFinance();

	const [activeModal, setActiveModal] = useState<
		'income' | 'savings' | 'category' | null
	>(null);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null,
	);
	const [isExcelMode, setIsExcelMode] = useState(false);

	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? 'light'];

	// Zero-Based Logic
	const totalAllocatedBudgets = Object.values(budgets).reduce(
		(acc, val) => acc + val,
		0,
	);
	const unallocatedFunds =
		expectedIncome - savingsTarget - totalAllocatedBudgets;

	const isPerfect = unallocatedFunds === 0;
	const isOverPlanned = unallocatedFunds < 0;

	const handleOpenBudget = (catName: string) => {
		if (isExcelMode) return; // In Excel mode, we use inline inputs
		setSelectedCategory(catName);
		setActiveModal('category');
	};

	const formatInput = (val: string) =>
		val.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: theme.background }]}>
			<View style={styles.header}>
				<View>
					<ThemedText style={styles.title}>Financial Plan</ThemedText>
					<ThemedText style={styles.subtitle}>
						Monthly strategy
					</ThemedText>
				</View>
				<Pressable
					onPress={() => setIsExcelMode(!isExcelMode)}
					style={[
						styles.excelToggle,
						isExcelMode && { backgroundColor: theme.tint },
					]}>
					<IconSymbol
						name='FileText'
						size={18}
						color={isExcelMode ? '#FFF' : theme.icon}
					/>
					<ThemedText
						style={[
							styles.excelToggleText,
							isExcelMode && { color: '#FFF' },
						]}>
						{isExcelMode ? 'Exit Excel Mode' : 'Excel Mode'}
					</ThemedText>
				</Pressable>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				{/* ... summary card remains same ... */}
				<View
					style={[
						styles.summaryCard,
						{ backgroundColor: theme.surface },
						isPerfect && {
							borderColor: theme.income,
							borderWidth: 2,
						},
						isOverPlanned && {
							borderColor: theme.expense,
							borderWidth: 2,
						},
					]}>
					<ThemedText style={styles.summaryLabel}>
						{isOverPlanned ? 'Over-allocated' : 'Unallocated Funds'}
					</ThemedText>
					<ThemedText
						style={[
							styles.summaryValue,
							{
								color: isOverPlanned
									? theme.expense
									: isPerfect
										? theme.income
										: theme.text,
							},
						]}>
						Rp {Math.abs(unallocatedFunds).toLocaleString('id-ID')}
					</ThemedText>
					<View
						style={[
							styles.badge,
							{
								backgroundColor: isPerfect
									? theme.income + '20'
									: isOverPlanned
										? theme.expense + '20'
										: theme.tint + '20',
							},
						]}>
						<ThemedText
							style={[
								styles.badgeText,
								{
									color: isPerfect
										? theme.income
										: isOverPlanned
											? theme.expense
											: theme.tint,
								},
							]}>
							{isPerfect
								? 'Zero-Based Achieved!'
								: isOverPlanned
									? 'Reduce your plan'
									: 'Give every rupiah a job'}
						</ThemedText>
					</View>
				</View>

				{/* Income & Savings */}
				<ThemedText style={styles.sectionTitle}>
					Income & Savings
				</ThemedText>
				<View style={styles.row}>
					<Pressable
						style={[
							styles.inputCard,
							{ backgroundColor: theme.surface },
						]}
						onPress={() => setActiveModal('income')}>
						<View
							style={[
								styles.iconCircle,
								{ backgroundColor: theme.income + '15' },
							]}>
							<IconSymbol
								name='Wallet'
								size={20}
								color={theme.income}
							/>
						</View>
						<ThemedText style={styles.inputLabel}>
							Expected Income
						</ThemedText>
						<ThemedText style={styles.inputValue}>
							Rp {expectedIncome.toLocaleString('id-ID')}
						</ThemedText>
					</Pressable>

					<Pressable
						style={[
							styles.inputCard,
							{ backgroundColor: theme.surface },
						]}
						onPress={() => setActiveModal('savings')}>
						<View
							style={[
								styles.iconCircle,
								{ backgroundColor: theme.tint + '15' },
							]}>
							<IconSymbol
								name='Target'
								size={20}
								color={theme.tint}
							/>
						</View>
						<ThemedText style={styles.inputLabel}>
							Savings Target
						</ThemedText>
						<ThemedText style={styles.inputValue}>
							Rp {savingsTarget.toLocaleString('id-ID')}
						</ThemedText>
					</Pressable>
				</View>

				{/* Budget Allocation */}
				<View style={styles.sectionHeader}>
					<ThemedText style={styles.sectionTitle}>
						Budget Allocation
					</ThemedText>
					{isExcelMode && (
						<ThemedText style={styles.excelHint}>
							Tap values to edit
						</ThemedText>
					)}
				</View>

				<View style={styles.categoryList}>
					{categories
						.filter((c) => c.name !== 'Gaji')
						.map((cat, index) => {
							const budgetAmt = budgets[cat.name] || 0;
							return (
								<View
									key={index}
									style={[
										styles.categoryItem,
										{ backgroundColor: theme.surface },
									]}>
									<View
										style={[
											styles.categoryIconBox,
											{
												backgroundColor:
													cat.color + '15',
											},
										]}>
										<IconSymbol
											name={cat.icon}
											size={20}
											color={cat.color}
										/>
									</View>
									<View style={styles.categoryInfo}>
										<ThemedText style={styles.categoryName}>
											{cat.name}
										</ThemedText>
										{!isExcelMode && (
											<ThemedText
												style={styles.categoryBudget}>
												{budgetAmt > 0
													? `Rp ${budgetAmt.toLocaleString('id-ID')}`
													: 'Not set'}
											</ThemedText>
										)}
									</View>

									{isExcelMode ? (
										<View style={styles.excelInputWrapper}>
											<ThemedText style={styles.excelRp}>
												Rp
											</ThemedText>
											<TextInput
												style={[
													styles.excelInput,
													{
														color: theme.tint,
														borderBottomColor:
															theme.tint + '40',
													},
												]}
												value={
													budgetAmt > 0
														? formatInput(
																budgetAmt.toString(),
															)
														: ''
												}
												onChangeText={(txt) =>
													setBudget(
														cat.name,
														parseFloat(
															txt.replace(
																/\./g,
																'',
															),
														) || 0,
													)
												}
												placeholder='0'
												keyboardType='numeric'
												selectTextOnFocus
											/>
										</View>
									) : (
										<Pressable
											onPress={() =>
												handleOpenBudget(cat.name)
											}>
											<IconSymbol
												name='ChevronRight'
												size={18}
												color={theme.icon}
											/>
										</Pressable>
									)}
								</View>
							);
						})}
				</View>
				<View style={{ height: 40 }} />
			</ScrollView>

			{/* Modals */}
			<AmountModal
				visible={activeModal === 'income'}
				title='Expected Income'
				initialValue={expectedIncome}
				onClose={() => setActiveModal(null)}
				onSave={setExpectedIncome}
				icon='Wallet'
				iconColor={theme.income}
			/>

			<AmountModal
				visible={activeModal === 'savings'}
				title='Savings Target'
				initialValue={savingsTarget}
				onClose={() => setActiveModal(null)}
				onSave={setSavingsTarget}
				icon='Target'
				iconColor={theme.tint}
			/>

			<BudgetModal
				visible={activeModal === 'category'}
				categoryName={selectedCategory || ''}
				currentBudget={
					selectedCategory ? budgets[selectedCategory] || 0 : 0
				}
				onClose={() => setActiveModal(null)}
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
		paddingHorizontal: 20,
		paddingVertical: 15,
	},
	title: {
		fontSize: 28,
		fontWeight: '800',
	},
	subtitle: {
		fontSize: 16,
		opacity: 0.5,
		marginTop: 2,
	},
	scrollContent: {
		padding: 20,
	},
	summaryCard: {
		padding: 24,
		borderRadius: 32,
		alignItems: 'center',
		marginBottom: 30,
	},
	summaryLabel: {
		fontSize: 14,
		fontWeight: '600',
		opacity: 0.6,
		marginBottom: 8,
	},
	summaryValue: {
		fontSize: 32,
		fontWeight: '800',
		marginBottom: 16,
	},
	badge: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
	},
	badgeText: {
		fontSize: 12,
		fontWeight: '700',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 16,
		marginLeft: 4,
	},
	row: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 30,
	},
	inputCard: {
		flex: 1,
		padding: 16,
		borderRadius: 24,
	},
	iconCircle: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
	},
	inputLabel: {
		fontSize: 12,
		fontWeight: '600',
		opacity: 0.5,
		marginBottom: 4,
	},
	inputValue: {
		fontSize: 14,
		fontWeight: '700',
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
		paddingRight: 8,
	},
	excelToggle: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: '#E5E5E520',
		gap: 6,
	},
	excelToggleText: {
		fontSize: 12,
		fontWeight: '700',
		opacity: 0.8,
	},
	excelHint: {
		fontSize: 11,
		opacity: 0.4,
		fontWeight: '600',
	},
	excelInputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	excelRp: {
		fontSize: 14,
		fontWeight: '700',
		opacity: 0.3,
	},
	excelInput: {
		fontSize: 16,
		fontWeight: '800',
		borderBottomWidth: 1,
		paddingHorizontal: 4,
		paddingVertical: 2,
		textAlign: 'right',
		minWidth: 100,
	},
	categoryList: {
		gap: 12,
	},
	categoryItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 20,
	},
	categoryIconBox: {
		width: 44,
		height: 44,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	categoryInfo: {
		flex: 1,
	},
	categoryName: {
		fontSize: 15,
		fontWeight: '700',
	},
	categoryBudget: {
		fontSize: 13,
		opacity: 0.5,
		marginTop: 2,
	},
});
