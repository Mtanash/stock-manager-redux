import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyANu9gUKjOHSYIsLyw9G35xcmZtXm5kJ9M",
  authDomain: "stock-manager-d8d1e.firebaseapp.com",
  projectId: "stock-manager-d8d1e",
  storageBucket: "stock-manager-d8d1e.appspot.com",
  messagingSenderId: "987053767412",
  appId: "1:987053767412:web:39d3026ff41af354fdbca1",
  measurementId: "G-7ZE98JGG52",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export { db, auth };
