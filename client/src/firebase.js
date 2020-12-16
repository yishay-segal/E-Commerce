import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBYv0wr1KJNhqEDT0Fcq2HSyk3BtzltkD0',
  authDomain: 'ecommerce-a7062.firebaseapp.com',
  databaseURL: 'https://ecommerce-a7062.firebaseio.com',
  projectId: 'ecommerce-a7062',
  storageBucket: 'ecommerce-a7062.appspot.com',
  messagingSenderId: '399386548198',
  appId: '1:399386548198:web:b108319397b1bca9cde827',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
