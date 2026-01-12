// ADMIN CREDENTIALS
const ADMIN_USER = "NAS MANAGEMENT";
const ADMIN_PASS = "NAS007@";

// FIREBASE CONFIG
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

// LOGIN
function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  if (u.toLowerCase() === ADMIN_USER.toLowerCase() && p === ADMIN_PASS) {
    sessionStorage.setItem("adminLoggedIn", "true");
    showAdmin();
    loadDates();
  } else {
    document.getElementById("error").style.display = "block";
  }
}

// LOGOUT
function logout() {
  sessionStorage.removeItem("adminLoggedIn");
  location.reload();
}

// SESSION CHECK
if (sessionStorage.getItem("adminLoggedIn") === "true") {
  showAdmin();
  loadDates();
}

// SHOW ADMIN
function showAdmin() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
}

// LOAD DATE GROUPS
function loadDates() {
  const dateList = document.getElementById("dateList");

  db.collection("teachers").orderBy("createdAt", "desc").onSnapshot(snapshot => {
    const grouped = {};

    snapshot.forEach(doc => {
      const d = doc.data();
      const dateObj = new Date(d.createdAt.seconds * 1000);
      const dateStr = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });

      if (!grouped[dateStr]) grouped[dateStr] = 0;
      grouped[dateStr]++;
    });

    dateList.innerHTML = "";

    Object.keys(grouped).forEach(date => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${date} (${grouped[date]})</span>
        <button onclick="openDay('${date}')">View</button>
      `;
      dateList.appendChild(li);
    });
  });
}

function openDay(date) {
  window.location.href = `day.html?date=${encodeURIComponent(date)}`;
}

// EXPORT ALL
function exportAll() {
  db.collection("teachers").orderBy("createdAt", "desc").get().then(snapshot => {
    let data = [];

    snapshot.forEach(doc => {
      const d = doc.data();
      const t = new Date(d.createdAt.seconds * 1000);
      data.push({
        Name: d.name,
        Class: d.class,
        Subject: d.subject,
        Remarks: d.remarks,
        Date: t.toLocaleDateString(),
        Time: t.toLocaleTimeString()
      });
    });

    downloadExcel(data, "NAS_All_Records.xlsx");
  });
}

function downloadExcel(jsonData, fileName) {
  const ws = XLSX.utils.json_to_sheet(jsonData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  XLSX.writeFile(wb, fileName);
}
