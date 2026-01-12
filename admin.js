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

const dateList = document.getElementById("dateList");

db.collection("teachers").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  const grouped = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const dateObj = new Date(data.createdAt.seconds * 1000);
    const dateStr = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    if (!grouped[dateStr]) {
      grouped[dateStr] = [];
    }
    grouped[dateStr].push(doc.id);
  });

  dateList.innerHTML = "";

  Object.keys(grouped).forEach(date => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>📅 ${date}</strong>
      <button onclick="openDay('${date}')">View</button>
    `;
    dateList.appendChild(li);
  });
});

function openDay(date) {
  window.location.href = `day.html?date=${encodeURIComponent(date)}`;
}
