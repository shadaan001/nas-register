var firebaseConfig = {
  apiKey: "AIzaSyCaaDUKV6ADRY7OQhM5Gqiwa9JxSPp_xaw",
  authDomain: "nas-register.firebaseapp.com",
  projectId: "nas-register",
  storageBucket: "nas-register.appspot.com",
  messagingSenderId: "761059271776",
  appId: "1:761059271776:web:d456f948ae741365a40f05"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

const entriesDiv = document.getElementById("entries");

// First entry auto add
addEntry();

function addEntry() {
  const div = document.createElement("div");
  div.className = "entry-box";
  div.innerHTML = `
    <input type="text" placeholder="Class" class="class">
    <input type="text" placeholder="Subject" class="subject">
    <textarea placeholder="Remarks" class="remarks"></textarea>
  `;
  entriesDiv.appendChild(div);
}

function submitAll() {
  const name = document.getElementById("name").value.trim();
  const classes = document.querySelectorAll(".class");
  const subjects = document.querySelectorAll(".subject");
  const remarks = document.querySelectorAll(".remarks");

  if (name === "") {
    alert("Enter teacher name");
    return;
  }

  let batch = db.batch();
  let count = 0;

  for (let i = 0; i < classes.length; i++) {
    if (classes[i].value !== "" && subjects[i].value !== "") {
      const ref = db.collection("teachers").doc();
      batch.set(ref, {
        name: name,
        class: classes[i].value,
        subject: subjects[i].value,
        remarks: remarks[i].value,
        createdAt: new Date()
      });
      count++;
    }
  }

  if (count === 0) {
    alert("Fill at least one class and subject");
    return;
  }

  batch.commit().then(() => {
  window.location.href = "thankyou.html";
}).catch(err => {
  alert("Error: " + err.message);
});

}
