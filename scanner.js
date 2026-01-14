let html5QrCode;
let currentCameraId;
let cameras = [];
let started = false;

// ===== Male Voice System =====
let selectedVoice = null;

function loadMaleVoice() {
  const voices = window.speechSynthesis.getVoices();
  selectedVoice = voices.find(v =>
    v.name.toLowerCase().includes("male") ||
    v.name.toLowerCase().includes("google") ||
    v.name.toLowerCase().includes("microsoft")
  );
}

window.speechSynthesis.onvoiceschanged = loadMaleVoice;

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 0.8;
  msg.pitch = 0.4;
  msg.volume = 1;
  msg.lang = "en-IN";

  if (selectedVoice) msg.voice = selectedVoice;
  window.speechSynthesis.speak(msg);
}

// ===== Scan Success (NO thank-you here now) =====
function onScanSuccess(decodedText) {
  document.getElementById("beep").play();
  document.getElementById("successMsg").style.display = "block";

  if (navigator.vibrate) navigator.vibrate(200);

  setTimeout(() => {
    window.location.href = decodedText;
  }, 1000);
}

// ===== Start Scanner =====
function startScanner() {
  if (started) return;
  started = true;

  speak("Welcome to Naaas Revolution Centre");

  html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(devices => {
    if (!devices || devices.length === 0) {
      alert("No camera found");
      return;
    }

    cameras = devices;
    currentCameraId = devices[devices.length - 1].id;

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      onScanSuccess
    ).catch(err => {
      alert("Camera start failed: " + err);
    });
  });
}

// ===== Switch Camera =====
function switchCamera() {
  if (!started) return alert("Start scanner first");

  if (cameras.length < 2) return alert("Only one camera");

  let index = cameras.findIndex(cam => cam.id === currentCameraId);
  let nextIndex = (index + 1) % cameras.length;

  html5QrCode.stop().then(() => {
    currentCameraId = cameras[nextIndex].id;
    started = false;
    startScanner();
  });
}

// ===== Scan from Image =====
function scanFromImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const imgScanner = new Html5Qrcode("temp-img-reader");

    imgScanner.scanFile(file, true)
      .then(decodedText => onScanSuccess(decodedText))
      .catch(() => alert("No QR found in image"));
  };

  input.click();
}
