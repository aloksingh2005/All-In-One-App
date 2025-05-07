const converterFunctions = {
    history: [],
    
    initialize: function() {
        this.inputElement = document.getElementById('inputValue');
        this.fromUnitElement = document.getElementById('fromUnit');
        this.toUnitElement = document.getElementById('toUnit');
        this.resultElement = document.getElementById('result');
        this.historyElement = document.getElementById('history');
        this.addEventListeners();
        // Removed this.updateResult() as it doesn't exist
        this.resultElement.textContent = '0'; // Initial result
    },
    
    addEventListeners: function() {
        this.inputElement.addEventListener('input', () => this.convert());
        this.fromUnitElement.addEventListener('change', () => this.convert());
        this.toUnitElement.addEventListener('change', () => this.convert());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.convert();
            if (e.key === 'Escape') this.clear();
        });
    },
    
    clear: function() {
        this.inputElement.value = '';
        this.resultElement.textContent = '0';
        this.updateHistory();
    },
    
    convert: function() {
        const value = parseFloat(this.inputElement.value);
        const fromUnit = this.fromUnitElement.value;
        const toUnit = this.toUnitElement.value;
        
        if (isNaN(value)) {
            this.resultElement.textContent = 'Invalid input';
            return;
        }
        
        const result = this.convertValue(value, fromUnit, toUnit);
        if (result === null) {
            this.resultElement.textContent = 'Invalid conversion';
            return;
        }
        
        this.resultElement.textContent = this.formatNumber(result);
        this.history.push(`${this.formatNumber(value)} ${fromUnit} = ${this.formatNumber(result)} ${toUnit}`);
        this.updateHistory();
    },
    
    convertValue: function(value, fromUnit, toUnit) {
        // Length conversions (to meter, then to target)
        const lengthToMeter = {
            m: 1,
            km: 1000,
            cm: 0.01,
            mm: 0.001,
            in: 0.0254,
            ft: 0.3048,
            yd: 0.9144
        };
        
        // Weight conversions (to kg, then to target)
        const weightToKg = {
            kg: 1,
            g: 0.001,
            lb: 0.453592,
            oz: 0.0283495
        };
        
        // Volume conversions (to liter, then to target)
        const volumeToLiter = {
            L: 1,
            mL: 0.001,
            gal: 3.78541,
            fl_oz: 0.0295735
        };
        
        // Temperature conversions
        if (fromUnit === toUnit) return value;
        
        if (['C', 'F', 'K'].includes(fromUnit) && ['C', 'F', 'K'].includes(toUnit)) {
            let celsius;
            if (fromUnit === 'C') celsius = value;
            else if (fromUnit === 'F') celsius = (value - 32) * 5 / 9;
            else if (fromUnit === 'K') {
                if (value < 0) return null; // Invalid Kelvin
                celsius = value - 273.15;
            }
            
            if (toUnit === 'C') return celsius;
            if (toUnit === 'F') return celsius * 9 / 5 + 32;
            if (toUnit === 'K') return celsius + 273.15;
        }
        
        // Length conversions
        if (Object.keys(lengthToMeter).includes(fromUnit) && Object.keys(lengthToMeter).includes(toUnit)) {
            return value * lengthToMeter[fromUnit] / lengthToMeter[toUnit];
        }
        
        // Weight conversions
        if (Object.keys(weightToKg).includes(fromUnit) && Object.keys(weightToKg).includes(toUnit)) {
            return value * weightToKg[fromUnit] / weightToKg[toUnit];
        }
        
        // Volume conversions
        if (Object.keys(volumeToLiter).includes(fromUnit) && Object.keys(volumeToLiter).includes(toUnit)) {
            return value * volumeToLiter[fromUnit] / volumeToLiter[toUnit];
        }
        
        return null; // Invalid unit pair
    },
    
    formatNumber: function(number) {
        if (typeof number !== 'number') return number;
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits.slice(0, 4)}`;
        }
        return integerDisplay || stringNumber;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<p>${item}</p>`).join('');
        this.historyElement.scrollTop = this.historyElement.scrollHeight;
    }
};

// Initialize converter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    converterFunctions.initialize();
});