import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAVxxYh656ve72qw02L_Tar44grb-fo82o',
  authDomain: 'halalway-9ff06.firebaseapp.com',
  projectId: 'halalway-9ff06',
  storageBucket: 'halalway-9ff06.firebasestorage.app',
  messagingSenderId: '748891753028',
  appId: '1:748891753028:web:e71ce8173882f7280c8a11',
  measurementId: 'G-P2W1DMJMQ8',
};

const app = initializeApp(firebaseConfig);

let auth;
let ReactNativeAsyncStorage;
try {
  ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  ReactNativeAsyncStorage = null;
}

if (Platform.OS === 'web' || !ReactNativeAsyncStorage) {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export { auth };
export default app;
