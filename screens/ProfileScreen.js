import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { useFavourites } from '../contexts/FavouritesContext';
import { useThemePreference } from '../contexts/ThemeContext';
import restaurants from '../data/dundeeStAndrewsRestaurants';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { favourites } = useFavourites();
  const { theme, themeMode, setThemeMode } = useThemePreference();
  const isDark = theme === 'dark';
  const useSystemTheme = themeMode === 'system';
  const backgroundColor = isDark ? '#0b1120' : '#fff';
  const cardBackground = isDark ? '#1f2937' : '#fff';
  const borderColor = isDark ? '#334155' : '#e5e7eb';
  const primaryText = isDark ? '#f8fafc' : '#111827';
  const secondaryText = isDark ? '#cbd5f5' : '#475569';

  const favouriteRestaurants = restaurants.filter(r => favourites.includes(r.id));

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.title, { color: primaryText }]}>Not logged in</Text>
        <Text style={[styles.text, { color: secondaryText }]}>Please log in to see your profile.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: primaryText }]}>Profile</Text>

      <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
        <Text style={[styles.label, { color: secondaryText }]}>Email</Text>
        <Text style={[styles.value, { color: primaryText }]}>{user.email}</Text>

        <Text style={[styles.label, { color: secondaryText }]}>User ID</Text>
        <Text style={[styles.value, { color: primaryText }]} numberOfLines={1}>
          {user.uid}
        </Text>

        <Text style={[styles.label, { color: secondaryText }]}>Verified</Text>
        <Text style={[styles.value, { color: primaryText }]}>{user.emailVerified ? 'Yes' : 'No'}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: 'transparent', borderWidth: 0, padding: 0 }]}>
        <Text style={[styles.sectionTitle, { color: primaryText }]}>Appearance</Text>
        <View style={styles.appearanceRow}>
          <Text style={[styles.value, { color: primaryText }]}>Match device theme</Text>
          <Switch
            value={useSystemTheme}
            onValueChange={value => setThemeMode(value ? 'system' : theme)}
            thumbColor={isDark ? '#0f172a' : '#f8fafc'}
            trackColor={{ false: '#94a3b8', true: '#16a34a' }}
          />
        </View>
        {!useSystemTheme && (
          <View style={styles.themeButtons}>
            {['light', 'dark'].map(mode => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeButton,
                  {
                    borderColor: borderColor,
                    backgroundColor:
                      themeMode === mode ? (mode === 'dark' ? '#0f172a' : '#16a34a') : cardBackground,
                  },
                ]}
                onPress={() => setThemeMode(mode)}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    { color: themeMode === mode ? '#fff' : primaryText },
                  ]}
                >
                  {mode === 'light' ? 'Light' : 'Dark'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={[styles.sectionTitle, { color: primaryText }]}>My Favourite Restaurants</Text>
        {favouriteRestaurants.length === 0 ? (
          <Text style={[styles.value, { color: secondaryText }]}>No favourites yet.</Text>
        ) : (
          favouriteRestaurants.map(r => (
            <Text key={r.id} style={[styles.value, { color: primaryText }]}>
              • {r.name}
            </Text>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  label: { fontSize: 13, color: '#6b7280', marginTop: 8 },
  value: { fontSize: 15, color: '#111827' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  appearanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeButtonText: {
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  text: { fontSize: 14, color: '#333' },
});

export default ProfileScreen;
