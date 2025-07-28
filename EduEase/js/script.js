// Dark Mode Toggle
let toggleBtn = document.getElementById('toggle-btn');
let body = document.body;
let darkMode = localStorage.getItem('dark-mode');

// --- AccessibilityManager: Modular Accessibility for EduEase ---
const ACCESSIBILITY_KEY = 'accessibility-enabled';
let accessibilityEnabled = localStorage.getItem(ACCESSIBILITY_KEY) === 'true';

// --- UI: Global Accessibility Toggle & Settings Modal ---
function injectAccessibilityToggle() {
    if (document.getElementById('accessibility-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'accessibility-toggle';
    btn.innerHTML = accessibilityEnabled ? 'Accessibility: ON' : 'Accessibility: OFF';
    btn.setAttribute('aria-pressed', accessibilityEnabled);
    btn.style.position = 'fixed';
    btn.style.bottom = '24px';
    btn.style.right = '24px';
    btn.style.zIndex = '9999';
    btn.style.padding = '16px 20px';
    btn.style.background = '#222';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '8px';
    btn.style.fontSize = '18px';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'background 0.2s';
    btn.addEventListener('mouseenter', () => btn.style.background = '#444');
    btn.addEventListener('mouseleave', () => btn.style.background = '#222');
    btn.onclick = function() {
        accessibilityEnabled = !accessibilityEnabled;
        localStorage.setItem(ACCESSIBILITY_KEY, accessibilityEnabled);
        btn.innerHTML = accessibilityEnabled ? 'Accessibility: ON' : 'Accessibility: OFF';
        btn.setAttribute('aria-pressed', accessibilityEnabled);
        if (accessibilityEnabled) {
            AccessibilityManager.enable();
        } else {
            AccessibilityManager.disable();
        }
    };
    // Settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.title = 'Accessibility Settings';
    settingsBtn.style.marginLeft = '12px';
    settingsBtn.style.fontSize = '20px';
    settingsBtn.style.background = 'transparent';
    settingsBtn.style.border = 'none';
    settingsBtn.style.color = '#fff';
    settingsBtn.style.cursor = 'pointer';
    settingsBtn.onclick = AccessibilityManager.showSettings;
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.appendChild(btn);
    container.appendChild(settingsBtn);
    container.style.position = 'fixed';
    container.style.bottom = '24px';
    container.style.right = '24px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
}

// --- AccessibilityManager: All Features Modular ---
const AccessibilityManager = {
    enabled: accessibilityEnabled,
    enable() {
        this.enabled = true;
        this.enableTTS();
        this.enableVoiceNavigation();
        this.enableObjectDetection();
        this.enableOCR();
        this.enableAIHelper();
        this.enableVoiceAuth();
        // ...add more enables as needed
        this.audioFeedback('Accessibility enabled.');
    },
    disable() {
        this.enabled = false;
        this.disableTTS();
        this.disableVoiceNavigation();
        this.disableObjectDetection();
        this.disableOCR();
        this.disableAIHelper();
        this.disableVoiceAuth();
        // ...add more disables as needed
        this.audioFeedback('Accessibility disabled.');
    },
    // --- TTS (multi-engine, fallback) ---
    ttsHandler: null,
    ttsEngine: 'browser', // 'google', 'amazon', 'azure', 'browser'
    enableTTS() {
        this.disableTTS();
        this.ttsHandler = (e) => {
            let text = e.target.innerText || e.target.alt || '';
            text = text.trim();
            if (text) this.speak(text);
        };
        document.querySelectorAll('body *').forEach(el => {
            if (el.children.length === 0 && (el.innerText.trim() || el.alt)) {
                el.addEventListener('mouseenter', this.ttsHandler);
                el.addEventListener('focus', this.ttsHandler);
                el.addEventListener('mouseleave', this.cancelSpeech);
                el.addEventListener('blur', this.cancelSpeech);
            }
        });
    },
    disableTTS() {
        document.querySelectorAll('body *').forEach(el => {
            el.removeEventListener('mouseenter', this.ttsHandler);
            el.removeEventListener('focus', this.ttsHandler);
            el.removeEventListener('mouseleave', this.cancelSpeech);
            el.removeEventListener('blur', this.cancelSpeech);
        });
        this.cancelSpeech();
    },
    speak(text) {
        // Multi-engine TTS stub. Use browser for now.
        if (this.ttsEngine === 'browser') {
            if ('speechSynthesis' in window) {
                this.cancelSpeech();
                let utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US';
                utterance.rate = 1;
                utterance.pitch = 1;
                window.speechSynthesis.speak(utterance);
            }
        } else {
            // TODO: Integrate Google, Amazon Polly, Azure TTS via cloud API
            this.audioFeedback('Cloud TTS not yet configured.');
        }
    },
    cancelSpeech() {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    },
    // --- Voice Navigation (NLP, multi-step) ---
    voiceNavActive: false,
    enableVoiceNavigation() {
        // TODO: Use Web Speech API + custom NLP for voice navigation
        // Placeholder: press Ctrl+Shift+V to start/stop voice nav
        document.addEventListener('keydown', this.voiceNavKeyHandler);
    },
    disableVoiceNavigation() {
        document.removeEventListener('keydown', this.voiceNavKeyHandler);
    },
    voiceNavKeyHandler(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'V') {
            AccessibilityManager.voiceNavActive = !AccessibilityManager.voiceNavActive;
            AccessibilityManager.audioFeedback('Voice navigation ' + (AccessibilityManager.voiceNavActive ? 'activated' : 'deactivated'));
            // TODO: Start/stop voice recognition here
        }
    },
    // --- Object Detection (Camera) ---
    enableObjectDetection() {
        // TODO: Integrate TensorFlow.js or similar for real-time object detection
        // UI: Add camera button to settings modal
    },
    disableObjectDetection() {},
    // --- OCR & Braille ---
    enableOCR() {
        // TODO: Integrate Tesseract.js for OCR, Braille output for supported hardware
    },
    disableOCR() {},
    // --- AI Assistant ---
    enableAIHelper() {
        // TODO: Integrate local/cloud LLM for context-aware help
    },
    disableAIHelper() {},
    // --- Voice Authentication ---
    enableVoiceAuth() {
        // TODO: Integrate voiceprint + PIN for secure auth
    },
    disableVoiceAuth() {},
    // --- Audio Feedback ---
    audioFeedback(text) {
        if ('speechSynthesis' in window) {
            let utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.1;
            utterance.pitch = 1.1;
            window.speechSynthesis.speak(utterance);
        }
    },
    // --- Settings Modal ---
    showSettings() {
        // Simple modal for now
        let modal = document.getElementById('accessibility-settings-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'accessibility-settings-modal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.background = '#fff';
            modal.style.color = '#222';
            modal.style.padding = '32px';
            modal.style.borderRadius = '12px';
            modal.style.zIndex = '10000';
            modal.style.boxShadow = '0 4px 32px rgba(0,0,0,0.3)';
            modal.innerHTML = `
                <h2>Accessibility Settings</h2>
                <label>TTS Engine:
                    <select id="tts-engine-select">
                        <option value="browser">Browser (default)</option>
                        <option value="google">Google Cloud TTS</option>
                        <option value="amazon">Amazon Polly</option>
                        <option value="azure">Microsoft Azure</option>
                    </select>
                </label><br><br>
                <button id="voice-nav-toggle">Test Voice Navigation</button><br><br>
                <button id="object-detect-btn">Test Object Detection</button><br><br>
                <button id="ocr-btn">Test OCR</button><br><br>
                <button id="ai-helper-btn">Ask AI Assistant</button><br><br>
                <button id="voice-auth-btn">Test Voice Auth</button><br><br>
                <button id="close-settings">Close</button>
                <p style="margin-top:16px;font-size:13px;color:#888;">Some features require cloud API keys or special hardware.<br>Contact admin for advanced setup.</p>
            `;
            document.body.appendChild(modal);
            // Event listeners for settings
            document.getElementById('tts-engine-select').onchange = function(e) {
                AccessibilityManager.ttsEngine = e.target.value;
                AccessibilityManager.audioFeedback('TTS engine set to ' + e.target.value);
            };
            document.getElementById('close-settings').onclick = function() {
                modal.remove();
            };
            document.getElementById('voice-nav-toggle').onclick = function() {
                AccessibilityManager.audioFeedback('Voice navigation feature coming soon.');
            };
            document.getElementById('object-detect-btn').onclick = function() {
                AccessibilityManager.audioFeedback('Object detection feature coming soon.');
            };
            document.getElementById('ocr-btn').onclick = function() {
                AccessibilityManager.audioFeedback('OCR feature coming soon.');
            };
            document.getElementById('ai-helper-btn').onclick = function() {
                AccessibilityManager.audioFeedback('AI Assistant feature coming soon.');
            };
            document.getElementById('voice-auth-btn').onclick = function() {
                AccessibilityManager.audioFeedback('Voice authentication feature coming soon.');
            };
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    injectAccessibilityToggle();
    if (accessibilityEnabled) AccessibilityManager.enable();
});

const enableDarkMode = () => {
   toggleBtn.classList.replace('fa-sun', 'fa-moon');
   body.classList.add('dark');
   localStorage.setItem('dark-mode', 'enabled');
}

const disableDarkMode = () => {
   toggleBtn.classList.replace('fa-moon', 'fa-sun');
   body.classList.remove('dark');
   localStorage.setItem('dark-mode', 'disabled');
}

if (darkMode === 'enabled') {
   enableDarkMode();
}

toggleBtn.onclick = (e) => {
   darkMode = localStorage.getItem('dark-mode');
   if (darkMode === 'disabled') {
      enableDarkMode();
   } else {
      disableDarkMode();
   }
}

// Profile Toggle
let profile = document.querySelector('.header .flex .profile');

document.querySelector('#user-btn').onclick = () => {
   profile.classList.toggle('active');
   search.classList.remove('active');
}

// Search Toggle
let search = document.querySelector('.header .flex .search-form');

document.querySelector('#search-btn').onclick = () => {
   search.classList.toggle('active');
   profile.classList.remove('active');
}

// Sidebar Toggle
let sideBar = document.querySelector('.side-bar');

document.querySelector('#menu-btn').onclick = () => {
   sideBar.classList.toggle('active');
   body.classList.toggle('active');
}

document.querySelector('#close-btn').onclick = () => {
   sideBar.classList.remove('active');
   body.classList.remove('active');
}

// Window Scroll Handling
window.onscroll = () => {
   profile.classList.remove('active');
   search.classList.remove('active');

   if (window.innerWidth < 1200) {
      sideBar.classList.remove('active');
      body.classList.remove('active');
   }
}

// Audiobook Dropdown Toggle
let exploreButton = document.getElementById('explore-audiobooks');
let dropdown = document.getElementById('audiobooks-dropdown');

exploreButton.addEventListener('click', function() {
   // Toggle dropdown visibility
   if (dropdown.style.display === 'none') {
      dropdown.style.display = 'block';
   } else {
      dropdown.style.display = 'none';
   }
});
