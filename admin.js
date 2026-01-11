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

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");

let allData = [];

db.collection("teachers").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
  allData = [];
  snapshot.forEach((doc) => {
    allData.push({ id: doc.id, ...doc.data() });
  });
  renderTable(allData);
});

function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach((item) => {
    let row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.class}</td>
        <td>${item.subject}</td>
        <td>${item.remarks}</td>
        <td>${new Date(item.createdAt.seconds * 1000).toLocaleString()}</td>
        <td><button class="delete-btn" onclick="deleteEntry('${item.id}')">Delete</button></td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allData.filter(item =>
    item.name.toLowerCase().includes(value) ||
    item.class.toLowerCase().includes(value) ||
    item.subject.toLowerCase().includes(value)
  );
  renderTable(filtered);
});

function deleteEntry(id) {
  if(confirm("Delete this entry?")) {
    db.collection("teachers").doc(id).delete();
  }
}
