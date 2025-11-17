import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePreference } from '../contexts/ThemeContext';

export default function SupportScreen() {
  const { themeColors } = useThemePreference();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Support HalalWay</Text>
        <Text style={[styles.body, { color: themeColors.textSecondary }]}>
          Donations help us audit restaurants, maintain accurate data, and keep the guide free for
          students. Choose an amount that works for you, and we’ll invest it back into the community.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.accent }]}
          onPress={() => Alert.alert('Coming soon', 'Donation portal coming soon!')}
        >
          <Text style={[styles.buttonText, { color: themeColors.accentContrast }]}>Donate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  body: { fontSize: 14, lineHeight: 20 },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  buttonText: { fontWeight: '600', textTransform: 'uppercase' },
});

