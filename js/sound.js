const soundFunctions = {
    canvas: null,
    ctx: null,
    decibels: 0,
    smooth: true,
    sensitivity: 1,
    isRecording: false,
    lastDecibels: 0,
    audioContext: null,
    analyser: null,
    history: [],
    
    initialize: function() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.smoothCheckbox = document.getElementById('smooth');
        this.sensitivityInput = document.getElementById('sensitivity');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
        this.drawGauge();
        this.animate();
    },
    
    addEventListeners: function() {
        this.smoothCheckbox.addEventListener('change', (e) => {
            this.smooth = e.target.checked;
            this.updateDisplay();
        });
        this.sensitivityInput.addEventListener('input', (e) => {
            this.sensitivity = parseFloat(e.target.value);
            this.updateDisplay();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                this.toggleRecording();
            }
            if (e.key === 'r' || e.key === 'R') this.reset();
        });
    },
    
    async toggleRecording() {
        if (this.isRecording) {
            this.isRecording = false;
            this.audioContext.close();
            this.audioContext = null;
            this.history.push('Stopped recording');
            this.updateHistory();
            this.saveToStorage();
            this.updateDisplay();
            return;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);
            this.analyser.fftSize = 2048;
            this.isRecording = true;
            this.history.push('Started recording');
            this.updateHistory();
            this.saveToStorage();
            this.updateDisplay();
            this.processAudio();
        } catch (err) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>Audio error: ${err.message}</p>
            `;
            this.history.push(`Error: ${err.message}`);
            this.updateHistory();
            this.saveToStorage();
        }
    },
    
    processAudio: function() {
        if (!this.isRecording) return;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        this.analyser.getFloatTimeDomainData(dataArray);
        let rms = 0;
        for (let i = 0; i < bufferLength; i++) {
            rms += dataArray[i] * dataArray[i];
        }
        rms = Math.sqrt(rms / bufferLength);
        this.decibels = 20 * Math.log10(rms / this.sensitivity) + 100;
        this.decibels = Math.max(0, Math.min(120, this.decibels));
        if (this.smooth) {
            this.decibels = this.smoothValue(this.decibels, this.lastDecibels);
            this.lastDecibels = this.decibels;
        }
        this.updateDisplay();
        requestAnimationFrame(() => this.processAudio());
    },
    
    smoothValue: function(newValue, lastValue) {
        return lastValue + (newValue - lastValue) * 0.1;
    },
    
    reset: function() {
        if (this.isRecording) {
            this.isRecording = false;
            this.audioContext.close();
            this.audioContext = null;
        }
        this.decibels = 0;
        this.lastDecibels = 0;
        this.history.push('Reset sound');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    drawGauge: function() {
        const ctx = this.ctx;
        const radius = this.canvas.width / 2;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw gauge background
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--card-bg)';
        ctx.fill();
        ctx.strokeStyle = 'var(--secondary)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw decibel markers
        const maxDecibels = 120;
        for (let i = 0; i <= maxDecibels; i += 10) {
            const angle = ((i / maxDecibels) * 270 - 135) * Math.PI / 180;
            const startX = radius + Math.sin(angle) * (radius - 20);
            const startY = radius - Math.cos(angle) * (radius - 20);
            const endX = radius + Math.sin(angle) * (radius - 30);
            const endY = radius - Math.cos(angle) * (radius - 30);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = 'var(--text)';
            ctx.lineWidth = i % 30 === 0 ? 3 : 1;
            ctx.stroke();
            if (i % 30 === 0) {
                ctx.font = '12px Orbitron';
                ctx.fillStyle = 'var(--text)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const textX = radius + Math.sin(angle) * (radius - 50);
                const textY = radius - Math.cos(angle) * (radius - 50);
                ctx.fillText(i, textX, textY);
            }
        }
        
        // Draw needle
        const angle = ((this.decibels / maxDecibels) * 270 - 135) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.lineTo(
            radius + Math.sin(angle) * (radius - 20),
            radius - Math.cos(angle) * (radius - 20)
        );
        ctx.strokeStyle = 'var(--accent)';
        ctx.lineWidth = 4;
        ctx.stroke();
    },
    
    animate: function() {
        this.drawGauge();
        requestAnimationFrame(() => this.animate());
    },
    
    updateDisplay: function() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Sound Meter</h3>
            <p>Level: ${this.decibels.toFixed(1)} dB</p>
            <p>Status: ${this.isRecording ? 'Recording' : 'Stopped'}</p>
            <p>Smoothing: ${this.smooth ? 'On' : 'Off'}</p>
            <p>Sensitivity: ${this.sensitivity.toFixed(1)}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('soundHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('soundHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    soundFunctions.initialize();
});