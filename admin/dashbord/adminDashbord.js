import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  getDoc,
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

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "links");
const colPayments = collection(db, "payments");


// Queires
const q = query(colRef, orderBy('createdAt'));

// Dom elements
const linksList = document.querySelector('.linksList');

// Real Time Collection data
onSnapshot(q, (snapshot) => {
  let links = [];
  let html = '';
  snapshot.docs.forEach((doc, i) => {
      links.push({ ...doc.data()})
      // console.log(links[i]);
      const div = `
          <div class="col" id="${links[i].LinkID}">
              <p>${links[i].link}</p>
              <p><i class="far fa-trash-alt"></i></p>
          </div>
          `;
       html += div;
    });
    linksList.innerHTML = html;
    // console.log(links);
    // Deleted Link
  setTimeout(() => {
    const deletBtn = document.querySelectorAll("#Admin .nett .addLink .tap .col p:nth-of-type(2)");
    deletBtn.forEach(btn => addEventListenerfun(btn, "The New Link Has Been Deleted", btn.parentElement));
  }, 0);

});


// // Payments
// // Dom elements
const paymentsList = document.querySelector('.paymentsList');
// Push data Payments For Admin
onSnapshot(colPayments, (snapshot) => {

 let payments = [];
 let html = '';
 snapshot.docs.forEach((doc, i) => {
     payments.push({ ...doc.data()})
     // console.log(payments);
     const div = `
         <div class="col" id="${payments[i].requestID}">
              <p>${payments[i].amount}</p>
              <p>${payments[i].walletID}</p>


              <p>
                  <span class="accept" id="${payments[i].requestID}">
                      <i class="fas fa-check-circle"></i>
                  </span>
                  <span class="reject" id="${payments[i].requestID}">
                      <i class="far fa-trash-alt"></i>
                  </span>
              </p>
         </div>
         `;
      html += div;
   });
   paymentsList.innerHTML = html;
   // console.log(payments);

    // Agree or Reject
       // not Agredd WithDrawl
       setTimeout(() => {
         const notAgredd = document.querySelectorAll("#Admin #tableRequests .col p:nth-of-type(3) span:nth-of-type(2)");
         notAgredd.forEach((btn) => {
           addEventListenerfun(btn, "The Withdrawl Has Been Rejected", btn.parentElement.parentElement);
           btn.addEventListener('click', () => {
             // console.log(btn.id);
             const paymentRef = doc(db, "payments", btn.id);
             const userRef = doc(db, "users", btn.id);

           // console.log(btn.id);

             const paymentID = doc(db, 'payments', btn.id);
             deleteDoc(paymentID)
               .then(() => {
                 console.log('Deleted', btn.id);
               })


               });
           })
       }, 0);

       // Agredd WithDrawl
       setTimeout(() => {
       const Agredd = document.querySelectorAll("#Admin #tableRequests .col p:nth-of-type(3) span:nth-of-type(1)");
       Agredd.forEach((btn) => {
       addEventListenerfun(btn, "The Withdrawl Has Been Accepted", btn.parentElement.parentElement);
       // => Send In (DB) Accepted Withdrawl
       btn.addEventListener('click', () => {
         // console.log(btn.id);
         const paymentRef = doc(db, "payments", btn.id);
         const userRef = doc(db, "users", btn.id);
         // console.log(btn.parentElement.parentNode.children);
         // console.log(btn.parentElement.parentNode.children[0].outerText);
         // console.log(btn.parentElement.parentNode.children[1].outerText);

         let today = new Date();
         let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();


         setDoc(doc(db, "acceptedPayments", btn.id),{
           amount: btn.parentElement.parentNode.children[0].outerText,
           walletID: btn.parentElement.parentNode.children[1].outerText,
           createdAt: date,

       });

       const paymentID = doc(db, 'payments', btn.id);
       deleteDoc(paymentID)
         .then(() => {
           console.log('Accepted', btn.id);
         })




               });
         });
       }, 0);


})

