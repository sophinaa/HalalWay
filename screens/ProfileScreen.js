import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import restaurants from '../data/dundeeStAndrewsRestaurants';
import { useAuth } from '../contexts/AuthContext';
import { useFavourites } from '../contexts/FavouritesContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { favourites } = useFavourites();
  const favouriteRestaurants = restaurants.filter(r => favourites.includes(r.id));

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Not logged in</Text>
        <Text style={styles.text}>Please log in to see your profile.</Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={styles.sectionTitle}>My Favourite Restaurants</Text>
        {favouriteRestaurants.length === 0 ? (
          <Text style={styles.value}>No favourites yet.</Text>
        ) : (
          favouriteRestaurants.map(r => (
            <Text key={r.id} style={styles.value}>
              • {r.name}
            </Text>
          ))
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>User ID</Text>
        <Text style={styles.value} numberOfLines={1}>
          {user.uid}
        </Text>

        <Text style={styles.label}>Verified</Text>
        <Text style={styles.value}>{user.emailVerified ? 'Yes' : 'No'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  text: {
    fontSize: 14,
    color: '#475569',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  label: { fontSize: 13, color: '#6b7280', marginTop: 8 },
  value: { fontSize: 15, color: '#111827' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen;
