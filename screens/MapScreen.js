import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import restaurants from '../data/dundeeStAndrewsRestaurants';

const MapScreen = ({ navigation }) => {
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

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {restaurants
          .filter(r => r.location?.lat && r.location?.lng)
          .map(restaurant => (
            <Marker
              key={restaurant.id}
              coordinate={{
                latitude: restaurant.location.lat,
                longitude: restaurant.location.lng,
              }}
              onPress={() => handleMarkerPress(restaurant)}
            >
              <View style={styles.markerOuter}>
                <View
                  style={[
                    styles.markerInner,
                    restaurant.halalInfo?.overallStatus === 'all-halal'
                      ? styles.markerAllHalal
                      : styles.markerOther,
                  ]}
                />
              </View>
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
});

export default MapScreen;
