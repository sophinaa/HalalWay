import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSocial } from '../contexts/SocialContext';
import { useThemePreference } from '../contexts/ThemeContext';

const initialsForName = name => {
  if (!name) return '?';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const PersonProfileScreen = ({ route, navigation }) => {
  const { personId } = route.params ?? {};
  const { followers, following, suggested, followUser, unfollowUser, isFollowing } = useSocial();
  const { themeColors } = useThemePreference();

  const backgroundColor = themeColors.background;
  const cardBackground = themeColors.card;
  const borderColor = themeColors.border;
  const primaryText = themeColors.textPrimary;
  const secondaryText = themeColors.textSecondary;

  const person = useMemo(() => {
    const all = [...followers, ...following, ...suggested];
    return all.find(p => p.id === personId);
  }, [followers, following, suggested, personId]);

  const meta = useMemo(() => {
    if (!person) return '';
    return [person.handle ? `@${person.handle}` : null, person.city].filter(Boolean).join(' · ');
  }, [person]);

  if (!person) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <View style={styles.centered}>
          <Text style={[styles.title, { color: primaryText }]}>Profile not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { borderColor }]}>
            <Text style={[styles.backText, { color: themeColors.accent }]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const followingAlready = isFollowing(person.id);
  const handleToggleFollow = () => {
    if (followingAlready) {
      unfollowUser(person.id);
      Alert.alert('Unfollowed', `You are no longer following ${person.name}.`);
    } else {
      followUser(person);
      Alert.alert('Following', `You will now see updates from ${person.name}.`);
    }
  };

  const mutual = followers.some(f => f.id === person.id) && following.some(f => f.id === person.id);
  const followsYou = followers.some(f => f.id === person.id);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
        <View style={[styles.avatar, { backgroundColor: themeColors.tagBackground }]}>
          <Text style={[styles.avatarText, { color: primaryText }]}>{initialsForName(person.name)}</Text>
        </View>
        <Text style={[styles.title, { color: primaryText }]}>{person.name}</Text>
        {meta ? <Text style={[styles.meta, { color: secondaryText }]}>{meta}</Text> : null}
        {person.note ? <Text style={[styles.note, { color: secondaryText }]}>{person.note}</Text> : null}
        <View style={styles.badges}>
          {mutual ? (
            <View style={[styles.badge, { backgroundColor: themeColors.tagBackground }]}>
              <Text style={[styles.badgeText, { color: themeColors.accent }]}>Mutual</Text>
            </View>
          ) : null}
          {!mutual && followsYou ? (
            <View style={[styles.badge, { backgroundColor: themeColors.tagBackground }]}>
              <Text style={[styles.badgeText, { color: themeColors.accent }]}>Follows you</Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={handleToggleFollow}
          style={[
            styles.followButton,
            {
              backgroundColor: followingAlready ? 'transparent' : themeColors.accent,
              borderColor,
            },
          ]}
        >
          <Text
            style={[
              styles.followText,
              { color: followingAlready ? primaryText : themeColors.accentContrast },
            ]}
          >
            {followingAlready ? 'Unfollow' : 'Add friend'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    margin: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: { fontSize: 26, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '700' },
  meta: { fontSize: 14 },
  note: { fontSize: 13, textAlign: 'center' },
  badges: { flexDirection: 'row', gap: 8, marginTop: 8 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  followButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  followText: { fontWeight: '700', fontSize: 15 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  backButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  backText: { fontWeight: '700' },
});

export default PersonProfileScreen;
