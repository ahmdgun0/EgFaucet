import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGVC7gYqwtJ-YT4QtZo49FdyIhoTV7SOw",
  authDomain: "egyfaucet.firebaseapp.com",
  projectId: "egyfaucet",
  storageBucket: "egyfaucet.appspot.com",
  messagingSenderId: "56655496804",
  appId: "1:56655496804:web:27f493159edc9017200171"
};

// init firebase
initializeApp(firebaseConfig);
// const FieldValue = require('firebase-admin').firestore.FieldValue;

// init services
const db = getFirestore();
const auth = getAuth();
// const batch = db.batch();

// collection ref
const colRef = collection(db, "links");
const colRefBound = collection(db, "bound");
const colRefUsers = collection(db, "users");



let check = setInterval(() =>{
    let price = localStorage.getItem("price");
    if(price !== null){
        addPoints(parseInt(price))
        localStorage.removeItem("price");
        clearInterval(check);
    }
},1000);
// Set In => (DB)
function addPoints(price){
    // console.log(price);

    auth.onAuthStateChanged((user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
          getDoc(docRef).then((doc) => {
            updateDoc(docRef, {
              earningsCount:
                Number(doc.data().earningsCount) + price,
            });
          });
      }
    });
}
