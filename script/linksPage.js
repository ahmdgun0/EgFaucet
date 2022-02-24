import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
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
const colRef = collection(db, "links");
const colRefBound = collection(db, "bound");
const colRefUsers = collection(db, "users");

// Queires

const q = query(colRef, orderBy("createdAt"));

// Dom elements
const linksList = document.querySelector(".linksList");

// Real Time Collection data
onSnapshot(q, (snapshot) => {
  let links = [];
  // let html = '';
  snapshot.docs.forEach((doc, i) => {
    links.push({ ...doc.data() });
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
      let linksArr = [];
      snapshot.docs.forEach((doc, i) => {
        linksArr.push(doc.data().LinkID);
      });
      // console.log(linksArr);

      const userRef = doc(db, "users", user.uid);
      getDoc(userRef).then((docs) => {
        // console.log(doc.data().submittedLinks);
        const a1 = linksArr;
        // console.log(a1);
        const a2 = docs.data().submittedLinks;
        const notSubmittedLinks = a1.filter((x) => !a2.includes(x));
        // console.log(notSubmittedLinks);
        let html = "";
        notSubmittedLinks.forEach((link, i) => {
          // console.log(link);
          const div = `
                <article id="${notSubmittedLinks[i]}">
                <img src="../../img/More/statc1.png" alt="" draggable="false">
                <p>Visit <a target="_blank" href="${links[i].link}">Link</a></p>
                <label for="code">Verfication Code Here</label>
                <input type="text" id="${links[i].LinkID}" maxlength="10" autocomplete="off">
                <button>Submit</button>
                </article>
                `;
          html += div;
        });
        // Display links from DB into Users UI
        linksList.innerHTML = html;


        const linkks = document.querySelectorAll("#linksPage p span");
        const btns = document.querySelectorAll("#linksPage article button");
        btns.forEach((btn) => {
          btn.addEventListener("click", () => {
            const input = btn.previousElementSibling;
            const docRefLinks = doc(db, "links", input.id);
            getDoc(docRefLinks)
              .then((doc) => {
            // console.log(doc.data().code); // Check if func work
            // code must be current Link Code
            let code = doc.data().code;



            if (input.value === code) {
              addPoint(btn);
              // Remove Link From UI
              // add a Submitted link to the "submittedLinks" array field.
              updateDoc(userRef, {
                submittedLinks: arrayUnion(input.id),
              });
            } else {
              Swal.fire("Ops!", "This Code Is Not Valid", "error");
            }
          })

          });
        }); // end links call from db
      });
      // Solution :D
      // const a1 = ["1", "2", "3", "4", "5"];
      // const a2 = ["1", "2", "3"];
      //
      // console.log( a1.filter(x => !a2.includes(x)) );
    }
  });
});
const docRefBound = doc(db, 'bound', 'default')
getDoc(docRefBound).then((doc) => {
  // console.log(doc.data().bound);
  let bouns = doc.data().bound;

document.querySelector("#price2").textContent = bouns + '$'; // This Pouns
});

let dateNow     = Math.floor(new Date().getTime() / 1000);
let linksDate   = localStorage.getItem("linksDate");
let numLinks    = localStorage.getItem("numLinks");

if(linksDate === null || numLinks === null){
  localStorage.setItem("linksDate", dateNow);
  localStorage.setItem("numLinks", 0);
  linksDate   = localStorage.getItem("linksDate");
  numLinks    = localStorage.getItem("numLinks");
}else if(dateNow - linksDate >= 86400){
  localStorage.setItem("numLinks", 0);
}
// console.log(numLinks);
// Add Point Func
function addPoint(btn) {
  // Start Auth Tracking
  auth.onAuthStateChanged((user) => {
    if (user) {
      linksDate   = localStorage.getItem("linksDate");
      numLinks    = localStorage.getItem("numLinks");

      if(numLinks < 10){
        localStorage.setItem("numLinks", parseInt(numLinks) + 1);
        Swal.fire("Success!", "Correct Code", "success");
        btn.parentElement.remove(); // => Delete UI
        const docRef = doc(db, "users", user.uid);
        const colRefBound = doc(db, "bound", "default");
        getDoc(colRefBound).then((docBound) => {
          console.log(docBound.data().bound);

          getDoc(docRef).then((doc) => {
            updateDoc(docRef, {
              viewsCount: Number(doc.data().viewsCount) + Number(1),
              earningsCount:
                Number(doc.data().earningsCount) + Number(docBound.data().bound),
            });
          });
        });
      }else{
        Swal.fire("Error!", "Try agin towmorw!", "error");
      }
    }

    //V1 work
    /*
const docRef = doc(db, 'users', user.uid);
getDoc(docRef)
  .then((doc) => {
    console.log(doc.data().viewsCount);
    console.log(doc.data(), doc.id);
    updateDoc(docRef, {
      viewsCount: Number(doc.data().viewsCount) + Number(1),
    })
    .then(() => {
      console.log("view Added", doc.data().viewsCount);
    })
  })
*/
  });
}
//
// // get a single doc
// const linksRef = doc(db, 'links', 'httpsgooglecom')
//
// getDoc(linksRef)
//   .then((doc) => {
//     console.log(doc.data(), doc.id);
//   })
