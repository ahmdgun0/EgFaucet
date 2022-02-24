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
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

// Axios
// const axios = require("axios");

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
const colRef = collection(db, "users");

// queries
const q = query(colRef, orderBy("aesc"));

// realtime collection data
onSnapshot(q, (snapshot) => {
  let users = [];
  snapshot.docs.forEach((doc) => {
    users.push({ ...doc.data(), id: doc.id });
  });
  console.log(users);
});

// Add Ref code into RefCode input
function getParameters() {
  const queryString = window.location.search;
  // console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  const refCode = urlParams.get('RefCode')
  // console.log(refCode); // For testing :D
  document.querySelector(".refCode").value = refCode;
}
getParameters();


// signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  // start addEventListener
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  const displayName = signupForm.username.value;
  // const passwordConfirm = signupForm.passwordConfirm.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
        setDoc(doc(db, "users", cred.user.uid),{
        displayName: signupForm.username.value,
        email: signupForm.email.value,
        password: signupForm.password.value,
        submittedLinks: [],
        payments: [],
        earningsCount: 0,
        viewsCount: 0,
        refCount: 0,
        refEarningsCount: 0,
        uid: cred.user.uid,
        refCode: signupForm.referralCode.value,
        // ip: (document.querySelector("#ip").value = res.data),
        createdAt: serverTimestamp(),
      });
      // reset Form
      console.log("user created:", cred.user);

      // Send ip to ip DB

      fetch('https://api.db-ip.com/v2/free/self')
      .then( res => res.json() )
      .then(response => {
        console.log(response.ipAddress);

      setDoc(doc(db, "ip", response.ipAddress), {
          ip: response.ipAddress,
          createdAt: serverTimestamp(),
        })
      })

      // Look for uid Ref Code in db and add x point
      console.log(signupForm.referralCode.value);
      const docRef = doc(db, "users", signupForm.referralCode.value);
        getDoc(docRef).then((doc) => {
          updateDoc(docRef, {
            refCount: Number(doc.data().refCount) + Number(1),
            refEarningsCount:
              Number(doc.data().refEarningsCount) + Number(1),
            earningsCount: Number(doc.data().earningsCount) + Number(1),
          });
        });


      // // Redirect To login
      // const domain = window.location.hostname;
      // window.location.replace(`http://${domain}/login/login.html`);
      signupForm.reset();

    })
    .catch((err) => {
      console.log(err.code);
      // if (password !== passwordConfirm) {
      //   getCheckBaneer("error", "Passwords Does not match.")
      // }
      // check if pwd less < 6
      if (err.code === "auth/weak-password") {
        getCheckBaneer("error", "Weak Password! Must be 6 characters at least.")
      }
      // check if email is invalid : test@.test
      if (err.code === "auth/invalid-email") {
        getCheckBaneer("error", "invalid Email.")
      }
      // check if email alread in use
      if (err.code === "auth/email-already-in-use") {
        getCheckBaneer("error", "Email Already in use.")
      }
      // check if pwd is empty
      if (password === "") {
        getCheckBaneer("error", "You must fill password input.")
      }

      // No internet
      if (err.code === "auth/network-request-failed") {
        getCheckBaneer("error", "please Check Your internet Connection.")
      }
    });

}); // end addEventListener

// End Signup section


// Just Sweet Alert :)
function getCheckBaneer(stats, msg){
  const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
  })
  Toast.fire({icon: stats, title: msg})
};

// add ip in collection "ip"

fetch('https://api.db-ip.com/v2/free/self')
.then( res => res.json() )
.then(response => {
  console.log(response.ipAddress);

// setDoc(doc(db, "ip", response.ipAddress), {
//     ip: response.ipAddress,
//     createdAt: serverTimestamp(),
//   })

const ipRef = doc(db, 'ip', response.ipAddress)
getDoc(ipRef)
  .then((ip) => {
    // console.log(ip.data().ip);
    if ( response.ipAddress === ip.data().ip) {
      // console.log('you signed up before');
      getCheckBaneer("error", "You can't create multiple Accounts.")

      setTimeout(() => {
        // Redirect To login
        const domain = window.location.hostname;
        window.location.replace(`http://${domain}/login/login.html`);
      }, 7000);
}
  })
})
