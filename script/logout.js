import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
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
const auth = getAuth();


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

// Start Auth Tracking
auth.onAuthStateChanged((user) => {
  if (user) {
    document.querySelector(".account-details").textContent = user.email;
  } else {
    const domain = window.location.hostname;
    const port = window.location.port;
    window.location.replace(`http://${domain}:${port}/login/login.html`);
  }
});
// logging user out
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {

    console.log("signed out!!!!!!!!!");
  });
});
