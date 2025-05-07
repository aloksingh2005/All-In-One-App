const gmeterFunctions = {
    canvas: null,
    ctx: null,
    gforce: 0,
    smooth: true,
    scale: 5,
    isTracking: false,
    lastGforce: 0,
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
        this.drawGauge();
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
            const x = accel.x || 0;
            const y = accel.y || 0;
            const z = accel.z || 0;
            this.gforce = Math.sqrt(x * x + y * y + z * z) / 9.81; // Convert to g-forces
            if (this.smooth) {
                this.gforce = this.smoothValue(this.gforce, this.lastGforce);
                this.lastGforce = this.gforce;
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
        this.gforce = 0;
        this.lastGforce = 0;
        this.history.push('Reset g-meter');
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
        ctx.strokeStyle = 'var(--accent)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw g-force markers
        const maxGforce = this.scale;
        for (let i = 0; i <= maxGforce; i += maxGforce / 10) {
            const angle = ((i / maxGforce) * 270 - 135) * Math.PI / 180;
            const startX = radius + Math.sin(angle) * (radius - 20);
            const startY = radius - Math.cos(angle) * (radius - 20);
            const endX = radius + Math.sin(angle) * (radius - 30);
            const endY = radius - Math.cos(angle) * (radius - 30);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = 'var(--text)';
            ctx.lineWidth = i % (maxGforce / 5) === 0 ? 3 : 1;
            ctx.stroke();
            if (i % (maxGforce / 5) === 0) {
                ctx.font = '12px Orbitron';
                ctx.fillStyle = 'var(--text)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const textX = radius + Math.sin(angle) * (radius - 50);
                const textY = radius - Math.cos(angle) * (radius - 50);
                ctx.fillText(i.toFixed(1), textX, textY);
            }
        }
        
        // Draw needle
        const angle = ((Math.min(this.gforce, maxGforce) / maxGforce) * 270 - 135) * Math.PI / 180;
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
            <h3>G-Meter</h3>
            <p>G-Force: ${this.gforce.toFixed(2)} g</p>
            <p>Status: ${this.isTracking ? 'Tracking' : 'Stopped'}</p>
            <p>Smoothing: ${this.smooth ? 'On' : 'Off'}</p>
            <p>Scale: ${this.scale} g</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('gmeterHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('gmeterHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    gmeterFunctions.initialize();
});