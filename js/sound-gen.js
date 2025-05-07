const soundFunctions = {
    ctx: new AudioContext(),
    oscillator: null,
    gainNode: null,
    wave: 'sine',
    frequency: 440,
    volume: 0.5,
    canvas: null,
    canvasCtx: null,
    history: [],
    
    initialize: function() {
        this.waveSelect = document.getElementById('wave');
        this.frequencyInput = document.getElementById('frequency');
        this.volumeInput = document.getElementById('volume');
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
        this.waveSelect.addEventListener('change', (e) => {
            this.wave = e.target.value;
            if (this.oscillator) {
                this.oscillator.type = this.wave;
            }
            this.updateDisplay();
        });
        this.frequencyInput.addEventListener('input', (e) => {
            this.frequency = parseInt(e.target.value);
            if (this.oscillator) {
                this.oscillator.frequency.setValueAtTime(this.frequency, this.ctx.currentTime);
            }
            this.updateDisplay();
        });
        this.volumeInput.addEventListener('input', (e) => {
            this.volume = parseInt(e.target.value) / 100;
            if (this.gainNode) {
                this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
            }
            this.updateDisplay();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePlay();
            }
            if (e.key === 'r' || e.key === 'R') this.reset();
            if (e.key === 's' || e.key === 'S') this.save();
        });
    },
    
    togglePlay: function() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
            this.gainNode = null;
            this.history.push(`Stopped ${this.wave} ${this.frequency}Hz`);
        } else {
            this.oscillator = this.ctx.createOscillator();
            this.gainNode = this.ctx.createGain();
            this.oscillator.type = this.wave;
            this.oscillator.frequency.setValueAtTime(this.frequency, this.ctx.currentTime);
            this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.ctx.destination);
            this.oscillator.start();
            this.history.push(`Played ${this.wave} ${this.frequency}Hz`);
        }
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    reset: function() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
            this.gainNode = null;
        }
        this.wave = 'sine';
        this.frequency = 440;
        this.volume = 0.5;
        this.waveSelect.value = 'sine';
        this.frequencyInput.value = 440;
        this.volumeInput.value = 50;
        this.history.push('Reset sound settings');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    save: function() {
        const duration = 2; // 2 seconds
        const sampleRate = 44100;
        const buffer = new Float32Array(sampleRate * duration);
        const phaseStep = (2 * Math.PI * this.frequency) / sampleRate;
        for (let i = 0; i < buffer.length; i++) {
            let value;
            if (this.wave === 'sine') {
                value = Math.sin(phaseStep * i);
            } else if (this.wave === 'square') {
                value = Math.sin(phaseStep * i) > 0 ? 1 : -1;
            } else if (this.wave === 'triangle') {
                value = 2 * Math.abs(2 * ((phaseStep * i / (2 * Math.PI)) % 1) - 1) - 1;
            }
            buffer[i] = value * this.volume;
        }
        const wav = this.createWav(buffer, sampleRate);
        const blob = new Blob([wav], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.wave}_${this.frequency}Hz.wav`;
        link.click();
        URL.revokeObjectURL(url);
        this.history.push(`Saved ${this.wave} ${this.frequency}Hz`);
        this.updateHistory();
        this.saveToStorage();
    },
    
    createWav: function(buffer, sampleRate) {
        const numChannels = 1;
        const bitsPerSample = 16;
        const blockAlign = numChannels * bitsPerSample / 8;
        const byteRate = sampleRate * blockAlign;
        const dataSize = buffer.length * blockAlign;
        const bufferSize = 44 + dataSize;
        const wav = new ArrayBuffer(bufferSize);
        const view = new DataView(wav);
        const writeString = (str, offset) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };
        writeString('RIFF', 0);
        view.setUint32(4, 36 + dataSize, true);
        writeString('WAVE', 8);
        writeString('fmt ', 12);
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
        writeString('data', 36);
        view.setUint32(40, dataSize, true);
        for (let i = 0; i < buffer.length; i++) {
            view.setInt16(44 + i * 2, buffer[i] * 32767, true);
        }
        return wav;
    },
    
    animateWave: function() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = 'var(--primary)';
        this.canvasCtx.lineWidth = 2;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerY = height / 2;
        for (let x = 0; x < width; x++) {
            const t = (x / width) * 2 * Math.PI;
            let y;
            if (this.wave === 'sine') {
                y = Math.sin(t * this.frequency / 100);
            } else if (this.wave === 'square') {
                y = Math.sin(t * this.frequency / 100) > 0 ? 1 : -1;
            } else if (this.wave === 'triangle') {
                y = 2 * Math.abs(2 * ((t * this.frequency / 100 / (2 * Math.PI)) % 1) - 1) - 1;
            }
            y = centerY - (y * this.volume * centerY * 0.8);
            if (x === 0) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }
        }
        this.canvasCtx.stroke();
        requestAnimationFrame(() => this.animateWave());
    },
    
    updateDisplay: function() {
        this.display.innerHTML = `
            <h3>Sound Generator</h3>
            <p>Wave: ${this.wave}</p>
            <p>Frequency: ${this.frequency}Hz</p>
            <p>Volume: ${Math.round(this.volume * 100)}%</p>
            <p>${this.oscillator ? 'Playing' : 'Stopped'}</p>
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