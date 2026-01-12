let currentCameraId = null;
let cameras = [];
let html5QrCode;
let imgScanner;
let started = false;

function onScanSuccess(decodedText) {
  document.getElementById("beep").play();
  document.getElementById("successMsg").style.display = "block";

  if (navigator.vibrate) navigator.vibrate(200);

  setTimeout(() => {
    window.location.href = decodedText;
  }, 800);
}

function startScanner(cameraId = null) {
  if (started) return;
  started = true;

  html5QrCode = new Html5Qrcode("reader");
  imgScanner = new Html5Qrcode("temp-img-reader");

  Html5Qrcode.getCameras().then(devices => {
    if (!devices || devices.length === 0) {
      alert("No camera found");
      return;
    }

    cameras = devices;

    if (!cameraId) {
      currentCameraId = devices[devices.length - 1].id;
    } else {
      currentCameraId = cameraId;
    }

    html5QrCode.start(
      currentCameraId,
      { fps: 12, qrbox: 250 },
      onScanSuccess
    ).catch(err => {
      console.error(err);
      alert("Camera start failed");
    });

  }).catch(err => {
    console.error(err);
    alert("Camera permission denied");
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
    started = false;
    startScanner(cameras[nextIndex].id);
  });
}

function scanFromImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    imgScanner.scanFile(file, true)
      .then(decodedText => onScanSuccess(decodedText))
      .catch(() => alert("No QR found in image"));
  };

  input.click();
}
