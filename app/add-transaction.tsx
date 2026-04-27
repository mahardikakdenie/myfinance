import { ThemedText } from '@/components/themed-text';
import { DatePickerModal } from '@/components/ui/date-picker-modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { TransactionType, useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

export default function AddTransactionScreen() {
	const [type, setType] = useState<TransactionType>('expense');
	const [amount, setAmount] = useState('');
	const [title, setTitle] = useState('');
	const [category, setCategory] = useState('Makanan');
	const [date, setDate] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [note, setNote] = useState('');
	const [loading, setLoading] = useState(false);

	const { addTransaction, categories } = useFinance();
	const router = useRouter();
	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? 'light'];

	const handleSave = () => {
	  if (!amount || !title) return;

	  const numericAmount = parseFloat(amount.replace(/\./g, ''));
	  if (isNaN(numericAmount)) return;

	  setLoading(true);

	  // Simulate a short delay for a better UX/loading feel
	  setTimeout(() => {
	    addTransaction({
	      title,
	      amount: numericAmount,
	      type,
	      category,
	      date: date.toISOString(),
	      note,
	    });
	    setLoading(false);
	    router.back();
	  }, 1200);
	};

	const formatCurrencyInput = (val: string) => {
	  // Remove non-numeric characters
	  const cleanValue = val.replace(/\D/g, '');
	  if (!cleanValue) return '';
	  // Add dot as thousands separator
	  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const handleAmountChange = (text: string) => {
	  setAmount(formatCurrencyInput(text));
	};
	const formatDate = (d: Date) => {
		const today = new Date();
		const yesterday = new Date();
		yesterday.setDate(today.getDate() - 1);

		if (d.toDateString() === today.toDateString()) return 'Today';
		if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

		return d.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		});
	};

	const selectedCategories = categories.filter((c) =>
		type === 'income'
			? c.name === 'Salary' || c.name === 'Other'
			: c.name !== 'Salary',
	);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={[styles.container, { backgroundColor: theme.background }]}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.typeSelector}>
					<Pressable
						style={[
							styles.typeButton,
							type === 'expense' && {
								backgroundColor: theme.expense + '20',
								borderColor: theme.expense,
							},
							{ borderColor: theme.border },
						]}
						onPress={() => {
							setType('expense');
							setCategory('Food');
						}}>
						<ThemedText
							style={[
								type === 'expense' && {
									color: theme.expense,
									fontWeight: '700',
								},
							]}>
							Expense
						</ThemedText>
					</Pressable>
					<Pressable
						style={[
							styles.typeButton,
							type === 'income' && {
								backgroundColor: theme.income + '20',
								borderColor: theme.income,
							},
							{ borderColor: theme.border },
						]}
						onPress={() => {
							setType('income');
							setCategory('Salary');
						}}>
						<ThemedText
							style={[
								type === 'income' && {
									color: theme.income,
									fontWeight: '700',
								},
							]}>
							Income
						</ThemedText>
					</Pressable>
				</View>

				<View style={styles.inputGroup}>
					<ThemedText style={styles.label}>Jumlah</ThemedText>
					<View
						style={[
							styles.amountInputContainer,
							{ borderBottomColor: theme.border },
						]}>
						<ThemedText style={styles.currencySymbol}>
							Rp
						</ThemedText>
						<TextInput
							style={[styles.amountInput, { color: theme.text }]}
							placeholder='0'
							placeholderTextColor={theme.secondaryText}
							keyboardType='decimal-pad'
							value={amount}
							onChangeText={handleAmountChange}
							autoFocus
						/>
					</View>
				</View>

				<View style={styles.inputGroup}>
					<ThemedText style={styles.label}>Judul</ThemedText>
					<TextInput
						style={[
							styles.textInput,
							{
								backgroundColor: theme.surface,
								color: theme.text,
							},
						]}
						placeholder='Untuk apa ini?'
						placeholderTextColor={theme.secondaryText}
						value={title}
						onChangeText={setTitle}
					/>
				</View>

				<View style={styles.inputGroup}>
					<ThemedText style={styles.label}>Tanggal</ThemedText>
					<Pressable
						style={[
							styles.dateSelector,
							{ backgroundColor: theme.surface },
						]}
						onPress={() => setShowDatePicker(true)}>
						<View style={styles.dateInfo}>
							<IconSymbol
								name='Calendar'
								size={20}
								color={theme.tint}
							/>
							<ThemedText style={styles.dateText}>
								{formatDate(date)}
							</ThemedText>
						</View>
						<IconSymbol
							name='ChevronDown'
							size={18}
							color={theme.icon}
						/>
					</Pressable>
				</View>

				<View style={styles.inputGroup}>
					<ThemedText style={styles.label}>Category</ThemedText>
					<View style={styles.categoryGrid}>
						{selectedCategories.map((cat) => (
							<Pressable
								key={cat.name}
								style={[
									styles.categoryChip,
									{ backgroundColor: theme.surface },
									category === cat.name && {
										backgroundColor: theme.tint + '20',
										borderColor: theme.tint,
									},
								]}
								onPress={() => setCategory(cat.name)}>
								<IconSymbol
									name={cat.icon as any}
									size={18}
									color={
										category === cat.name
											? theme.tint
											: theme.icon
									}
								/>
								<ThemedText
									style={[
										styles.categoryChipText,
										category === cat.name && {
											color: theme.tint,
											fontWeight: '600',
										},
									]}>
									{cat.name}
								</ThemedText>
							</Pressable>
						))}
					</View>
				</View>

				<View style={styles.inputGroup}>
					<ThemedText style={styles.label}>
						Note (Optional)
					</ThemedText>
					<TextInput
						style={[
							styles.textInput,
							{
								backgroundColor: theme.surface,
								color: theme.text,
								height: 100,
								textAlignVertical: 'top',
							},
						]}
						placeholder='Add a note...'
						placeholderTextColor={theme.secondaryText}
						multiline
						value={note}
						onChangeText={setNote}
					/>
				</View>

				<Pressable
					style={[
						styles.saveButton,
						{ backgroundColor: theme.tint },
						(!amount || !title || loading) && { opacity: 0.5 },
					]}
					onPress={handleSave}
					disabled={!amount || !title || loading}>
					{loading ? (
						<ActivityIndicator color='#fff' />
					) : (
						<ThemedText style={styles.saveButtonText}>
							Save Transaction
						</ThemedText>
					)}
				</Pressable>
			</ScrollView>

			<DatePickerModal
				visible={showDatePicker}
				onClose={() => setShowDatePicker(false)}
				selectedDate={date}
				onSelect={setDate}
			/>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: 20,
	},
	typeSelector: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 32,
	},
	typeButton: {
		flex: 1,
		height: 48,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputGroup: {
		marginBottom: 24,
	},
	label: {
		fontSize: 14,
		opacity: 0.6,
		marginBottom: 8,
	},
	amountInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 2,
		paddingBottom: 8,
	},
	currencySymbol: {
		fontSize: 32,
		fontWeight: '700',
		marginRight: 8,
	},
	amountInput: {
		fontSize: 40,
		fontWeight: '800',
		flex: 1,
	},
	textInput: {
		padding: 16,
		borderRadius: 12,
		fontSize: 16,
	},
	dateSelector: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
		borderRadius: 12,
	},
	dateInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	dateText: {
		fontSize: 16,
		fontWeight: '600',
	},
	categoryGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	categoryChip: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: 'transparent',
		gap: 8,
	},
	categoryChipText: {
		fontSize: 14,
	},
	saveButton: {
		height: 56,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20,
		marginBottom: 40,
	},
	saveButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '700',
	},
});
