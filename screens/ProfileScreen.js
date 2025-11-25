import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../contexts/AuthContext';
import { useFavourites } from '../contexts/FavouritesContext';
import { useSocial } from '../contexts/SocialContext';
import { useThemePreference } from '../contexts/ThemeContext';
import restaurants from '../data/dundeeStAndrewsRestaurants';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, username } = useAuth();
  const { favourites } = useFavourites();
  const { followers, following, mutualCount } = useSocial();
  const {
    theme,
    themeMode,
    setThemeMode,
    themeColors,
    themeName,
    setThemeName,
    accessibilityMode,
    setAccessibilityMode,
    accessibilityScale,
    setAccessibilityScale,
  } = useThemePreference();
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
  const initialsForName = name => {
    if (!name) return 'HW';
    const cleaned = name.trim();
    if (!cleaned) return 'HW';
    const parts = cleaned.split(/\s+/).slice(0, 2);
    return parts.map(part => part[0]?.toUpperCase() ?? '').join('') || 'HW';
  };
  const [avatarUri, setAvatarUri] = useState(null);
  const favouriteRestaurants = restaurants.filter(r => favourites.includes(r.id));
  const themeChoices = [
    { key: 'default', label: 'Original', swatch: ['#3a5974', '#f8fafc'] },
    { key: 'autumn', label: 'Autumn', swatch: ['#5c1f28', '#d8b7a0'] },
    { key: 'blush', label: 'Blush', swatch: ['#f7dce5', '#4a1c2a'] },
    { key: 'forest', label: 'Forest', swatch: ['#99ce63', '#243b2c'] },
    { key: 'ocean', label: 'Ocean', swatch: ['#2f5388', '#c8f1ff'] },
    { key: 'amethyst', label: 'Amethyst', swatch: ['#9d4edd', '#10002b'] },
  ];
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const saved = await AsyncStorage.getItem('profileAvatarUri');
        if (saved) {
          // eslint-disable-next-line no-console
          console.log('Loaded avatarUri:', saved);
          setAvatarUri(saved);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error loading avatar:', e);
      }
    };

    loadAvatar();
  }, []);

  const handleChangeAvatar = async () => {
    try {
      const choice = await new Promise(resolve => {
        Alert.alert(
          'Profile photo',
          'How would you like to add your photo?',
          [
            { text: 'Take photo', onPress: () => resolve('camera') },
            { text: 'Choose from library', onPress: () => resolve('library') },
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
          ],
          { cancelable: true },
        );
      });

      if (!choice) return;

      if (choice === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera access is required.');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets[0]?.uri) {
          const uri = result.assets[0].uri;
          // eslint-disable-next-line no-console
          console.log('Camera uri:', uri);
          setAvatarUri(uri);
          await AsyncStorage.setItem('profileAvatarUri', uri);
        }
        return;
      }

      if (choice === 'library') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Photo library access is required.');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets[0]?.uri) {
          const uri = result.assets[0].uri;
          // eslint-disable-next-line no-console
          console.log('Library uri:', uri);
          setAvatarUri(uri);
          await AsyncStorage.setItem('profileAvatarUri', uri);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Error changing avatar:', e);
      Alert.alert('Error', 'Something went wrong while changing your photo.');
    }
  };

  const handleThemeChange = async nextMode => {
    await Haptics.selectionAsync();
    setThemeMode(nextMode);
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
          <TouchableOpacity
            style={[
              styles.avatar,
              { backgroundColor: themeColors.tagBackground, borderColor: themeColors.border },
            ]}
            onPress={handleChangeAvatar}
            activeOpacity={0.85}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={[styles.avatarInitials, { color: themeColors.textSecondary }]}>
                  {initialsForName(user?.displayName || user?.email || preferredName)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.avatarText}>
          <Text style={[styles.profileName, { color: primaryText }]}>{preferredName}</Text>
          {username ? (
            <Text style={[styles.profileHandle, { color: secondaryText }]}>@{username}</Text>
          ) : null}
          <TouchableOpacity style={[styles.avatarButton, { backgroundColor: 'transparent' }]} onPress={handleChangeAvatar}>
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
            onPress={() => navigation.navigate('Social', { tab: 'mutual' })}
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
      <View style={[styles.section, styles.themeSection, { backgroundColor: cardBackground, borderColor }]}>
        <Text style={[styles.sectionTitle, { color: primaryText, textAlign: 'left' }]}>Themes</Text>
        <Text style={[styles.sectionHint, { color: secondaryText }]}>
          Pick a palette and light/dark mode. Your choice is saved to your profile.
        </Text>
        <View style={styles.appearanceRow}>
          <Text style={[styles.value, { color: primaryText, textAlign: 'left' }]}>High contrast & large text</Text>
          <Switch
            value={accessibilityMode === 'accessible'}
            onValueChange={value => setAccessibilityMode(value ? 'accessible' : 'standard')}
            thumbColor={themeColors.card}
            trackColor={{ false: themeColors.muted, true: themeColors.accent }}
          />
        </View>
        {accessibilityMode === 'accessible' ? (
          <View style={styles.sliderBlock}>
            <Text style={[styles.value, { color: primaryText }]}>Text size is enlarged while on.</Text>
          </View>
        ) : null}
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
        <TouchableOpacity
          style={[
            styles.themeSelectButton,
            { borderColor, backgroundColor: themeColors.card },
          ]}
          onPress={() => setThemePickerOpen(true)}
          activeOpacity={0.9}
          >
            <Text style={[styles.themeSelectLabel, { color: primaryText }]}>Theme</Text>
            <View style={styles.themeSelectValueRow}>
              <View style={styles.swatchRow}>
                {(themeChoices.find(choice => choice.key === themeName)?.swatch ?? []).map(color => (
                <View key={color} style={[styles.swatchDot, { backgroundColor: color }]} />
              ))}
            </View>
              <Text style={[styles.themeSelectValue, { color: secondaryText }]}>
                {themeChoices.find(choice => choice.key === themeName)?.label ?? 'Choose'}
              </Text>
            </View>
            <Text style={[styles.themeSelectHint, { color: secondaryText }]}>
              Pick a palette for buttons, cards, and tags.
            </Text>
          </TouchableOpacity>
        <Modal
          visible={themePickerOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setThemePickerOpen(false)}
        >
          <View style={styles.themeModalBackdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setThemePickerOpen(false)} />
            <View style={[styles.themeModalCard, { backgroundColor: cardBackground, borderColor }]}>
              <Text style={[styles.sheetTitle, { color: primaryText }]}>Select theme</Text>
              <Text style={[styles.sheetSubtitle, { color: secondaryText }]}>Tap a theme to apply instantly.</Text>
              <ScrollView
                style={styles.themeOptionScroll}
                contentContainerStyle={styles.themeOptionList}
                showsVerticalScrollIndicator={false}
              >
                {themeChoices.map(choice => {
                  const active = choice.key === themeName;
                  return (
                    <TouchableOpacity
                      key={choice.key}
                      style={[
                        styles.themeOption,
                        {
                          borderColor: active ? themeColors.accent : borderColor,
                          backgroundColor: active ? themeColors.tagBackground : themeColors.card,
                        },
                      ]}
                      onPress={() => {
                        setThemeName(choice.key);
                        setThemePickerOpen(false);
                      }}
                      activeOpacity={0.9}
                    >
                      <View style={styles.swatchRow}>
                        {choice.swatch.map(color => (
                          <View key={color} style={[styles.swatchDot, { backgroundColor: color }]} />
                        ))}
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={[styles.themeOptionLabel, { color: primaryText }]}>{choice.label}</Text>
                        {active ? (
                          <Text style={[styles.themeOptionActive, { color: themeColors.accent }]}>Selected</Text>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                style={[styles.closeSheetButton, { backgroundColor: themeColors.accent }]}
                onPress={() => setThemePickerOpen(false)}
                activeOpacity={0.9}
              >
                <Text style={[styles.closeSheetText, { color: themeColors.accentContrast }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  sectionHint: { fontSize: 12, marginBottom: 8 },
  swatchRow: {
    flexDirection: 'row',
    gap: 6,
  },
  swatchDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#ffffff33',
  },
  themePaletteLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  themeSelectButton: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  themeSelectLabel: { fontSize: 13, fontWeight: '700' },
  themeSelectValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  themeSelectValue: { fontSize: 13, fontWeight: '600' },
  themeSelectHint: { fontSize: 12, marginTop: 4 },
  sliderBlock: { marginTop: 8 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sliderValue: { fontSize: 12, fontWeight: '600' },
  themeModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  themeModalCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    paddingBottom: 72,
  },
  themeOptionScroll: { maxHeight: 360 },
  themeOptionList: { gap: 8, marginTop: 8 },
  themeOption: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeOptionLabel: { fontWeight: '700', fontSize: 13 },
  themeOptionActive: { fontSize: 12, marginTop: 2 },
  closeSheetButton: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeSheetText: { fontWeight: '700', fontSize: 14 },
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
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '600',
    color: '#555',
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
    textAlign: 'center',
  },
  socialStatValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
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
});

export default ProfileScreen;
