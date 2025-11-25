import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  const restaurant = useMemo(() => restaurants.find(r => r.id === restaurantId), [restaurantId]);

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

      {openingHours && typeof openingHours === 'object' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: primaryText }]}>Opening Hours</Text>
          {Object.entries(openingHours).map(([dayKey, slots]) => {
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
          })}
        </View>
      )}

      {tags && tags.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: primaryText }]}>Tags</Text>
          <Text style={[styles.text, { color: secondaryText }]}>{tags.join(' · ')}</Text>
        </View>
      )}

      {serviceOptions && serviceOptions.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: primaryText }]}>Service Options</Text>
          <Text style={[styles.text, { color: secondaryText }]}>{serviceOptions.join(' · ')}</Text>
        </View>
      )}

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
