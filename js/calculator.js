// Calculator functionality
const calculatorFunctions = {
    currentOperand: '0',
    previousOperand: '',
    currentOperation: undefined,
    shouldResetScreen: false,
    history: [],
    
    initialize: function() {
        this.currentOperandElement = document.getElementById('currentOperand');
        this.previousOperandElement = document.getElementById('prevOperand');
        this.historyElement = document.getElementById('history');
        this.updateDisplay();
        this.addKeyboardSupport();
    },
    
    clearAll: function() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.currentOperation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    },
    
    deleteLast: function() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    },
    
    appendNumber: function(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    },
    
    operation: function(operator) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.calculate();
        }
        
        this.currentOperation = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    },
    
    calculate: function() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.currentOperation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentOperand = 'Error: ÷ by 0';
                    this.currentOperation = undefined;
                    this.previousOperand = '';
                    this.shouldResetScreen = true;
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Store history
        const operationSymbol = {'+': '+', '-': '−', '*': '×', '/': '÷'}[this.currentOperation];
        this.history.push(`${this.getDisplayNumber(prev)} ${operationSymbol} ${this.getDisplayNumber(current)} = ${this.getDisplayNumber(computation)}`);
        
        this.currentOperand = computation.toString();
        this.currentOperation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    },
    
    percentage: function() {
        if (this.currentOperand === '') return;
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
        this.updateDisplay();
    },
    
    squareRoot: function() {
        if (this.currentOperand === '' || parseFloat(this.currentOperand) < 0) {
            this.currentOperand = 'Error: Invalid √';
            this.shouldResetScreen = true;
        } else {
            this.currentOperand = Math.sqrt(parseFloat(this.currentOperand)).toString();
        }
        this.updateDisplay();
    },
    
    getDisplayNumber: function(number) {
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
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay || stringNumber;
        }
    },
    
    updateDisplay: function() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        if (this.currentOperation != null) {
            const operationSymbol = {'+': '+', '-': '−', '*': '×', '/': '÷'}[this.currentOperation];
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
        
        // Update history
        this.historyElement.innerHTML = this.history.map(item => `<p>${item}</p>`).join('');
        this.historyElement.scrollTop = this.historyElement.scrollHeight;
    },
    
    addKeyboardSupport: function() {
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key);
            if (e.key === '.') this.appendNumber('.');
            if (['+', '-', '*', '/'].includes(e.key)) this.operation(e.key);
            if (e.key === 'Enter') this.calculate();
            if (e.key === 'Backspace') this.deleteLast();
            if (e.key === 'Escape') this.clearAll();
            if (e.key === '%') this.percentage();
        });
    }
};

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    calculatorFunctions.initialize();
});