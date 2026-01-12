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

const params = new URLSearchParams(window.location.search);
const selectedDate = params.get("date");

document.getElementById("dateTitle").innerText = "Records for " + selectedDate;

const tableBody = document.getElementById("tableBody");

db.collection("teachers").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  tableBody.innerHTML = "";

  snapshot.forEach(doc => {
    const d = doc.data();
    const t = new Date(d.createdAt.seconds * 1000);
    const dateStr = t.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    if (dateStr === selectedDate) {
      const row = `
        <tr>
          <td>${d.name}</td>
          <td>${d.class}</td>
          <td>${d.subject}</td>
          <td>${d.remarks}</td>
          <td>${t.toLocaleTimeString()}</td>
          <td><button onclick="deleteEntry('${doc.id}')">X</button></td>
        </tr>
      `;
      tableBody.innerHTML += row;
    }
  });
});

function deleteEntry(id) {
  if (confirm("Delete this entry?")) {
    db.collection("teachers").doc(id).delete();
  }
}
