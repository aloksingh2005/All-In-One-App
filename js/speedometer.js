const speedometerFunctions = {
    canvas: null,
    ctx: null,
    speed: 0,
    unit: 'kmh',
    smooth: true,
    lastSpeed: 0,
    watchId: null,
    history: [],
    
    initialize: function() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.unitSelect = document.getElementById('unit');
        this.smoothCheckbox = document.getElementById('smooth');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
        this.drawSpeedometer();
        this.animate();
    },
    
    addEventListeners: function() {
        this.unitSelect.addEventListener('change', (e) => {
            this.unit = e.target.value;
            this.updateDisplay();
        });
        this.smoothCheckbox.addEventListener('change', (e) => {
            this.smooth = e.target.checked;
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
    
    toggleTracking: function() {
        if (!navigator.geolocation) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>Geolocation not supported</p>
            `;
            return;
        }
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            this.history.push('Stopped tracking');
            this.updateHistory();
            this.saveToStorage();
            this.updateDisplay();
        } else {
            this.watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    this.speed = pos.coords.speed ? pos.coords.speed * 3.6 : 0; // m/s to km/h
                    if (this.unit === 'mph') this.speed *= 0.621371; // km/h to mph
                    if (this.smooth) {
                        this.speed = this.smoothSpeed(this.speed);
                    }
                    this.updateDisplay();
                },
                (err) => {
                    this.display.classList.add('error');
                    this.display.innerHTML = `
                        <h3>Error</h3>
                        <p>Speed error: ${err.message}</p>
                    `;
                    this.history.push(`Error: ${err.message}`);
                    this.updateHistory();
                    this.saveToStorage();
                },
                { enableHighAccuracy: true, maximumAge: 1000 }
            );
            this.history.push('Started tracking');
            this.updateHistory();
            this.saveToStorage();
        }
    },
    
    smoothSpeed: function(newSpeed) {
        const diff = newSpeed - this.lastSpeed;
        this.lastSpeed += diff * 0.1;
        return this.lastSpeed;
    },
    
    reset: function() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        this.speed = 0;
        this.lastSpeed = 0;
        this.history.push('Reset speed');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    drawSpeedometer: function() {
        const ctx = this.ctx;
        const radius = this.canvas.width / 2;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw speedometer background
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--card-bg)';
        ctx.fill();
        ctx.strokeStyle = 'var(--secondary)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw speed markers
        const maxSpeed = this.unit === 'kmh' ? 200 : 120;
        for (let i = 0; i <= maxSpeed; i += 10) {
            const angle = ((i / maxSpeed) * 270 - 135) * Math.PI / 180;
            const startX = radius + Math.sin(angle) * (radius - 20);
            const startY = radius - Math.cos(angle) * (radius - 20);
            const endX = radius + Math.sin(angle) * (radius - 30);
            const endY = radius - Math.cos(angle) * (radius - 30);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = 'var(--text)';
            ctx.lineWidth = i % 50 === 0 ? 3 : 1;
            ctx.stroke();
            if (i % 50 === 0) {
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
        const speedAngle = ((Math.min(this.speed, maxSpeed) / maxSpeed) * 270 - 135) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.lineTo(
            radius + Math.sin(speedAngle) * (radius - 20),
            radius - Math.cos(speedAngle) * (radius - 20)
        );
        ctx.strokeStyle = 'var(--accent)';
        ctx.lineWidth = 4;
        ctx.stroke();
    },
    
    animate: function() {
        this.drawSpeedometer();
        requestAnimationFrame(() => this.animate());
    },
    
    updateDisplay: function() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Speedometer</h3>
            <p>Speed: ${this.speed.toFixed(1)} ${this.unit === 'kmh' ? 'km/h' : 'mph'}</p>
            <p>Unit: ${this.unit === 'kmh' ? 'km/h' : 'mph'}</p>
            <p>Smoothing: ${this.smooth ? 'On' : 'Off'}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('speedometerHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('speedometerHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    speedometerFunctions.initialize();
});