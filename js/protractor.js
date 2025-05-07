const protractorFunctions = {
    canvas: null,
    ctx: null,
    alpha: 0,
    beta: 0,
    gamma: 0,
    smooth: true,
    lock: false,
    isTracking: false,
    lastValues: { alpha: 0, beta: 0, gamma: 0 },
    history: [],
    
    initialize: function() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.smoothCheckbox = document.getElementById('smooth');
        this.lockCheckbox = document.getElementById('lock');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
        this.drawProtractor();
        this.animate();
    },
    
    addEventListeners: function() {
        this.smoothCheckbox.addEventListener('change', (e) => {
            this.smooth = e.target.checked;
            this.updateDisplay();
        });
        this.lockCheckbox.addEventListener('change', (e) => {
            this.lock = e.target.checked;
            this.updateDisplay();
        });
        window.addEventListener('deviceorientation', (e) => {
            if (!this.isTracking || this.lock) return;
            this.alpha = e.alpha || 0;
            this.beta = e.beta || 0;
            this.gamma = e.gamma || 0;
            if (this.smooth) {
                this.alpha = this.smoothValue(this.alpha, this.lastValues.alpha);
                this.beta = this.smoothValue(this.beta, this.lastValues.beta);
                this.gamma = this.smoothValue(this.gamma, this.lastValues.gamma);
                this.lastValues.alpha = this.alpha;
                this.lastValues.beta = this.beta;
                this.lastValues.gamma = this.gamma;
            }
            this.updateDisplay();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                this.toggleTracking();
            }
            if (e.key === 'r' || e.key === 'R') this.reset();
            if (e.key === 'c' || e.key === 'C') this.copy();
        });
    },
    
    smoothValue: function(newValue, lastValue) {
        return lastValue + (newValue - lastValue) * 0.1;
    },
    
    toggleTracking: function() {
        if (!window.DeviceOrientationEvent) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>DeviceOrientation not supported</p>
            `;
            return;
        }
        this.isTracking = !this.isTracking;
        this.history.push(this.isTracking ? 'Started tracking' : 'Stopped tracking');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    copy: function() {
        const angles = `Alpha: ${this.alpha.toFixed(1)}°, Beta: ${this.beta.toFixed(1)}°, Gamma: ${this.gamma.toFixed(1)}°`;
        navigator.clipboard.writeText(angles).then(() => {
            this.history.push('Copied angles');
            this.updateHistory();
            this.saveToStorage();
        });
    },
    
    reset: function() {
        this.isTracking = false;
        this.lock = false;
        this.lockCheckbox.checked = false;
        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;
        this.lastValues = { alpha: 0, beta: 0, gamma: 0 };
        this.history.push('Reset protractor');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    drawProtractor: function() {
        const ctx = this.ctx;
        const radius = this.canvas.width / 2;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw protractor background
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--card-bg)';
        ctx.fill();
        ctx.strokeStyle = 'var(--primary)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw angle markers
        for (let i = -90; i <= 90; i += 10) {
            const angle = (i * Math.PI) / 180;
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
        
        // Draw beta (pitch) needle
        const betaAngle = ((-this.beta / 90) * 90 * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.lineTo(
            radius + Math.sin(betaAngle) * (radius - 20),
            radius - Math.cos(betaAngle) * (radius - 20)
        );
        ctx.strokeStyle = 'var(--secondary)';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Draw gamma (roll) needle
        const gammaAngle = ((-this.gamma / 90) * 90 * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.lineTo(
            radius + Math.sin(gammaAngle) * (radius - 20),
            radius - Math.cos(gammaAngle) * (radius - 20)
        );
        ctx.strokeStyle = 'var(--accent)';
        ctx.lineWidth = 4;
        ctx.stroke();
    },
    
    animate: function() {
        this.drawProtractor();
        requestAnimationFrame(() => this.animate());
    },
    
    updateDisplay: function() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Protractor</h3>
            <p>Alpha: ${this.alpha.toFixed(1)}°</p>
            <p>Beta: ${this.beta.toFixed(1)}°</p>
            <p>Gamma: ${this.gamma.toFixed(1)}°</p>
            <p>Status: ${this.isTracking ? (this.lock ? 'Locked' : 'Tracking') : 'Stopped'}</p>
            <p>Smoothing: ${this.smooth ? 'On' : 'Off'}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('protractorHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('protractorHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    protractorFunctions.initialize();
});