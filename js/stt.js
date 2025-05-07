const sttFunctions = {
    recognition: null,
    isRecording: false,
    transcript: '',
    interimTranscript: '',
    lang: 'en-US',
    interimResults: true,
    history: [],
    
    initialize: function() {
        this.output = document.getElementById('output');
        this.langSelect = document.getElementById('lang');
        this.interimCheckbox = document.getElementById('interim');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = this.lang;
            this.recognition.interimResults = this.interimResults;
            this.recognition.continuous = true;
            this.setupRecognition();
        } else {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>Speech Recognition API not supported</p>
            `;
        }
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
    },
    
    setupRecognition: function() {
        this.recognition.onresult = (event) => {
            this.interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    this.transcript += transcript + ' ';
                } else {
                    this.interimTranscript += transcript;
                }
            }
            this.output.value = this.transcript + this.interimTranscript;
        };
        this.recognition.onerror = (event) => {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>Speech recognition error: ${event.error}</p>
            `;
            this.history.push(`Error: ${event.error}`);
            this.updateHistory();
            this.saveToStorage();
        };
        this.recognition.onend = () => {
            if (this.isRecording) {
                this.recognition.start(); // Restart for continuous recognition
            }
        };
    },
    
    addEventListeners: function() {
        if (!this.recognition) return;
        this.langSelect.addEventListener('change', (e) => {
            this.lang = e.target.value;
            this.recognition.lang = this.lang;
            this.updateDisplay();
        });
        this.interimCheckbox.addEventListener('change', (e) => {
            this.interimResults = e.target.checked;
            this.recognition.interimResults = this.interimResults;
            this.updateDisplay();
        });
        this.output.addEventListener('input', (e) => {
            this.transcript = e.target.value;
            this.updateDisplay();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.toggleRecording();
            }
            if (e.key === 'c' || e.key === 'C') this.copy();
            if (e.key === 'x' || e.key === 'X') this.clear();
        });
    },
    
    toggleRecording: function() {
        if (!this.recognition) return;
        if (this.isRecording) {
            this.isRecording = false;
            this.recognition.stop();
            this.history.push('Stopped recording');
            this.updateHistory();
            this.saveToStorage();
            this.updateDisplay();
        } else {
            try {
                this.isRecording = true;
                this.recognition.start();
                this.history.push('Started recording');
                this.updateHistory();
                this.saveToStorage();
                this.updateDisplay();
            } catch (err) {
                this.display.classList.add('error');
                this.display.innerHTML = `
                    <h3>Error</h3>
                    <p>Failed to start recognition: ${err.message}</p>
                `;
                this.history.push(`Error: ${err.message}`);
                this.updateHistory();
                this.saveToStorage();
            }
        }
    },
    
    copy: function() {
        if (!this.transcript && !this.interimTranscript) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>No text to copy</p>
            `;
            return;
        }
        navigator.clipboard.writeText(this.transcript + this.interimTranscript).then(() => {
            this.history.push('Copied text');
            this.updateHistory();
            this.saveToStorage();
        });
    },
    
    clear: function() {
        this.transcript = '';
        this.interimTranscript = '';
        this.output.value = '';
        this.isRecording = false;
        if (this.recognition) this.recognition.stop();
        this.history.push('Cleared text');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    updateDisplay: function() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Speech to Text</h3>
            <p>Status: ${this.isRecording ? 'Recording...' : 'Stopped'}</p>
            <p>Language: ${this.lang}</p>
            <p>Text: ${this.transcript || this.interimTranscript ? (this.transcript + this.interimTranscript).slice(0, 20) + ((this.transcript + this.interimTranscript).length > 20 ? '...' : '') : 'None'}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('sttHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('sttHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    sttFunctions.initialize();
});