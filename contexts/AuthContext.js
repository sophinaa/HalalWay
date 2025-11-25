import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth } from '../firebaseConfig';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);
  const [username, setUsername] = useState(null);

  const generateUsername = firebaseUser => {
    if (!firebaseUser) return null;
    const display = firebaseUser.displayName || firebaseUser.email || '';
    const base = display
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 20);
    if (base) return base;
    return `user_${firebaseUser.uid.slice(0, 6)}`;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser);
      setInitialising(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadUsername = async currentUser => {
      if (!currentUser) {
        if (isMounted) setUsername(null);
        return;
      }
      const key = `username:${currentUser.uid}`;
      try {
        const stored = await AsyncStorage.getItem(key);
        if (isMounted) {
          if (stored) {
            setUsername(stored);
          } else {
            const generated = generateUsername(currentUser);
            setUsername(generated);
            await AsyncStorage.setItem(key, generated);
          }
        }
      } catch {
        if (isMounted) {
          setUsername(generateUsername(currentUser));
        }
      }
    };
    loadUsername(user);
    return () => {
      isMounted = false;
    };
  }, [user]);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateDisplayName = async newName => {
    if (!auth.currentUser) {
      return;
    }
    await updateProfile(auth.currentUser, { displayName: newName });
    await auth.currentUser.reload();
    setUser({ ...auth.currentUser });
  };

  const updateUsername = async newUsername => {
    if (!auth.currentUser) return;
    const key = `username:${auth.currentUser.uid}`;
    const cleaned = newUsername.trim();
    setUsername(cleaned);
    try {
      await AsyncStorage.setItem(key, cleaned);
    } catch {
      // best effort only
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    initialising,
    updateDisplayName,
    username,
    updateUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
