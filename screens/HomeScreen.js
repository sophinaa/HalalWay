import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import restaurants from '../data/dundeeStAndrewsRestaurants';
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
  const { favourites } = useFavourites();
  const { theme, themeColors } = useThemePreference();
  const isDark = theme === 'dark';

  const filteredRestaurants = useMemo(() => {
    switch (filterMode) {
      case 'all-halal':
        return restaurants.filter(r => r.halalInfo?.overallStatus === 'all-halal');
      case 'no-alcohol':
        return restaurants.filter(r => r.alcoholInfo?.servesAlcohol === false);
      case 'favourites':
        return restaurants.filter(r => favourites.includes(r.id));
      default:
        return restaurants;
    }
  }, [filterMode, favourites]);

  const renderItem = ({ item }) => (
    <RestaurantCard
      item={item}
      themeColors={themeColors}
      onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: item.id })}
      onViewMap={() => navigation.navigate('MapTab', { focusRestaurantId: item.id })}
    />
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { backgroundColor: themeColors.background }]}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: themeColors.textPrimary }]}>HalalWay</Text>
              <Text style={[styles.subtitle, { color: themeColors.accent }]}>
                Discover halal restaurants across Dundee & St Andrews.
              </Text>
              <Text style={[styles.body, { color: themeColors.textSecondary }]}>
                Use filters to focus on all-halal venues, alcohol-free spaces, or browse everything
                verified so far.
              </Text>
            </View>
            <View style={styles.filterBar}>
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
  body: {
    fontSize: 14,
    lineHeight: 20,
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
});
