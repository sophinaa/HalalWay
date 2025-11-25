import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import { Image as ExpoImage } from 'expo-image';

import { useAuth } from '../contexts/AuthContext';
import { useFavourites } from '../contexts/FavouritesContext';
import { useSocial } from '../contexts/SocialContext';
import { useThemePreference } from '../contexts/ThemeContext';
import restaurants from '../data/dundeeStAndrewsRestaurants';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, username } = useAuth();
  const { favourites } = useFavourites();
  const { followers, following, mutualCount } = useSocial();
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
  const profilePhotoKey = user ? `profilePhoto:${user.uid}` : null;
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadPhoto = async () => {
      if (!profilePhotoKey) {
        if (isMounted) setProfilePhoto(null);
        return;
      }
      try {
        const stored = await AsyncStorage.getItem(profilePhotoKey);
        if (isMounted) {
          setProfilePhoto(stored);
        }
      } catch (error) {
        if (isMounted) {
          setProfilePhoto(null);
        }
      }
    };
    loadPhoto();
    return () => {
      isMounted = false;
    };
  }, [profilePhotoKey]);

  const persistProfilePhoto = async uri => {
    if (!profilePhotoKey) {
      return;
    }
    try {
      if (uri) {
        await AsyncStorage.setItem(profilePhotoKey, uri);
      } else {
        await AsyncStorage.removeItem(profilePhotoKey);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to persist profile photo', error);
    }
  };

  const handlePhotoResult = async result => {
    if (!result?.canceled && result.assets?.length) {
      const asset = result.assets[0];
      let uri = asset.uri || asset.localUri;
      if (!uri && asset.assetId) {
        try {
          const info = await MediaLibrary.getAssetInfoAsync(asset.assetId);
          uri = info.localUri || info.uri;
        } catch {
          // ignore
        }
      }
      if (!uri) {
        Alert.alert('Error', 'Could not load the selected photo. Please try again.');
        return;
      }
      setProfilePhoto(uri);
      persistProfilePhoto(uri);
    }
  };

  const pickProfilePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const granted = status === 'granted' || status === 'limited';
      if (!granted) {
        Alert.alert('Permission required', 'Please grant photo library permissions to update your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      await handlePhotoResult(result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to pick profile photo', error);
      Alert.alert('Error', 'Unable to pick an image right now. Please try again later.');
    }
  };

  const takeProfilePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant camera permissions to take a profile picture.');
        return;
      }
      const cameraAvailable = await ImagePicker.isCameraAvailableAsync?.();
      if (cameraAvailable === false) {
        Alert.alert('Camera unavailable', 'No camera available on this device.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      await handlePhotoResult(result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to take profile photo', error);
      Alert.alert('Error', 'Unable to take a photo right now. Please try again later.');
    }
  };

  const promptForPhotoSource = () => {
    Alert.alert('Update profile photo', 'Choose how you want to add a photo.', [
      { text: 'Take a photo', onPress: takeProfilePhoto },
      { text: 'Choose from library', onPress: pickProfilePhoto },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleThemeChange = async nextMode => {
    await Haptics.selectionAsync();
    setThemeMode(nextMode);
  };

  const openPhotoModal = () => {
    if (profilePhoto) {
      setPhotoModalVisible(true);
    }
  };

  const closePhotoModal = () => setPhotoModalVisible(false);

  const savePhotoToLibrary = async () => {
    if (!profilePhoto) return;
    try {
      setSavingPhoto(true);
      const { status } = await MediaLibrary.getPermissionsAsync();
      let finalStatus = status;
      if (status !== 'granted') {
        const request = await MediaLibrary.requestPermissionsAsync();
        finalStatus = request.status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permission required', 'Please allow photo access to save your profile picture.');
        return;
      }
      await MediaLibrary.saveToLibraryAsync(profilePhoto);
      Alert.alert('Saved', 'Profile photo saved to your camera roll.');
    } catch (error) {
      Alert.alert('Error', 'Unable to save the photo right now.');
    } finally {
      setSavingPhoto(false);
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
            <TouchableOpacity onPress={openPhotoModal} activeOpacity={0.85}>
              <ExpoImage
                source={{ uri: profilePhoto }}
                style={styles.avatarImage}
                contentFit="cover"
                onError={() => {
                  Alert.alert('Image error', 'Could not load your photo. Please try again.');
                  setProfilePhoto(null);
                }}
              />
            </TouchableOpacity>
          ) : (
            <Text style={[styles.avatarPlaceholder, { color: themeColors.textSecondary }]}>Add photo</Text>
          )}
        </View>
      </View>
      <View style={styles.avatarText}>
        <Text style={[styles.profileName, { color: primaryText }]}>{preferredName}</Text>
        {username ? (
          <Text style={[styles.profileHandle, { color: secondaryText }]}>@{username}</Text>
        ) : null}
        <TouchableOpacity
          style={[styles.avatarButton, { backgroundColor: 'transparent' }]}
          onPress={promptForPhotoSource}
        >
          <Text style={[styles.avatarButtonText, { color: themeColors.accent }]}>Edit profile photo</Text>
        </TouchableOpacity>
      </View>
      </View>
      <View style={[styles.section, styles.socialSection, { backgroundColor: cardBackground, borderColor }]}>
        <View style={styles.socialHeader}>
          <Text style={[styles.sectionTitle, { color: primaryText, textAlign: 'left', marginBottom: 0 }]}>
            Friends
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Social')}>
            <Text style={[styles.socialLink, { color: themeColors.accent }]}>Open social</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.socialStatsRow}>
          <TouchableOpacity
            style={[styles.socialStat, { borderColor }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Social', { tab: 'followers' })}
          >
            <Text style={[styles.socialStatLabel, { color: secondaryText }]}>Followers</Text>
            <Text style={[styles.socialStatValue, { color: primaryText }]}>{followers.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialStat, { borderColor }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Social', { tab: 'following' })}
          >
            <Text style={[styles.socialStatLabel, { color: secondaryText }]}>Following</Text>
            <Text style={[styles.socialStatValue, { color: primaryText }]}>{following.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialStat, { borderColor }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Social', { tab: 'followers' })}
          >
            <Text style={[styles.socialStatLabel, { color: secondaryText }]}>Mutual</Text>
            <Text style={[styles.socialStatValue, { color: primaryText }]}>{mutualCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          styles.section,
          styles.favouritesSection,
          { backgroundColor: 'transparent', borderWidth: 0, padding: 0 },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: primaryText, textAlign: 'left' }]}>
          Favourite restaurants
        </Text>
        {favouriteRestaurants.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.favouritesScroll}
          >
            {favouriteRestaurants.map(restaurant => (
              <TouchableOpacity
                key={restaurant.id}
                style={[
                  styles.favouritePill,
                  {
                    backgroundColor: cardBackground,
                    borderColor,
                  },
                ]}
                onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: restaurant.id })}
                activeOpacity={0.85}
              >
                <Text style={[styles.favouriteTitle, { color: primaryText }]} numberOfLines={1}>
                  {restaurant.name}
                </Text>
                <Text style={[styles.favouriteMeta, { color: secondaryText }]} numberOfLines={1}>
                  {restaurant.cuisine || 'Restaurant'} · {restaurant.city}
                </Text>
                <Text style={[styles.favouriteMeta, { color: secondaryText }]} numberOfLines={1}>
                  Halal: {restaurant.halalInfo?.overallStatus ?? 'unknown'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
            onValueChange={value => handleThemeChange(value ? 'system' : theme)}
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
                onPress={() => handleThemeChange(mode)}
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
          { title: 'Friends & social', description: 'Followers, following, and suggestions', target: 'Social' },
          { title: 'Messages', description: 'Chat with mutuals', target: 'Messages' },
        ].map(link => (
          <TouchableOpacity
            key={link.title}
            style={[styles.linkCard, { backgroundColor: cardBackground, borderColor }]}
            onPress={() =>
              navigation.navigate(link.target, {
                tab: link.title === 'Friends & social' ? 'followers' : undefined,
              })
            }
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
      <Modal
        visible={photoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closePhotoModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: cardBackground, borderColor }]}>
            {profilePhoto ? (
              <ExpoImage
                source={{ uri: profilePhoto }}
                style={styles.modalImage}
                contentFit="contain"
                onError={() => {
                  Alert.alert('Image error', 'Could not load your photo preview.');
                }}
              />
            ) : null}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: themeColors.accent }]}
                onPress={savePhotoToLibrary}
                disabled={savingPhoto}
              >
                <Text style={[styles.modalButtonText, { color: themeColors.accentContrast }]}>
                  {savingPhoto ? 'Saving...' : 'Save to camera roll'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: 'transparent', borderColor }]} onPress={closePhotoModal}>
                <Text style={[styles.modalButtonText, { color: primaryText }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  section: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
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
  profileHandle: {
    fontSize: 13,
    marginTop: 2,
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
  favouritesScroll: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  socialSection: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    gap: 12,
  },
  socialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialLink: {
    fontWeight: '700',
    fontSize: 13,
  },
  socialStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialStat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  socialStatLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  socialStatValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  favouritePill: {
    width: 220,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginRight: 12,
    gap: 4,
  },
  favouriteTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  favouriteMeta: {
    fontSize: 12,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 320,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalActions: {
    width: '100%',
    gap: 10,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: '700',
  },
});

export default ProfileScreen;
