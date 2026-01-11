var firebaseConfig = {
  apiKey: "AIzaSyCaaDUKV6ADRY7OQhM5Gqiwa9JxSPp_xaw",
  authDomain: "nas-register.firebaseapp.com",
  projectId: "nas-register",
  storageBucket: "nas-register.appspot.com",
  messagingSenderId: "761059271776",
  appId: "1:761059271776:web:d456f948ae741365a40f05"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
var db = firebase.firestore();

function submitForm() {
  const name = document.getElementById("name").value;
  const className = document.getElementById("class").value;
  const subject = document.getElementById("subject").value;
  const remarks = document.getElementById("remarks").value;

  if (name === "" || className === "" || subject === "") {
    alert("Fill all required fields");
    return;
  }

  db.collection("teachers").add({
    name: name,
    class: className,
    subject: subject,
    remarks: remarks,
    createdAt: new Date()
  })
  .then(function() {
    alert("Entry saved successfully!");
  })
  .catch(function(error) {
    alert("Firebase Error: " + error.message);
  });
}
