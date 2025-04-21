// src/config/db.js
const admin = require("firebase-admin");
const serviceAccount = require("../../firebaseAdminConfig.json"); // đúng path đến file json của bạn

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://musicapp-fuchoachu-default-rtdb.firebaseio.com"
});

const db = admin.database(); // Lấy Realtime Database

module.exports = db;
