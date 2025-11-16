import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tint = '#16a34a';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
        tabBarStyle: {
          borderTopColor: '#e2e8f0',
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName: Record<string, keyof typeof MaterialIcons.glyphMap> = {
            index: 'home',
            map: 'map',
            profile: 'person',
          };
          return <MaterialIcons name={iconName[route.name] ?? 'trip-origin'} size={size} color={color} />;
        },
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
