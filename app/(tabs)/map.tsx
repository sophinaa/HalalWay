import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Map</Text>
        <Text style={styles.subtitle}>Halal spots near you (placeholder).</Text>
        <Text style={styles.body}>
          Soon this screen will show an interactive map with favourite markers, filters, and live
          location support. For now, head over to the data tabs to explore curated lists.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
  },
  body: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
});
