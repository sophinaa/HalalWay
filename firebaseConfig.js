import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
export const auth = getAuth(app);

export default app;
