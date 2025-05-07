const stopwatchFunctions = {
    startTime: null,
    elapsedTime: 0,
    isRunning: false,
    laps: [],
    intervalId: null,
    
    initialize: function() {
        this.displayElement = document.getElementById('display');
        this.startStopBtn = document.getElementById('startStopBtn');
        this.historyElement = document.getElementById('history').querySelector('table');
        this.addEventListeners();
        this.updateDisplay();
    },
    
    addEventListeners: function() {
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault(); // Prevent scrolling
                this.startStop();
            }
            if (e.key === 'r' || e.key === 'R') this.reset();
            if (e.key === 'l' || e.key === 'L') this.lap();
        });
    },
    
    startStop: function() {
        if (this.isRunning) {
            // Stop
            clearInterval(this.intervalId);
            this.elapsedTime += Date.now() - this.startTime;
            this.isRunning = false;
            this.startStopBtn.textContent = 'Start';
            this.startStopBtn.classList.remove('stop');
            this.startStopBtn.classList.add('action');
            this.startStopBtn.style.background = '';
        } else {
            // Start
            this.startTime = Date.now();
            this.intervalId = setInterval(() => this.updateDisplay(), 10);
            this.isRunning = true;
            this.startStopBtn.textContent = 'Stop';
            this.startStopBtn.classList.remove('action');
            this.startStopBtn.classList.add('stop');
        }
    },
    
    reset: function() {
        clearInterval(this.intervalId);
        this.startTime = null;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.laps = [];
        this.startStopBtn.textContent = 'Start';
        this.startStopBtn.classList.remove('stop');
        this.startStopBtn.classList.add('action');
        this.startStopBtn.style.background = '';
        this.updateDisplay();
    },
    
    lap: function() {
        if (!this.isRunning) return;
        const currentTime = this.elapsedTime + (Date.now() - this.startTime);
        const formattedTime = this.formatTime(currentTime);
        this.laps.push(`Lap ${this.laps.length + 1}: ${formattedTime}`);
        this.updateHistory();
    },
    
    formatTime: function(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
    },
    
    updateDisplay: function() {
        const currentTime = this.isRunning ? this.elapsedTime + (Date.now() - this.startTime) : this.elapsedTime;
        this.displayElement.textContent = this.formatTime(currentTime);
        this.displayElement.style.animation = 'none';
        this.displayElement.offsetHeight; // Trigger reflow
        this.displayElement.style.animation = 'fadeIn 0.3s ease-in-out';
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.laps.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    }
};

// Initialize stopwatch when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    stopwatchFunctions.initialize();
});