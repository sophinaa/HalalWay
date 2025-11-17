import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../contexts/AuthContext';
import { useThemePreference } from '../contexts/ThemeContext';

export default function PersonalDetailsScreen() {
  const { user } = useAuth();
  const { themeColors } = useThemePreference();
  const [name, setName] = useState(user?.displayName ?? '');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Personal details</Text>
        <Text style={[styles.label, { color: themeColors.textSecondary }]}>Name</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: themeColors.card, color: themeColors.textPrimary, borderColor: themeColors.border },
          ]}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: themeColors.accent }]}
          onPress={() => Alert.alert('Coming soon', 'Profile name updates coming soon!')}
        >
          <Text style={[styles.saveButtonText, { color: themeColors.accentContrast }]}>Save name</Text>
        </TouchableOpacity>
        <Text style={[styles.label, { color: themeColors.textSecondary }]}>Email</Text>
        <Text style={[styles.value, { color: themeColors.textPrimary }]}>{user?.email ?? 'Not available'}</Text>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>User ID</Text>
          <Text style={[styles.value, { color: themeColors.textPrimary }]} numberOfLines={1}>
            {user?.uid ?? 'Not available'}
          </Text>
        <Text style={[styles.label, { color: themeColors.textSecondary }]}>Verified</Text>
        <Text style={[styles.value, { color: themeColors.textPrimary }]}>{user?.emailVerified ? 'Yes' : 'No'}</Text>
        </View>
        <Text style={[styles.note, { color: themeColors.textSecondary }]}>
          These details are only used to personalise your HalalWay account. Tap “Contact us” if you
          need to update your email or delete your profile.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 24, gap: 16 },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: '700' },
  label: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 16, fontWeight: '600' },
  note: { fontSize: 13, lineHeight: 19 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  saveButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
  },
  saveButtonText: {
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase',
  },
});
