import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';

import { HALAL_RESTAURANTS, Restaurant } from '@/constants/restaurants';

const INITIAL_REGION: Region = {
  latitude: 54.5,
  longitude: -2.5,
  latitudeDelta: 7.5,
  longitudeDelta: 4.5,
};

export default function MapScreen() {
  const [selectedRestaurant, setSelectedRestaurant] = React.useState<Restaurant | null>(
    HALAL_RESTAURANTS[0] ?? null,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_DEFAULT}
          initialRegion={INITIAL_REGION}
          style={StyleSheet.absoluteFillObject}
          showsUserLocation
          showsCompass
          showsScale
        >
          {HALAL_RESTAURANTS.map(restaurant => (
            <Marker
              key={restaurant.id}
              coordinate={restaurant.coordinates}
              title={restaurant.name}
              description={restaurant.description}
              pinColor={selectedRestaurant?.id === restaurant.id ? '#16a34a' : '#0ea5e9'}
              onPress={() => setSelectedRestaurant(restaurant)}
            />
          ))}
        </MapView>
        <View style={styles.mapOverlay}>
          <Text style={styles.overlayTitle}>Map</Text>
          <Text style={styles.overlaySubtitle}>Halal spots near you</Text>
          <Text style={styles.overlayBody}>
            Replace this placeholder with a live map once location permissions, restaurant APIs,
            and clustering are configured.
          </Text>
        </View>
      </View>
      <View style={styles.detailSheet}>
        <View style={styles.detailHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>{selectedRestaurant?.name ?? 'Select a spot'}</Text>
            {selectedRestaurant ? (
              <Text style={styles.detailMeta}>
                {selectedRestaurant.city} · {selectedRestaurant.price} ·{' '}
                {selectedRestaurant.rating.toFixed(1)} ★
              </Text>
            ) : null}
          </View>
          {selectedRestaurant ? (
            <View style={styles.timeChip}>
              <MaterialIcons name="directions-walk" color="#16a34a" size={16} />
              <Text style={styles.timeChipText}>{selectedRestaurant.distanceMinutes} min</Text>
            </View>
          ) : null}
        </View>
        {selectedRestaurant ? (
          <>
            <Text style={styles.detailBody}>{selectedRestaurant.description}</Text>
            <View style={styles.tagRow}>
              {selectedRestaurant.tags.map(tag => (
                <Text style={styles.detailTag} key={tag}>
                  {tag}
                </Text>
              ))}
            </View>
            <View style={styles.futureBlock}>
              <Text style={styles.futureHeading}>Up next</Text>
              <Text style={styles.futureItem}>
                • Integrate react-native-maps with live location permissions.
              </Text>
              <Text style={styles.futureItem}>• Fetch halal places from a backend API.</Text>
              <Text style={styles.futureItem}>• Tap a marker to view menus, reviews, and photos.</Text>
            </View>
          </>
        ) : (
          <Text style={styles.detailBody}>Tap on a marker to preview restaurant details.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mapWrapper: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    gap: 4,
  },
  overlayTitle: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '700',
  },
  overlaySubtitle: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
  },
  overlayBody: {
    color: '#e2e8f0',
    fontSize: 13,
  },
  detailSheet: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    gap: 12,
  },
  detailHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  detailMeta: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
  detailBody: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailTag: {
    borderRadius: 9999,
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ecfdf5',
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
  },
  futureBlock: {
    marginTop: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    gap: 8,
  },
  futureHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  futureItem: {
    color: '#475569',
    fontSize: 13,
  },
});
