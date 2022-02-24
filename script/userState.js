import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

import {
  getAuth,
  signOut,
  updatePassword,
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

// Auth onAuthStateChanged
auth.onAuthStateChanged((user) => {
  if (user) {
    // console.log(user);
    const docRef = doc(db, "users", user.uid);
    onSnapshot(docRef, (doc) => {

    if (doc.data().admin === true) {
      document.querySelector('#dashboard').href = "/admin/dashbord/adminDashbord.html";
      document.querySelector("#loggedin").textContent = 'Admin Dashboard';
    }
    else {
      document.querySelector('#dashboard').href = "user/dashboard/dashboard.html";
      document.querySelector("#loggedin").textContent = 'Dashboard';
    }
  })

    }

})
