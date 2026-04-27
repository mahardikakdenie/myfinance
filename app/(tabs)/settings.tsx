import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Switch, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFinance } from '@/context/FinanceContext';
import { ProfileModal } from '@/components/ui/profile-modal';

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  color?: string;
  isLast?: boolean;
}

const SettingItem = ({ 
  icon, 
  label, 
  value, 
  onPress, 
  showSwitch, 
  switchValue, 
  onSwitchChange, 
  color,
  isLast 
}: SettingItemProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const iconColor = color || theme.tint;

  return (
    <Pressable 
      onPress={onPress} 
      style={[
        styles.itemContainer, 
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border + '30' }
      ]}>
      <View style={[styles.iconWrapper, { backgroundColor: iconColor + '15' }]}>
        <IconSymbol name={icon} size={20} color={iconColor} />
      </View>
      
      <View style={styles.itemContent}>
        <ThemedText style={styles.itemLabel}>{label}</ThemedText>
        {value && <ThemedText style={styles.itemValue}>{value}</ThemedText>}
      </View>

      {showSwitch ? (
        <Switch 
          value={switchValue} 
          onValueChange={onSwitchChange} 
          trackColor={{ false: '#767577', true: theme.tint + '50' }}
          thumbColor={switchValue ? theme.tint : '#f4f3f4'}
        />
      ) : (
        <IconSymbol name="ChevronRight" size={18} color={theme.icon} />
      )}
    </Pressable>
  );
};

export default function SettingsScreen() {
  const { user, setUser, currency, setCurrency, resetData } = useFinance();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [notifications, setNotifications] = useState(true);
  const [faceId, setFaceId] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleClearData = () => {
    Alert.alert(
      'Hapus Semua Data',
      'Apakah Anda yakin ingin menghapus semua transaksi dan budget? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => {
            resetData();
            Alert.alert('Berhasil', 'Semua data telah dibersihkan.');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Fitur ini akan mengekspor data Anda ke format CSV. Lanjutkan?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Ekspor', onPress: () => Alert.alert('Sukses', 'Data berhasil diekspor ke folder Downloads.') }
    ]);
  };

  const handleChangeCurrency = () => {
    Alert.alert('Pilih Mata Uang', 'Pilih mata uang utama aplikasi', [
      { text: 'IDR (Rp)', onPress: () => setCurrency('IDR') },
      { text: 'USD ($)', onPress: () => setCurrency('USD') },
      { text: 'Batal', style: 'cancel' }
    ]);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Settings</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface }]}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.tint + '20' }]}>
            <ThemedText style={[styles.avatarText, { color: theme.tint }]}>{getInitials(user.name)}</ThemedText>
          </View>
          <View style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>{user.name}</ThemedText>
            <ThemedText style={styles.profileEmail}>{user.email}</ThemedText>
          </View>
          <Pressable 
            style={[styles.editButton, { backgroundColor: theme.background }]}
            onPress={() => setShowProfileModal(true)}>
            <ThemedText style={styles.editButtonText}>Edit</ThemedText>
          </Pressable>
        </View>

        {/* General Section */}
        <ThemedText style={styles.sectionTitle}>General</ThemedText>
        <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}>
          <SettingItem 
            icon="CreditCard" 
            label="My Accounts" 
            value="3 Accounts" 
          />
          <SettingItem 
            icon="Globe" 
            label="Currency" 
            value={currency === 'IDR' ? 'IDR (Rp)' : 'USD ($)'}
            onPress={handleChangeCurrency}
          />
          <SettingItem 
            icon="Bell" 
            label="Notifications" 
            showSwitch 
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
          <SettingItem 
            icon="Shield" 
            label="Security" 
            value="Face ID"
            showSwitch
            switchValue={faceId}
            onSwitchChange={setFaceId}
            isLast
          />
        </View>

        {/* Data & Privacy */}
        <ThemedText style={styles.sectionTitle}>Data & Privacy</ThemedText>
        <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}>
          <SettingItem 
            icon="FileText" 
            label="Export Data" 
            value="CSV, PDF" 
            onPress={handleExportData}
          />
          <SettingItem 
            icon="MoreHorizontal" 
            label="Clear Data" 
            color="#FF9500"
            onPress={handleClearData}
            isLast
          />
        </View>

        {/* Support */}
        <ThemedText style={styles.sectionTitle}>Support</ThemedText>
        <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}>
          <SettingItem 
            icon="HelpCircle" 
            label="Help Center" 
          />
          <SettingItem 
            icon="Shield" 
            label="Privacy Policy" 
            isLast
          />
        </View>

        {/* Logout */}
        <Pressable 
          style={[styles.logoutButton, { backgroundColor: theme.expense + '15' }]}
          onPress={() => Alert.alert('Logout', 'Anda yakin ingin keluar?')}>
          <IconSymbol name="LogOut" size={20} color={theme.expense} />
          <ThemedText style={[styles.logoutText, { color: theme.expense }]}>Log Out</ThemedText>
        </Pressable>

        <ThemedText style={styles.versionText}>Version 1.0.0 (Build 2024)</ThemedText>
      </ScrollView>

      <ProfileModal 
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={user}
        onSave={setUser}
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
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
    opacity: 0.8,
  },
  sectionCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 25,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
    marginLeft: 15,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemValue: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20,
    marginTop: 10,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.3,
    marginTop: 30,
    marginBottom: 20,
  },
});
