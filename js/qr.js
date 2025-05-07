const qrFunctions = {
    qr: null,
    canvas: null,
    text: '',
    size: 200,
    errorCorrection: 'M',
    history: [],
    
    initialize: function() {
        this.canvas = document.getElementById('canvas');
        this.textInput = document.getElementById('text');
        this.sizeInput = document.getElementById('size');
        this.errorCorrectionSelect = document.getElementById('errorCorrection');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.qr = new QRCode(this.canvas, {
            width: this.size,
            height: this.size,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel[this.errorCorrection]
        });
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
    },
    
    addEventListeners: function() {
        this.textInput.addEventListener('input', (e) => {
            this.text = e.target.value;
            this.updateDisplay();
        });
        this.sizeInput.addEventListener('input', (e) => {
            this.size = parseInt(e.target.value);
            this.canvas.width = this.size;
            this.canvas.height = this.size;
            if (this.text) this.generate();
        });
        this.errorCorrectionSelect.addEventListener('change', (e) => {
            this.errorCorrection = e.target.value;
            if (this.text) this.generate();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.generate();
            }
            if (e.key === 'c' || e.key === 'C') this.clear();
            if (e.key === 'd' || e.key === 'D') this.download();
        });
    },
    
    generate: function() {
        if (!this.text) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>Please enter text or URL</p>
            `;
            return;
        }
        this.qr.clear();
        this.qr.makeCode(this.text);
        this.history.push(`Generated QR for "${this.text.slice(0, 20)}${this.text.length > 20 ? '...' : ''}"`);
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    clear: function() {
        this.text = '';
        this.size = 200;
        this.errorCorrection = 'M';
        this.textInput.value = '';
        this.sizeInput.value = 200;
        this.errorCorrectionSelect.value = 'M';
        this.qr.clear();
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.history.push('Cleared QR code');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    download: function() {
        if (!this.text) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>No QR code to download</p>
            `;
            return;
        }
        const dataUrl = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qrcode.png';
        link.click();
        this.history.push('Downloaded QR code');
        this.updateHistory();
        this.saveToStorage();
    },
    
    updateDisplay: function() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>QR Generator</h3>
            <p>Text: ${this.text ? this.text.slice(0, 20) + (this.text.length > 20 ? '...' : '') : 'None'}</p>
            <p>Size: ${this.size}px</p>
            <p>Error Correction: ${this.errorCorrection}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('qrHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('qrHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    qrFunctions.initialize();
});