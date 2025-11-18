import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const [searchQuery, setSearchQuery] = useState('');
  const { favourites } = useFavourites();
  const { theme, themeColors } = useThemePreference();
  const isDark = theme === 'dark';

  const applyQuickFilter = mode => {
    setFilterMode(mode);
  };

  const filteredRestaurants = useMemo(() => {
    let base = restaurants;
    switch (filterMode) {
      case 'all-halal':
        base = restaurants.filter(r => r.halalInfo?.overallStatus === 'all-halal');
        break;
      case 'no-alcohol':
        base = restaurants.filter(r => r.alcoholInfo?.servesAlcohol === false);
        break;
      case 'favourites':
        base = restaurants.filter(r => favourites.includes(r.id));
        break;
      case 'burgers':
        base = restaurants.filter(r => {
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
        base = restaurants.filter(r => {
          const cuisine = (r.cuisine || '').toLowerCase();
          return cuisine.includes('chicken') || cuisine.includes('peri');
        });
        break;
      case 'indian':
        base = restaurants.filter(r => {
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
        base = restaurants.filter(r => {
          const cuisine = (r.cuisine || '').toLowerCase();
          return cuisine.includes('pizza') || cuisine.includes('doner');
        });
        break;
      case 'healthy':
        base = restaurants.filter(r => {
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
        base = restaurants;
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return base;
    }
    return base.filter(r => {
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
    });
  }, [filterMode, favourites, searchQuery]);

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
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=60',
              }}
              imageStyle={styles.heroImage}
              style={[
                styles.heroBanner,
                { backgroundColor: isDark ? '#1f2933' : '#e2e8f0', borderColor: themeColors.border },
              ]}
            >
              <View style={styles.heroOverlay} />
              <View style={styles.heroContent}>
                <Text style={styles.heroKicker}>Find Halal Food Near You 🍽️</Text>
                <Text style={styles.heroTitle}>Discover trusted places to eat in Dundee & St Andrews.</Text>
                <Text style={styles.heroBody}>
                  Filter by cuisine, halal status, or alcohol policy. Tap a category to jump straight into a curated
                  list.
                </Text>
                <TouchableOpacity
                  style={styles.heroCTA}
                  onPress={() => navigation.navigate('MapTab')}
                >
                  <Text style={styles.heroCTAText}>Explore Map</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
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
              style={[
                styles.searchWrapper,
                { backgroundColor: themeColors.card, borderColor: themeColors.border },
              ]}
            >
              <Text style={[styles.searchIcon, { color: themeColors.muted }]}>🔍</Text>
              <TextInput
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
  heroBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 20,
    position: 'relative',
  },
  heroImage: {
    opacity: 0.6,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroContent: {
    gap: 8,
  },
  heroKicker: {
    color: '#facc15',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  heroBody: {
    color: '#f8fafc',
    fontSize: 14,
    lineHeight: 20,
  },
  heroCTA: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  heroCTAText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
