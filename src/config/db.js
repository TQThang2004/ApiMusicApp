// src/config/db.js
const admin = require("firebase-admin");
const serviceAccount = require("../../firebaseAdminConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://musicapp-fuchoachu-default-rtdb.firebaseio.com"
});

const db = admin.database();

module.exports = db;
