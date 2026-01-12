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

document.getElementById("dateTitle").innerText = `Records for ${selectedDate}`;

const tableBody = document.getElementById("tableBody");

db.collection("teachers").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  tableBody.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    const dateObj = new Date(data.createdAt.seconds * 1000);
    const dateStr = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    if (dateStr === selectedDate) {
      let row = `
        <tr>
          <td>${data.name}</td>
          <td>${data.class}</td>
          <td>${data.subject}</td>
          <td>${data.remarks}</td>
          <td>${dateObj.toLocaleTimeString()}</td>
          <td><button onclick="deleteEntry('${doc.id}')">Delete</button></td>
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
