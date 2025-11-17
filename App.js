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
import RestaurantDetailsScreen from './screens/RestaurantDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#6b7280',
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            HomeTab: 'home',
            MapTab: 'map',
            ProfileTab: 'person',
          };
          return <MaterialIcons name={iconMap[route.name] ?? 'trip-origin'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="MapTab" component={MapScreen} options={{ title: 'Map' }} />
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
        <FavouritesProvider>
          <AppNavigator />
        </FavouritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
