import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyAEJcrkcX9-ZCBUKbdyy6HMk_7aewltQBU",
//   authDomain: "web-dropship-kosmetik-re-2a8b6.firebaseapp.com",
//   projectId: "web-dropship-kosmetik-re-2a8b6",
//   storageBucket: "web-dropship-kosmetik-re-2a8b6.appspot.com",
//   messagingSenderId: "141009325988",
//   appId: "1:141009325988:web:b82598d1b04cdd50ab7b31",
//   measurementId: "G-VXN9WE8HYX",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBbSA6mw4gnDI3Iymq0jaYrZlceZP8kb08",
  authDomain: "e-kosmetik.firebaseapp.com",
  projectId: "e-kosmetik",
  storageBucket: "e-kosmetik.appspot.com",
  messagingSenderId: "509891655670",
  appId: "1:509891655670:web:99d290e39db033e9a5b9d7",
  measurementId: "G-3CRB9ZJ2CW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
