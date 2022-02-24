console.log("Hi From user Dashboard");
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
  updatePassword
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

// DB
const colRef = collection(db, "users");

// queries
const q = query(colRef, orderBy('createdAt'));

// State Cards UI into All Pages :)
// const viewsCount = document.querySelector("#views-count").textContent  = 10;
// const earningsCount = document.querySelector("#total-earnings-count").textContent  = 10;
// const refCount = document.querySelector("#ref-count").textContent  = 10;
// const refEarningsCount = document.querySelector("#ref-earnings-count").textContent  = 10;


//
// // Start Auth Tracking
// auth.onAuthStateChanged((user) => {
//   if (user) {
//     console.log("logged in As: ", user.email);
//     const docRef = doc(db, 'users', user.uid);
//     onSnapshot(docRef, (doc) => {
//       console.log(doc.data());
//       // Display UI cards Counts From DB
//       document.querySelector("#views-count").textContent  = doc.data().viewsCount;
//       document.querySelector("#total-earnings-count").textContent  = doc.data().earningsCount;
//       document.querySelector("#ref-count").textContent  = doc.data().refCount;
//       document.querySelector("#ref-earnings-count").textContent  = doc.data().refEarningsCount;
//       // Display Email From DB
//       document.querySelector(".account-details").textContent  = doc.data().email;
//       // Display UID From DB // Which uses to Ref a user and earn 1 point
//       document.querySelector("#refLink").value  = doc.data().uid;
//
// });


//     getCheckBaneer("success", "Success Login");
//   } else {
//     console.log("logged out!");
//     getCheckBaneer("success", "Signed out");
//   }
// });

// logging user out
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("signed out!!!!!!!!!");
  });
});





// Just Sweet Alert :)
function getCheckBaneer(stats, msg) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  Toast.fire({ icon: stats, title: msg });
}
