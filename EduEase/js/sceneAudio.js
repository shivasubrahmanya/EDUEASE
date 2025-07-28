// js/sceneAudio.js
// Scene Description: Image to Audio
// Uses a placeholder API for demo. Replace with real API for production.

// Helper: Convert image file or canvas to base64
function imageToBase64(imgOrCanvas, callback) {
  let canvas;
  if (imgOrCanvas instanceof HTMLCanvasElement) {
    canvas = imgOrCanvas;
  } else {
    canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imgOrCanvas.width;
    canvas.height = imgOrCanvas.height;
    ctx.drawImage(imgOrCanvas, 0, 0);
  }
  callback(canvas.toDataURL('image/jpeg').split(',')[1]);
}

// Placeholder: Simulate scene description API
function describeScene(base64, cb) {
  // Replace with real API call (e.g. Google Vision, Azure, etc.)
  setTimeout(() => {
    cb("There's a person holding a book in a classroom.");
  }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('scene-form');
  const fileInput = document.getElementById('scene-image');
  const resultDiv = document.getElementById('scene-result');
  const webcamBtn = document.getElementById('open-webcam');
  const webcamContainer = document.getElementById('webcam-container');
  const webcamVideo = document.getElementById('webcam');
  const captureBtn = document.getElementById('capture-webcam');
  const webcamCanvas = document.getElementById('webcam-canvas');
  let webcamStream = null;
  let capturedImage = null;

  // Webcam logic
  webcamBtn.addEventListener('click', () => {
    webcamContainer.style.display = 'block';
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        webcamStream = stream;
        webcamVideo.srcObject = stream;
      });
  });

  captureBtn.addEventListener('click', () => {
    webcamCanvas.getContext('2d').drawImage(webcamVideo, 0, 0, 320, 240);
    webcamCanvas.style.display = 'block';
    capturedImage = webcamCanvas;
    // Stop webcam
    if (webcamStream) webcamStream.getTracks().forEach(t => t.stop());
    webcamVideo.srcObject = null;
    webcamContainer.style.display = 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resultDiv.textContent = 'Describing scene...';
    let imgSource = null;
    if (capturedImage) {
      imgSource = capturedImage;
    } else if (fileInput.files && fileInput.files[0]) {
      const img = new window.Image();
      img.onload = function() {
        imageToBase64(img, (base64) => {
          describeScene(base64, handleResult);
        });
      };
      img.src = URL.createObjectURL(fileInput.files[0]);
      return;
    } else {
      resultDiv.textContent = 'Please upload or capture an image.';
      return;
    }
    imageToBase64(imgSource, (base64) => {
      describeScene(base64, handleResult);
    });
  });

  function handleResult(desc) {
    resultDiv.textContent = desc;
    if (window.getToggleState && window.getToggleState('tts')) {
      window.speak && window.speak(desc);
    }
  }
}); 