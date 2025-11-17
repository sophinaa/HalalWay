import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import restaurants from '../data/dundeeStAndrewsRestaurants';
import { useFavourites } from '../contexts/FavouritesContext';

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
  const tagsToShow = Array.isArray(item.tags) ? item.tags.slice(0, 3) : [];
  const postcode = item?.address?.postcode ?? 'Postcode tbc';
  const addressLine = item?.address?.line1 ?? 'Address coming soon';
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.cardBackground ?? '#fff', borderColor: colors.borderColor ?? '#e2e8f0' },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.cardTitle, { color: colors.primaryText ?? '#0f172a' }]}>{item.name}</Text>
      <Text style={[styles.cardMeta, { color: colors.secondaryText ?? '#475569' }]}>
        {item.cuisine} · {item.city} · {item.priceRange}
      </Text>
      <Text style={[styles.metaLine, { color: colors.metaLineColor ?? '#64748b' }]}>
        {item.city} · {postcode}
      </Text>
      <Text style={[styles.cardBody, { color: colors.secondaryText ?? '#475569' }]}>{addressLine}</Text>
      <View style={styles.tagRow}>
        {tagsToShow.map(tag => (
          <Text
            style={[
              styles.tag,
              { backgroundColor: colors.tagBackground ?? '#e2e8f0', color: colors.tagText ?? '#0f172a' },
            ]}
            key={`${item.id}-${tag}`}
          >
            {tag}
          </Text>
        ))}
      </View>
      <Text style={[styles.metaNote, { color: colors.mutedText ?? '#64748b' }]}>
        Halal: {formatHalalStatus(item.halalInfo?.overallStatus)} · Alcohol:{' '}
        {item.alcoholInfo?.servesAlcohol ? 'Yes' : 'No'}
      </Text>
      <Text style={[styles.detailHint, { color: '#16a34a' }]}>Tap for details →</Text>
      <TouchableOpacity
        style={[
          styles.mapLink,
          {
            backgroundColor: colors.isDark ? '#1f2937' : '#e5e7eb',
            borderColor: colors.isDark ? '#475569' : '#d1d5db',
          },
        ]}
        onPress={onViewMap}
      >
        <Text style={[styles.mapLinkText, { color: colors.isDark ? '#a5f3fc' : '#111827' }]}>View on map</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const [filterMode, setFilterMode] = useState('all');
  const { favourites } = useFavourites();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
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
    paddingVertical: 32,
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
    borderWidth: 1,
    padding: 16,
    gap: 8,
    backgroundColor: '#fff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardMeta: {
    fontSize: 14,
  },
  metaLine: {
    fontSize: 13,
  },
  cardBody: {
    fontSize: 13,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: '600',
  },
  metaNote: {
    fontSize: 12,
  },
  detailHint: {
    marginTop: 4,
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
  mapLink: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  mapLinkText: {
    fontSize: 12,
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
