const paintFunctions = {
    ctx: null,
    canvas: null,
    drawing: false,
    tool: 'brush',
    brushSize: 5,
    color: '#000000',
    fill: 'stroke',
    history: [],
    actions: [],
    
    initialize: function() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.toolSelect = document.getElementById('tool');
        this.brushSizeInput = document.getElementById('brushSize');
        this.colorInput = document.getElementById('color');
        this.fillSelect = document.getElementById('fill');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
    },
    
    addEventListeners: function() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        this.toolSelect.addEventListener('change', (e) => {
            this.tool = e.target.value;
            this.updateDisplay();
        });
        this.brushSizeInput.addEventListener('change', (e) => {
            this.brushSize = parseInt(e.target.value);
        });
        this.colorInput.addEventListener('change', (e) => {
            this.color = e.target.value;
        });
        this.fillSelect.addEventListener('change', (e) => {
            this.fill = e.target.value;
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'c' || e.key === 'C') this.clear();
            if (e.key === 'u' || e.key === 'U') this.undo();
            if (e.key === 's' || e.key === 'S') this.save();
            if (e.key === 'b' || e.key === 'B') {
                this.tool = 'brush';
                this.toolSelect.value = 'brush';
                this.updateDisplay();
            }
            if (e.key === 'e' || e.key === 'E') {
                this.tool = 'eraser';
                this.toolSelect.value = 'eraser';
                this.updateDisplay();
            }
        });
    },
    
    startDrawing: function(e) {
        this.drawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.actions.push(this.canvas.toDataURL());
    },
    
    draw: function(e) {
        if (!this.drawing) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.lineWidth = this.brushSize;
        this.ctx.strokeStyle = this.tool === 'eraser' ? '#FFFFFF' : this.color;
        this.ctx.fillStyle = this.color;
        
        if (this.tool === 'brush' || this.tool === 'eraser') {
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.actions.length > 1) {
                const img = new Image();
                img.src = this.actions[this.actions.length - 2];
                this.ctx.drawImage(img, 0, 0);
            }
            this.ctx.beginPath();
            if (this.tool === 'line') {
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            } else if (this.tool === 'rectangle') {
                const width = x - this.startX;
                const height = y - this.startY;
                if (this.fill === 'fill') {
                    this.ctx.fillRect(this.startX, this.startY, width, height);
                } else {
                    this.ctx.strokeRect(this.startX, this.startY, width, height);
                }
            } else if (this.tool === 'circle') {
                const radius = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
                this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
                if (this.fill === 'fill') {
                    this.ctx.fill();
                } else {
                    this.ctx.stroke();
                }
            }
        }
        this.updateDisplay();
    },
    
    stopDrawing: function() {
        if (this.drawing) {
            this.drawing = false;
            this.actions.push(this.canvas.toDataURL());
            this.history.push(`Drew ${this.tool}`);
            this.updateHistory();
            this.saveToStorage();
        }
    },
    
    clear: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.actions.push(this.canvas.toDataURL());
        this.history.push('Cleared canvas');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    undo: function() {
        if (this.actions.length > 1) {
            this.actions.pop();
            const img = new Image();
            img.src = this.actions[this.actions.length - 1];
            img.onload = () => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(img, 0, 0);
            };
            this.history.push('Undo');
            this.updateHistory();
            this.saveToStorage();
        }
    },
    
    save: function() {
        const link = document.createElement('a');
        link.download = 'painting.png';
        link.href = this.canvas.toDataURL();
        link.click();
        this.history.push('Saved image');
        this.updateHistory();
        this.saveToStorage();
    },
    
    updateDisplay: function() {
        this.display.innerHTML = `
            <h3>Paint</h3>
            <p>Drawing with ${this.tool}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('paintHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('paintHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    paintFunctions.initialize();
});