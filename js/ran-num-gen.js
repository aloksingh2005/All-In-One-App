const generatorFunctions = {
    usedNumbers: [],
    history: [],
    presets: [],
    
    initialize: function() {
        this.minValueElement = document.getElementById('minValue');
        this.maxValueElement = document.getElementById('maxValue');
        this.countElement = document.getElementById('count');
        this.noDuplicatesElement = document.getElementById('noDuplicates');
        this.displayElement = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('table');
        this.presetsElement = document.getElementById('presets').querySelector('table');
        this.addEventListeners();
        this.updateDisplay();
    },
    
    addEventListeners: function() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.generate();
            }
            if (e.key === 'r' || e.key === 'R') this.clear();
            if (e.key === 's' || e.key === 'S') this.savePreset();
        });
        this.presetsElement.addEventListener('click', (e) => {
            const preset = e.target.closest('td');
            if (preset) {
                const [min, max, count] = preset.textContent.split(',').map(s => parseInt(s.split(':')[1].trim()));
                this.minValueElement.value = min;
                this.maxValueElement.value = max;
                this.countElement.value = count;
                this.history.push(`Loaded preset: Min=${min}, Max=${max}, Count=${count}`);
                this.updateHistory();
            }
        });
    },
    
    generate: function() {
        const min = parseInt(this.minValueElement.value);
        const max = parseInt(this.maxValueElement.value);
        const count = parseInt(this.countElement.value) || 1;
        const noDuplicates = this.noDuplicatesElement.checked;
        
        if (isNaN(min) || isNaN(max) || isNaN(count)) {
            this.displayElement.textContent = 'Invalid input';
            return;
        }
        
        if (min > max) {
            this.displayElement.textContent = 'Min must be less than Max';
            return;
        }
        
        if (count <= 0) {
            this.displayElement.textContent = 'Count must be positive';
            return;
        }
        
        if (noDuplicates && count > (max - min + 1)) {
            this.displayElement.textContent = 'Not enough unique numbers';
            return;
        }
        
        const numbers = [];
        let attempts = 0;
        const maxAttempts = 1000; // Prevent infinite loop
        
        while (numbers.length < count && attempts < maxAttempts) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!noDuplicates || !this.usedNumbers.includes(num)) {
                numbers.push(num);
                if (noDuplicates) this.usedNumbers.push(num);
            }
            attempts++;
        }
        
        if (numbers.length < count) {
            this.displayElement.textContent = 'Could not generate enough unique numbers';
            return;
        }
        
        this.displayElement.textContent = numbers.join(', ');
        this.history.push(`Generated: ${numbers.join(', ')}`);
        this.updateHistory();
    },
    
    clear: function() {
        this.minValueElement.value = 1;
        this.maxValueElement.value = 100;
        this.countElement.value = 1;
        this.noDuplicatesElement.checked = false;
        this.usedNumbers = [];
        this.displayElement.textContent = '0';
        this.history.push('Cleared');
        this.updateHistory();
    },
    
    savePreset: function() {
        const min = parseInt(this.minValueElement.value);
        const max = parseInt(this.maxValueElement.value);
        const count = parseInt(this.countElement.value) || 1;
        
        if (isNaN(min) || isNaN(max) || isNaN(count)) return;
        
        const preset = `Min:${min}, Max:${max}, Count:${count}`;
        if (!this.presets.includes(preset)) {
            this.presets.push(preset);
            this.history.push(`Saved preset: ${preset}`);
            this.updatePresets();
            this.updateHistory();
        }
    },
    
    updateDisplay: function() {
        this.displayElement.textContent = '0';
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

// Initialize generator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    generatorFunctions.initialize();
});