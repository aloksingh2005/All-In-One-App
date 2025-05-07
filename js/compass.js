const compassFunctions = {
    canvas: null,
    ctx: null,
    heading: 0,
    calibrate: true,
    lastHeading: 0,
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
        this.drawCompass();
        this.animate();
    },
    
    addEventListeners: function() {
        window.addEventListener('deviceorientation', (e) => {
            if (e.webkitCompassHeading !== undefined) {
                // iOS
                this.heading = e.webkitCompassHeading;
            } else if (e.alpha !== null) {
                // Android
                this.heading = 360 - e.alpha;
            }
            if (this.calibrate) {
                this.heading = this.smoothHeading(this.heading);
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
    
    smoothHeading: function(newHeading) {
        const diff = newHeading - this.lastHeading;
        if (Math.abs(diff) > 180) {
            this.lastHeading += diff > 0 ? -360 : 360;
        }
        this.lastHeading += diff * 0.1;
        if (this.lastHeading < 0) this.lastHeading += 360;
        if (this.lastHeading > 360) this.lastHeading -= 360;
        return this.lastHeading;
    },
    
    reset: function() {
        this.heading = 0;
        this.lastHeading = 0;
        this.history.push('Reset compass');
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
    
    drawCompass: function() {
        const ctx = this.ctx;
        const radius = this.canvas.width / 2;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw compass background
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--card-bg)';
        ctx.fill();
        ctx.strokeStyle = 'var(--secondary)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw cardinal directions
        ctx.font = '16px Orbitron';
        ctx.fillStyle = 'var(--text)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const directions = ['N', 'E', 'S', 'W'];
        for (let i = 0; i < 4; i++) {
            const angle = (i * 90 - this.heading) * Math.PI / 180;
            const x = radius + Math.sin(angle) * (radius - 30);
            const y = radius - Math.cos(angle) * (radius - 30);
            ctx.fillText(directions[i], x, y);
        }
        
        // Draw needle
        ctx.beginPath();
        ctx.moveTo(radius, radius - radius + 20);
        ctx.lineTo(radius + 10, radius);
        ctx.lineTo(radius - 10, radius);
        ctx.closePath();
        ctx.fillStyle = 'var(--accent)';
        ctx.fill();
    },
    
    animate: function() {
        this.drawCompass();
        requestAnimationFrame(() => this.animate());
    },
    
    updateDisplay: function() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Compass</h3>
            <p>Heading: ${Math.round(this.heading)}°</p>
            <p>Calibration: ${this.calibrate ? 'On' : 'Off'}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('compassHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('compassHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    compassFunctions.initialize();
});