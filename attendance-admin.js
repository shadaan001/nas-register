document.addEventListener("DOMContentLoaded", () => {

  var firebaseConfig = {
    apiKey: "AIzaSyCaaDUKV6ADRY7OQhM5Gqiwa9JxSPp_xaw",
    authDomain: "nas-register.firebaseapp.com",
    projectId: "nas-register"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  var db = firebase.firestore();

  const teacherSelect = document.getElementById("teacherSelect");
  const statsDiv = document.getElementById("stats");
  const tableDiv = document.getElementById("attendanceTable");
  const viewBtn = document.getElementById("viewBtn");

  let percentChart;
  let barChart;

  // ===== Load Teachers =====
  db.collection("teachers").onSnapshot(snapshot => {
    const names = new Set();

    snapshot.forEach(doc => {
      names.add(doc.data().name);
    });

    teacherSelect.innerHTML = `<option value="">Select Teacher</option>`;
    names.forEach(n => {
      const opt = document.createElement("option");
      opt.value = n;
      opt.textContent = n;
      teacherSelect.appendChild(opt);
    });
  });

  viewBtn.addEventListener("click", loadAttendance);

  function loadAttendance() {
    const name = teacherSelect.value;
    if (!name) return alert("Select a teacher");

    Promise.all([
      db.collection("attendance").where("name", "==", name).get(),
      db.collection("teachers").where("name", "==", name).get()
    ]).then(([attendanceSnap, lectureSnap]) => {

      let presentDays = attendanceSnap.size;
      let totalLectures = lectureSnap.size;

      let percent = totalLectures === 0 ? 0 : ((presentDays / totalLectures) * 100).toFixed(1);

      let rows = "";
      attendanceSnap.forEach(doc => {
        const d = doc.data();
        rows += `
          <tr>
            <td>${d.date || "-"}</td>
            <td>${d.day || "-"}</td>
            <td>${d.time || "-"}</td>
            <td>${d.status || "Present"}</td>
          </tr>
        `;
      });

      statsDiv.innerHTML = `
        <h3>${name}</h3>
        <p>Total Lectures: ${totalLectures}</p>
        <p>Present Days: ${presentDays}</p>
        <p><b>Attendance %: ${percent}%</b></p>
      `;

      tableDiv.innerHTML = `
        <table>
          <tr>
            <th>Date</th>
            <th>Day</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
          ${rows}
        </table>
      `;

      drawPercentChart(percent);
      drawBarChart(presentDays, totalLectures);
    });
  }

  function drawPercentChart(percent) {
    const ctx = document.getElementById("percentChart").getContext("2d");

    if (percentChart) percentChart.destroy();

    percentChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Present %", "Remaining"],
        datasets: [{
          data: [percent, 100 - percent],
          backgroundColor: ["#00ffff", "#222"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  function drawBarChart(present, lectures) {
    const ctx = document.getElementById("barChart").getContext("2d");

    if (barChart) barChart.destroy();

    barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Present Days", "Total Lectures"],
        datasets: [{
          data: [present, lectures],
          backgroundColor: ["#00ffff", "#ff00ff"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

});
