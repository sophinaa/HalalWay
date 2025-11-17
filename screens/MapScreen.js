import React from 'react';
import { FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import restaurants from '../data/dundeeStAndrewsRestaurants';

export default function MapScreen() {
  const restaurantsWithLocation = restaurants.filter(
    r => r.location && r.location.lat != null && r.location.lng != null,
  );

  const openInMaps = restaurant => {
    const { lat, lng } = restaurant.location;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(err => console.error('Failed to open maps:', err));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>
        {item.cuisine} · {item.city}
      </Text>
      <Text style={styles.detail}>Halal: {item.halalInfo?.overallStatus ?? 'unknown'}</Text>
      <Text style={styles.detail}>Alcohol: {item.alcoholInfo?.servesAlcohol ? 'Yes' : 'No'}</Text>
      <TouchableOpacity style={styles.button} onPress={() => openInMaps(item)}>
        <Text style={styles.buttonText}>Open in Maps</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HalalWay Map</Text>
      <Text style={styles.subtitle}>Tap a restaurant to open it in Google/Apple Maps.</Text>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
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
    color: '#555',
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});
