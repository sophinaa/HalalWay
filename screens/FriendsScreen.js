import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useSocial } from '../contexts/SocialContext';
import { useThemePreference } from '../contexts/ThemeContext';
import restaurants from '../data/dundeeStAndrewsRestaurants';

const initialsForName = name => {
  if (!name) return '?';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const sampleVisits = {
  amina: [
    { restaurantId: 'taza-indian', rating: 4.5, note: 'Loved the chutney bar' },
    { restaurantId: 'souk-glasgow', rating: 4, note: 'Great lamb tagine' },
  ],
  basit: [
    { restaurantId: 'taza-indian', rating: 4, note: 'Biryani was solid' },
    { restaurantId: 'forgan', rating: 3.5, note: 'Brunch was okay' },
  ],
  leena: [
    { restaurantId: 'nahm-jim', rating: 4.5, note: 'Pad thai halal verified' },
  ],
  fatima: [
    { restaurantId: 'bread-meat', rating: 4, note: 'Juicy burger' },
  ],
  yusuf: [
    { restaurantId: 'kebabish-original', rating: 4, note: 'Late-night shawarma hit' },
  ],
};

const FriendsScreen = ({ navigation }) => {
  const { themeColors } = useThemePreference();
  const { following } = useSocial();
  const backgroundColor = themeColors.background;
  const cardBackground = themeColors.card;
  const borderColor = themeColors.border;
  const primaryText = themeColors.textPrimary;
  const secondaryText = themeColors.textSecondary;

  const feedPeople = useMemo(() => following, [following]);

  const visitCards = person => {
    const visits = sampleVisits[person.id] || [];
    return visits.map(visit => {
      const restaurant = restaurants.find(r => r.id === visit.restaurantId);
      return (
        <TouchableOpacity
          key={`${person.id}-${visit.restaurantId}`}
          style={[styles.visitCard, { backgroundColor: cardBackground, borderColor }]}
          onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: restaurant?.id || visit.restaurantId })}
          activeOpacity={0.85}
        >
          <Text style={[styles.visitTitle, { color: primaryText }]}>{restaurant?.name ?? 'Restaurant'}</Text>
          <Text style={[styles.visitMeta, { color: secondaryText }]}>
            {restaurant?.city ?? ''} · Rating {visit.rating.toFixed(1)}/5
          </Text>
          {visit.note ? <Text style={[styles.visitNote, { color: secondaryText }]} numberOfLines={1}>{visit.note}</Text> : null}
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: primaryText }]}>Feed</Text>
        <TouchableOpacity
          style={[styles.messageButton, { borderColor }]}
          onPress={() => navigation.navigate('Messages')}
          activeOpacity={0.85}
        >
          <MaterialIcons name="chat" size={20} color={themeColors.accent} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {feedPeople.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: cardBackground, borderColor }]}>
            <Text style={[styles.emptyText, { color: secondaryText }]}>Follow some people to see their recent spots.</Text>
          </View>
        ) : (
          feedPeople.map(person => (
            <View key={person.id} style={[styles.friendCard, { backgroundColor: cardBackground, borderColor }]}>
              <View style={styles.friendHeader}>
                <TouchableOpacity
                  style={styles.personHeader}
                  onPress={() => navigation.navigate('PersonProfile', { personId: person.id })}
                  activeOpacity={0.85}
                >
                  <View style={[styles.avatar, { backgroundColor: themeColors.tagBackground }]}>
                    <Text style={[styles.avatarText, { color: primaryText }]}>{initialsForName(person.name)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.name, { color: primaryText }]}>{person.name}</Text>
                    <Text style={[styles.handle, { color: secondaryText }]}>@{person.handle}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.miniMessage, { borderColor }]}
                  onPress={() => navigation.navigate('MessageThread', { personId: person.id })}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="chat-bubble-outline" size={18} color={themeColors.accent} />
                </TouchableOpacity>
              </View>
              {visitCards(person)}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  title: { fontSize: 22, fontWeight: '700' },
  messageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 16, paddingBottom: 32, gap: 12 },
  friendCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '700' },
  name: { fontSize: 16, fontWeight: '700' },
  handle: { fontSize: 13 },
  visitCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  visitTitle: { fontSize: 15, fontWeight: '700' },
  visitMeta: { fontSize: 12 },
  visitNote: { fontSize: 12 },
  miniMessage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: { borderWidth: 1, borderRadius: 14, padding: 16, alignItems: 'center' },
  emptyText: { fontSize: 13, textAlign: 'center' },
});

export default FriendsScreen;
