import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  getDoc,
  setDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
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
// const FieldValue = require('firebase-admin').firestore.FieldValue;

// init services
const db = getFirestore();
const auth = getAuth();
// const batch = db.batch();

// collection ref
const colRef = collection(db, "payments");
const colRefBound = collection(db, "bound");
const colRefUsers = collection(db, "users");

// Queires

const q = query(colRef, orderBy("createdAt"));


const requestBtn = document.querySelector("#added .big-input button");
const requestInput = document.querySelector("#added .big-input input");
// Validation
requestBtn.addEventListener("click", async function (){
    let userPoints;
    let Amount;
    if(ValidationWallet(requestInput.value)){
      // how much user had
      auth.onAuthStateChanged((user) => {
          const userRef = doc(db, "users", user.uid);
          getDoc(userRef)
            .then((doc) => {
              userPoints = doc.data().earningsCount;
            Swal.fire({
            icon:'question',
            title:'Amount',
            inputLabel: 'Select The Withdrawl Amount',
            showCancelButton: true,
            showCloseButton: true,
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Confirm',
            confirmButtonColor: '#0088FF',
            cancelButtonAriaLabel: 'Thumbs down',
            input:'number',
            inputAttributes: {
              min: 0,
              max: userPoints,
            },
        }).then(result => {
          Amount = result.value;
          // console.log(result.value);
          if(ValidationAmount(Amount)){
            Swal.fire("Success","The Draw Is Waiting For Review","success");
            sendWithdrawlRequest(Amount)
        }else{
            Swal.fire("Ops!","Minimum Withdrawl is 5 SHIP","error");
        }
        })
      }) // user amount func
    }) // user amount func
    }else{
      Swal.fire("Ops!","Please Put Valid address Address","error");
    }
});
// Validation Function
function ValidationWallet(val) {
       if(
        val !== ""
        && val.length >= 10
        && true /* => Here Put Check In Wallet Adress API (DB) */
        ){
        return true
    }else{
        return false;
    }
}



function ValidationAmount(val) {


    if (val < 5) {
      return false;
    }
    if(val !== ""
       && val > 0
       && isNaN(val) == false
       && true /* => Here Put Check In Her Pont In (DB) >= amount*/
    ) {
        return true
    } else{
        return false;
    }

}

// DB
function sendWithdrawlRequest(Amount){
    Amount = +Amount;

  auth.onAuthStateChanged((user) => {
    const paymentRef = doc(db, "payments", user.uid);
    const userRef = doc(db, "users", user.uid);
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    const requestCode = Math.random().toString(36).substr(2, 9);

  setDoc(doc(db, "payments", requestCode),{
    amount: Amount,
    walletID: requestInput.value,
    requestID: requestCode,
    createdAt: date,
});

    // add a payments to the "user.payments" array field and (-) the amount in input.
    getDoc(userRef).then((doc) => {
    updateDoc(userRef, {
      earningsCount:
        doc.data().earningsCount - Amount,

      payments: arrayUnion({ amount: Amount, walletID: requestInput.value, createdAt: date,}),
    });
  });
  });


    // console.log(requestInput.value);
    // console.log(Amount); //Here Put Block Of Code To Senf Request
};


// push payment for user
const paymentsList = document.querySelector("#paymentsList");

// Real Time Collection data
onSnapshot(q, (snapshot) => {
  let payments = [];
  snapshot.docs.forEach((doc, i) => {
    payments.push({ ...doc.data() });
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef).then((doc) => {
        // console.log(doc.data().payments[0].amount);
        const pendingPayments = doc.data().payments;
        let html = "";
        pendingPayments.forEach((payment, i) => {
          // console.log(payment.count);
          // console.log(link);
          const div = `
          <tr>
              <td>${payment.amount}$</td>
              <td>${payment.createdAt}</td>
          </tr>
                `;
          html += div;
        });
        // Display payments from DB into Users UI
        paymentsList.innerHTML = html;
      });

    }
  });
});
