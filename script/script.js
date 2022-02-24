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

const scrolling = document.querySelectorAll("[data-scroll]");

// Scrooling To
scrolling.forEach((btn) => {
  btn.addEventListener("click", () => {
    const elment = document.getElementById(
      btn.getAttribute("data-scroll")
    ).offsetTop;
    window.scrollTo({ top: elment, behavior: "smooth" });
  });
});
// Show List
const listBtn = document.querySelector("#login-nav.user-dash-board .user");
const list = document.querySelector("#login-nav.user-dash-board .user .opt");
if (listBtn !== null) {
  listBtn.addEventListener("click", () => list.classList.toggle("acctive"));
}
window.addEventListener("click", (e) => {
  const btns = document.querySelectorAll(".user-dash-board .user > *");
  const tar = e.target;
  if (
    tar !== listBtn &&
    tar !== btns[0] &&
    tar !== btns[1] &&
    tar !== btns[2] &&
    list !== null
  ) {
    list.classList.remove("acctive");
  }
});

async function GetPaswordPopup() {
  const { value: password } = await Swal.fire({
    icon: "question",
    title: `New Password`,
    html:
      '<label for="swal-input1" class="swal2-input-label">Password</label>' +
      '<input type="password" id="swal-input1" class="swal2-input popuppassword pwd">' +
      '<label for="swal-input2" class="swal2-input-label">Repeat Password</label>' +
      '<input type="password" id="swal-input2" class="swal2-input popuppassword confpwd">',
    showCancelButton: true,
    showCloseButton: true,
    cancelButtonColor: "#dc3545",
    confirmButtonText: "Confirm",
    confirmButtonColor: "#0088FF",
    cancelButtonAriaLabel: "Thumbs down",
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value,
      ];
    },
  });
  password != undefined ? password.forEach(() => validat(password)) : "";
}

// Validat Function
let Send = true; // To Send One Password
function validat(...password) {
  password[0][0] === ""
    ? Swal.fire("Error !", "Password Is A Required Field", "error")
    : password[0][0].length < 8
    ? Swal.fire(
        "Error !",
        "This Password Is Very Short, Chose The Strongest One",
        "error"
      )
    : password[0][0].length > 25
    ? Swal.fire("Error !", "This Password Is Very Long, Shorten It", "error")
    : password[0][0] !== password[0][1]
    ? Swal.fire("Error !", "Passwords Is Not Matching", "error")
    : sendResetPass(password[0][0]);
}

// Send Data Function
function sendResetPass(password) {
  if (Send) {
    Swal.fire("Success", "Password Has Been Changed.", "success");
    Send = false;
    console.log(password);
    // password => This Send Tp DB
    const user = auth.currentUser;
    console.log(user);
    updatePassword(user, password)
      .then(() => {
        console.log(password, "updated:D");
        // Update successful.
        const docRef = doc(db, "users", user.uid);
        updateDoc(docRef, {
          password: password,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
// Get POP up
const popCall = document.querySelectorAll('[data-changepass="Change popup"]');
popCall.forEach((call) =>
  call.addEventListener("click", () => {
    GetPaswordPopup();
    Send = true;
  })
);
// Copy Button =>
const btn = document.querySelector("#net #referrals .input button");
if (btn != null) {
  btn.addEventListener("click", () => {
    // Copy Text
    const inputText = document.querySelector("#net #referrals .input input");
    navigator.clipboard.writeText(inputText.value);
    // Show Text Msg
    const before = document.querySelector("#net button span:first-of-type");
    const after = document.querySelector("#net button span:last-child");
    before.style.display = "block";
    after.style.display = "block";
    setTimeout(() => {
      before.style.display = "none";
      after.style.display = "none";
    }, 3000);
  });
}
