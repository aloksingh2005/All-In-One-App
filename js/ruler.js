const rulerFunctions = {
    start: null,
    end: null,
    unit: 'px',
    grid: false,
    history: [],
    
    initialize: function() {
        this.canvas = document.getElementById('canvas');
        this.line = document.getElementById('line');
        this.startPoint = document.getElementById('start-point');
        this.endPoint = document.getElementById('end-point');
        this.display = document.getElementById('display');
        this.unitSelect = document.getElementById('unit');
        this.gridCheckbox = document.getElementById('grid');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
    },
    
    addEventListeners: function() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.updateDrawing(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.unitSelect.addEventListener('change', (e) => {
            this.unit = e.target.value;
            this.updateDisplay();
        });
        this.gridCheckbox.addEventListener('change', (e) => {
            this.grid = e.target.checked;
            this.canvas.classList.toggle('grid', this.grid);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') this.reset();
            if (e.key === 'g' || e.key === 'G') {
                this.grid = !this.grid;
                this.gridCheckbox.checked = this.grid;
                this.canvas.classList.toggle('grid', this.grid);
            }
            if (e.key === 's' || e.key === 'S') this.save();
        });
    },
    
    startDrawing: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.start = {
            x: this.grid ? Math.round(e.clientX - rect.left / 10) * 10 : e.clientX - rect.left,
            y: this.grid ? Math.round(e.clientY - rect.top / 10) * 10 : e.clientY - rect.top
        };
        this.end = null;
        this.updateDrawing(e);
    },
    
    updateDrawing: function(e) {
        if (!this.start) return;
        const rect = this.canvas.getBoundingClientRect();
        this.end = {
            x: this.grid ? Math.round(e.clientX - rect.left / 10) * 10 : e.clientX - rect.left,
            y: this.grid ? Math.round(e.clientY - rect.top / 10) * 10 : e.clientY - rect.top
        };
        this.drawLine();
        this.updateDisplay();
    },
    
    stopDrawing: function() {
        if (this.start && this.end) {
            this.history.push(this.getMeasurement());
            this.updateHistory();
            this.saveToStorage();
        }
    },
    
    drawLine: function() {
        if (!this.start || !this.end) return;
        const dx = this.end.x - this.start.x;
        const dy = this.end.y - this.start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        this.line.style.width = `${length}px`;
        this.line.style.transform = `rotate(${angle}deg)`;
        this.line.style.left = `${this.start.x}px`;
        this.line.style.top = `${this.start.y}px`;
        this.startPoint.style.left = `${this.start.x}px`;
        this.startPoint.style.top = `${this.start.y}px`;
        this.endPoint.style.left = `${this.end.x}px`;
        this.endPoint.style.top = `${this.end.y}px`;
    },
    
    getMeasurement: function() {
        if (!this.start || !this.end) return 0;
        const dx = this.end.x - this.start.x;
        const dy = this.end.y - this.start.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (this.unit === 'cm') distance /= 37.8; // Approx px to cm
        if (this.unit === 'in') distance /= 96; // Approx px to inch
        return distance.toFixed(2);
    },
    
    reset: function() {
        this.start = null;
        this.end = null;
        this.line.style.width = '0';
        this.startPoint.style.left = '0';
        this.startPoint.style.top = '0';
        this.endPoint.style.left = '0';
        this.endPoint.style.top = '0';
        this.updateDisplay();
        this.history.push('Reset measurement');
        this.updateHistory();
        this.saveToStorage();
    },
    
    save: function() {
        const measurement = this.getMeasurement();
        if (measurement > 0) {
            this.history.push(`Saved: ${measurement} ${this.unit}`);
            this.updateHistory();
            this.saveToStorage();
        }
    },
    
    updateDisplay: function() {
        const measurement = this.getMeasurement();
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Measurement</h3>
            <p>Distance: ${measurement} ${this.unit}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('rulerHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('rulerHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    rulerFunctions.initialize();
});