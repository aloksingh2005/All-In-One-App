const motionFunctions = {
    canvas: null,
    ctx: null,
    x: 0,
    y: 0,
    z: 0,
    smooth: true,
    scale: 5,
    isTracking: false,
    data: { x: [], y: [], z: [] },
    lastValues: { x: 0, y: 0, z: 0 },
    history: [],
    
    initialize: function() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.smoothCheckbox = document.getElementById('smooth');
        this.scaleInput = document.getElementById('scale');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
        this.animate();
    },
    
    addEventListeners: function() {
        this.smoothCheckbox.addEventListener('change', (e) => {
            this.smooth = e.target.checked;
            this.updateDisplay();
        });
        this.scaleInput.addEventListener('input', (e) => {
            this.scale = parseInt(e.target.value);
            this.updateDisplay();
        });
        window.addEventListener('devicemotion', (e) => {
            if (!this.isTracking) return;
            const accel = e.accelerationIncludingGravity || {};
            this.x = accel.x || 0;
            this.y = accel.y || 0;
            this.z = accel.z || 0;
            if (this.smooth) {
                this.x = this.smoothValue(this.x, this.lastValues.x);
                this.y = this.smoothValue(this.y, this.lastValues.y);
                this.z = this.smoothValue(this.z, this.lastValues.z);
                this.lastValues.x = this.x;
                this.lastValues.y = this.y;
                this.lastValues.z = this.z;
            }
            this.data.x.push(this.x);
            this.data.y.push(this.y);
            this.data.z.push(this.z);
            if (this.data.x.length > 50) {
                this.data.x.shift();
                this.data.y.shift();
                this.data.z.shift();
            }
            this.updateDisplay();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                this.toggleTracking();
            }
            if (e.key === 'r' || e.key === 'R') this.reset();
        });
    },
    
    smoothValue: function(newValue, lastValue) {
        return lastValue + (newValue - lastValue) * 0.1;
    },
    
    toggleTracking: function() {
        if (!window.DeviceMotionEvent) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>DeviceMotion not supported</p>
            `;
            return;
        }
        this.isTracking = !this.isTracking;
        this.history.push(this.isTracking ? 'Started tracking' : 'Stopped tracking');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    reset: function() {
        this.isTracking = false;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.lastValues = { x: 0, y: 0, z: 0 };
        this.data = { x: [], y: [], z: [] };
        this.history.push('Reset motion');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    drawGraph: function() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.beginPath();
        ctx.strokeStyle = 'var(--text-muted)';
        ctx.lineWidth = 1;
        for (let y = 0; y <= height; y += height / 4) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();
        
        // Draw axes
        const midY = height / 2;
        const step = width / 50;
        const scale = this.scale;
        
        // Draw X (purple)
        ctx.beginPath();
        ctx.strokeStyle = 'var(--primary)';
        ctx.lineWidth = 2;
        for (let i = 0; i < this.data.x.length; i++) {
            const x = i * step;
            const y = midY - (this.data.x[i] / scale) * (height / 2);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Draw Y (blue)
        ctx.beginPath();
        ctx.strokeStyle = 'var(--secondary)';
        for (let i = 0; i < this.data.y.length; i++) {
            const x = i * step;
            const y = midY - (this.data.y[i] / scale) * (height / 2);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Draw Z (red)
        ctx.beginPath();
        ctx.strokeStyle = 'var(--accent)';
        for (let i = 0; i < this.data.z.length; i++) {
            const x = i * step;
            const y = midY - (this.data.z[i] / scale) * (height / 2);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    },
    
    animate: function() {
        this.drawGraph();
        requestAnimationFrame(() => this.animate());
    },
    
    updateDisplay: function() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Motion Sensor</h3>
            <p>X: ${this.x.toFixed(2)} m/s²</p>
            <p>Y: ${this.y.toFixed(2)} m/s²</p>
            <p>Z: ${this.z.toFixed(2)} m/s²</p>
            <p>Status: ${this.isTracking ? 'Tracking' : 'Stopped'}</p>
            <p>Smoothing: ${this.smooth ? 'On' : 'Off'}</p>
            <p>Scale: ${this.scale} m/s²</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('motionHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('motionHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    motionFunctions.initialize();
});