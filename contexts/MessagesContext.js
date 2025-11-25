import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from './AuthContext';

const MessagesContext = createContext(null);

const seedThreads = {
  amina: [
    { id: 'm1', from: 'them', text: 'Let’s try the new halal grill this Friday?', ts: Date.now() - 1000 * 60 * 60 * 5 },
    { id: 'm2', from: 'me', text: 'Sounds good! I’m free after Maghrib.', ts: Date.now() - 1000 * 60 * 60 * 4.5 },
  ],
  yusuf: [
    { id: 'm3', from: 'them', text: 'Late-night shawarma run?', ts: Date.now() - 1000 * 60 * 60 * 24 },
    { id: 'm4', from: 'me', text: 'Always down.', ts: Date.now() - 1000 * 60 * 60 * 23.5 },
  ],
};

export const MessagesProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `messages:${user.uid}` : null;
  const [threads, setThreads] = useState(seedThreads);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!storageKey) {
        if (isMounted) setThreads(seedThreads);
        return;
      }
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored && isMounted) {
          setThreads(JSON.parse(stored));
        } else if (isMounted) {
          setThreads(seedThreads);
        }
      } catch {
        if (isMounted) setThreads(seedThreads);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [storageKey]);

  const persist = async next => {
    if (!storageKey) return;
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // best effort only
    }
  };

  const sendMessage = (personId, text, meta) => {
    if (!text?.trim()) return;
    setThreads(prev => {
      const next = {
        ...prev,
        [personId]: [
          ...(prev[personId] || []),
          { id: `${Date.now()}`, from: 'me', text: text.trim(), ts: Date.now(), meta },
        ],
      };
      persist(next);
      return next;
    });
  };

  const clearThread = personId => {
    if (!personId) return;
    setThreads(prev => {
      const { [personId]: _, ...rest } = prev;
      persist(rest);
      return rest;
    });
  };

  const value = {
    threads,
    sendMessage,
    clearThread,
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};

export const useMessages = () => {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider');
  return ctx;
};
