import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../contexts/AuthContext';
import { useFavourites } from '../contexts/FavouritesContext';
import { useThemePreference } from '../contexts/ThemeContext';
import restaurants from '../data/dundeeStAndrewsRestaurants';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { favourites } = useFavourites();
  const { theme, themeMode, setThemeMode, themeColors } = useThemePreference();
  const useSystemTheme = themeMode === 'system';
  const backgroundColor = themeColors.background;
  const cardBackground = themeColors.card;
  const borderColor = themeColors.border;
  const primaryText = themeColors.textPrimary;
  const secondaryText = themeColors.textSecondary;

  const preferredName =
    (user?.displayName && user.displayName.trim()) ||
    user?.email?.split('@')[0] ||
    'HalalWay user';
  const favouriteRestaurants = restaurants.filter(r => favourites.includes(r.id));
  const [profilePhoto, setProfilePhoto] = useState(null);

  const pickProfilePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant photo library permissions to update your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to pick an image right now. Please try again later.');
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top']}>
        <View style={styles.centered}>
          <Text style={[styles.title, { color: primaryText }]}>Not logged in</Text>
          <Text style={[styles.text, { color: secondaryText }]}>Please log in to see your profile.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: primaryText, textAlign: 'center' }]}>Profile</Text>
      <View style={styles.avatarRow}>
        <View style={styles.avatarSection}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: themeColors.tagBackground, borderColor: themeColors.border },
          ]}
        >
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
          ) : (
            <Text style={[styles.avatarPlaceholder, { color: themeColors.textSecondary }]}>Add photo</Text>
          )}
        </View>
      </View>
      <View style={styles.avatarText}>
        <Text style={[styles.profileName, { color: primaryText }]}>{preferredName}</Text>
        <TouchableOpacity
          style={[styles.avatarButton, { backgroundColor: 'transparent' }]}
          onPress={pickProfilePhoto}
        >
          <Text style={[styles.avatarButtonText, { color: themeColors.accent }]}>Edit profile photo</Text>
        </TouchableOpacity>
      </View>
      </View>
      <View style={[styles.section, styles.favouritesSection, { backgroundColor: 'transparent', borderWidth: 0, padding: 0 }]}>
        <Text style={[styles.sectionTitle, { color: primaryText, textAlign: 'left' }]}>Favourite restaurants</Text>
        {favouriteRestaurants.length > 0 ? (
          <TouchableOpacity
            style={[
              styles.smallCard,
              styles.favouriteCard,
              { backgroundColor: cardBackground, borderColor },
            ]}
            onPress={() => Alert.alert('Coming soon', 'Favourites screen coming soon!')}
          >
            <Text style={[styles.smallCardValue, { color: primaryText }]}>
              {favouriteRestaurants.length} saved spot{favouriteRestaurants.length === 1 ? '' : 's'}
            </Text>
            <Text style={[styles.smallCardDescription, { color: secondaryText }]}>
              Tap to view and manage your saved places.
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.noFavourites}>
            <Text style={[styles.noFavText, { color: secondaryText }]}>
              Favourite a restaurant to save it here.
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.section, styles.appearanceSection, { backgroundColor: 'transparent', borderWidth: 0, padding: 0 }]}>
        <Text style={[styles.sectionTitle, { color: primaryText, textAlign: 'left' }]}>Appearance</Text>
        <View style={styles.appearanceRow}>
          <Text style={[styles.value, { color: primaryText, textAlign: 'left' }]}>Match device theme</Text>
          <Switch
            value={useSystemTheme}
            onValueChange={value => setThemeMode(value ? 'system' : theme)}
            thumbColor={themeColors.card}
            trackColor={{ false: themeColors.muted, true: themeColors.accent }}
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
                    borderColor,
                    backgroundColor: themeMode === mode ? themeColors.accent : cardBackground,
                  },
                ]}
                onPress={() => setThemeMode(mode)}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    { color: themeMode === mode ? themeColors.accentContrast : primaryText },
                  ]}
                >
                  {mode === 'light' ? 'Light' : 'Dark'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.quickLinks}>
        {[
          { title: 'Personal details', description: 'Manage email and user ID', target: 'PersonalDetails' },
          { title: 'Suggest a restaurant', description: 'Help us add new halal spots', target: 'SuggestRestaurant' },
          { title: 'Support HalalWay', description: 'Fund audits & student researchers', target: 'Support' },
          { title: 'Contact us', description: 'Partnerships, help, and audits', target: 'Contact' },
          { title: 'Notifications', description: 'Pick which updates to receive', target: 'NotificationSettings' },
          { title: 'About & terms', description: 'Learn how HalalWay works', target: 'Legal' },
        ].map(link => (
          <TouchableOpacity
            key={link.title}
            style={[styles.linkCard, { backgroundColor: cardBackground, borderColor }]}
            onPress={() => navigation.navigate(link.target)}
          >
            <Text style={[styles.linkTitle, { color: primaryText }]}>{link.title}</Text>
            <Text style={[styles.linkDescription, { color: secondaryText }]}>{link.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutLink} onPress={logout}>
        <Text style={[styles.logoutText, { color: secondaryText }]}>Log out</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  label: { fontSize: 13, marginTop: 8, textAlign: 'center' },
  value: { fontSize: 15, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarText: {
    flex: 1,
    alignItems: 'flex-start',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    fontSize: 12,
  },
  avatarButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  avatarButtonText: {
    fontWeight: '600',
  },
  sectionButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
  },
  sectionButtonText: {
    fontWeight: '600',
  },
  linkRow: {
    paddingVertical: 10,
  },
  logoutLink: {
    alignItems: 'center',
    marginTop: 32,
  },
  logoutText: { fontSize: 14, fontWeight: '600' },
  text: { fontSize: 14 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  topCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  smallCard: {
    flex: 1,
    minWidth: 160,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  smallCardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  smallCardValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  smallCardDescription: {
    fontSize: 13,
  },
  noFavourites: {
    marginTop: 16,
    alignItems: 'center',
  },
  noFavText: {
    fontSize: 13,
  },
  quickLinks: {
    gap: 12,
    marginTop: 16,
  },
  favouritesSection: {
    marginTop: 12,
  },
  linkCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 4,
    alignItems: 'center',
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  linkDescription: {
    fontSize: 13,
    textAlign: 'center',
  },
  favouriteCard: {
    width: '100%',
    alignItems: 'flex-start',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  appearanceSection: {
    marginTop: 24,
  },
});

export default ProfileScreen;
