const altitudeFunctions = {
    canvas: null,
    ctx: null,
    altitude: 0,
    unit: 'meters',
    highAccuracy: true,
    history: [],
    
    initialize: function() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.unitSelect = document.getElementById('unit');
        this.highAccuracyCheckbox = document.getElementById('highAccuracy');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
        this.drawGauge();
        this.animate();
    },
    
    addEventListeners: function() {
        this.unitSelect.addEventListener('change', (e) => {
            this.unit = e.target.value;
            this.updateDisplay();
        });
        this.highAccuracyCheckbox.addEventListener('change', (e) => {
            this.highAccuracy = e.target.checked;
            this.updateDisplay();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                this.getAltitude();
            }
            if (e.key === 'r' || e.key === 'R') this.reset();
        });
    },
    
    getAltitude: function() {
        if (!navigator.geolocation) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>Geolocation not supported</p>
            `;
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                if (pos.coords.altitude !== null) {
                    this.altitude = pos.coords.altitude;
                    if (this.unit === 'feet') this.altitude *= 3.28084; // Meters to feet
                    this.history.push(`Fetched altitude: ${this.altitude.toFixed(1)} ${this.unit}`);
                } else {
                    this.display.classList.add('error');
                    this.display.innerHTML = `
                        <h3>Error</h3>
                        <p>Altitude data unavailable</p>
                    `;
                    this.history.push('Error: Altitude data unavailable');
                }
                this.updateHistory();
                this.saveToStorage();
                this.updateDisplay();
            },
            (err) => {
                this.display.classList.add('error');
                this.display.innerHTML = `
                    <h3>Error</h3>
                    <p>Altitude error: ${err.message}</p>
                `;
                this.history.push(`Error: ${err.message}`);
                this.updateHistory();
                this.saveToStorage();
            },
            { enableHighAccuracy: this.highAccuracy, timeout: 5000 }
        );
    },
    
    reset: function() {
        this.altitude = 0;
        this.history.push('Reset altitude');
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
        
        // Draw altitude markers
        const maxAltitude = this.unit === 'meters' ? 5000 : 16400; // Rough max
        for (let i = 0; i <= maxAltitude; i += maxAltitude / 10) {
            const angle = ((i / maxAltitude) * 270 - 135) * Math.PI / 180;
            const startX = radius + Math.sin(angle) * (radius - 20);
            const startY = radius - Math.cos(angle) * (radius - 20);
            const endX = radius + Math.sin(angle) * (radius - 30);
            const endY = radius - Math.cos(angle) * (radius - 30);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = 'var(--text)';
            ctx.lineWidth = i % (maxAltitude / 5) === 0 ? 3 : 1;
            ctx.stroke();
            if (i % (maxAltitude / 5) === 0) {
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
        const altitudeAngle = ((Math.min(this.altitude, maxAltitude) / maxAltitude) * 270 - 135) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.lineTo(
            radius + Math.sin(altitudeAngle) * (radius - 20),
            radius - Math.cos(altitudeAngle) * (radius - 20)
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
            <h3>Altitude</h3>
            <p>Altitude: ${this.altitude.toFixed(1)} ${this.unit}</p>
            <p>Unit: ${this.unit}</p>
            <p>Accuracy: ${this.highAccuracy ? 'High' : 'Low'}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('altitudeHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('altitudeHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    altitudeFunctions.initialize();
});