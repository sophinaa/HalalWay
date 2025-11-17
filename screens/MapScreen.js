import React from 'react';
import { FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import restaurants from '../data/dundeeStAndrewsRestaurants';
import { useThemePreference } from '../contexts/ThemeContext';

export default function MapScreen() {
  const { theme } = useThemePreference();
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#0b1120' : '#fff';
  const cardBackground = isDark ? '#1f2937' : '#fff';
  const borderColor = isDark ? '#334155' : '#e5e5e5';
  const primaryText = isDark ? '#f8fafc' : '#111827';
  const secondaryText = isDark ? '#cbd5f5' : '#555';
  const accent = isDark ? '#38bdf8' : '#007AFF';
  const restaurantsWithLocation = restaurants.filter(
    r => r.location && r.location.lat != null && r.location.lng != null,
  );

  const openInMaps = restaurant => {
    const { lat, lng } = restaurant.location;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(err => console.error('Failed to open maps:', err));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
      <Text style={[styles.name, { color: primaryText }]}>{item.name}</Text>
      <Text style={[styles.detail, { color: secondaryText }]}>
        {item.cuisine} · {item.city}
      </Text>
      <Text style={[styles.detail, { color: secondaryText }]}>
        Halal: {item.halalInfo?.overallStatus ?? 'unknown'}
      </Text>
      <Text style={[styles.detail, { color: secondaryText }]}>
        Alcohol: {item.alcoholInfo?.servesAlcohol ? 'Yes' : 'No'}
      </Text>
      <TouchableOpacity style={[styles.button, { borderColor: accent }]} onPress={() => openInMaps(item)}>
        <Text style={[styles.buttonText, { color: accent }]}>Open in Maps</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: primaryText }]}>HalalWay Map</Text>
      <Text style={[styles.subtitle, { color: secondaryText }]}>
        Tap a restaurant to open it in Google/Apple Maps.
      </Text>
      <FlatList
        data={restaurantsWithLocation}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
