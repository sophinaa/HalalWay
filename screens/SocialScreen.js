import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSocial } from '../contexts/SocialContext';
import { useThemePreference } from '../contexts/ThemeContext';

const initialsForName = name => {
  if (!name) return '?';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const SocialScreen = ({ navigation }) => {
  const { themeColors } = useThemePreference();
  const { followers, following, suggested, followBack, followUser, unfollowUser, isFollowing, mutualCount } =
    useSocial();

  const backgroundColor = themeColors.background;
  const cardBackground = themeColors.card;
  const borderColor = themeColors.border;
  const primaryText = themeColors.textPrimary;
  const secondaryText = themeColors.textSecondary;

  const stats = useMemo(
    () => [
      { label: 'Followers', value: followers.length },
      { label: 'Following', value: following.length },
      { label: 'Mutual', value: mutualCount },
    ],
    [followers.length, following.length, mutualCount],
  );

  const renderPerson = (person, { actionLabel, action, status }) => {
    const meta = [person.handle ? `@${person.handle}` : null, person.city].filter(Boolean).join(' · ');
    return (
      <TouchableOpacity
        key={person.id}
        style={[styles.personCard, { backgroundColor: cardBackground, borderColor }]}
        onPress={() => navigation.navigate('PersonProfile', { personId: person.id })}
        activeOpacity={0.85}
      >
        <View style={styles.personMeta}>
          <View style={[styles.avatar, { backgroundColor: themeColors.tagBackground }]}>
            <Text style={[styles.avatarText, { color: themeColors.textPrimary }]}>
              {initialsForName(person.name)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.personName, { color: primaryText }]}>{person.name}</Text>
            {meta ? <Text style={[styles.personHandle, { color: secondaryText }]}>{meta}</Text> : null}
            {person.note ? (
              <Text style={[styles.personNote, { color: secondaryText }]} numberOfLines={1}>
                {person.note}
              </Text>
            ) : null}
            {status ? (
              <Text style={[styles.statusText, { color: themeColors.accent }]}>{status}</Text>
            ) : null}
          </View>
        </View>
        {action ? (
          <TouchableOpacity
            style={[styles.actionButton, { borderColor, backgroundColor: themeColors.accent }]}
            onPress={e => {
              e.stopPropagation();
              action();
            }}
          >
            <Text style={[styles.actionButtonText, { color: themeColors.accentContrast }]}>
              {actionLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: primaryText }]}>Social</Text>
        <View style={[styles.statsCard, { backgroundColor: cardBackground, borderColor }]}>
          {stats.map(stat => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={[styles.statLabel, { color: secondaryText }]}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: primaryText }]}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: primaryText }]}>Followers</Text>
        {followers.map(person =>
          renderPerson(person, {
            actionLabel: isFollowing(person.id) ? undefined : 'Add back',
            action: isFollowing(person.id) ? undefined : () => followBack(person.id),
            status: isFollowing(person.id) ? 'Mutual friends' : 'Follows you',
          }),
        )}
        {followers.length === 0 ? (
          <View style={[styles.emptyCard, { borderColor, backgroundColor: cardBackground }]}>
            <Text style={[styles.personHandle, { color: secondaryText }]}>No followers yet.</Text>
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { color: primaryText }]}>Following</Text>
        {following.map(person =>
          renderPerson(person, {
            actionLabel: 'Unfollow',
            action: () => unfollowUser(person.id),
            status: followers.some(f => f.id === person.id) ? 'Mutual friends' : undefined,
          }),
        )}
        {following.length === 0 ? (
          <View style={[styles.emptyCard, { borderColor, backgroundColor: cardBackground }]}>
            <Text style={[styles.personHandle, { color: secondaryText }]}>Not following anyone yet.</Text>
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { color: primaryText }]}>Suggested friends</Text>
        {suggested.map(person =>
          renderPerson(person, {
            actionLabel: isFollowing(person.id) ? undefined : 'Add friend',
            action: isFollowing(person.id) ? undefined : () => followUser(person),
            status: 'Suggested for you',
          }),
        )}
        {suggested.length === 0 ? (
          <View style={[styles.emptyCard, { borderColor, backgroundColor: cardBackground }]}>
            <Text style={[styles.personHandle, { color: secondaryText }]}>No suggestions right now.</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statLabel: { fontSize: 13, fontWeight: '600' },
  statValue: { fontSize: 20, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginVertical: 10 },
  personCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  personMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '700' },
  personName: { fontSize: 16, fontWeight: '700' },
  personHandle: { fontSize: 13 },
  personNote: { fontSize: 12 },
  statusText: { fontSize: 12, marginTop: 4, fontWeight: '600' },
  actionButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  actionButtonText: { fontWeight: '700', fontSize: 13 },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
});

export default SocialScreen;
