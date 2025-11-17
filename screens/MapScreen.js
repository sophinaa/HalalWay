import React from 'react';
import { View, StyleSheet } from 'react-native';
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
              title={restaurant.name}
              description={`${restaurant.city} · ${restaurant.halalInfo?.overallStatus ?? 'unknown halal'}`}
              onPress={() => handleMarkerPress(restaurant)}
            />
          ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default MapScreen;
