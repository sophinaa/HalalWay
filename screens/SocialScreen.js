import React, { useEffect, useMemo, useState } from 'react';
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

const validTabs = ['followers', 'following', 'mutual', 'suggested'];

const SocialScreen = ({ navigation, route }) => {
  const { themeColors } = useThemePreference();
  const {
    followers,
    following,
    suggested,
    followBack,
    followUser,
    unfollowUser,
    isFollowing,
    mutualCount,
    mutualIds,
  } = useSocial();
  const [activeTab, setActiveTab] = useState(
    () => (route?.params?.tab && validTabs.includes(route.params.tab) ? route.params.tab : 'followers'),
  );

  useEffect(() => {
    if (route?.params?.tab && validTabs.includes(route.params.tab)) {
      setActiveTab(route.params.tab);
    }
  }, [route?.params?.tab]);

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

  const mutuals = useMemo(() => {
    if (!mutualIds?.length) return [];
    const ids = new Set(mutualIds);
    return following.filter(p => ids.has(p.id));
  }, [following, mutualIds]);

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
        <TouchableOpacity
          style={[styles.messageLink, { borderColor }]}
          onPress={() => navigation.navigate('MessageThread', { personId: person.id })}
        >
          <Text style={[styles.messageLinkText, { color: themeColors.accent }]}>Message</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: primaryText }]}>Social</Text>
          <TouchableOpacity
            style={[styles.messagesButton, { borderColor, backgroundColor: themeColors.card }]}
            onPress={() => navigation.navigate('Messages')}
            activeOpacity={0.85}
          >
            <Text style={[styles.messagesButtonText, { color: themeColors.accent }]}>Messages</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.statsCard, { backgroundColor: cardBackground, borderColor }]}>
          {stats.map(stat => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={[styles.statLabel, { color: secondaryText }]}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: primaryText }]}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.tabs, { borderColor }]}>
          {[
            { key: 'followers', label: 'Followers', count: followers.length },
            { key: 'following', label: 'Following', count: following.length },
            { key: 'mutual', label: 'Mutual', count: mutualCount },
            { key: 'suggested', label: 'Suggested', count: suggested.length },
          ].map(tab => {
            const selected = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: selected ? themeColors.accent : 'transparent',
                    borderColor,
                  },
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: selected ? themeColors.accentContrast : primaryText },
                  ]}
                >
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === 'followers' ? (
          <>
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
          </>
        ) : null}

        {activeTab === 'following' ? (
          <>
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
          </>
        ) : null}

        {activeTab === 'mutual' ? (
          <>
            <Text style={[styles.sectionTitle, { color: primaryText }]}>Mutual friends</Text>
            {mutuals.map(person =>
              renderPerson(person, {
                actionLabel: 'Unfollow',
                action: () => unfollowUser(person.id),
                status: 'Mutual friends',
              }),
            )}
            {mutuals.length === 0 ? (
              <View style={[styles.emptyCard, { borderColor, backgroundColor: cardBackground }]}>
                <Text style={[styles.personHandle, { color: secondaryText }]}>No mutual friends yet.</Text>
              </View>
            ) : null}
          </>
        ) : null}

        {activeTab === 'suggested' ? (
          <>
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
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 12, gap: 10 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  messagesButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  messagesButtonText: { fontWeight: '700', fontSize: 13 },
  tabs: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  tabText: { fontWeight: '700', fontSize: 12, textAlign: 'center' },
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
  messageLink: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  messageLinkText: { fontWeight: '700', fontSize: 13 },
});

export default SocialScreen;