// onSnapshot(colPayments, (snapshot) => {
//   let payments = [];
//   let htmll = '';
//   snapshot.docs.forEach((doc, i) => {
//       payments.push({ ...doc.data()})
//       console.log(payments[i].payments[i]);
//       // console.log(payments[0].payments[0]);
//       const divv = `
//       <div class="col" id="${payments[i].payments[i].walletID}">
//            <p>${payments[i].payments[i].walletID}</p>
//            <p>${payments[i].payments[i].amount}$</p>
//            <p>
//                <span class="accept">
//                    <i class="fas fa-check-circle"></i>
//                </span>
//                <span class="reject" id="${payments[i].payments[i].paymentID}">
//                    <i class="far fa-trash-alt"></i>
//                </span>
//            </p>
//       </div>
//           `;
//        htmll += divv;
//     });
//     paymentsList.innerHTML = htmll;
//     console.log(payments);
//     // Agree or Reject
//
//     // not Agredd WithDrawl
//     setTimeout(() => {
//       const notAgredd = document.querySelectorAll("#Admin #tableRequests .col p:nth-of-type(3) span:nth-of-type(2)");
//       notAgredd.forEach((btn) => {
//         addEventListenerfun(btn, "The Withdrawl Has Been Rejected", btn.parentElement.parentElement);
//         btn.addEventListener('click', () => {
//
//             });
//         })
//     }, 0);
//
//     // Agredd WithDrawl
//     setTimeout(() => {
//     const Agredd = document.querySelectorAll("#Admin #tableRequests .col p:nth-of-type(3) span:nth-of-type(1)");
//     Agredd.forEach((btn) => {
//     addEventListenerfun(btn, "The Withdrawl Has Been Accepted", btn.parentElement.parentElement);
//     // => Send In (DB) Accepted Withdrawl
//     btn.addEventListener('click', () => {
//
//             });
//       });
//     }, 0);
//
//
//   }); // closing snapshot
//



// Add links
const linkInput = document.querySelector(
  "#Admin .addLink input:nth-of-type(1)"
);
const codeInput = document.querySelector(
  "#Admin .addLink input:nth-of-type(2)"
);
const AddLinkBtn = document.querySelector("#Admin .addLink button");
const boxLinks = document.querySelector("#Admin .addLink .tap");
AddLinkBtn.addEventListener("click", () => {
  linkInput.value === "" || codeInput.value === ""
    ? Swal.fire("Ops!", "Please Write Password & Code", "error")
    : codeInput.value.length < 6
    ? Swal.fire("Ops!", "The Code More Than 6 Letter And Numbers", "error")
    : afterValidate(linkInput.value, codeInput.value);
});
// afterValidate Function
function afterValidate(link, code) {
  SendData(link, code);
  Swal.fire("Success!", "The New Link Is Added", "success");
}
// Function SendData
function SendData(link, code) {
  // Send link into links Collection
  const docLink = link.replace(/[^a-zA-Z ]/g, "");
  console.log(docLink);
  setDoc(doc(db, "links", docLink),{
  link: link,
  code: code,
  LinkID: docLink,
  id: code,
  createdAt: serverTimestamp(),
})
  .then(() => {
    console.log('Link ID:', parent.id, " Added Successfully");
  })

} // close SendData Func
// Bouns Sec
const bounsBtn = document.querySelector("#Admin .bouns .input button");
const bounsinp = document.querySelector("#Admin .bouns .input input");
const bounsText= document.querySelector("#Admin .nett article > p span");
bounsBtn.addEventListener("click", (value) => {
    value = +bounsinp.value;
    if(value === "" || value == NaN || value <= 0){
        Swal.fire('Ops!','Sorry Put Valid Bound','error');
    }else{
        Swal.fire('Success!','Bound Have Been Update','success');
        // bounsText.textContent = value; // => Get (DB)
    }
});

// Send Bouns into bound Collection
const addBounsForm = document.querySelector(".bounsForm");
addBounsForm.addEventListener("submit", (e) => {
  e.preventDefault();
const bouns = document.querySelector("#pouns").value;
// adding bound into bound/default collection
      updateDoc(doc(db, "bound", "default"),{
        bound: bouns,
        createdAt: serverTimestamp(),
      })
  .then(() => {
    addBounsForm.reset();
    console.log("Bound updated Successfully");
  })
});

// Display Bouns into UI
const colRefBound = doc(db, 'bound', 'default')
onSnapshot(colRefBound, (doc) => {
  // console.log(doc.data().bound);
 document.querySelector("#price").textContent = doc.data().bound + '$';
});

// Add EventListener Functions
function addEventListenerfun(btn, msg, parent) {
  btn.addEventListener("click", async function () {
    Swal.fire("Success!", msg, "success");
    // get rid of a Link From Links collection
    const docLink = parent.id.replace(/[^a-zA-Z ]/g, "");
    console.log(docLink);
    console.log(parent);
    const docDeleteLink = doc(db, 'links', docLink);
        deleteDoc(docDeleteLink)
          .then(() => {
            // console.log('Link ID:', docLink, ' Deleted Successfully!');
          })
    parent.remove(); // remove from UI
  });
}

// Redirect user to Panel
auth.onAuthStateChanged((user) => {
  if (user) {
const docRef = doc(db, "users", user.uid);
onSnapshot(docRef, (doc) => {
  // console.log(doc.data().admin);
  if (doc.data().admin !== true) {
    const domain = window.location.hostname;
    const port = window.location.port;
    window.location.replace(`http://${domain}/user/dashboard/dashboard.html`);
  }

});
    };
});
