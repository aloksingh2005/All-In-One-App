const counterFunctions = {
    count: 0,
    stepSize: 1,
    history: [],
    presets: [],
    
    initialize: function() {
        this.stepSizeElement = document.getElementById('stepSize');
        this.displayElement = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('table');
        this.presetsElement = document.getElementById('presets').querySelector('table');
        this.addEventListeners();
        this.updateDisplay();
    },
    
    addEventListeners: function() {
        this.stepSizeElement.addEventListener('input', () => this.setStepSize());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.increment();
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.decrement();
            }
            if (e.key === 'r' || e.key === 'R') this.reset();
            if (e.key === 's' || e.key === 'S') this.savePreset();
        });
        this.presetsElement.addEventListener('click', (e) => {
            const preset = e.target.closest('td');
            if (preset) {
                this.count = parseInt(preset.textContent);
                this.updateDisplay();
                this.history.push(`Loaded preset: ${this.count}`);
                this.updateHistory();
            }
        });
    },
    
    setStepSize: function() {
        const step = parseInt(this.stepSizeElement.value) || 1;
        if (step <= 0) {
            this.displayElement.textContent = 'Invalid step size';
            this.stepSize = 1;
            this.stepSizeElement.value = 1;
            return;
        }
        this.stepSize = step;
    },
    
    increment: function() {
        this.count += this.stepSize;
        this.history.push(`+${this.stepSize} = ${this.count}`);
        this.updateDisplay();
    },
    
    decrement: function() {
        this.count -= this.stepSize;
        this.history.push(`-${this.stepSize} = ${this.count}`);
        this.updateDisplay();
    },
    
    reset: function() {
        this.count = 0;
        this.history.push(`Reset to ${this.count}`);
        this.updateDisplay();
    },
    
    savePreset: function() {
        if (!this.presets.includes(this.count)) {
            this.presets.push(this.count);
            this.history.push(`Saved preset: ${this.count}`);
            this.updatePresets();
            this.updateHistory();
        }
    },
    
    updateDisplay: function() {
        this.displayElement.textContent = this.count;
        this.displayElement.style.animation = 'none';
        this.displayElement.offsetHeight; // Trigger reflow
        this.displayElement.style.animation = 'fadeIn 0.3s ease-in-out';
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    updatePresets: function() {
        this.presetsElement.innerHTML = this.presets.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.presetsElement.parentElement.scrollTop = this.presetsElement.parentElement.scrollHeight;
    }
};

// Initialize counter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    counterFunctions.initialize();
});