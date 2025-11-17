import React from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePreference } from '../contexts/ThemeContext';

export default function NotificationSettingsScreen() {
  const { themeColors } = useThemePreference();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Notifications</Text>
        <Text style={[styles.body, { color: themeColors.textSecondary }]}>
          Choose which updates you’d like to receive. We’ll offer granular controls soon; for now,
          use the switches below to toggle categories.
        </Text>

        {[
          'Halal openings & closures',
          'Community requests',
          'HalalWay roadmap updates',
        ].map(label => (
          <View key={label} style={styles.switchRow}>
            <Text style={[styles.label, { color: themeColors.textPrimary }]}>{label}</Text>
            <Switch
              value
              onValueChange={() => Alert.alert('Coming soon', 'Notification toggles coming soon!')}
              thumbColor={themeColors.card}
              trackColor={{ false: themeColors.muted, true: themeColors.accent }}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 24, gap: 20 },
  title: { fontSize: 24, fontWeight: '800' },
  body: { fontSize: 14, lineHeight: 20 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: { fontSize: 14, flex: 1, paddingRight: 12 },
});

