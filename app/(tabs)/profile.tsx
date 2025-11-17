import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HALAL_RESTAURANTS } from '@/constants/restaurants';

const favourites = HALAL_RESTAURANTS.slice(0, 2);
const upcomingProfileFeatures = [
  'Secure authentication powered by Supabase or Firebase.',
  'Sync favourites, dietary filters, and notification preferences.',
  'Leave reviews with photos and halal compliance notes.',
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Login, favourites, and reviews.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign in to continue</Text>
          <Text style={styles.cardBody}>
            Connect your HalalWay account to unlock saved spots, submit reviews, and receive updates
            about new halal openings near you.
          </Text>
          <View style={styles.inputGroup}>
            <TextInput placeholder="Email" keyboardType="email-address" style={styles.input} />
            <TextInput placeholder="Password" secureTextEntry style={styles.input} />
          </View>
          <Pressable style={styles.primaryButton} onPress={() => {}}>
            <MaterialIcons name="lock-open" color="#fff" size={20} />
            <Text style={styles.primaryButtonText}>Sign in with email</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => {}}>
            <MaterialIcons name="fingerprint" color="#0f172a" size={20} />
            <Text style={styles.secondaryButtonText}>Use biometrics / SSO</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favourites</Text>
          {favourites.map(item => (
            <View key={item.id} style={styles.favoriteRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.favoriteName}>{item.name}</Text>
                <Text style={styles.favoriteMeta}>
                  {item.city} · {item.tags[0]}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
            </View>
          ))}
          <Pressable style={styles.outlineButton} onPress={() => {}}>
            <Text style={styles.outlineButtonText}>View all saved places</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Roadmap</Text>
          {upcomingProfileFeatures.map(item => (
            <View style={styles.roadmapRow} key={item}>
              <MaterialIcons name="circle" size={10} color="#16a34a" />
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
    paddingBottom: 32,
    paddingTop: 56,
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    gap: 16,
    backgroundColor: '#fff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardBody: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  inputGroup: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#16a34a',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#f1f5f9',
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  section: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 16,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  favoriteMeta: {
    color: '#475569',
    fontSize: 13,
    marginTop: 4,
  },
  outlineButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  outlineButtonText: {
    color: '#16a34a',
    fontWeight: '600',
  },
  roadmapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roadmapText: {
    color: '#475569',
    fontSize: 13,
    flex: 1,
  },
});
