import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import restaurants from '../data/dundeeStAndrewsRestaurants';
import { useFavourites } from '../contexts/FavouritesContext';

const formatHalalStatus = status => {
  if (!status) return 'unknown';
  return status.replace('-', ' ');
};

const FilterChip = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, active && styles.chipActive]}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const RestaurantCard = ({ item, onPress, onViewMap }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardTitle}>{item.name}</Text>
    <Text style={styles.cardMeta}>
      {item.cuisine} · {item.city} · {item.priceRange}
    </Text>
    <Text style={styles.metaLine}>
      {item.city} · {item.address?.postcode ?? 'Postcode tbc'}
    </Text>
    <Text style={styles.cardBody}>{item.address.line1}</Text>
    <View style={styles.tagRow}>
      {item.tags.slice(0, 3).map(tag => (
        <Text style={styles.tag} key={`${item.id}-${tag}`}>
          {tag}
        </Text>
      ))}
    </View>
    <Text style={styles.metaNote}>
      Halal: {formatHalalStatus(item.halalInfo?.overallStatus)} · Alcohol:{' '}
      {item.alcoholInfo?.servesAlcohol ? 'Yes' : 'No'}
    </Text>
    <Text style={styles.detailHint}>Tap for details →</Text>
    <TouchableOpacity style={styles.mapLink} onPress={onViewMap}>
      <Text style={styles.mapLinkText}>View on map</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const [filterMode, setFilterMode] = useState('all');
  const { favourites } = useFavourites();

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
      onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: item.id })}
      onViewMap={() => navigation.navigate('MapTab', { focusRestaurantId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.header}>
              <Text style={styles.title}>HalalWay</Text>
              <Text style={styles.subtitle}>
                Discover halal restaurants across Dundee & St Andrews.
              </Text>
              <Text style={styles.body}>
                Use filters to focus on all-halal venues, alcohol-free spaces, or browse everything
                verified so far.
              </Text>
            </View>
            <View style={styles.filterBar}>
              <FilterChip label="All" active={filterMode === 'all'} onPress={() => setFilterMode('all')} />
              <FilterChip
                label="All-halal"
                active={filterMode === 'all-halal'}
                onPress={() => setFilterMode('all-halal')}
              />
              <FilterChip
                label="No alcohol"
                active={filterMode === 'no-alcohol'}
                onPress={() => setFilterMode('no-alcohol')}
              />
              <FilterChip
                label="Favourites"
                active={filterMode === 'favourites'}
                onPress={() => setFilterMode('favourites')}
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
    color: '#16a34a',
  },
  body: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    color: '#0f172a',
  },
  cardMeta: {
    fontSize: 14,
    color: '#475569',
  },
  metaLine: {
    fontSize: 13,
    color: '#64748b',
  },
  cardBody: {
    fontSize: 13,
    color: '#475569',
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
    backgroundColor: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  metaNote: {
    fontSize: 12,
    color: '#64748b',
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
    backgroundColor: '#e5e7eb',
  },
  mapLinkText: {
    fontSize: 12,
    color: '#111827',
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
  chipText: {
    fontSize: 13,
    color: '#0f172a',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
