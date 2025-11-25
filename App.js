import * as React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavouritesProvider } from './contexts/FavouritesContext';
import { ThemeProvider, useThemePreference } from './contexts/ThemeContext';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';
import QiblaScreen from './screens/QiblaScreen';
import RestaurantDetailsScreen from './screens/RestaurantDetailsScreen';
import SuggestRestaurantScreen from './screens/SuggestRestaurantScreen';
import SupportScreen from './screens/SupportScreen';
import ContactScreen from './screens/ContactScreen';
import PersonalDetailsScreen from './screens/PersonalDetailsScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import LegalScreen from './screens/LegalScreen';
import SocialScreen from './screens/SocialScreen';
import PersonProfileScreen from './screens/PersonProfileScreen';
import { SocialProvider } from './contexts/SocialContext';
import { MessagesProvider } from './contexts/MessagesContext';
import MessagesScreen from './screens/MessagesScreen';
import MessageThreadScreen from './screens/MessageThreadScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { themeColors } = useThemePreference();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: themeColors.accent,
        tabBarInactiveTintColor: themeColors.muted,
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.border,
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            HomeTab: 'home',
            MapTab: 'map',
            QiblaTab: 'explore',
            ProfileTab: 'person',
          };
          return <MaterialIcons name={iconMap[route.name] ?? 'trip-origin'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="MapTab" component={MapScreen} options={{ title: 'Map' }} />
      <Tab.Screen name="QiblaTab" component={QiblaScreen} options={{ title: 'Qibla' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, initialising } = useAuth();

  if (initialising) {
    return null;
  }

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="RestaurantDetails"
            component={RestaurantDetailsScreen}
            options={{ title: 'Details' }}
          />
          <Stack.Screen name="SuggestRestaurant" component={SuggestRestaurantScreen} options={{ title: 'Suggest a restaurant' }} />
          <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Support HalalWay' }} />
          <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact us' }} />
          <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} options={{ title: 'Personal details' }} />
          <Stack.Screen
            name="NotificationSettings"
            component={NotificationSettingsScreen}
            options={{ title: 'Notifications' }}
          />
          <Stack.Screen name="Legal" component={LegalScreen} options={{ title: 'About & terms' }} />
          <Stack.Screen name="Social" component={SocialScreen} options={{ title: 'Social' }} />
          <Stack.Screen name="PersonProfile" component={PersonProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: 'Messages' }} />
          <Stack.Screen name="MessageThread" component={MessageThreadScreen} options={{ title: 'Chat' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { theme } = useThemePreference();
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocialProvider>
          <MessagesProvider>
            <FavouritesProvider>
              <AppNavigator />
            </FavouritesProvider>
          </MessagesProvider>
        </SocialProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
