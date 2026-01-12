var firebaseConfig = {
  apiKey: "AIzaSyCaaDUKV6ADRY7OQhM5Gqiwa9JxSPp_xaw",
  authDomain: "nas-register.firebaseapp.com",
  projectId: "nas-register"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

const params = new URLSearchParams(window.location.search);
const selectedDate = params.get("date");

document.getElementById("dateTitle").innerText = `Records for ${selectedDate}`;

const tableBody = document.getElementById("tableBody");
let cachedRows = [];

db.collection("teachers").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  tableBody.innerHTML = "";
  cachedRows = [];

  snapshot.forEach(doc => {
    const d = doc.data();
    const timeObj = new Date(d.createdAt.seconds * 1000);

    const dateStr = timeObj.toLocaleDateString("en-GB", {
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
          <td>${timeObj.toLocaleTimeString()}</td>
          <td><button onclick="deleteEntry('${doc.id}')">X</button></td>
        </tr>
      `;
      tableBody.innerHTML += row;

      cachedRows.push({
        Teacher: d.name,
        Class: d.class,
        Subject: d.subject,
        Remarks: d.remarks,
        Time: timeObj.toLocaleTimeString(),
        Date: dateStr
      });
    }
  });
});

function deleteEntry(id) {
  if (confirm("Delete this entry?")) {
    db.collection("teachers").doc(id).delete();
  }
}

function exportThisDay() {
  if (cachedRows.length === 0) {
    alert("No data to export");
    return;
  }

  const ws = XLSX.utils.json_to_sheet(cachedRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Records");

  XLSX.writeFile(wb, `NAS_${selectedDate}.xlsx`);
}
