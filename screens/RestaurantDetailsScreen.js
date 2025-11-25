import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';

import restaurants from '../data/dundeeStAndrewsRestaurants';
import { useFavourites } from '../contexts/FavouritesContext';
import { useThemePreference } from '../contexts/ThemeContext';

const RestaurantDetailsScreen = ({ route }) => {
  const { restaurantId } = route.params;
  const { addFavourite, removeFavourite, isFavourite } = useFavourites();
  const { themeColors } = useThemePreference();
  const backgroundColor = themeColors.background;
  const primaryText = themeColors.textPrimary;
  const secondaryText = themeColors.textSecondary;
  const [distanceMiles, setDistanceMiles] = useState(null);
  const [distanceError, setDistanceError] = useState(null);

  const restaurant = useMemo(() => restaurants.find(r => r.id === restaurantId), [restaurantId]);

  useEffect(() => {
    let isMounted = true;
    let locationWatcher;
    const toRad = deg => (deg * Math.PI) / 180;
    const calculateDistance = (a, b) => {
      const R = 6371;
      const dLat = toRad(b.lat - a.lat);
      const dLon = toRad(b.lng - a.lng);
      const lat1 = toRad(a.lat);
      const lat2 = toRad(b.lat);
      const h =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
      return (R * c) * 0.621371;
    };

    const fetchDistance = async () => {
      if (!restaurant?.location?.lat || !restaurant?.location?.lng) {
        return;
      }
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) setDistanceError('Location permission denied');
          return;
        }
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const updateFromCoords = coords => {
          if (!isMounted) return;
          const miles = calculateDistance(
            { lat: coords.latitude, lng: coords.longitude },
            { lat: restaurant.location.lat, lng: restaurant.location.lng },
          );
          setDistanceMiles(miles);
          setDistanceError(null);
        };

        updateFromCoords(position.coords);

        locationWatcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 100,
            timeInterval: 10000,
          },
          pos => updateFromCoords(pos.coords),
        );
      } catch (err) {
        if (isMounted) {
          setDistanceError('Unable to determine distance');
        }
      }
    };

    fetchDistance();
    return () => {
      isMounted = false;
      locationWatcher?.remove?.();
    };
  }, [restaurant]);

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text>Restaurant not found.</Text>
      </View>
    );
  }

  const favourite = isFavourite(restaurantId);

  const {
    name,
    city,
    area,
    address,
    halalInfo,
    alcoholInfo,
    openingHours,
    tags,
    serviceOptions,
    reviews,
    cuisine,
    priceRange,
  } = restaurant;

  const toggleFavourite = async () => {
    await Haptics.selectionAsync();
    if (favourite) {
      removeFavourite(restaurantId);
    } else {
      addFavourite(restaurantId);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} contentContainerStyle={styles.content}>
      <Text style={[styles.name, { color: primaryText }]}>{name}</Text>
      <Text style={[styles.subtitle, { color: secondaryText }]}>
        {cuisine} {priceRange ? `· ${priceRange}` : ''}
      </Text>

      <Text style={[styles.location, { color: secondaryText }]}>
        {city} {area ? `· ${area}` : ''}
        {'\n'}
        {address?.line1}
        {'\n'}
        {address?.postcode}
        {'\n'}
        {distanceMiles != null
          ? `${distanceMiles.toFixed(1)} miles away`
          : distanceError || 'Distance unavailable'}
      </Text>

      <TouchableOpacity
        onPress={toggleFavourite}
        style={[
          styles.favButton,
          { backgroundColor: favourite ? '#dc2626' : themeColors.accent },
        ]}
      >
        <Text style={[styles.favButtonText, { color: themeColors.accentContrast }]}>
          {favourite ? 'Remove from favourites' : 'Add to favourites ⭐'}
        </Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: primaryText }]}>Halal & Alcohol</Text>
        <Text style={[styles.text, { color: secondaryText }]}>Halal status: {halalInfo?.overallStatus || 'unknown'}</Text>
        <Text style={[styles.text, { color: secondaryText }]}>
          Chicken halal: {halalInfo?.chickenHalal ? 'Yes' : 'No / Unknown'}
        </Text>
        <Text style={[styles.text, { color: secondaryText }]}>
          Red meat halal: {halalInfo?.redMeatHalal ? 'Yes' : 'No / Unknown'}
        </Text>
        <Text style={[styles.text, { color: secondaryText }]}>Pork served: {halalInfo?.porkServed ? 'Yes' : 'No'}</Text>
        <Text style={[styles.text, { color: secondaryText }]}>
          Alcohol served: {alcoholInfo?.servesAlcohol ? 'Yes' : 'No'}
        </Text>
        {halalInfo?.notes ? <Text style={[styles.text, { color: secondaryText }]}>Notes: {halalInfo.notes}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: primaryText }]}>Opening Hours</Text>
        {openingHours && typeof openingHours === 'object' ? (
          Object.entries(openingHours).map(([dayKey, slots]) => {
            const label = String(dayKey);

            let slotText = 'Not available';
            if (Array.isArray(slots) && slots.length > 0) {
              const validSlots = slots.filter(
                slot => slot && typeof slot.open === 'string' && typeof slot.close === 'string',
              );
              if (validSlots.length > 0) {
                slotText = validSlots.map(slot => `${slot.open}–${slot.close}`).join(', ');
              }
            }

            return (
              <Text key={dayKey} style={[styles.text, { color: secondaryText }]}>
                {label}: {slotText}
              </Text>
            );
          })
        ) : (
          <Text style={[styles.text, { color: secondaryText }]}>Hours not available</Text>
        )}
      </View>

      {tags && tags.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: primaryText }]}>Tags</Text>
          <Text style={[styles.text, { color: secondaryText }]}>{tags.join(' · ')}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: primaryText }]}>Service Options</Text>
        <Text style={[styles.text, { color: secondaryText }]}>
          {serviceOptions && serviceOptions.length > 0 ? serviceOptions.join(' · ') : 'Not available'}
        </Text>
      </View>

      {reviews && reviews.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: primaryText }]}>Reviews</Text>
          {reviews.map(review => (
            <Text key={review.id} style={[styles.text, { color: secondaryText }]}>
              {review.user}: {review.text}
            </Text>
          ))}
          <Text style={[styles.reviewNote, { color: secondaryText }]}>
            (Reviews stored locally for demo purposes)
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  name: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 6 },
  location: { fontSize: 14, marginBottom: 16 },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  text: { fontSize: 14, marginBottom: 2 },
  reviewNote: { fontSize: 12, marginTop: 4 },
  favButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  favButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default RestaurantDetailsScreen;
