import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';

import restaurants from '../data/dundeeStAndrewsRestaurants';
import { useThemePreference } from '../contexts/ThemeContext';
import { useFavourites } from '../contexts/FavouritesContext';

const defaultRegion = {
  latitude: 56.46,
  longitude: -2.97,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const FilterChip = ({ label, active, onPress, themeColors }) => (
  <TouchableOpacity
    style={[
      styles.chip,
      { borderColor: themeColors.border, backgroundColor: themeColors.card },
      active && { backgroundColor: themeColors.accent, borderColor: themeColors.accent },
    ]}
    onPress={onPress}
    activeOpacity={0.85}
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

const MapScreen = () => {
  const insets = useSafeAreaInsets();
  const { themeColors } = useThemePreference();
  const { favourites } = useFavourites();
  const navigation = useNavigation();
  const route = useRoute();
  const mapRef = useRef(null);
  const bottomListViewability = useRef({ itemVisiblePercentThreshold: 60 });
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [filterMode, setFilterMode] = useState('all');
  const [isFilterPending, startFilterTransition] = useTransition();

  const restaurantsWithLocation = useMemo(
    () => restaurants.filter(r => r?.location?.lat != null && r?.location?.lng != null),
    [],
  );
  const deferredFilterMode = useDeferredValue(filterMode);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showBottomList, setShowBottomList] = useState(false);
  const filteredRestaurants = useMemo(() => {
    switch (deferredFilterMode) {
      case 'all-halal':
        return restaurantsWithLocation.filter(r => r.halalInfo?.overallStatus === 'all-halal');
      case 'no-alcohol':
        return restaurantsWithLocation.filter(r => r.alcoholInfo?.servesAlcohol === false);
      case 'favourites':
        return restaurantsWithLocation.filter(r => favourites.includes(r.id));
      default:
        return restaurantsWithLocation;
    }
  }, [deferredFilterMode, favourites, restaurantsWithLocation]);
  const [selectedId, setSelectedId] = useState(filteredRestaurants[0]?.id ?? null);

  const selectedRestaurant =
    filteredRestaurants.find(r => r.id === selectedId) ??
    filteredRestaurants[0] ??
    restaurantsWithLocation[0];
  const carouselData = useMemo(
    () => [{ id: 'map-only', mapOnly: true }, ...filteredRestaurants],
    [filteredRestaurants],
  );

  const initialRegion =
    selectedRestaurant && selectedRestaurant.location
      ? {
          latitude: selectedRestaurant.location.lat,
          longitude: selectedRestaurant.location.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : defaultRegion;

  const focusOnRestaurant = useCallback(
    restaurant => {
      if (!restaurant?.location) {
        return;
      }
      setSelectedId(restaurant.id);
      if (!mapReady || !mapRef.current) {
        return;
      }
      const region = {
        latitude: restaurant.location.lat,
        longitude: restaurant.location.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      requestAnimationFrame(() => {
        mapRef.current?.animateToRegion?.(region, 500);
      });
    },
    [mapReady],
  );
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (isFilterPending) {
        return;
      }
      const firstRestaurant = viewableItems?.find(v => v.item && !v.item.mapOnly)?.item;
      if (firstRestaurant) {
        focusOnRestaurant(firstRestaurant);
      }
    },
    [focusOnRestaurant, isFilterPending],
  );

  useEffect(() => {
    if (filteredRestaurants.length === 0) {
      setSelectedId(null);
      setShowBottomList(false);
      return;
    }
    const stillVisible = filteredRestaurants.some(r => r.id === selectedId);
    if (!stillVisible) {
      setSelectedId(filteredRestaurants[0].id);
    }
  }, [filteredRestaurants, selectedId]);

  useEffect(() => {
    const focusRestaurantId = route?.params?.focusRestaurantId;
    if (focusRestaurantId) {
      const target = restaurantsWithLocation.find(r => r.id === focusRestaurantId);
      if (target) {
        setFilterMode('all');
        focusOnRestaurant(target);
      }
      navigation.setParams?.({ focusRestaurantId: undefined });
    }
  }, [
    focusOnRestaurant,
    navigation,
    restaurantsWithLocation,
    route?.params?.focusRestaurantId,
  ]);

  const handleFilterChange = mode => {
    startFilterTransition(() => setFilterMode(mode));
    setShowBottomList(false);
  };

  const handleOpenMaps = (restaurant, provider) => {
    if (!restaurant?.location) {
      return;
    }
    const { lat, lng } = restaurant.location;
    const url =
      provider === 'apple'
        ? `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(restaurant.name)}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => {
      // eslint-disable-next-line no-console
      console.warn('Unable to open maps for this location');
    });
  };

  const renderLocationCard = ({ item }) => {
    const isActive = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[
          styles.locationCard,
          {
            backgroundColor: themeColors.card,
            borderColor: isActive ? themeColors.accent : themeColors.border,
          },
        ]}
        onPress={() => focusOnRestaurant(item)}
        activeOpacity={0.9}
      >
        <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]}>{item.name}</Text>
        <Text style={[styles.cardSubtitle, { color: themeColors.textSecondary }]}>
          {item.cuisine || 'Restaurant'} · {item.city}
        </Text>
        <Text style={[styles.cardMeta, { color: themeColors.muted }]}>
          {item.address?.line1 || ''} {item.address?.postcode ? `· ${item.address.postcode}` : ''}
        </Text>
        <View style={styles.actionsRow}>
          <Text style={[styles.statusText, { color: themeColors.textSecondary }]}>
            Halal: {item.halalInfo?.overallStatus ?? 'unknown'}
          </Text>
          <View style={styles.mapButtonsRow}>
            <TouchableOpacity
              style={[
                styles.openMapsChip,
                { borderColor: themeColors.accent, backgroundColor: themeColors.card },
              ]}
              onPress={() => handleOpenMaps(item, 'google')}
              activeOpacity={0.8}
            >
              <Text style={[styles.openMapsText, { color: themeColors.accent }]}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.openMapsChip,
                { borderColor: themeColors.accent, backgroundColor: themeColors.card },
              ]}
              onPress={() => handleOpenMaps(item, 'apple')}
              activeOpacity={0.8}
            >
              <Text style={[styles.openMapsText, { color: themeColors.accent }]}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (restaurantsWithLocation.length === 0) {
    return (
      <View style={[styles.safeArea, { backgroundColor: themeColors.background, paddingTop: insets.top }]}>
        <View style={styles.headerBlock}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Halal Map</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            No restaurants with coordinates available yet.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: themeColors.background, paddingTop: insets.top }]}>
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Explore the map</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Tap a pin or choose from the list to see restaurant details. Use Open in Maps for turn-by-turn
            directions.
          </Text>
        </View>
        <View style={styles.filterBar}>
          <FilterChip
            label="All"
            active={filterMode === 'all'}
            onPress={() => handleFilterChange('all')}
            themeColors={themeColors}
          />
          <FilterChip
            label="All-halal"
            active={filterMode === 'all-halal'}
            onPress={() => handleFilterChange('all-halal')}
            themeColors={themeColors}
          />
          <FilterChip
            label="No alcohol"
            active={filterMode === 'no-alcohol'}
            onPress={() => handleFilterChange('no-alcohol')}
            themeColors={themeColors}
          />
          <FilterChip
            label="Favourites"
            active={filterMode === 'favourites'}
            onPress={() => handleFilterChange('favourites')}
            themeColors={themeColors}
          />
        </View>
        <View
          style={[
            styles.mapWrapper,
            mapExpanded && styles.mapExpanded,
            { backgroundColor: themeColors.card, borderColor: themeColors.border },
          ]}
        >
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={initialRegion}
            onMapReady={() => setMapReady(true)}
            onError={evt => setMapError(evt?.nativeEvent?.errorMessage || 'Map unavailable')}
          >
            {filteredRestaurants.map(restaurant => {
              if (!restaurant?.location) return null;
              const isActive = restaurant.id === selectedId;
              return (
                <Marker
                  key={restaurant.id}
                  coordinate={{
                    latitude: restaurant.location.lat,
                    longitude: restaurant.location.lng,
                  }}
                  onPress={() => focusOnRestaurant(restaurant)}
                >
                  <View
                    style={[
                      styles.markerOuter,
                      {
                        borderColor: isActive ? themeColors.accent : themeColors.border,
                        backgroundColor: themeColors.background,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.markerInner,
                        {
                          backgroundColor: isActive ? themeColors.accent : themeColors.textSecondary,
                        },
                      ]}
                    />
                  </View>
                </Marker>
              );
            })}
          </MapView>
          {(isFilterPending || !mapReady || mapError || filteredRestaurants.length === 0) && (
            <View style={styles.mapFallback}>
              <View
                style={[
                  styles.mapFallbackCard,
                  { backgroundColor: themeColors.card, borderColor: themeColors.border },
                ]}
              >
                <Text style={[styles.mapFallbackTitle, { color: themeColors.textPrimary }]}>
                  {mapError
                    ? 'Map unavailable right now'
                    : filteredRestaurants.length === 0
                    ? 'No places for this filter'
                    : !mapReady
                    ? 'Loading map...'
                    : 'Updating map...'}
                </Text>
                <Text style={[styles.mapFallbackSubtitle, { color: themeColors.textSecondary }]}>
                  {mapError
                    ? 'Please retry in a moment.'
                    : filteredRestaurants.length === 0
                    ? 'Try a different filter to see nearby spots.'
                    : 'We will show pins as soon as the data is ready.'}
                </Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.mapToggle,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
            activeOpacity={0.85}
            onPress={() =>
              setMapExpanded(prev => {
                const next = !prev;
                if (next) setShowBottomList(false);
                return next;
              })
            }
          >
            <Text style={[styles.mapToggleText, { color: themeColors.textPrimary }]}>
              {mapExpanded ? 'Collapse map' : 'Expand map'}
            </Text>
          </TouchableOpacity>
          {mapExpanded && !showBottomList && filteredRestaurants.length > 0 ? (
            <TouchableOpacity
              style={[
                styles.showOptionsButton,
                { backgroundColor: themeColors.card, borderColor: themeColors.border },
              ]}
              onPress={() => setShowBottomList(true)}
              activeOpacity={0.85}
            >
              <Text style={[styles.showOptionsText, { color: themeColors.textPrimary }]}>Show options</Text>
            </TouchableOpacity>
          ) : null}
          {mapExpanded && filteredRestaurants.length > 0 && showBottomList ? (
            <View
              style={[
                styles.bottomCarousel,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <FlatList
                data={carouselData}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bottomListContent}
                renderItem={({ item }) => {
                  if (item.mapOnly) {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.bottomCard,
                          styles.mapOnlyCard,
                          {
                            borderColor: themeColors.border,
                            backgroundColor: themeColors.background,
                          },
                        ]}
                        onPress={() => setShowBottomList(false)}
                        activeOpacity={0.9}
                      >
                        <Text style={[styles.bottomCardTitle, { color: themeColors.textPrimary }]}>
                          View full map
                        </Text>
                        <Text style={[styles.bottomCardMeta, { color: themeColors.textSecondary }]}>
                          Hide options to see the whole map
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  const active = item.id === selectedId;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.bottomCard,
                        {
                          borderColor: active ? themeColors.accent : themeColors.border,
                          backgroundColor: themeColors.background,
                        },
                      ]}
                      onPress={() => focusOnRestaurant(item)}
                      activeOpacity={0.9}
                    >
                      <Text style={[styles.bottomCardTitle, { color: themeColors.textPrimary }]} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={[styles.bottomCardMeta, { color: themeColors.textSecondary }]} numberOfLines={1}>
                        {item.cuisine || 'Restaurant'} · {item.city}
                      </Text>
                      <Text style={[styles.bottomCardMeta, { color: themeColors.muted }]} numberOfLines={1}>
                        Halal: {item.halalInfo?.overallStatus ?? 'unknown'}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={bottomListViewability.current}
              />
            </View>
          ) : null}
        </View>
        {!mapExpanded ? (
          filteredRestaurants.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
                No restaurants match this filter yet.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredRestaurants}
              keyExtractor={item => item.id}
              renderItem={renderLocationCard}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 0,
    gap: 16,
  },
  headerBlock: {
    paddingTop: 16,
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mapWrapper: {
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  mapExpanded: {
    flex: 1,
    height: undefined,
  },
  bottomCarousel: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  bottomListContent: {
    gap: 8,
    paddingHorizontal: 4,
  },
  bottomCard: {
    width: 220,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  bottomCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bottomCardMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  showOptionsButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  showOptionsText: { fontSize: 12, fontWeight: '700' },
  mapOnlyCard: {
    borderStyle: 'dashed',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 0,
    gap: 12,
  },
  locationCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
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
    marginTop: 4,
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 12,
  },
  mapButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  openMapsChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  openMapsText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    paddingVertical: 32,
    alignItems: 'center',
  },
  markerOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  mapToggle: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  mapToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mapFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  mapFallbackCard: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  mapFallbackTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  mapFallbackSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default MapScreen;
