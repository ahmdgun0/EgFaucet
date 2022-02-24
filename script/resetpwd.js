console.log('hi');
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

import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

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

const resetForm = document.querySelector("#resetForm");
resetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = resetForm.email.value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      console.log('Password reset email sent!');
      // ..
          getCheckBaneer("success", "Please Check Your inbox.");

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      console.log(errorCode, errorMessage);
      if (errorCode === "auth/user-not-found") {
        getCheckBaneer("error", "Email Not Found.");
      }

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
