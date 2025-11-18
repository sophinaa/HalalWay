import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePreference } from '../contexts/ThemeContext';

export default function ContactScreen() {
  const { themeColors } = useThemePreference();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Contact us</Text>
        <Text style={[styles.body, { color: themeColors.textSecondary }]}>
          Whether you need help with the app, want to report an issue, or would like to partner with
          us, send a message and we’ll get back to you within a few days.
        </Text>
        <TouchableOpacity
          style={[styles.button, { borderColor: themeColors.border, backgroundColor: themeColors.tagBackground }]}
          onPress={() => {
            const email = 'sophina0212@gmail.com';
            const subject = encodeURIComponent('HalalWay support');
            const body = encodeURIComponent('Hi HalalWay team,\n\n');
            const url = `mailto:${email}?subject=${subject}&body=${body}`;
            Linking.openURL(url).catch(() => {
              Alert.alert('Unable to open email', `Please email us at ${email}`);
            });
          }}
        >
          <Text style={[styles.buttonText, { color: themeColors.textPrimary }]}>Email support</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  body: { fontSize: 14, lineHeight: 20 },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  buttonText: { fontWeight: '600', textTransform: 'uppercase' },
});
