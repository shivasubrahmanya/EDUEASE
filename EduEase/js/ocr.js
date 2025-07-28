// js/ocr.js
// OCR (Image-to-Text) using Tesseract.js

// Helper: Convert image file or canvas to base64
function imageToBase64_OCR(imgOrCanvas, callback) {
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
  callback(canvas.toDataURL('image/jpeg'));
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ocr-form');
  const fileInput = document.getElementById('ocr-image');
  const resultDiv = document.getElementById('ocr-result');
  const webcamBtn = document.getElementById('open-webcam-ocr');
  const webcamContainer = document.getElementById('webcam-container-ocr');
  const webcamVideo = document.getElementById('webcam-ocr');
  const captureBtn = document.getElementById('capture-webcam-ocr');
  const webcamCanvas = document.getElementById('webcam-canvas-ocr');
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
    resultDiv.textContent = 'Recognizing text...';
    let imgSource = null;
    if (capturedImage) {
      imgSource = capturedImage;
    } else if (fileInput.files && fileInput.files[0]) {
      const img = new window.Image();
      img.onload = function() {
        imageToBase64_OCR(img, (base64) => {
          recognizeText(base64);
        });
      };
      img.src = URL.createObjectURL(fileInput.files[0]);
      return;
    } else {
      resultDiv.textContent = 'Please upload or capture an image.';
      return;
    }
    imageToBase64_OCR(imgSource, (base64) => {
      recognizeText(base64);
    });
  });

  function recognizeText(imageData) {
    Tesseract.recognize(
      imageData,
      'eng',
      { logger: m => { resultDiv.textContent = 'Progress: ' + Math.round(m.progress * 100) + '%'; } }
    ).then(({ data: { text } }) => {
      resultDiv.textContent = text;
      if (window.getToggleState && window.getToggleState('tts')) {
        window.speak && window.speak(text);
      }
    });
  }
}); 