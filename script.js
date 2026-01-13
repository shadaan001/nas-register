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
  saveAttendance(name);   // 👈 ADD THIS
  window.location.href = "thankyou.html";
});


}
function saveAttendance(name) {
  const now = new Date();

  const dateStr = now.toLocaleDateString("en-GB");
  const dayStr = now.toLocaleString("en-US", { weekday: "long" });
  const timeStr = now.toLocaleTimeString();

  const todayKey = dateStr + "_" + name;

  // Ek din me sirf 1 attendance
  db.collection("attendance")
    .where("key", "==", todayKey)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        // Already marked today
        return;
      }

      db.collection("attendance").add({
        name: name,
        date: dateStr,
        day: dayStr,
        time: timeStr,
        status: "Present",
        key: todayKey,
        createdAt: new Date()
      });
    });
}

