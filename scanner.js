let html5QrCode;
let currentCameraId;
let cameras = [];
let started = false;

function onScanSuccess(decodedText) {
  document.getElementById("beep").play();
  document.getElementById("successMsg").style.display = "block";

  if (navigator.vibrate) navigator.vibrate(200);

  setTimeout(() => {
    window.location.href = decodedText;
  }, 800);
}

function startScanner() {
  if (started) return;
  started = true;

  html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(devices => {
    if (!devices || devices.length === 0) {
      alert("No camera found");
      return;
    }

    cameras = devices;

    // Prefer back camera
    currentCameraId = devices[devices.length - 1].id;

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      onScanSuccess
    ).catch(err => {
      console.error(err);
      alert("Camera start failed: " + err);
    });

  }).catch(err => {
    console.error(err);
    alert("Camera permission denied: " + err);
  });
}

function switchCamera() {
  if (!started) {
    alert("Start scanner first");
    return;
  }

  if (cameras.length < 2) {
    alert("Only one camera available");
    return;
  }

  let index = cameras.findIndex(cam => cam.id === currentCameraId);
  let nextIndex = (index + 1) % cameras.length;

  html5QrCode.stop().then(() => {
    currentCameraId = cameras[nextIndex].id;
    started = false;
    startScanner();
  });
}

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
