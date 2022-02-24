// console.log("Hi From refLink");
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
  getAuth,
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


// Display UID From DB // Which uses to Ref a user and earn x point
auth.onAuthStateChanged((user) => {
  if (user) {

    function getParameters() {
      // get website Domain and set as Domain before RefCode
        let domain = window.location.hostname;
        let urlString = `${domain}/signup/signup.html?RefCode=${user.uid}`;
        let paramString = urlString.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        for(let pair of queryString.entries()) {
            // for Testing
              // console.log("Key is: " + pair[0]);
              // console.log("Value is: " + pair[1]);
              // console.log(urlString);
              // Add user uid as Ref Code :D
          document.querySelector("#refLink").value = urlString;
        }
    }
    getParameters(); // Call the fucking Func XXD

    // Display Email From DB
    document.querySelector(".account-details").textContent = user.email;

  } else {
      console.log("Can't Diplay user Ref uid: logged out!");
  }
});
