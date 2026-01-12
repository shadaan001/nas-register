let currentCameraId = null;
let html5QrCode = new Html5Qrcode("reader");
let flashOn = false;

function onScanSuccess(decodedText) {
  document.getElementById("beep").play();
  document.getElementById("successMsg").style.display = "block";

  if (navigator.vibrate) navigator.vibrate(200);

  setTimeout(() => {
    window.location.href = decodedText;
  }, 800);
}

function startScanner(cameraId = null) {
  Html5Qrcode.getCameras().then(cameras => {
    if (!cameras || cameras.length === 0) {
      alert("No camera found");
      return;
    }

    if (!cameraId) {
      currentCameraId = cameras[cameras.length - 1].id; // Prefer back camera
    } else {
      currentCameraId = cameraId;
    }

    html5QrCode.start(
      currentCameraId,
      { fps: 12, qrbox: 300 },
      onScanSuccess
    );
  });
}

function switchCamera() {
  Html5Qrcode.getCameras().then(cameras => {
    if (cameras.length < 2) {
      alert("Only one camera available");
      return;
    }

    let index = cameras.findIndex(c => c.id === currentCameraId);
    let nextIndex = (index + 1) % cameras.length;

    html5QrCode.stop().then(() => {
      startScanner(cameras[nextIndex].id);
    });
  });
}

function toggleFlash() {
  try {
    flashOn = !flashOn;
    html5QrCode.applyVideoConstraints({
      advanced: [{ torch: flashOn }]
    });
  } catch (e) {
    alert("Flash not supported on this device");
  }
}

function scanFromImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    html5QrCode.scanFile(file, true)
      .then(decodedText => onScanSuccess(decodedText))
      .catch(() => alert("No QR found in image"));
  };
  input.click();
}

// Start on load
startScanner();
