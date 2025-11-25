import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSocial } from '../contexts/SocialContext';
import { useMessages } from '../contexts/MessagesContext';
import { useThemePreference } from '../contexts/ThemeContext';

const initialsForName = name => {
  if (!name) return '?';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const MessagesScreen = ({ navigation }) => {
  const { themeColors } = useThemePreference();
  const { followers, following } = useSocial();
  const { threads } = useMessages();

  const backgroundColor = themeColors.background;
  const cardBackground = themeColors.card;
  const borderColor = themeColors.border;
  const primaryText = themeColors.textPrimary;
  const secondaryText = themeColors.textSecondary;

  const mutuals = useMemo(() => {
    const followerIds = new Set(followers.map(p => p.id));
    return following.filter(p => followerIds.has(p.id));
  }, [followers, following]);

  const withLastMessage = mutuals.map(person => {
    const thread = threads[person.id] || [];
    const last = thread[thread.length - 1];
    return { person, last };
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: primaryText }]}>Messages</Text>
        {withLastMessage.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: cardBackground, borderColor }]}>
            <Text style={[styles.emptyText, { color: secondaryText }]}>
              You need mutual friends to start chatting.
            </Text>
          </View>
        ) : (
          withLastMessage.map(({ person, last }) => (
            <TouchableOpacity
              key={person.id}
              style={[styles.threadCard, { backgroundColor: cardBackground, borderColor }]}
              onPress={() => navigation.navigate('MessageThread', { personId: person.id })}
              activeOpacity={0.85}
            >
              <View style={[styles.avatar, { backgroundColor: themeColors.tagBackground }]}>
                <Text style={[styles.avatarText, { color: primaryText }]}>{initialsForName(person.name)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: primaryText }]}>{person.name}</Text>
                <Text style={[styles.handle, { color: secondaryText }]}>@{person.handle}</Text>
                {last ? (
                  <Text style={[styles.preview, { color: secondaryText }]} numberOfLines={1}>
                    {last.from === 'me' ? 'You: ' : ''}{last.text}
                  </Text>
                ) : (
                  <Text style={[styles.preview, { color: secondaryText }]}>Start the conversation</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  threadCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '700' },
  name: { fontSize: 16, fontWeight: '700' },
  handle: { fontSize: 12 },
  preview: { fontSize: 12, marginTop: 2 },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyText: { fontSize: 13, textAlign: 'center' },
});

export default MessagesScreen;
