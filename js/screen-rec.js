const recorderFunctions = {
    stream: null,
    recorder: null,
    chunks: [],
    history: [],
    
    initialize: function() {
        this.preview = document.getElementById('preview');
        this.audioCheckbox = document.getElementById('audio');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
    },
    
    addEventListeners: function() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.toggleRecording();
            }
            if (e.key === 's' || e.key === 'S') this.save();
        });
    },
    
    async toggleRecording() {
        if (this.recorder && this.recorder.state === 'recording') {
            this.recorder.stop();
            this.stream.getTracks().forEach(track => track.stop());
            this.preview.srcObject = null;
            this.history.push('Stopped recording');
            this.updateHistory();
            this.saveToStorage();
            this.updateDisplay();
        } else {
            try {
                this.stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: this.audioCheckbox.checked
                });
                this.preview.srcObject = this.stream;
                this.chunks = [];
                this.recorder = new MediaRecorder(this.stream);
                this.recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        this.chunks.push(e.data);
                    }
                };
                this.recorder.onstop = () => {
                    this.updateDisplay();
                };
                this.recorder.start();
                this.history.push('Started recording');
                this.updateHistory();
                this.saveToStorage();
                this.updateDisplay();
            } catch (err) {
                this.display.classList.add('error');
                this.display.innerHTML = `
                    <h3>Error</h3>
                    <p>Failed to start recording: ${err.message}</p>
                `;
            }
        }
    },
    
    save() {
        if (this.chunks.length > 0) {
            const blob = new Blob(this.chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'recording.webm';
            link.click();
            URL.revokeObjectURL(url);
            this.history.push('Saved video');
            this.updateHistory();
            this.saveToStorage();
        }
    },
    
    updateDisplay() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Screen Recorder</h3>
            <p>${this.recorder && this.recorder.state === 'recording' ? 'Recording...' : 'Click Start to begin'}</p>
        `;
    },
    
    updateHistory() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage() {
        localStorage.setItem('recorderHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage() {
        const savedHistory = localStorage.getItem('recorderHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    recorderFunctions.initialize();
});