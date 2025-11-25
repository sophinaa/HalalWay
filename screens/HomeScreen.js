import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import restaurants from '../data/dundeeStAndrewsRestaurants';
import { useAuth } from '../contexts/AuthContext';
import { useFavourites } from '../contexts/FavouritesContext';
import { useThemePreference } from '../contexts/ThemeContext';

const formatHalalStatus = status => {
  if (!status || typeof status !== 'string') {
    return 'Unknown';
  }
  return status
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : ''))
    .join(' ');
};

const FilterChip = ({ label, active, onPress, themeColors }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      {
        backgroundColor: themeColors.tagBackground,
        borderColor: themeColors.border,
      },
      active && {
        backgroundColor: themeColors.accent,
        borderColor: themeColors.accent,
      },
    ]}
  >
    <Text
      style={[
        styles.chipText,
        { color: themeColors.textSecondary },
        active && { color: themeColors.accentContrast },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const RestaurantCard = ({ item, onPress, onViewMap, themeColors }) => {
  const colors = themeColors ?? {};
  const halalText =
    item.halalInfo?.overallStatus ||
    (item.halalInfo?.chickenHalal || item.halalInfo?.redMeatHalal ? 'halal-friendly' : 'unknown');
  const alcoholText =
    item.alcoholInfo?.servesAlcohol === true
      ? 'Yes'
      : item.alcoholInfo?.servesAlcohol === false
      ? 'No'
      : 'Unknown';
  const tags = Array.isArray(item.tags) ? item.tags : [];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary ?? '#0f172a' }]}>{item.name}</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary ?? '#6b7280' }]}>
            {item.cuisine || 'Restaurant'} {item.priceRange ? `· ${item.priceRange}` : ''}
          </Text>
          <Text style={[styles.cardMeta, { color: colors.muted ?? '#9ca3af' }]}>
            {item.city}
            {item.address?.postcode ? ` · ${item.address.postcode}` : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onViewMap}
          style={[styles.mapChip, { backgroundColor: colors.accent ?? '#059669' }]}
        >
          <Text style={[styles.mapChipText, { color: colors.accentContrast ?? '#fff' }]}>Map</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.metaNote, { color: colors.textSecondary ?? '#475569' }]}>
        Halal: {halalText} · Alcohol: {alcoholText}
      </Text>
      <Text style={[styles.metaNote, { color: colors.muted ?? '#9ca3af' }]}>
        {item.distanceMiles != null ? `${item.distanceMiles.toFixed(1)} miles away` : 'Distance unavailable'}
      </Text>

      <View style={styles.tagRow}>
        {tags.slice(0, 3).map(tag => (
          <Text
            key={tag}
            style={[
              styles.tag,
              { backgroundColor: colors.tagBackground ?? '#e5e7eb', color: colors.tagText ?? '#111827' },
            ]}
          >
            {tag}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const [filterMode, setFilterMode] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationLabel, setLocationLabel] = useState('Detecting location...');
  const [locationError, setLocationError] = useState(null);
  const [locationCoords, setLocationCoords] = useState(null);
  const searchInputRef = useRef(null);
  const lastGeocodedCoords = useRef(null);
  const { user } = useAuth();
  const { favourites } = useFavourites();
  const { theme, themeColors } = useThemePreference();
  const preferredName =
    (user?.displayName && user.displayName.trim()) ||
    user?.email?.split('@')[0] ||
    'HalalWay user';

  useEffect(() => {
    let isMounted = true;
    let locationWatcher;

    const toRad = deg => (deg * Math.PI) / 180;
    const distanceBetweenMiles = (a, b) => {
      const R = 6371; // km
      const dLat = toRad(b.lat - a.lat);
      const dLon = toRad(b.lng - a.lng);
      const lat1 = toRad(a.lat);
      const lat2 = toRad(b.lat);
      const h =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
      const distanceKm = R * c;
      return distanceKm * 0.621371;
    };

    const updateLabel = async coords => {
      let readable = `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`;
      try {
        const [place] = await Location.reverseGeocodeAsync(coords);
        if (place) {
          const parts = [place.city || place.subregion || place.region, place.country || place.isoCountryCode];
          const formatted = parts.filter(Boolean).join(', ');
          if (formatted) {
            readable = formatted;
          }
        }
      } catch {
        // keep coordinates as fallback
      }

      if (!isMounted) return;
      lastGeocodedCoords.current = { lat: coords.latitude, lng: coords.longitude };
      setLocationLabel(readable);
      setLocationError(null);
    };

    const handlePosition = coords => {
      if (!isMounted) return;
      const current = { lat: coords.latitude, lng: coords.longitude };
      setLocationCoords(current);
      const last = lastGeocodedCoords.current;
      if (!last) {
        updateLabel(coords);
        return;
      }
      const moved = distanceBetweenMiles(current, last);
      if (moved >= 0.25) {
        updateLabel(coords);
      }
    };

    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setLocationError('Location permission denied');
            setLocationLabel('Location permission denied');
          }
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        handlePosition(position.coords);

        locationWatcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 100,
            timeInterval: 10000,
          },
          pos => handlePosition(pos.coords),
        );
      } catch {
        if (isMounted) {
          setLocationError('Unable to fetch location');
          setLocationLabel('Location unavailable');
          setLocationCoords(null);
        }
      }
    };

    fetchLocation();
    return () => {
      isMounted = false;
      locationWatcher?.remove?.();
    };
  }, []);

  const applyQuickFilter = mode => {
    setFilterMode(mode);
  };

  const distanceMiles = (a, b) => {
    const toRad = deg => (deg * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    const distanceKm = R * c;
    return distanceKm * 0.621371;
  };

  const filteredRestaurants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const isSearching = query.length > 0;

    let base;
    if (isSearching) {
      base = restaurants;
    } else {
      if (!locationCoords) {
        return [];
      }
      base = restaurants.filter(r => {
        if (!r.location?.lat || !r.location?.lng) return false;
        const miles = distanceMiles(locationCoords, { lat: r.location.lat, lng: r.location.lng });
        return miles <= 10;
      });
    }

    switch (filterMode) {
      case 'all-halal':
        base = base.filter(r => r.halalInfo?.overallStatus === 'all-halal');
        break;
      case 'no-alcohol':
        base = base.filter(r => r.alcoholInfo?.servesAlcohol === false);
        break;
      case 'favourites':
        base = base.filter(r => favourites.includes(r.id));
        break;
      case 'burgers':
        base = base.filter(r => {
          const cuisine = (r.cuisine || '').toLowerCase();
          const tags = (r.tags || []).map(tag => tag.toLowerCase());
          return (
            cuisine.includes('burger') ||
            cuisine.includes('grill') ||
            tags.some(tag => tag.includes('burger') || tag.includes('grill'))
          );
        });
        break;
      case 'chicken':
        base = base.filter(r => {
          const cuisine = (r.cuisine || '').toLowerCase();
          return cuisine.includes('chicken') || cuisine.includes('peri');
        });
        break;
      case 'indian':
        base = base.filter(r => {
          const cuisine = (r.cuisine || '').toLowerCase();
          const name = (r.name || '').toLowerCase();
          return (
            cuisine.includes('indian') ||
            cuisine.includes('pakistani') ||
            name.includes('tandoori') ||
            name.includes('balti')
          );
        });
        break;
      case 'pizza':
        base = base.filter(r => {
          const cuisine = (r.cuisine || '').toLowerCase();
          return cuisine.includes('pizza') || cuisine.includes('doner');
        });
        break;
      case 'healthy':
        base = base.filter(r => {
          const cuisine = (r.cuisine || '').toLowerCase();
          const tags = (r.tags || []).map(tag => tag.toLowerCase());
          return (
            cuisine.includes('salad') ||
            cuisine.includes('mediterranean') ||
            tags.some(tag => tag.includes('healthy') || tag.includes('vegan'))
          );
        });
        break;
      default:
        break;
    }

    if (!query) {
      return base.map(r => ({
        ...r,
        distanceMiles:
          locationCoords && r.location?.lat && r.location?.lng
            ? distanceMiles(locationCoords, { lat: r.location.lat, lng: r.location.lng })
            : null,
      }));
    }
    return base
      .filter(r => {
        const haystack = [
          r.name || '',
          r.cuisine || '',
          r.city || '',
          r.area || '',
        ...(r.tags || []),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      })
      .map(r => ({
        ...r,
        distanceMiles:
          locationCoords && r.location?.lat && r.location?.lng
            ? distanceMiles(locationCoords, { lat: r.location.lat, lng: r.location.lng })
            : null,
      }));
  }, [filterMode, favourites, searchQuery, locationCoords]);

  const renderItem = ({ item }) => (
    <RestaurantCard
      item={item}
      themeColors={themeColors}
      onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: item.id })}
      onViewMap={() => navigation.navigate('MapTab', { focusRestaurantId: item.id })}
    />
  );

  const isSearching = searchQuery.trim().length > 0;
  const listHeading = isSearching ? 'Search results' : 'Nearby halal places (within 10 miles)';
  const emptyMessage = isSearching
    ? 'No matching restaurants found.'
    : locationCoords
    ? 'No restaurants within 10 miles.'
    : locationError
    ? 'Enable location to see nearby restaurants.'
    : 'Detecting your location...';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { backgroundColor: themeColors.background }]}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>{emptyMessage}</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.greetingBlock}>
              <Text style={[styles.greeting, { color: themeColors.textPrimary }]}>
                Salaam, {preferredName} 👋
              </Text>
              <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
                Find halal food near you
              </Text>
              <Text style={[styles.locationLine, { color: themeColors.muted }]}>
                {locationError ? 'Location unavailable' : `${locationLabel} • Using your location`}
              </Text>
            </View>
            <View style={[styles.primarySearchCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
              <Text style={[styles.primarySearchTitle, { color: themeColors.textPrimary }]}>
                Search for a halal restaurant, cuisine, or city
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.primarySearchInput, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}
                onPress={() => searchInputRef.current?.focus()}
              >
                <Text style={[styles.searchIcon, { color: themeColors.muted }]}>🔍</Text>
                <TextInput
                  ref={searchInputRef}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search restaurants, cuisines..."
                  placeholderTextColor={themeColors.inputPlaceholder}
                  style={[styles.searchInput, { color: themeColors.textPrimary }]}
                  autoCorrect={false}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Text style={[styles.clearText, { color: themeColors.accent }]}>Clear</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fullSearchButton, { backgroundColor: themeColors.accent }]}
                onPress={() => searchInputRef.current?.focus()}
              >
                <Text style={[styles.fullSearchText, { color: themeColors.accentContrast }]}>Open full search</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickRow}>
              {[
                { label: 'Burgers', emoji: '🍔', mode: 'burgers' },
                { label: 'Chicken', emoji: '🍗', mode: 'chicken' },
                { label: 'Indian', emoji: '🍛', mode: 'indian' },
                { label: 'Pizza', emoji: '🍕', mode: 'pizza' },
                { label: 'Healthy', emoji: '🥗', mode: 'healthy' },
                { label: 'No alcohol', emoji: '🕌', mode: 'no-alcohol' },
              ].map(option => (
                <TouchableOpacity
                  key={option.mode}
                  style={[
                    styles.quickButton,
                    {
                      borderColor: themeColors.border,
                      backgroundColor: filterMode === option.mode ? themeColors.accent : themeColors.card,
                    },
                  ]}
                  onPress={() => applyQuickFilter(option.mode)}
                >
                  <Text
                    style={[
                      styles.quickEmoji,
                      filterMode === option.mode && { color: themeColors.accentContrast },
                    ]}
                  >
                    {option.emoji}
                  </Text>
                  <Text
                    style={[
                      styles.quickLabel,
                      { color: filterMode === option.mode ? themeColors.accentContrast : themeColors.textPrimary },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={styles.filterBar}
            >
              <FilterChip
                label="All"
                active={filterMode === 'all'}
                onPress={() => setFilterMode('all')}
                themeColors={themeColors}
              />
              <FilterChip
                label="All-halal"
                active={filterMode === 'all-halal'}
                onPress={() => setFilterMode('all-halal')}
                themeColors={themeColors}
              />
              <FilterChip
                label="No alcohol"
                active={filterMode === 'no-alcohol'}
                onPress={() => setFilterMode('no-alcohol')}
                themeColors={themeColors}
              />
              <FilterChip
                label="Favourites"
                active={filterMode === 'favourites'}
                onPress={() => setFilterMode('favourites')}
                themeColors={themeColors}
              />
            </View>
            <Text style={[styles.listHeading, { color: themeColors.textSecondary }]}>{listHeading}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    gap: 16,
  },
  headerBlock: {
    gap: 16,
    marginBottom: 8,
  },
  header: {
    gap: 12,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickButton: {
    flexBasis: '30%',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  quickLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
  },
  greetingBlock: {
    gap: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
  },
  primarySearchCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  primarySearchTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  primarySearchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  fullSearchButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fullSearchText: {
    fontWeight: '700',
    fontSize: 13,
  },
  locationLine: {
    fontSize: 13,
  },
  card: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  cardMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  tag: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginRight: 4,
    marginBottom: 4,
  },
  metaNote: {
    fontSize: 12,
    marginTop: 6,
  },
  mapChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
    marginTop: 2,
  },
  mapChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  listHeading: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700',
  },
});
