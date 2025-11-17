import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePreference } from '../contexts/ThemeContext';

const MAKKAH_COORDS = { lat: 21.4225, lng: 39.8262 };

export default function QiblaScreen() {
  const { themeColors } = useThemePreference();

  const openQiblaMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${MAKKAH_COORDS.lat},${MAKKAH_COORDS.lng}`;
    Linking.openURL(url).catch(() => {
      // best effort only
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Qibla Finder</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Use the compass below to align your device toward the Kaaba in Makkah. When the arrow
            points to the highlighted zone, you’re facing the Qibla.
          </Text>
        </View>

        <View style={[styles.compass, { borderColor: themeColors.border }]}>
          <View style={[styles.compassNeedle, { backgroundColor: themeColors.accent }]} />
          <Text style={[styles.compassLabel, { color: themeColors.textSecondary }]}>N</Text>
        </View>

        <Text style={[styles.note, { color: themeColors.textSecondary }]}>
          Tip: Move your device slowly in a figure-eight motion to calibrate the compass sensor. For
          best accuracy, keep your phone flat and away from magnets or metal.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.accent }]}
          onPress={openQiblaMap}
        >
          <Text style={[styles.buttonText, { color: themeColors.accentContrast }]}>Open in Maps</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    gap: 24,
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  compass: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassNeedle: {
    width: 6,
    height: 140,
    borderRadius: 3,
    position: 'absolute',
    top: 40,
  },
  compassLabel: {
    position: 'absolute',
    top: 12,
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
  },
  button: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

