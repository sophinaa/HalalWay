import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMessages } from '../contexts/MessagesContext';
import { useSocial } from '../contexts/SocialContext';
import { useThemePreference } from '../contexts/ThemeContext';
import restaurants from '../data/dundeeStAndrewsRestaurants';

const MessageThreadScreen = ({ route, navigation }) => {
  const { personId } = route.params ?? {};
  const { threads, sendMessage, clearThread } = useMessages();
  const { followers, following } = useSocial();
  const { themeColors } = useThemePreference();
  const [draft, setDraft] = useState('');

  const backgroundColor = themeColors.background;
  const cardBackground = themeColors.card;
  const borderColor = themeColors.border;
  const primaryText = themeColors.textPrimary;
  const secondaryText = themeColors.textSecondary;

  const person = useMemo(() => {
    const all = [...followers, ...following];
    return all.find(p => p.id === personId);
  }, [followers, following, personId]);

  const messages = threads[personId] || [];

  const handleClear = () => {
    Alert.alert('Clear chat?', 'This will remove the conversation from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => clearThread(personId),
      },
    ]);
  };

  const renderRestaurantPreview = meta => {
    if (!meta?.restaurantId) return null;
    const restaurant = restaurants.find(r => r.id === meta.restaurantId);
    const title = meta.restaurantName || restaurant?.name || 'Restaurant';
    const city = meta.restaurantCity || restaurant?.city;
    return (
      <TouchableOpacity
        style={[styles.restaurantCard, { borderColor, backgroundColor: cardBackground }]}
        onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: meta.restaurantId })}
        activeOpacity={0.85}
      >
        <Text style={[styles.restaurantTitle, { color: primaryText }]}>{title}</Text>
        {city ? <Text style={[styles.restaurantMeta, { color: secondaryText }]}>{city}</Text> : null}
        <Text style={[styles.restaurantLink, { color: themeColors.accent }]}>Open restaurant</Text>
      </TouchableOpacity>
    );
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(personId, draft);
    setDraft('');
  };

  if (!person) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <View style={styles.centered}>
          <Text style={[styles.title, { color: primaryText }]}>Conversation unavailable</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={[styles.header, { borderColor }]}>
          <View style={[styles.headerAvatar, { backgroundColor: themeColors.tagBackground }]}>
            <Text style={[styles.headerAvatarText, { color: primaryText }]}>{person.name?.charAt(0)?.toUpperCase()}</Text>
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={[styles.title, { color: primaryText }]} numberOfLines={1}>
              {person.name}
            </Text>
            <Text style={[styles.subtitle, { color: secondaryText }]}>Active now</Text>
          </View>
          <TouchableOpacity style={[styles.clearButton, { borderColor }]} onPress={handleClear} activeOpacity={0.85}>
            <Text style={[styles.clearText, { color: themeColors.accent }]}>Clear</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.thread}
          contentContainerStyle={styles.threadContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => {
            const mine = msg.from === 'me';
            const bubbleBg = mine ? themeColors.accent : themeColors.card;
            const textColor = mine ? themeColors.accentContrast : primaryText;
            const time = msg.ts ? new Date(msg.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '';
            return (
              <View key={msg.id} style={[styles.bubbleWrap, { alignItems: mine ? 'flex-end' : 'flex-start' }]}>
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: bubbleBg,
                      alignSelf: mine ? 'flex-end' : 'flex-start',
                      borderTopLeftRadius: mine ? 16 : 4,
                      borderTopRightRadius: mine ? 4 : 16,
                    },
                  ]}
                >
                  <Text style={[styles.bubbleText, { color: textColor }]}>{msg.text}</Text>
                  {renderRestaurantPreview(msg.meta)}
                </View>
                {time ? (
                  <Text style={[styles.timeText, { color: secondaryText }]}>{time}</Text>
                ) : null}
              </View>
            );
          })}
          {messages.length === 0 ? (
            <Text style={[styles.empty, { color: secondaryText }]}>Say salam to start the chat.</Text>
          ) : null}
        </ScrollView>
        <View style={[styles.inputRow, { borderColor }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message..."
            placeholderTextColor={themeColors.muted}
            style={[styles.input, { color: primaryText, borderColor, backgroundColor: cardBackground }]}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendButton, { backgroundColor: themeColors.accent }]}
            activeOpacity={0.85}
          >
            <Text style={[styles.sendText, { color: themeColors.accentContrast }]}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 2,
    paddingBottom: 3,
    borderBottomWidth: 1,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerAvatarText: { fontWeight: '700' },
  headerTextWrap: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 12 },
  thread: { flex: 1 },
  threadContent: { paddingHorizontal: 8, paddingTop: 6, paddingBottom: 16, gap: 6 },
  clearButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 10,
  },
  clearText: { fontWeight: '700', fontSize: 12 },
  bubbleWrap: { maxWidth: '100%', gap: 2 },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  timeText: { fontSize: 11 },
  restaurantCard: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  restaurantTitle: { fontWeight: '700', fontSize: 14 },
  restaurantMeta: { fontSize: 12 },
  restaurantLink: { fontSize: 12, fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 13 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  sendText: { fontWeight: '700' },
});

export default MessageThreadScreen;
