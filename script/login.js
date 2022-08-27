console.log("hi");
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
  signInWithEmailAndPassword,
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
// const colRef = collection(db, "dashboard");

const loginForm = document.querySelector("#loginForm");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // Signed in
      const user = cred.user;
      console.log("logged in:", cred.user);
      // reset form
      loginForm.reset();
    })
    .catch((err) => {
      console.log(err.code);
      // check if email is invalid : test@.test
      if (err.code === "auth/user-not-found") {
        getCheckBaneer("error", "User Does not Found.");
      }
      // check if email alread in use
      if (err.code === "auth/wrong-password") {
        // Please check your password
        getCheckBaneer("error", "Please check your password and try again.");
      }
      // check if pwd is empty
      if (password === "") {
        getCheckBaneer("error", "You must fill password input.");
      }
      // too many Reqests
      if (err.code === "auth/too-many-requests") {
        getCheckBaneer("error", "Too many Request! please try Again later.");
      }
    });
});

// Start Auth Tracking
auth.onAuthStateChanged((user) => {
  if (user) {
    // console.log("logged in As: ", user);
    getCheckBaneer("success", "Success Login");

    // if logged in
      document.cookie = `username= ${user}`;
      // Redirect To dashboard
      const domain = window.location.hostname;
      const port = window.location.port;
      window.location.replace(`http://${domain}:${port}/Crypto-currency-site-Native/user/dashboard/dashboard.html`);
  } else {
    console.log("user logged out!");
  }
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
