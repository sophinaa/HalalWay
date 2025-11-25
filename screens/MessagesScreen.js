import React, { useMemo, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';

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
  const { threads, clearThread } = useMessages();
  const [swipingId, setSwipingId] = useState(null);

  const backgroundColor = themeColors.background;
  const cardBackground = themeColors.card;
  const borderColor = themeColors.border;
  const primaryText = themeColors.textPrimary;
  const secondaryText = themeColors.textSecondary;

  const peopleMap = useMemo(() => {
    const map = new Map();
    [...followers, ...following].forEach(p => {
      map.set(p.id, p);
    });
    return map;
  }, [followers, following]);

  const withLastMessage = useMemo(() => {
    const idsFromThreads = Object.keys(threads || {});
    const ids = new Set([...following.map(p => p.id), ...idsFromThreads]);
    const items = Array.from(ids).map(id => {
      const person = peopleMap.get(id) || { id, name: 'Friend', handle: id };
      const thread = threads[id] || [];
      const last = thread[thread.length - 1];
      return { person, last };
    });
    return items.sort((a, b) => (b.last?.ts ?? 0) - (a.last?.ts ?? 0));
  }, [following, threads, peopleMap]);

  const renderRightActions = (progress, personId) => {
    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View style={[styles.deleteAction, { transform: [{ scale }] }]}>
        <View style={styles.deleteBox}>
          <Text style={[styles.deleteText, { color: themeColors.accentContrast }]}>Delete</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteActionInner}
          onPress={() => {
            setSwipingId(null);
            clearThread(personId);
          }}
          activeOpacity={0.85}
        >
          <Text style={[styles.deleteText, { color: themeColors.accentContrast }]}>Confirm</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: primaryText }]}>Messages</Text>
          <Text style={[styles.subtitle, { color: secondaryText }]}>
            Chat with friends and open shared spots.
          </Text>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {withLastMessage.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: cardBackground, borderColor }]}>
              <Text style={[styles.emptyText, { color: secondaryText }]}>
                You need mutual friends to start chatting.
              </Text>
            </View>
          ) : (
            withLastMessage.map(({ person, last }) => (
              <Swipeable
                key={person.id}
                renderRightActions={progress => renderRightActions(progress, person.id)}
                overshootRight={false}
                friction={2}
                onSwipeableWillOpen={() => setSwipingId(person.id)}
                onSwipeableClose={() => setSwipingId(null)}
              >
                <TouchableOpacity
                  style={[styles.threadCard, { backgroundColor: cardBackground, borderColor }]}
                  onPress={() => {
                    if (swipingId) return;
                    navigation.navigate('MessageThread', { personId: person.id });
                  }}
                  activeOpacity={0.85}
                  delayPressIn={100}
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
              </Swipeable>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 0 },
  header: { marginBottom: 4, paddingTop: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 4 },
  scroll: { flex: 1 },
  content: { paddingBottom: 12, gap: 10 },
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
  deleteAction: {
    width: 140,
    height: '100%',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  deleteBox: {
    width: 70,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionInner: {
    flex: 1,
    backgroundColor: '#b91c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: { fontWeight: '700', fontSize: 13 },
});

export default MessagesScreen;
