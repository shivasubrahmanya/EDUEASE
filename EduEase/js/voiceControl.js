// js/voiceControl.js
// Voice Navigation using Web Speech API

// Command mapping
function findAndClickClosestMatch(query) {
  query = query.trim().toLowerCase();
  // Search buttons, links, and elements with data-tts or visible text
  const candidates = Array.from(document.querySelectorAll('button, a, [data-tts], .inline-btn, .btn, .option-btn'));
  let bestMatch = null;
  let bestScore = 0;
  candidates.forEach(el => {
    let text = (el.innerText || el.value || '').trim().toLowerCase();
    if (!text) return;
    // Simple fuzzy match: score = length of matching substring
    if (text.includes(query) && query.length > bestScore) {
      bestMatch = el;
      bestScore = query.length;
    } else if (text.split(' ').some(word => query.includes(word)) && 2 > bestScore) {
      bestMatch = el;
      bestScore = 2;
    }
  });
  if (bestMatch) {
    bestMatch.focus();
    bestMatch.click && bestMatch.click();
    window.speak && window.speak('Opened ' + bestMatch.innerText);
    return true;
  } else {
    window.speak && window.speak('Could not find anything matching ' + query);
    return false;
  }
}

const voiceCommands = {
  'go to home page': () => window.location.href = 'home.html',
  'open image to audio': () => window.location.href = 'scene-audio.html',
  'open scene audio': () => window.location.href = 'scene-audio.html',
  'read this section': () => {
    const active = document.activeElement;
    if (active && (active.innerText || active.value)) {
      window.speak(active.innerText || active.value);
    }
  },
  'click next': () => {
    const nextBtn = document.querySelector('button, .btn, .inline-btn, .option-btn, .next, [aria-label="Next"]');
    if (nextBtn) nextBtn.click();
  },
  // Flexible open command
  'open *': (spoken) => {
    // Extract the part after 'open '
    const match = spoken.match(/open (.+)/i);
    if (match && match[1]) {
      findAndClickClosestMatch(match[1]);
    } else {
      window.speak && window.speak('Please say what to open.');
    }
  },
};

function handleVoiceCommand(transcript) {
  // Try exact matches first
  for (const cmd in voiceCommands) {
    if (cmd.endsWith('*')) {
      // Flexible match
      const prefix = cmd.replace('*', '').trim();
      if (transcript.startsWith(prefix)) {
        voiceCommands[cmd](transcript);
        return;
      }
    } else if (transcript.includes(cmd)) {
      voiceCommands[cmd](transcript);
      return;
    }
  }
  window.speak && window.speak('Sorry, command not recognized.');
}

function setVoiceStatus(status, show = true) {
  const statusDiv = document.getElementById('voice-status');
  const statusText = document.getElementById('voice-status-text');
  if (statusDiv && statusText) {
    statusText.textContent = status;
    statusDiv.style.display = show ? 'block' : 'none';
  }
}

function startVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    setVoiceStatus('Not supported', true);
    console.error('SpeechRecognition not supported in this browser.');
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = function() {
    setVoiceStatus('Listening...', true);
  };
  recognition.onend = function() {
    setVoiceStatus('Inactive', true);
    // Restart recognition for continuous listening
    if (window.getToggleState && window.getToggleState('voice')) {
      recognition.start();
    }
  };
  recognition.onerror = function(event) {
    setVoiceStatus('Error', true);
    console.error('SpeechRecognition error:', event.error);
  };
  recognition.onresult = function(event) {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        const transcript = event.results[i][0].transcript.trim().toLowerCase();
        handleVoiceCommand(transcript);
      }
    }
  };
  setVoiceStatus('Listening...', true);
  recognition.start();
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.getToggleState && window.getToggleState('voice')) {
    setVoiceStatus('Listening...', true);
    startVoiceRecognition();
  } else {
    setVoiceStatus('Inactive', false);
  }
}); 