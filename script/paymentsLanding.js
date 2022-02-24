import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  getDoc,
  arrayRemove,
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

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colPayments = collection(db, "acceptedPayments");


// // Payments
// // Dom elements
const paymentsList = document.querySelector('.requests');
// Push data Payments For Admin
onSnapshot(colPayments, (snapshot) => {
 let payments = [];
 let html = '';
 snapshot.docs.forEach((doc, i) => {
     payments.push({ ...doc.data()})
     // console.log(payments[0].createdAt);
     const div = `
     <article ${payments[i].requestID}>
     <p>${payments[i].walletID}</p>
     <p>${payments[i].createdAt}</p>
     <p>${payments[i].amount}$</p>
     </article>
         `;
      html += div;
   });
   paymentsList.innerHTML = html;
   console.log(payments);

 })
