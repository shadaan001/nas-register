var firebaseConfig = {
  apiKey: "AIzaSyCaaDUKV6ADRY7OQhM5Gqiwa9JxSPp_xaw",
  authDomain: "nas-register.firebaseapp.com",
  projectId: "nas-register"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

const dateList = document.getElementById("dateList");

db.collection("teachers").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  const grouped = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const d = new Date(data.createdAt.seconds * 1000);

    const dateStr = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    if (!grouped[dateStr]) grouped[dateStr] = 0;
    grouped[dateStr]++;
  });

  dateList.innerHTML = "";

  Object.keys(grouped).forEach(date => {
    const div = document.createElement("div");
    div.className = "date-card";
    div.innerHTML = `
      <span>${date} (${grouped[date]} entries)</span>
      <button onclick="openDay('${date}')">View</button>
    `;
    dateList.appendChild(div);
  });
});

function openDay(date) {
  window.location.href = `day.html?date=${encodeURIComponent(date)}`;
}
