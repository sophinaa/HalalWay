import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from './AuthContext';

const SocialContext = createContext(null);

const seedSocialState = {
  followers: [
    { id: 'amina', name: 'Amina Khadri', handle: 'aminakh', city: 'Dundee', note: 'Tries every biryani spot' },
    { id: 'basit', name: 'Basit Rahman', handle: 'basitra', city: 'St Andrews', note: 'Sends dessert recs' },
    { id: 'leena', name: 'Leena Chen', handle: 'leenac', city: 'Glasgow', note: 'Halal brunch hunter' },
  ],
  following: [
    { id: 'fatima', name: 'Fatima Ali', handle: 'fatimaal', city: 'Edinburgh', note: 'Burger reviewer' },
    { id: 'yusuf', name: 'Yusuf Patel', handle: 'yusufp', city: 'Dundee', note: 'Knows every late-night spot' },
  ],
  suggested: [
    { id: 'omar', name: 'Omar Ridwan', handle: 'omaruk', city: 'St Andrews', note: 'New in town' },
    { id: 'safa', name: 'Safa Noor', handle: 'safaeats', city: 'Aberdeen', note: 'Shares hidden gems' },
  ],
};

export const SocialProvider = ({ children }) => {
  const { user } = useAuth();
  const [socialState, setSocialState] = useState(seedSocialState);
  const storageKey = user ? `social:${user.uid}` : null;

  useEffect(() => {
    let isMounted = true;
    const loadState = async () => {
      if (!storageKey) {
        if (isMounted) setSocialState(seedSocialState);
        return;
      }
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored && isMounted) {
          setSocialState(JSON.parse(stored));
        } else if (isMounted) {
          setSocialState(seedSocialState);
        }
      } catch {
        if (isMounted) {
          setSocialState(seedSocialState);
        }
      }
    };
    loadState();
    return () => {
      isMounted = false;
    };
  }, [storageKey]);

  const persistState = async nextState => {
    if (!storageKey) return;
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(nextState));
    } catch {
      // best effort persistence only
    }
  };

  const setAndPersist = updater => {
    setSocialState(prev => {
      const nextState = typeof updater === 'function' ? updater(prev) : updater;
      persistState(nextState);
      return nextState;
    });
  };

  const followUser = person => {
    if (!person) return;
    setAndPersist(prev => {
      const alreadyFollowing = prev.following.some(p => p.id === person.id);
      if (alreadyFollowing) return prev;
      const next = {
        ...prev,
        following: [...prev.following, person],
        suggested: prev.suggested.filter(p => p.id !== person.id),
      };
      return next;
    });
  };

  const unfollowUser = personId => {
    setAndPersist(prev => ({
      ...prev,
      following: prev.following.filter(p => p.id !== personId),
      suggested: prev.suggested.some(p => p.id === personId)
        ? prev.suggested
        : [...prev.suggested, prev.following.find(p => p.id === personId)].filter(Boolean),
    }));
  };

  const followBack = personId => {
    setAndPersist(prev => {
      const person = prev.followers.find(p => p.id === personId);
      if (!person) return prev;
      const alreadyFollowing = prev.following.some(p => p.id === personId);
      if (alreadyFollowing) return prev;
      return {
        ...prev,
        following: [...prev.following, person],
        suggested: prev.suggested.filter(p => p.id !== personId),
      };
    });
  };

  const isFollowing = personId => socialState.following.some(p => p.id === personId);

  const mutualIds = useMemo(() => {
    const followerIds = new Set(socialState.followers.map(p => p.id));
    return socialState.following.filter(p => followerIds.has(p.id)).map(p => p.id);
  }, [socialState.followers, socialState.following]);

  const value = {
    followers: socialState.followers,
    following: socialState.following,
    suggested: socialState.suggested,
    followUser,
    unfollowUser,
    followBack,
    isFollowing,
    mutualCount: mutualIds.length,
    mutualIds,
  };

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within SocialProvider');
  }
  return context;
};
