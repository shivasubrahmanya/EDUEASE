// js/toggle.js
// Master toggle for accessibility features

function setToggleState(feature, enabled) {
  localStorage.setItem(`accessibility_${feature}`, enabled ? "on" : "off");
}

function getToggleState(feature) {
  return localStorage.getItem(`accessibility_${feature}`) === "on";
}

function updateToggles() {
  const tts = document.getElementById('toggle-tts');
  const voice = document.getElementById('toggle-voice');
  if (tts) tts.checked = getToggleState('tts');
  if (voice) voice.checked = getToggleState('voice');
}

document.addEventListener('DOMContentLoaded', () => {
  updateToggles();
  const tts = document.getElementById('toggle-tts');
  const voice = document.getElementById('toggle-voice');
  if (tts) {
    tts.addEventListener('change', (e) => {
      setToggleState('tts', e.target.checked);
      window.location.reload();
    });
  }
  if (voice) {
    voice.addEventListener('change', (e) => {
      setToggleState('voice', e.target.checked);
      window.location.reload();
    });
  }
});

// Expose for other modules
window.getToggleState = getToggleState; 