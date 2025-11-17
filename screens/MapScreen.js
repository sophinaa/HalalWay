import React from 'react';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

import restaurants from '../data/dundeeStAndrewsRestaurants';

const MapScreen = ({ navigation, route }) => {
  const mapRef = useRef(null);
  const focusRestaurantId = route?.params?.focusRestaurantId;
  const initialRegion = {
    latitude: 56.455,
    longitude: -2.97,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  const handleMarkerPress = restaurant => {
    if (navigation?.navigate) {
      navigation.navigate('RestaurantDetails', { restaurantId: restaurant.id });
    }
  };

  useEffect(() => {
    if (!focusRestaurantId || !mapRef.current) return;
    const target = restaurants.find(r => r.id === focusRestaurantId);
    if (!target?.location?.lat || !target?.location?.lng) return;
    mapRef.current.animateToRegion(
      {
        latitude: target.location.lat,
        longitude: target.location.lng,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      800,
    );
  }, [focusRestaurantId]);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion}>
        {restaurants
          .filter(r => r.location?.lat && r.location?.lng)
          .map(r => (
            <Marker
              key={r.id}
              coordinate={{
                latitude: r.location.lat,
                longitude: r.location.lng,
              }}
            >
              <View style={styles.markerOuter}>
                <View
                  style={[
                    styles.markerInner,
                    r.halalInfo?.overallStatus === 'all-halal'
                      ? styles.markerAllHalal
                      : styles.markerOther,
                  ]}
                />
              </View>
              <Callout onPress={() => handleMarkerPress(r)}>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{r.name}</Text>
                  <Text style={styles.calloutMeta}>
                    {r.city}
                    {r.address?.postcode ? ` · ${r.address.postcode}` : ''}
                  </Text>
                  <Text style={styles.calloutText}>
                    Halal: {r.halalInfo?.overallStatus || 'unknown'}
                  </Text>
                  <Text style={styles.calloutText}>
                    Alcohol: {r.alcoholInfo?.servesAlcohol ? 'Yes' : 'No'}
                  </Text>
                  <Text style={styles.calloutLink}>Tap for details →</Text>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  markerOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  markerAllHalal: {
    backgroundColor: '#059669',
  },
  markerOther: {
    backgroundColor: '#6b7280',
  },
  callout: {
    maxWidth: 220,
    gap: 2,
  },
  calloutTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#0f172a',
  },
  calloutMeta: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 12,
    color: '#111827',
  },
  calloutLink: {
    fontSize: 12,
    color: '#059669',
    marginTop: 4,
    fontWeight: '600',
  },
});

export default MapScreen;
