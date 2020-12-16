import admin from 'firebase-admin';

// const serviceAccount = require('../config/serviceAccountKey');

import serviceAccount from '../config/serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: 'https://ecommerce-a7062.firebaseio.com',
});

export default admin;
