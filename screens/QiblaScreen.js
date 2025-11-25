import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import { useThemePreference } from '../contexts/ThemeContext';

const DEFAULT_COORDS = { lat: 56.46, lng: -2.97 }; // Dundee fallback
const MAKKAH_COORDS = { lat: 21.4225, lng: 39.8262 };

export default function QiblaScreen() {
  const { themeColors } = useThemePreference();
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [direction, setDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heading, setHeading] = useState(0);
  const [headingError, setHeadingError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let locationWatcher;
    const loadLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied. Using Dundee as a fallback.');
          setLoading(false);
          return;
        }
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (isMounted) {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
        locationWatcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 50,
          },
          pos => {
            if (isMounted && pos?.coords) {
              setCoords({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
            }
          },
        );
      } catch (err) {
        if (isMounted) {
          setError('Unable to read location. Using Dundee as a fallback.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadLocation();
    return () => {
      isMounted = false;
      locationWatcher?.remove?.();
    };
  }, []);

  useEffect(() => {
    let subscription;
    const watchHeading = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setHeadingError('Compass permission denied.');
          return;
        }
        subscription = await Location.watchHeadingAsync(result => {
          const nextHeading =
            result?.trueHeading != null && !Number.isNaN(result.trueHeading)
              ? result.trueHeading
              : result?.magHeading != null && !Number.isNaN(result.magHeading)
              ? result.magHeading
              : null;
          if (nextHeading != null) {
            setHeading(nextHeading);
          }
        });
      } catch (err) {
        setHeadingError('Compass unavailable.');
      }
    };
    watchHeading();
    return () => {
      subscription?.remove?.();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchDirection = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/qibla/${coords.lat}/${coords.lng}`,
        );
        const json = await response.json();
        if (!isMounted) return;
        if (json?.code === 200) {
          setDirection(json.data.direction);
          setError(null);
        } else {
          setDirection(null);
          setError('Unable to fetch Qibla direction right now.');
        }
      } catch (err) {
        if (isMounted) {
          setDirection(null);
          setError('Unable to fetch Qibla direction right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchDirection();
    return () => {
      isMounted = false;
    };
  }, [coords.lat, coords.lng]);

  const relativeDirection =
    direction != null
      ? ((direction - heading) % 360 + 360) % 360
      : null;

  const openQiblaMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${MAKKAH_COORDS.lat},${MAKKAH_COORDS.lng}`;
    Linking.openURL(url).catch(() => {
      // best effort only
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Qibla Finder</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Use the compass below to align your device toward the Kaaba in Makkah. When the arrow
            points to the highlighted zone, you’re facing the Qibla.
          </Text>
        </View>

        <View style={[styles.compassCard, { backgroundColor: themeColors.card }]}>
          <View style={[styles.compass, { borderColor: themeColors.border }]}>
            <View
              style={[
                styles.needleWrapper,
                relativeDirection != null ? { transform: [{ rotate: `${relativeDirection}deg` }] } : null,
              ]}
            >
              <View style={[styles.compassNeedle, { backgroundColor: themeColors.accent }]} />
            </View>
            <View style={[styles.compassHub, { backgroundColor: themeColors.card }]} />
            <Text style={[styles.compassLabel, { color: themeColors.textSecondary }]}>N</Text>
          </View>
          {loading ? (
            <ActivityIndicator color={themeColors.accent} style={{ marginTop: 12 }} />
          ) : direction != null ? (
            <Text style={[styles.directionText, { color: themeColors.textPrimary }]}>
              Qibla is {direction.toFixed(1)}° from true North
            </Text>
          ) : (
            <Text style={[styles.directionText, { color: themeColors.textSecondary }]}>
              Unable to determine Qibla direction.
            </Text>
          )}
          <Text style={[styles.locationText, { color: themeColors.textSecondary }]}>
            Using coordinates: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </Text>
        </View>

        <View style={styles.infoBlock}>
          {error ? (
            <Text style={[styles.errorText, { color: themeColors.accent }]}>{error}</Text>
          ) : null}
          {headingError ? (
            <Text style={[styles.errorText, { color: themeColors.accent }]}>{headingError}</Text>
          ) : (
            <Text style={[styles.locationText, { color: themeColors.textSecondary }]}>
              Device heading: {heading.toFixed(0)}°
            </Text>
          )}
          <Text style={[styles.note, { color: themeColors.textSecondary }]}>
            Tip: Move your device slowly in a figure-eight motion to calibrate the compass sensor.
            For best accuracy, keep your phone flat and away from magnets or metal.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.accent }]}
          onPress={openQiblaMap}
        >
          <Text style={[styles.buttonText, { color: themeColors.accentContrast }]}>Open in Maps</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    gap: 24,
  },
  header: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  compassCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
  },
  compass: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassNeedle: {
    width: 6,
    height: 100,
    borderRadius: 3,
  },
  needleWrapper: {
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  compassHub: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  compassLabel: {
    position: 'absolute',
    top: 12,
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
  },
  infoBlock: {
    gap: 8,
  },
  button: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  directionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
