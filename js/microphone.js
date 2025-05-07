const micFunctions = {
    stream: null,
    recorder: null,
    chunks: [],
    analyser: null,
    canvas: null,
    canvasCtx: null,
    history: [],
    startTime: null,
    
    initialize: function() {
        this.display = document.getElementById('display');
        this.canvas = document.getElementById('canvas');
        this.canvasCtx = this.canvas.getContext('2d');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
        this.animateWave();
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
            this.analyser = null;
            this.stream = null;
            this.recorder = null;
            this.history.push('Stopped recording');
            this.updateHistory();
            this.saveToStorage();
            this.updateDisplay();
        } else {
            try {
                this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.recorder = new MediaRecorder(this.stream);
                this.chunks = [];
                this.recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        this.chunks.push(e.data);
                    }
                };
                this.recorder.onstop = () => {
                    this.updateDisplay();
                };
                this.recorder.start();
                this.startTime = Date.now();
                const audioCtx = new AudioContext();
                this.analyser = audioCtx.createAnalyser();
                const source = audioCtx.createMediaStreamSource(this.stream);
                source.connect(this.analyser);
                this.analyser.fftSize = 2048;
                this.history.push('Started recording');
                this.updateHistory();
                this.saveToStorage();
                this.updateDisplay();
            } catch (err) {
                this.display.classList.add('error');
                this.display.innerHTML = `
                    <h3>Error</h3>
                    <p>Failed to access microphone: ${err.message}</p>
                `;
                this.history.push(`Error: ${err.message}`);
                this.updateHistory();
                this.saveToStorage();
            }
        }
    },
    
    save() {
        if (this.chunks.length > 0) {
            const blob = new Blob(this.chunks, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'recording.webm';
            link.click();
            URL.revokeObjectURL(url);
            this.history.push('Saved audio');
            this.updateHistory();
            this.saveToStorage();
        } else {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>No audio recorded to save</p>
            `;
        }
    },
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    
    updateDisplay() {
        this.display.classList.remove('error');
        if (this.recorder && this.recorder.state === 'recording') {
            const duration = Math.floor((Date.now() - this.startTime) / 1000);
            this.display.innerHTML = `
                <h3>Microphone</h3>
                <p>Recording... ${this.formatTime(duration)}</p>
            `;
        } else {
            this.display.innerHTML = `
                <h3>Microphone</h3>
                <p>Click Start to begin</p>
            `;
        }
    },
    
    animateWave() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.analyser && this.recorder && this.recorder.state === 'recording') {
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteTimeDomainData(dataArray);
            this.canvasCtx.beginPath();
            this.canvasCtx.strokeStyle = 'var(--accent)';
            this.canvasCtx.lineWidth = 2;
            const sliceWidth = this.canvas.width / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * this.canvas.height) / 2;
                if (i === 0) {
                    this.canvasCtx.moveTo(x, y);
                } else {
                    this.canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            this.canvasCtx.stroke();
        }
        requestAnimationFrame(() => this.animateWave());
    },
    
    updateHistory() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage() {
        localStorage.setItem('micHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage() {
        const savedHistory = localStorage.getItem('micHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    micFunctions.initialize();
});