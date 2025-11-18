import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from './AuthContext';

const defaultValue = {
  favourites: [],
  addFavourite: () => {},
  removeFavourite: () => {},
  isFavourite: () => false,
};

const FavouritesContext = createContext(defaultValue);

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const storageKey = user ? `favourites:${user.uid}` : null;

  useEffect(() => {
    let isMounted = true;
    const loadFavourites = async () => {
      if (!storageKey) {
        if (isMounted) setFavourites([]);
        return;
      }
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (raw && isMounted) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setFavourites(parsed);
          } else {
            setFavourites([]);
          }
        } else if (isMounted) {
          setFavourites([]);
        }
      } catch (error) {
        if (isMounted) {
          setFavourites([]);
        }
      }
    };
    loadFavourites();
    return () => {
      isMounted = false;
    };
  }, [storageKey]);

  const persist = async next => {
    if (!storageKey) return;
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to persist favourites', error);
    }
  };

  const addFavourite = id => {
    if (!id) return;
    setFavourites(prev => {
      const next = [...new Set([...prev, id])];
      persist(next);
      return next;
    });
  };

  const removeFavourite = id => {
    if (!id) return;
    setFavourites(prev => {
      const next = prev.filter(item => item !== id);
      persist(next);
      return next;
    });
  };

  const isFavourite = id => {
    if (!id || !Array.isArray(favourites)) {
      return false;
    }
    return favourites.includes(id);
  };

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export default FavouritesContext;
