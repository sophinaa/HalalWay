import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../firebaseConfig';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser);
      setInitialising(false);
    });
    return unsub;
  }, []);

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

  const value = { user, login, signup, logout, initialising, updateDisplayName };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
