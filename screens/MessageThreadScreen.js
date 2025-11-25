import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMessages } from '../contexts/MessagesContext';
import { useSocial } from '../contexts/SocialContext';
import { useThemePreference } from '../contexts/ThemeContext';

const MessageThreadScreen = ({ route }) => {
  const { personId } = route.params ?? {};
  const { threads, sendMessage } = useMessages();
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          style={styles.thread}
          contentContainerStyle={styles.threadContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => {
            const mine = msg.from === 'me';
            return (
              <View
                key={msg.id}
                style={[
                  styles.bubble,
                  {
                    alignSelf: mine ? 'flex-end' : 'flex-start',
                    backgroundColor: mine ? themeColors.accent : cardBackground,
                    borderColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    { color: mine ? themeColors.accentContrast : primaryText },
                  ]}
                >
                  {msg.text}
                </Text>
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
  title: { fontSize: 20, fontWeight: '700' },
  thread: { flex: 1 },
  threadContent: { padding: 16, paddingBottom: 24 },
  bubble: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    maxWidth: '78%',
  },
  bubbleText: { fontSize: 14 },
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
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  sendText: { fontWeight: '700' },
});

export default MessageThreadScreen;
