// DOM Elements
const languageSelect = document.getElementById('language');
const interimResultsCheckbox = document.getElementById('interim-results');
const transcriptTextarea = document.getElementById('transcript');
const recordBtn = document.getElementById('record-btn');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const saveBtn = document.getElementById('save-btn');
const statusMessage = document.getElementById('status-message');
const statusIndicator = document.getElementById('status-indicator');
const waveElement = document.getElementById('wave');

// Speech Recognition variables
let recognition = null;
let isRecording = false;
let finalTranscript = '';
let interimTranscript = '';

// Check if speech recognition is supported
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        statusMessage.textContent = 'Speech recognition not supported in this browser';
        statusMessage.style.color = 'var(--error-color)';
        recordBtn.disabled = true;
        return false;
    }
    
    recognition = new SpeechRecognition();
    setupRecognition();
    return true;
}

// Setup speech recognition
function setupRecognition() {
    recognition.continuous = true;
    recognition.interimResults = interimResultsCheckbox.checked;
    recognition.lang = languageSelect.value;
    
    recognition.onstart = function() {
        isRecording = true;
        updateUI();
        console.log('Speech recognition started');
    };
    
    recognition.onresult = function(event) {
        interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        updateTranscript();
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Error: ';
        switch(event.error) {
            case 'network':
                errorMessage += 'Network error. Check your internet connection.';
                break;
            case 'not-allowed':
            case 'service-not-allowed':
                errorMessage += 'Microphone access denied. Please allow microphone access.';
                break;
            case 'aborted':
                errorMessage += 'Recognition aborted.';
                break;
            case 'audio-capture':
                errorMessage += 'No microphone detected.';
                break;
            case 'no-speech':
                errorMessage += 'No speech detected. Try speaking louder.';
                break;
            default:
                errorMessage += event.error;
        }
        
        statusMessage.textContent = errorMessage;
        statusMessage.style.color = 'var(--error-color)';
        
        // If not a no-speech error, stop recording
        if (event.error !== 'no-speech') {
            stopRecording();
        }
    };
    
    recognition.onend = function() {
        console.log('Speech recognition ended');
        
        // If still flagged as recording, restart recognition (for continuous mode)
        if (isRecording) {
            try {
                recognition.start();
                console.log('Restarted speech recognition');
            } catch (error) {
                console.error('Error restarting recognition:', error);
                isRecording = false;
                updateUI();
            }
        }
    };
}

// Update the transcript in the textarea
function updateTranscript() {
    transcriptTextarea.value = finalTranscript + interimTranscript;
    transcriptTextarea.scrollTop = transcriptTextarea.scrollHeight;
}

// Start recording
function startRecording() {
    if (!recognition) {
        if (!initSpeechRecognition()) return;
    }
    
    try {
        recognition.start();
        isRecording = true;
        updateUI();
        statusMessage.textContent = 'Listening...';
        statusMessage.style.color = 'var(--success-color)';
    } catch (error) {
        console.error('Error starting recognition:', error);
        statusMessage.textContent = `Error starting recognition: ${error.message}`;
        statusMessage.style.color = 'var(--error-color)';
    }
}

// Stop recording
function stopRecording() {
    if (recognition) {
        try {
            recognition.stop();
            console.log('Stopped recognition');
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }
    
    isRecording = false;
    updateUI();
    statusMessage.textContent = 'Recording stopped';
    statusMessage.style.color = 'var(--text-secondary)';
}

// Toggle recording state
function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

// Clear transcript
function clearTranscript() {
    finalTranscript = '';
    interimTranscript = '';
    transcriptTextarea.value = '';
    statusMessage.textContent = 'Transcript cleared';
    statusMessage.style.color = 'var(--text-secondary)';
}

// Copy transcript to clipboard
function copyTranscript() {
    const text = transcriptTextarea.value.trim();
    
    if (!text) {
        statusMessage.textContent = 'Nothing to copy';
        statusMessage.style.color = 'var(--text-secondary)';
        return;
    }
    
    navigator.clipboard.writeText(text)
        .then(() => {
            statusMessage.textContent = 'Copied to clipboard';
            statusMessage.style.color = 'var(--success-color)';
        })
        .catch(err => {
            console.error('Error copying text:', err);
            statusMessage.textContent = 'Error copying to clipboard';
            statusMessage.style.color = 'var(--error-color)';
        });
}

// Save transcript to file
function saveTranscript() {
    const text = transcriptTextarea.value.trim();
    
    if (!text) {
        statusMessage.textContent = 'Nothing to save';
        statusMessage.style.color = 'var(--text-secondary)';
        return;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const lang = languageSelect.value.split('-')[0];
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript_${lang}_${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    statusMessage.textContent = 'Transcript saved';
    statusMessage.style.color = 'var(--success-color)';
}

// Update UI based on recording state
function updateUI() {
    if (isRecording) {
        recordBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
        recordBtn.classList.add('stop');
        statusIndicator.classList.add('recording');
        document.body.classList.add('recording');
    } else {
        recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
        recordBtn.classList.remove('stop');
        statusIndicator.classList.remove('recording');
        document.body.classList.remove('recording');
    }
}

// Event listeners
recordBtn.addEventListener('click', toggleRecording);
clearBtn.addEventListener('click', clearTranscript);
copyBtn.addEventListener('click', copyTranscript);
saveBtn.addEventListener('click', saveTranscript);

languageSelect.addEventListener('change', function() {
    if (recognition) {
        const wasRecording = isRecording;
        
        if (wasRecording) {
            stopRecording();
        }
        
        recognition.lang = this.value;
        statusMessage.textContent = `Language changed to ${this.options[this.selectedIndex].text}`;
        statusMessage.style.color = 'var(--text-secondary)';
        
        if (wasRecording) {
            // Small delay to ensure previous session is properly ended
            setTimeout(startRecording, 200);
        }
    }
});

interimResultsCheckbox.addEventListener('change', function() {
    if (recognition) {
        recognition.interimResults = this.checked;
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space to toggle recording
    if (e.code === 'Space' && document.activeElement !== transcriptTextarea) {
        e.preventDefault();
        toggleRecording();
    }
    
    // Ctrl+C to copy
    if (e.ctrlKey && e.code === 'KeyC' && document.activeElement !== transcriptTextarea) {
        e.preventDefault();
        copyTranscript();
    }
    
    // Ctrl+X to clear
    if (e.ctrlKey && e.code === 'KeyX' && document.activeElement !== transcriptTextarea) {
        e.preventDefault();
        clearTranscript();
    }
    
    // Ctrl+S to save
    if (e.ctrlKey && e.code === 'KeyS') {
        e.preventDefault();
        saveTranscript();
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

// Initialize everything
function initialize() {
    initSpeechRecognition();
    detectTheme();
    setInterval(detectTheme, 1000); // Check theme periodically
}

// Run initialization on page load
window.addEventListener('DOMContentLoaded', initialize);