// DOM Elements
const ttsInput = document.getElementById('ttsInput');
const ttsVoiceSelect = document.getElementById('ttsVoice');
const ttsRate = document.getElementById('ttsRate');
const ttsPitch = document.getElementById('ttsPitch');
const ttsVolume = document.getElementById('ttsVolume');
const ttsSpeakBtn = document.getElementById('ttsSpeakBtn');
const ttsPauseBtn = document.getElementById('ttsPauseBtn');
const ttsStopBtn = document.getElementById('ttsStopBtn');
const ttsStatus = document.getElementById('ttsStatus');
const ttsRateValue = document.getElementById('ttsRateValue');
const ttsPitchValue = document.getElementById('ttsPitchValue');
const ttsVolumeValue = document.getElementById('ttsVolumeValue');
const ttsPhrases = document.querySelectorAll('.phrase-btn');

// Check if speech synthesis is supported
if (typeof speechSynthesis === 'undefined') {
    ttsStatus.textContent = 'Speech synthesis not supported in this browser';
    ttsStatus.style.color = 'var(--error-color)';
    
    // Disable all controls
    [ttsInput, ttsVoiceSelect, ttsRate, ttsPitch, ttsVolume, 
     ttsSpeakBtn, ttsPauseBtn, ttsStopBtn].forEach(el => {
        el.disabled = true;
     });
}

// Load available voices
function loadVoices() {
    if (typeof speechSynthesis === 'undefined') return;
    
    // Clear existing options
    ttsVoiceSelect.innerHTML = '<option value="">Default Voice</option>';
    
    const voices = speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
        voices.forEach((voice, i) => {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${voice.name} (${voice.lang})`;
            ttsVoiceSelect.appendChild(option);
        });
        
        // Log for debugging
        console.log(`Loaded ${voices.length} voices`);
    } else {
        console.log('No voices available yet');
        // Try again after a delay if no voices are loaded
        setTimeout(loadVoices, 500);
    }
}

// Voice list might load asynchronously
if (typeof speechSynthesis !== 'undefined') {
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Initial load attempt
    loadVoices();
    
    // Sometimes onvoiceschanged doesn't fire in all browsers, so we'll try again after a delay
    setTimeout(loadVoices, 1000);
}

// Update slider value displays
ttsRate.addEventListener('input', () => {
    ttsRateValue.textContent = parseFloat(ttsRate.value).toFixed(1);
});

ttsPitch.addEventListener('input', () => {
    ttsPitchValue.textContent = parseFloat(ttsPitch.value).toFixed(1);
});

ttsVolume.addEventListener('input', () => {
    ttsVolumeValue.textContent = parseFloat(ttsVolume.value).toFixed(1);
});

// Speech function
function speak() {
    if (typeof speechSynthesis === 'undefined') return;
    
    const text = ttsInput.value.trim();
    if (!text) {
        ttsStatus.textContent = 'Please enter text to speak';
        ttsStatus.style.color = 'var(--error-color)';
        return;
    }
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice settings
    if (ttsVoiceSelect.value) {
        const voiceIndex = parseInt(ttsVoiceSelect.value);
        const voices = speechSynthesis.getVoices();
        if (voices && voices[voiceIndex]) {
            utterance.voice = voices[voiceIndex];
            console.log(`Using voice: ${voices[voiceIndex].name}`);
        }
    }
    
    utterance.rate = parseFloat(ttsRate.value);
    utterance.pitch = parseFloat(ttsPitch.value);
    utterance.volume = parseFloat(ttsVolume.value);
    
    // Event handlers
    utterance.onstart = () => {
        ttsStatus.textContent = 'Speaking...';
        ttsStatus.style.color = 'var(--primary-color)';
        ttsSpeakBtn.disabled = true;
        document.body.classList.add('speaking');
        
        // Log for debugging
        console.log('Speech started');
    };
    
    utterance.onend = () => {
        ttsStatus.textContent = 'Finished speaking';
        ttsStatus.style.color = 'var(--text-secondary)';
        ttsSpeakBtn.disabled = false;
        document.body.classList.remove('speaking');
        ttsPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        
        // Log for debugging
        console.log('Speech ended');
    };
    
    utterance.onerror = (e) => {
        ttsStatus.textContent = `Error: ${e.error}`;
        ttsStatus.style.color = 'var(--error-color)';
        ttsSpeakBtn.disabled = false;
        document.body.classList.remove('speaking');
        
        // Log for debugging
        console.error('Speech error:', e);
    };
    
    // Chrome bug fix: Need to speak small text snippet first
    // to ensure proper functioning after a page reload
    if (!window.speechSynthesisInitialized) {
        const initUtterance = new SpeechSynthesisUtterance('');
        speechSynthesis.speak(initUtterance);
        window.speechSynthesisInitialized = true;
        console.log('Initialized speech synthesis');
    }
    
    // Speak
    try {
        speechSynthesis.speak(utterance);
        console.log('Speech started with text:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    } catch (error) {
        console.error('Error speaking:', error);
        ttsStatus.textContent = `Error: ${error.message || 'Unknown error'}`;
        ttsStatus.style.color = 'var(--error-color)';
    }
}

// Handle Chrome bug where speech can stop
// Chrome has a bug where long text stops after ~15 seconds
setInterval(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        speechSynthesis.resume();
        console.log('Applied Chrome pause/resume fix');
    }
}, 14000);

// Button event handlers
ttsSpeakBtn.addEventListener('click', speak);

ttsPauseBtn.addEventListener('click', () => {
    if (typeof speechSynthesis === 'undefined') return;
    
    if (speechSynthesis.speaking) {
        try {
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
                ttsStatus.textContent = 'Speaking...';
                ttsStatus.style.color = 'var(--primary-color)';
                ttsPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                document.body.classList.add('speaking');
                console.log('Speech resumed');
            } else {
                speechSynthesis.pause();
                ttsStatus.textContent = 'Paused';
                ttsStatus.style.color = 'var(--text-secondary)';
                ttsPauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
                document.body.classList.remove('speaking');
                console.log('Speech paused');
            }
        } catch (error) {
            console.error('Error toggling pause/resume:', error);
        }
    }
});

ttsStopBtn.addEventListener('click', () => {
    if (typeof speechSynthesis === 'undefined') return;
    
    try {
        speechSynthesis.cancel();
        ttsStatus.textContent = 'Stopped';
        ttsStatus.style.color = 'var(--text-secondary)';
        ttsSpeakBtn.disabled = false;
        ttsPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        document.body.classList.remove('speaking');
        console.log('Speech stopped');
    } catch (error) {
        console.error('Error stopping speech:', error);
    }
});

// Quick phrases
ttsPhrases.forEach(phrase => {
    phrase.addEventListener('click', () => {
        ttsInput.value = phrase.textContent;
        speak();
    });
});

// Enter key to speak
ttsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        speak();
    }
});

// Adapt to parent theme
function detectTheme() {
    try {
        // Try to get parent's theme
        const parentIsDark = window.parent.document.body.classList.contains('dark-theme');
        if (parentIsDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    } catch (e) {
        // If we can't access parent (e.g., due to iframe security),
        // use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-theme');
        }
    }
}

// Initial theme detection
detectTheme();

// Optional: Check theme periodically (for dynamic theme changes)
setInterval(detectTheme, 1000);

// Add demo text to make it easier to test
ttsInput.value = "Hello! This is the Text to Speech tool. You can use this to convert any text to speech. Try changing the voice, rate, pitch, and volume settings.";