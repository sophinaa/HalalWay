import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import restaurants from '../data/dundeeStAndrewsRestaurants';
import { useAuth } from '../contexts/AuthContext';
import { useFavourites } from '../contexts/FavouritesContext';
import { useThemePreference } from '../contexts/ThemeContext';

const RestaurantDetailsScreen = ({ route }) => {
  const { restaurantId } = route.params;
  const { addFavourite, removeFavourite, isFavourite } = useFavourites();
  const { username: authUsername, user: authUser } = useAuth();
  const { themeColors } = useThemePreference();
  const backgroundColor = themeColors.background;
  const primaryText = themeColors.textPrimary;
  const secondaryText = themeColors.textSecondary;
  const [distanceMiles, setDistanceMiles] = useState(null);
  const [distanceError, setDistanceError] = useState(null);
  const [reviewsState, setReviewsState] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewPhoto, setReviewPhoto] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const restaurant = useMemo(() => restaurants.find(r => r.id === restaurantId), [restaurantId]);

  const reviewsStorageKey = `restaurantReviews:${restaurantId}`;

  useEffect(() => {
    let isMounted = true;
    const loadReviews = async () => {
      try {
        const stored = await AsyncStorage.getItem(reviewsStorageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && isMounted) {
            setReviewsState(parsed);
            return;
          }
        }
        if (isMounted) {
          setReviewsState(Array.isArray(restaurant?.reviews) ? restaurant.reviews : []);
        }
      } catch {
        if (isMounted) {
          setReviewsState(Array.isArray(restaurant?.reviews) ? restaurant.reviews : []);
        }
      } finally {
        if (isMounted) setLoadingReviews(false);
      }
    };
    loadReviews();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewsStorageKey]);

  const persistReviews = async next => {
    setReviewsState(next);
    try {
      await AsyncStorage.setItem(reviewsStorageKey, JSON.stringify(next));
    } catch {
      // ignore for now
    }
  };

  const handlePickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.IMAGE],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length) {
        setReviewPhoto(result.assets[0].uri);
      }
    } catch {
      // ignore
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: [ImagePicker.MediaType.IMAGE],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.length) {
        setReviewPhoto(result.assets[0].uri);
      }
    } catch {
      // ignore
    }
  };

  const choosePhotoSource = () => {
    Alert.alert('Add photo', 'Choose how to add a photo to your review.', [
      { text: 'Take photo', onPress: handleTakePhoto },
      { text: 'Choose from library', onPress: handlePickPhoto },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmitReview = async () => {
    if (submittingReview) return;
    setSubmittingReview(true);
    try {
      await Haptics.selectionAsync();
      const trimmed = reviewText.trim();
      const reviewerName =
        authUsername ||
        authUser?.displayName ||
        authUser?.email?.split('@')[0] ||
        'You';

      const newReview = {
        id: `${Date.now()}`,
        user: reviewerName,
        text: trimmed || 'No comment provided.',
        rating: reviewRating,
        photo: reviewPhoto || null,
        createdAt: new Date().toISOString(),
      };
      const next = [newReview, ...reviewsState];
      await persistReviews(next);
      setReviewText('');
      setReviewPhoto(null);
      setReviewRating(5);
    } finally {
      setSubmittingReview(false);
    }
  };

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

  const renderStars = value =>
    Array.from({ length: 5 }).map((_, idx) => (
      <Text
        key={idx}
        style={[
          styles.star,
          { color: idx < value ? themeColors.accent : themeColors.muted },
        ]}
      >
        ★
      </Text>
    ));

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

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: primaryText }]}>Reviews</Text>
        <View style={[styles.reviewCard, { borderColor: themeColors.border }]}>
          <Text style={[styles.inputLabel, { color: secondaryText }]}>Rate</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(val => (
              <TouchableOpacity key={val} onPress={() => setReviewRating(val)} style={styles.starButton}>
                <Text
                  style={[
                    styles.star,
                    { color: val <= reviewRating ? themeColors.accent : themeColors.muted },
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.inputLabel, { color: secondaryText }]}>Share your experience</Text>
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="Add a quick note..."
            placeholderTextColor={themeColors.inputPlaceholder}
            multiline
            style={[
              styles.reviewInput,
              {
                color: primaryText,
                borderColor: themeColors.border,
                backgroundColor: themeColors.card,
              },
            ]}
          />
          {reviewPhoto ? (
            <View style={styles.photoPreviewRow}>
              <Image source={{ uri: reviewPhoto }} style={styles.photoPreview} />
              <TouchableOpacity onPress={() => setReviewPhoto(null)}>
                <Text style={[styles.clearPhoto, { color: themeColors.accent }]}>Remove photo</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={styles.reviewActions}>
            <TouchableOpacity
              style={[styles.photoButton, { borderColor: themeColors.border }]}
              onPress={choosePhotoSource}
            >
              <Text style={[styles.photoButtonText, { color: themeColors.textPrimary }]}>Add photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: themeColors.accent, opacity: submittingReview ? 0.7 : 1 },
              ]}
              onPress={handleSubmitReview}
              disabled={submittingReview}
            >
              <Text style={[styles.submitButtonText, { color: themeColors.accentContrast }]}>
                Post review
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.reviewHint, { color: themeColors.muted }]}>
            Reviews are stored on this device for now.
          </Text>
        </View>

        {loadingReviews ? (
          <Text style={[styles.text, { color: secondaryText }]}>Loading reviews...</Text>
        ) : reviewsState.length === 0 ? (
          <Text style={[styles.text, { color: secondaryText }]}>No reviews yet. Be the first!</Text>
        ) : (
          reviewsState.map(review => (
            <View key={review.id} style={[styles.userReview, { borderColor: themeColors.border }]}>
              <View style={styles.reviewHeader}>
                <Text style={[styles.reviewUser, { color: primaryText }]}>{review.user || 'Guest'}</Text>
                <View style={styles.reviewStars}>{renderStars(review.rating || 0)}</View>
              </View>
              <Text style={[styles.text, { color: secondaryText }]}>{review.text}</Text>
              {review.photo ? <Image source={{ uri: review.photo }} style={styles.reviewImage} /> : null}
            </View>
          ))
        )}
      </View>
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
  star: { fontSize: 18, marginHorizontal: 2 },
  starRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  starButton: { padding: 4 },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  inputLabel: { fontSize: 13, fontWeight: '600' },
  reviewInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  photoButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
    alignItems: 'center',
  },
  photoButtonText: { fontWeight: '600' },
  submitButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flex: 1,
    alignItems: 'center',
  },
  submitButtonText: { fontWeight: '700' },
  reviewHint: { fontSize: 12, marginTop: 4 },
  userReview: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    gap: 6,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewUser: { fontWeight: '700' },
  reviewStars: { flexDirection: 'row', alignItems: 'center' },
  reviewImage: { width: '100%', height: 160, borderRadius: 10, marginTop: 4 },
  photoPreviewRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  photoPreview: { width: 80, height: 60, borderRadius: 8 },
  clearPhoto: { fontSize: 13, fontWeight: '600' },
});

export default RestaurantDetailsScreen;
