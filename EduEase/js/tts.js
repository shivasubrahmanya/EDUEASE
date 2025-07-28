// js/tts.js
// Text-to-Speech on hover using Web Speech API

function speak(text) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.lang = 'en-US';
  window.speechSynthesis.cancel(); // Stop previous
  window.speechSynthesis.speak(utter);
}

function enableTTSOnHover() {
  document.body.addEventListener('mouseover', (e) => {
    if (!window.getToggleState || !window.getToggleState('tts')) return;
    let el = e.target;
    // Only speak if the element has visible text and is not a script/style/meta/link
    if (el.innerText && el.innerText.trim().length > 0 && !['SCRIPT','STYLE','META','LINK','HEAD','TITLE','HTML','BODY'].includes(el.tagName)) {
      speak(el.innerText.trim());
    }
  });
  document.body.addEventListener('mouseout', (e) => {
    if (!window.getToggleState || !window.getToggleState('tts')) return;
    window.speechSynthesis.cancel();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.getToggleState && window.getToggleState('tts')) {
    enableTTSOnHover();
  }
  window.speak = speak;
}); 