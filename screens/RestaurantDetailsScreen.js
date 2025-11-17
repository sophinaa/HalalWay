import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import restaurants from '../data/dundeeStAndrewsRestaurants';

const RestaurantDetailsScreen = ({ route }) => {
  const { restaurantId } = route.params ?? {};

  const restaurant = useMemo(
    () => restaurants.find(r => r.id === restaurantId),
    [restaurantId],
  );

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text>Restaurant not found.</Text>
      </View>
    );
  }

  const { name, city, area, address, halalInfo, alcoholInfo, openingHours, tags, serviceOptions } =
    restaurant;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.location}>
        {city} {area ? `· ${area}` : ''}
        {'\n'}
        {address?.line1}
        {'\n'}
        {address?.postcode}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Halal & Alcohol</Text>
        <Text style={styles.text}>Halal status: {halalInfo?.overallStatus || 'unknown'}</Text>
        <Text style={styles.text}>
          Chicken halal: {halalInfo?.chickenHalal ? 'Yes' : 'No / Unknown'}
        </Text>
        <Text style={styles.text}>
          Red meat halal: {halalInfo?.redMeatHalal ? 'Yes' : 'No / Unknown'}
        </Text>
        <Text style={styles.text}>Pork served: {halalInfo?.porkServed ? 'Yes' : 'No'}</Text>
        <Text style={styles.text}>
          Alcohol served: {alcoholInfo?.servesAlcohol ? 'Yes' : 'No'}
        </Text>
        {halalInfo?.notes ? <Text style={styles.text}>Notes: {halalInfo.notes}</Text> : null}
      </View>

      {openingHours ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opening Hours</Text>
          {Object.entries(openingHours).map(([day, slots]) => (
            <Text key={day} style={styles.text}>
              {day.charAt(0).toUpperCase() + day.slice(1)}:{' '}
              {Array.isArray(slots) && slots.length > 0
                ? slots.map(slot => `${slot.open}–${slot.close}`).join(', ')
                : 'Not available'}
            </Text>
          ))}
        </View>
      ) : null}

      {tags?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <Text style={styles.text}>{tags.join(' · ')}</Text>
        </View>
      ) : null}

      {serviceOptions?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Options</Text>
          <Text style={styles.text}>{serviceOptions.join(' · ')}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RestaurantDetailsScreen;
