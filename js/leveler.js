const levelerFunctions = {
    canvas: null,
    ctx: null,
    pitch: 0,
    roll: 0,
    calibrate: true,
    lastPitch: 0,
    lastRoll: 0,
    history: [],
    
    initialize: function() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.calibrateCheckbox = document.getElementById('calibrate');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
        this.drawLeveler();
        this.animate();
    },
    
    addEventListeners: function() {
        window.addEventListener('deviceorientation', (e) => {
            this.pitch = e.beta || 0; // -180 to 180 degrees
            this.roll = e.gamma || 0; // -90 to 90 degrees
            if (this.calibrate) {
                this.pitch = this.smoothValue(this.pitch, this.lastPitch);
                this.roll = this.smoothValue(this.roll, this.lastRoll);
                this.lastPitch = this.pitch;
                this.lastRoll = this.roll;
            }
            this.updateDisplay();
        });
        this.calibrateCheckbox.addEventListener('change', (e) => {
            this.calibrate = e.target.checked;
            this.history.push(`Calibration ${this.calibrate ? 'enabled' : 'disabled'}`);
            this.updateHistory();
            this.saveToStorage();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.reset();
            }
            if (e.key === 'c' || e.key === 'C') this.toggleCalibration();
        });
    },
    
    smoothValue: function(newValue, lastValue) {
        const diff = newValue - lastValue;
        return lastValue + diff * 0.1;
    },
    
    reset: function() {
        this.pitch = 0;
        this.roll = 0;
        this.lastPitch = 0;
        this.lastRoll = 0;
        this.history.push('Reset level');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    toggleCalibration: function() {
        this.calibrate = !this.calibrate;
        this.calibrateCheckbox.checked = this.calibrate;
        this.history.push(`Calibration ${this.calibrate ? 'enabled' : 'disabled'}`);
        this.updateHistory();
        this.saveToStorage();
    },
    
    drawLeveler: function() {
        const ctx = this.ctx;
        const radius = this.canvas.width / 2;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw level background
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--card-bg)';
        ctx.fill();
        ctx.strokeStyle = 'var(--accent)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw grid lines
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(radius, this.canvas.height);
        ctx.moveTo(0, radius);
        ctx.lineTo(this.canvas.width, radius);
        ctx.strokeStyle = 'var(--text-muted)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw bubble
        const maxTilt = 45; // Max tilt for bubble movement
        const bubbleRadius = 20;
        const x = radius + (this.roll / maxTilt) * (radius - bubbleRadius - 10);
        const y = radius + (this.pitch / maxTilt) * (radius - bubbleRadius - 10);
        ctx.beginPath();
        ctx.arc(x, y, bubbleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--accent)';
        ctx.fill();
        ctx.strokeStyle = 'var(--primary)';
        ctx.lineWidth = 2;
        ctx.stroke();
    },
    
    animate: function() {
        this.drawLeveler();
        requestAnimationFrame(() => this.animate());
    },
    
    updateDisplay: function() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Leveler</h3>
            <p>Pitch: ${Math.round(this.pitch)}°</p>
            <p>Roll: ${Math.round(this.roll)}°</p>
            <p>Calibration: ${this.calibrate ? 'On' : 'Off'}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('levelerHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('levelerHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    levelerFunctions.initialize();
});