import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Pressable, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProfile } from '@/context/FinanceContext';
import { BottomSheet } from '@/components/ui/bottom-sheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSave: (user: UserProfile) => void;
}

export function ProfileModal({ visible, onClose, currentUser, onSave }: ProfileModalProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (visible) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [visible, currentUser]);

  const handleSave = () => {
    if (name.trim() && email.trim()) {
      onSave({ name: name.trim(), email: email.trim() });
      onClose();
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={450}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Edit Profil</ThemedText>
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Nama Lengkap</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Masukkan nama"
            placeholderTextColor={theme.secondaryText}
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Masukkan email"
            placeholderTextColor={theme.secondaryText}
            keyboardType="email-address"
            autoCapitalize="none"
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
