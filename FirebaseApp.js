const admin = require("firebase-admin");
const serviceFirebaseKey = require('./e-kosmetik-firebase-adminsdk-m1uy2-33f48fa97d.json')
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceFirebaseKey),
});

module.exports = app;
