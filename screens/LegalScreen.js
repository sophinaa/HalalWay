import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePreference } from '../contexts/ThemeContext';

export default function LegalScreen() {
  const { themeColors } = useThemePreference();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>About HalalWay</Text>
        <Text style={[styles.body, { color: themeColors.textSecondary }]}>
          HalalWay is a student-led guide to halal restaurants across the UK. We research venues,
          collect community feedback, and publish tools that help Muslims and the halal-curious dine
          confidently wherever they travel.
        </Text>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Terms & Conditions</Text>
        <Text style={[styles.body, { color: themeColors.textSecondary }]}>
          By using HalalWay you agree that all information is provided “as is”. We do our best to
          verify halal status, but venues may change ownership or policies without notice. Always
          contact the restaurant directly or ask staff on arrival if you have concerns.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  body: { fontSize: 14, lineHeight: 20 },
});

