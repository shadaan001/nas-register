const ADMIN_USER = "NAS MANAGEMENT";
const ADMIN_PASS = "NAS007@";

function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  if (u.toLowerCase() === ADMIN_USER.toLowerCase() && p === ADMIN_PASS) {
    sessionStorage.setItem("nasAdmin", "true");
    window.location.href = "admin.html";
  } else {
    document.getElementById("error").style.display = "block";
  }
}

function protectPage() {
  if (sessionStorage.getItem("nasAdmin") !== "true") {
    window.location.href = "login.html";
  }
}

function logout() {
  sessionStorage.removeItem("nasAdmin");
  window.location.href = "login.html";
}
