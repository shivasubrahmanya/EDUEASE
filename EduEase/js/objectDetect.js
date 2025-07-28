// js/objectDetect.js
// Real-Time Object Detection using TensorFlow.js coco-ssd

let model = null;
let detectInterval = null;

async function loadModel() {
  if (!model) {
    model = await cocoSsd.load();
  }
}

async function startObjectDetection() {
  await loadModel();
  const video = document.getElementById('object-video');
  const canvas = document.getElementById('object-canvas');
  const resultDiv = document.getElementById('object-result');
  const container = document.getElementById('object-detect-container');
  container.style.display = 'block';

  // Start webcam
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      detectInterval = setInterval(() => detectFrame(video, canvas, resultDiv), 1000);
    };
  });
}

async function detectFrame(video, canvas, resultDiv) {
  if (!model) return;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const predictions = await model.detect(canvas);
  let spoken = false;
  if (predictions.length > 0) {
    const objects = predictions.map(p => p.class).join(', ');
    resultDiv.textContent = 'Detected: ' + objects;
    if (window.getToggleState && window.getToggleState('tts') && window.speak && !spoken) {
      window.speak('Detected: ' + objects);
      spoken = true;
    }
  } else {
    resultDiv.textContent = 'No objects detected.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-detect');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startObjectDetection();
      startBtn.disabled = true;
      startBtn.textContent = 'Detecting...';
    });
  }
}); 