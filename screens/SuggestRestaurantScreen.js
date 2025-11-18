import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePreference } from '../contexts/ThemeContext';

export default function SuggestRestaurantScreen() {
  const { themeColors } = useThemePreference();
  const [restaurantName, setRestaurantName] = useState('');
  const [city, setCity] = useState('');
  const [details, setDetails] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleShare = () => {
    if (!restaurantName.trim() || !city.trim()) {
      Alert.alert('Missing info', 'Please provide at least the restaurant name and city.');
      return;
    }

    const email = 'sophina0212@gmail.com';
    const subject = encodeURIComponent(`Restaurant suggestion: ${restaurantName.trim()}`);
    const bodyLines = [
      `Restaurant name: ${restaurantName.trim()}`,
      `City/Area: ${city.trim()}`,
      submitterName.trim() ? `Suggested by: ${submitterName.trim()}` : null,
      contactEmail.trim() ? `Contact email: ${contactEmail.trim()}` : null,
      '',
      'Details / halal notes:',
      details.trim() || '(no additional details provided)',
    ].filter(Boolean);

    const body = encodeURIComponent(bodyLines.join('\n'));
    const url = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Unable to open email', `Please send the details manually to ${email}.`);
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 60}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Restaurant suggestion box</Text>
        <Text style={[styles.body, { color: themeColors.textSecondary }]}>
          Know a hidden gem or a halal-friendly cafe that deserves to be featured? Share the basics
          below and we’ll follow up with verification.
        </Text>

        <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>Restaurant name *</Text>
          <TextInput
            value={restaurantName}
            onChangeText={setRestaurantName}
            placeholder="e.g. Shawarma House"
            placeholderTextColor={themeColors.inputPlaceholder}
            style={[styles.input, { color: themeColors.textPrimary, borderColor: themeColors.border }]}
          />

          <Text style={[styles.label, { color: themeColors.textSecondary }]}>City / neighbourhood *</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Dundee, St Andrews, etc."
            placeholderTextColor={themeColors.inputPlaceholder}
            style={[styles.input, { color: themeColors.textPrimary, borderColor: themeColors.border }]}
          />

          <Text style={[styles.label, { color: themeColors.textSecondary }]}>Details / halal info</Text>
          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="What makes it halal-friendly? Any alcohol policy notes?"
            placeholderTextColor={themeColors.inputPlaceholder}
            style={[
              styles.input,
              styles.multilineInput,
              { color: themeColors.textPrimary, borderColor: themeColors.border },
            ]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={[styles.label, { color: themeColors.textSecondary }]}>Your name (optional)</Text>
          <TextInput
            value={submitterName}
            onChangeText={setSubmitterName}
            placeholder="So we know who to thank"
            placeholderTextColor={themeColors.inputPlaceholder}
            style={[styles.input, { color: themeColors.textPrimary, borderColor: themeColors.border }]}
          />

          <Text style={[styles.label, { color: themeColors.textSecondary }]}>Contact email (optional)</Text>
          <TextInput
            value={contactEmail}
            onChangeText={setContactEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="We’ll only contact you if we need more info"
            placeholderTextColor={themeColors.inputPlaceholder}
            style={[styles.input, { color: themeColors.textPrimary, borderColor: themeColors.border }]}
          />
        </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.accent }]} onPress={handleShare}>
              <Text style={[styles.buttonText, { color: themeColors.accentContrast }]}>Share details</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 24, gap: 16, paddingBottom: 260 },
  title: { fontSize: 24, fontWeight: '800' },
  body: { fontSize: 14, lineHeight: 20 },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  buttonText: { fontSize: 14, textTransform: 'uppercase', fontWeight: '600' },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  label: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 100,
  },
});
