import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { HALAL_RESTAURANTS } from '@/constants/restaurants';

const filterTags = ['No alcohol', 'Family friendly', 'Late night', 'Vegan friendly'];
const roadmapItems = [
  'Search across every UK city with smart filters.',
  'Sync favourites across devices with secure sign in.',
  'See wait times, delivery options, and reviews in one place.',
];

export default function HomeScreen() {
  const featured = HALAL_RESTAURANTS.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>HalalWay</Text>
        <Text style={styles.subtitle}>Discover halal restaurants across the UK.</Text>
        <Text style={styles.body}>
          Explore trusted places with the filters that matter to you—no alcohol venues, family
          friendly seating, and authentic flavours curated by the community.
        </Text>

        <View style={styles.tagRow}>
          {filterTags.map(tag => (
            <View key={tag} style={styles.tag}>
              <MaterialIcons name="check" color="#16a34a" size={16} />
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured near you</Text>
          <Link href="/map" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkButtonText}>View on map</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#16a34a" />
            </Pressable>
          </Link>
        </View>

        {featured.map(restaurant => (
          <View key={restaurant.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{restaurant.name}</Text>
                <Text style={styles.cardMeta}>
                  {restaurant.city} · {restaurant.price} · {restaurant.rating.toFixed(1)} ★
                </Text>
              </View>
              <View style={styles.chip}>
                <MaterialIcons name="schedule" color="#16a34a" size={16} />
                <Text style={styles.chipText}>{restaurant.distanceMinutes} min</Text>
              </View>
            </View>
            <Text style={styles.cardBody}>{restaurant.description}</Text>
            <View style={styles.cardTags}>
              {restaurant.tags.map(tag => (
                <Text key={tag} style={styles.cardTag}>
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.roadmap}>
          <Text style={styles.sectionTitle}>Coming soon</Text>
          {roadmapItems.map(item => (
            <View key={item} style={styles.roadmapRow}>
              <MaterialIcons name="circle" size={8} color="#16a34a" />
              <Text style={styles.roadmapText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    backgroundColor: '#f0fdf4',
  },
  tagText: {
    fontSize: 13,
    color: '#15803d',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkButtonText: {
    color: '#16a34a',
    fontWeight: '600',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    gap: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardMeta: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
  cardBody: {
    fontSize: 14,
    color: '#475569',
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardTag: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#e2e8f0',
    color: '#0f172a',
    fontWeight: '600',
  },
  chip: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: '#ecfdf5',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
  },
  roadmap: {
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    padding: 20,
    gap: 12,
    marginBottom: 32,
  },
  roadmapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roadmapText: {
    color: '#475569',
    fontSize: 14,
  },
});
