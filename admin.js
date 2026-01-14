var firebaseConfig = {
  apiKey: "AIzaSyCaaDUKV6ADRY7OQhM5Gqiwa9JxSPp_xaw",
  authDomain: "nas-register.firebaseapp.com",
  projectId: "nas-register"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

const dateList = document.getElementById("dateList");
const teacherSelect = document.getElementById("teacherSelect");
const teacherTable = document.getElementById("teacherTable");
const teacherStats = document.getElementById("teacherStats");

let currentRange = "today";

// ================= RANGE UI =================
function setRange(range) {
  currentRange = range;

  document.getElementById("btnToday").classList.remove("active");
  document.getElementById("btnWeek").classList.remove("active");
  document.getElementById("btnMonth").classList.remove("active");

  if (range === "today") document.getElementById("btnToday").classList.add("active");
  if (range === "week") document.getElementById("btnWeek").classList.add("active");
  if (range === "month") document.getElementById("btnMonth").classList.add("active");

  reloadByRange();
}

// ================= DATE FILTER =================
function isInRange(date) {
  const now = new Date();
  const d = new Date(date);

  if (currentRange === "today") {
    return d.toDateString() === now.toDateString();
  }

  if (currentRange === "week") {
    const diff = (now - d) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }

  if (currentRange === "month") {
    return d.getMonth() === now.getMonth() &&
           d.getFullYear() === now.getFullYear();
  }

  return true;
}

// ================= LOAD DATA =================
function reloadByRange() {
  db.collection("teachers").orderBy("createdAt", "desc").onSnapshot(snapshot => {
    const grouped = {};
    const teachers = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      const d = new Date(data.createdAt.seconds * 1000);

      if (!isInRange(d)) return;

      const dateStr = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });

      if (!grouped[dateStr]) grouped[dateStr] = 0;
      grouped[dateStr]++;

      teachers.add(data.name);
    });

    // Fill Date List
    dateList.innerHTML = "";
    Object.keys(grouped).forEach(date => {
      const div = document.createElement("div");
      div.className = "date-item";
      div.innerHTML = `
        <span>${date} (${grouped[date]} entries)</span>
        <button class="view-btn" onclick="openDay('${date}')">View</button>
      `;
      dateList.appendChild(div);
    });

    // Fill Teacher Dropdown
    teacherSelect.innerHTML = `<option value="">-- Select Teacher --</option>`;
    teachers.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      teacherSelect.appendChild(opt);
    });
  });
}

reloadByRange();

// ================= OPEN DAY =================
function openDay(date) {
  window.location.href = `day.html?date=${encodeURIComponent(date)}`;
}

// ================= FILTER BY TEACHER =================
function filterByTeacher() {
  const selected = teacherSelect.value;
  if (selected === "") return alert("Select a teacher");

  db.collection("teachers")
    .where("name", "==", selected)
    .get()
    .then(snapshot => {
      let rows = "";
      let total = 0;
      const classCount = {};

      snapshot.forEach(doc => {
        const d = doc.data();
        const time = new Date(d.createdAt.seconds * 1000);

        if (!isInRange(time)) return;

        total++;

        if (!classCount[d.class]) classCount[d.class] = 0;
        classCount[d.class]++;

        rows += `
          <tr>
            <td>${time.toLocaleDateString()}</td>
            <td>${d.class}</td>
            <td>${d.subject}</td>
            <td>${d.remarks || "-"}</td>
          </tr>
        `;
      });

      let statHTML = `<b>${selected}</b><br>Total Lectures: ${total}<br><br><b>Class-wise:</b><br>`;
      for (let c in classCount) {
        statHTML += `• Class ${c}: ${classCount[c]}<br>`;
      }

      teacherStats.innerHTML = statHTML;
      teacherStats.style.display = "block";

      teacherTable.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
      teacherTable.style.display = "block";
      document.getElementById("clearFilterBtn").style.display = "block";
    });
}

// ================= CLEAR =================
function clearTeacherFilter() {
  teacherSelect.value = "";
  teacherTable.style.display = "none";
  teacherStats.style.display = "none";
  document.getElementById("clearFilterBtn").style.display = "none";
}

// ================= ATTENDANCE BUTTON =================
function goToAttendance() {
  window.location.href = "attendance-admin.html"; 
}
