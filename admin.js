// 🔒 Admin Credentials
const ADMIN_USER = "NAS MANAGEMENT";
const ADMIN_PASS = "NAS007@";

// Firebase config
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
var db = firebase.firestore();

// Login function
function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  if (u.toLowerCase() === ADMIN_USER.toLowerCase() && p === ADMIN_PASS) {
    sessionStorage.setItem("adminLoggedIn", "true");
    showAdmin();
    loadData();
  } else {
    document.getElementById("error").style.display = "block";
  }
}

// Logout
function logout() {
  sessionStorage.removeItem("adminLoggedIn");
  location.reload();
}

// Show admin panel
function showAdmin() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
}

// Check session
if (sessionStorage.getItem("adminLoggedIn") === "true") {
  showAdmin();
  loadData();
}

// Load Firebase data
function loadData() {
  const tableBody = document.getElementById("tableBody");

  db.collection("teachers").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
    tableBody.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();

      let row = `
        <tr>
          <td>${data.name}</td>
          <td>${data.class}</td>
          <td>${data.subject}</td>
          <td>${data.remarks}</td>
          <td>${new Date(data.createdAt.seconds * 1000).toLocaleString()}</td>
          <td>
            <button onclick="deleteEntry('${doc.id}')">Delete</button>
          </td>
        </tr>
      `;

      tableBody.innerHTML += row;
    });
  });
}

// Delete entry
function deleteEntry(id) {
  if (confirm("Delete this entry?")) {
    db.collection("teachers").doc(id).delete();
  }
}
