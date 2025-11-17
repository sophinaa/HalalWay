import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#0b1120' : '#fff';
  const cardColor = isDark ? '#111827' : '#fff';
  const primaryText = isDark ? '#f8fafc' : '#111827';
  const secondaryText = isDark ? '#cbd5f5' : '#6b7280';

  const onSubmit = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter email and password.');
        return;
      }
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await signup(email.trim(), password);
      }
    } catch (err) {
      Alert.alert('Error', err?.message ?? 'Something went wrong');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: primaryText }]}>HalalWay</Text>
      <Text style={[styles.subtitle, { color: secondaryText }]}>
        {mode === 'login' ? 'Log in to your account' : 'Create a new account'}
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: cardColor, color: primaryText, borderColor: isDark ? '#334155' : '#d1d5db' },
        ]}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[
          styles.input,
          { backgroundColor: cardColor, color: primaryText, borderColor: isDark ? '#334155' : '#d1d5db' },
        ]}
        placeholder="Password (min 6 chars)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>{mode === 'login' ? 'Log in' : 'Sign up'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
        style={styles.switchMode}
      >
        <Text style={[styles.switchText, { color: secondaryText }]}>
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  switchMode: { marginTop: 16, alignItems: 'center' },
  switchText: { fontSize: 14 },
});

export default LoginScreen;
