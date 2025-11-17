import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePreference } from '../contexts/ThemeContext';

export default function SuggestRestaurantScreen() {
  const { themeColors } = useThemePreference();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Restaurant suggestion box</Text>
        <Text style={[styles.body, { color: themeColors.textSecondary }]}>
          Know a hidden gem or a halal-friendly cafe that deserves to be featured? Send the details
          below and the HalalWay team will review it for a future release.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.accent }]}
          onPress={() => Alert.alert('Coming soon', 'Suggestion form coming soon!')}
        >
          <Text style={[styles.buttonText, { color: themeColors.accentContrast }]}>share details</Text>
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
  buttonText: { fontSize: 14, textTransform: 'uppercase', fontWeight: '600' },
});

