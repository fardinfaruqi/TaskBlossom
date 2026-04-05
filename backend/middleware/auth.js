const admin = require('firebase-admin');
const path = require('path');
const pool = require('../db');

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json';
const serviceAccount = require(path.resolve(serviceAccountPath));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

// Middleware to verify Firebase token
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    // Get MySQL user ID by firebase_uid
    const [users] = await pool.execute('SELECT id FROM users WHERE firebase_uid = ?', [decodedToken.uid]);
    if (users.length > 0) {
      req.userId = users[0].id;
    } else {
      // Return nil or handle appropriately; route will create if needed
      req.userId = null;
    }

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
