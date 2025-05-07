const morseFunctions = {
    input: '',
    mode: 'textToMorse',
    output: '',
    ctx: new AudioContext(),
    morseCode: {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
        'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
        'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
    },
    history: [],
    
    initialize: function() {
        this.inputElement = document.getElementById('input');
        this.modeSelect = document.getElementById('mode');
        this.outputElement = document.getElementById('output');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
    },
    
    addEventListeners: function() {
        this.inputElement.addEventListener('input', (e) => {
            this.input = e.target.value;
            this.updateDisplay();
        });
        this.modeSelect.addEventListener('change', (e) => {
            this.mode = e.target.value;
            this.updateDisplay();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.convert();
            }
            if (e.key === 'p' || e.key === 'P') this.play();
            if (e.key === 'c' || e.key === 'C') this.copy();
            if (e.key === 'r' || e.key === 'R') this.clear();
        });
    },
    
    convert: function() {
        if (!this.input) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>Please enter text or Morse code</p>
            `;
            return;
        }
        if (this.mode === 'textToMorse') {
            this.output = this.textToMorse(this.input.toUpperCase());
            this.history.push(`Converted "${this.input.slice(0, 20)}${this.input.length > 20 ? '...' : ''}" to Morse`);
        } else {
            this.output = this.morseToText(this.input);
            this.history.push(`Converted "${this.input.slice(0, 20)}${this.input.length > 20 ? '...' : ''}" to Text`);
        }
        this.outputElement.textContent = this.output || '...';
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    textToMorse: function(text) {
        return text.split('').map(char => this.morseCode[char] || '').join(' ').trim();
    },
    
    morseToText: function(morse) {
        const reverseMorse = Object.fromEntries(
            Object.entries(this.morseCode).map(([k, v]) => [v, k])
        );
        return morse.split(' ').map(code => reverseMorse[code] || '').join('');
    },
    
    play: function() {
        if (!this.output || this.mode !== 'textToMorse') {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>No Morse code to play</p>
            `;
            return;
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        let time = this.ctx.currentTime;
        const dotDuration = 0.1; // 100ms
        const dashDuration = 0.3; // 300ms
        const spaceDuration = 0.1; // 100ms
        this.output.split('').forEach(symbol => {
            if (symbol === '.') {
                const oscillator = this.ctx.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, time);
                oscillator.connect(this.ctx.destination);
                oscillator.start(time);
                oscillator.stop(time + dotDuration);
                time += dotDuration + spaceDuration;
            } else if (symbol === '-') {
                const oscillator = this.ctx.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, time);
                oscillator.connect(this.ctx.destination);
                oscillator.start(time);
                oscillator.stop(time + dashDuration);
                time += dashDuration + spaceDuration;
            } else if (symbol === ' ') {
                time += spaceDuration * 2;
            }
        });
        this.history.push('Played Morse code');
        this.updateHistory();
        this.saveToStorage();
    },
    
    copy: function() {
        if (!this.output) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>No output to copy</p>
            `;
            return;
        }
        navigator.clipboard.writeText(this.output).then(() => {
            this.history.push('Copied output');
            this.updateHistory();
            this.saveToStorage();
        });
    },
    
    clear: function() {
        this.input = '';
        this.output = '';
        this.inputElement.value = '';
        this.mode = 'textToMorse';
        this.modeSelect.value = 'textToMorse';
        this.outputElement.textContent = '...';
        this.history.push('Cleared input');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    updateDisplay: function() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Morse Code</h3>
            <p>Mode: ${this.mode === 'textToMorse' ? 'Text to Morse' : 'Morse to Text'}</p>
            <p>Input: ${this.input ? this.input.slice(0, 20) + (this.input.length > 20 ? '...' : '') : 'None'}</p>
            <p>Output: ${this.output ? this.output.slice(0, 20) + (this.output.length > 20 ? '...' : '') : 'None'}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('morseHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('morseHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    morseFunctions.initialize();
});