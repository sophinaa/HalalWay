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

const FilterChip = ({ label, active, onPress, isDark }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      isDark && styles.chipDark,
      active && styles.chipActive,
    ]}
  >
    <Text
      style={[
        styles.chipText,
        isDark && styles.chipTextDark,
        active && styles.chipTextActive,
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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: colors.primaryText ?? '#0f172a' }]}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>
            {item.cuisine || 'Restaurant'} {item.priceRange ? `· ${item.priceRange}` : ''}
          </Text>
          <Text style={styles.cardMeta}>
            {item.city}
            {item.address?.postcode ? ` · ${item.address.postcode}` : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={onViewMap} style={styles.mapChip}>
          <Text style={styles.mapChipText}>Map</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.metaNote}>
        Halal: {halalText} · Alcohol: {alcoholText}
      </Text>

      <View style={styles.tagRow}>
        {tags.slice(0, 3).map(tag => (
          <Text key={tag} style={styles.tag}>
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
  const { theme } = useThemePreference();
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

  const backgroundColor = isDark ? '#0b1120' : '#ffffff';
  const cardBackground = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const primaryText = isDark ? '#f8fafc' : '#0f172a';
  const secondaryText = isDark ? '#cbd5f5' : '#475569';
  const mutedText = isDark ? '#94a3b8' : '#64748b';
  const tagBackground = isDark ? '#1e293b' : '#e2e8f0';
  const tagText = isDark ? '#e2e8f0' : '#0f172a';
  const metaLineColor = isDark ? '#cbd5f5' : '#64748b';
  const themeColors = { cardBackground, borderColor, primaryText, secondaryText, mutedText, tagBackground, tagText, metaLineColor, isDark };

  const renderItem = ({ item }) => (
    <RestaurantCard
      item={item}
      themeColors={themeColors}
      onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: item.id })}
      onViewMap={() => navigation.navigate('MapTab', { focusRestaurantId: item.id })}
    />
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top']}>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: primaryText }]}>HalalWay</Text>
              <Text style={[styles.subtitle, { color: '#16a34a' }]}>
                Discover halal restaurants across Dundee & St Andrews.
              </Text>
              <Text style={[styles.body, { color: secondaryText }]}>
                Use filters to focus on all-halal venues, alcohol-free spaces, or browse everything
                verified so far.
              </Text>
            </View>
            <View style={styles.filterBar}>
              <FilterChip label="All" active={filterMode === 'all'} onPress={() => setFilterMode('all')} isDark={isDark} />
              <FilterChip
                label="All-halal"
                active={filterMode === 'all-halal'}
                onPress={() => setFilterMode('all-halal')}
                isDark={isDark}
              />
              <FilterChip
                label="No alcohol"
                active={filterMode === 'no-alcohol'}
                onPress={() => setFilterMode('no-alcohol')}
                isDark={isDark}
              />
              <FilterChip
                label="Favourites"
                active={filterMode === 'favourites'}
                onPress={() => setFilterMode('favourites')}
                isDark={isDark}
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
    backgroundColor: '#ffffff',
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
    color: '#6b7280',
    marginTop: 2,
  },
  cardMeta: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  tag: {
    fontSize: 11,
    color: '#111827',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginRight: 4,
    marginBottom: 4,
  },
  metaNote: {
    fontSize: 12,
    color: '#111827',
    marginTop: 6,
  },
  mapChip: {
    backgroundColor: '#059669',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
    marginTop: 2,
  },
  mapChipText: {
    color: '#ffffff',
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
    borderColor: '#cbd5f5',
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  chipDark: {
    backgroundColor: '#0b1120',
    borderColor: '#475569',
  },
  chipText: {
    fontSize: 13,
    color: '#0f172a',
  },
  chipTextDark: {
    color: '#e2e8f0',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
