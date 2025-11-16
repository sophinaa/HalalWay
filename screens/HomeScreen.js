import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import restaurants from '../data/dundeeStAndrewsRestaurants';

const formatHalalStatus = status => {
  if (!status) return 'unknown';
  return status.replace('-', ' ');
};

const RestaurantCard = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.name}</Text>
    <Text style={styles.cardMeta}>
      {item.cuisine} · {item.city} · {item.priceRange}
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
  </View>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <RestaurantCard item={item} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>HalalWay</Text>
            <Text style={styles.subtitle}>
              Discover halal restaurants across Dundee & St Andrews.
            </Text>
            <Text style={styles.body}>
              This is the home screen. Later you can show search, filters, and a list of nearby halal
              restaurants here. For now, here are a few verified places to get you started.
            </Text>
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
  header: {
    gap: 12,
    marginBottom: 8,
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
});
