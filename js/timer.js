const timerFunctions = {
    totalTime: 0,
    remainingTime: 0,
    isRunning: false,
    intervalId: null,
    presets: [],
    
    initialize: function() {
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.displayElement = document.getElementById('display');
        this.startPauseBtn = document.getElementById('startPauseBtn');
        this.presetsElement = document.getElementById('presets').querySelector('table');
        this.addEventListeners();
        this.updateDisplay();
    },
    
    addEventListeners: function() {
        this.minutesElement.addEventListener('input', () => this.setTime());
        this.secondsElement.addEventListener('input', () => this.setTime());
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.startPause();
            }
            if (e.key === 'r' || e.key === 'R') this.reset();
            if (e.key === 's' || e.key === 'S') this.savePreset();
        });
        this.presetsElement.addEventListener('click', (e) => {
            const preset = e.target.closest('td');
            if (preset) {
                const [min, sec] = preset.textContent.split(':').map(Number);
                this.minutesElement.value = min;
                this.secondsElement.value = sec;
                this.setTime();
            }
        });
    },
    
    setTime: function() {
        if (this.isRunning) return;
        const minutes = parseInt(this.minutesElement.value) || 0;
        const seconds = parseInt(this.secondsElement.value) || 0;
        if (minutes < 0 || seconds < 0 || minutes > 59 || seconds > 59) {
            this.displayElement.textContent = 'Invalid input';
            this.totalTime = 0;
            return;
        }
        this.totalTime = (minutes * 60 + seconds) * 1000;
        this.remainingTime = this.totalTime;
        this.updateDisplay();
    },
    
    startPause: function() {
        if (this.totalTime <= 0) {
            this.displayElement.textContent = 'Set a time';
            return;
        }
        
        if (this.isRunning) {
            // Pause
            clearInterval(this.intervalId);
            this.isRunning = false;
            this.startPauseBtn.textContent = 'Start';
            this.startPauseBtn.classList.remove('pause');
            this.startPauseBtn.classList.add('action');
            this.startPauseBtn.style.background = '';
        } else {
            // Start
            if (this.remainingTime <= 0) {
                this.remainingTime = this.totalTime;
            }
            this.intervalId = setInterval(() => this.updateTime(), 100);
            this.isRunning = true;
            this.startPauseBtn.textContent = 'Pause';
            this.startPauseBtn.classList.remove('action');
            this.startPauseBtn.classList.add('pause');
        }
    },
    
    reset: function() {
        clearInterval(this.intervalId);
        this.totalTime = 0;
        this.remainingTime = 0;
        this.isRunning = false;
        this.minutesElement.value = '';
        this.secondsElement.value = '';
        this.startPauseBtn.textContent = 'Start';
        this.startPauseBtn.classList.remove('pause');
        this.startPauseBtn.classList.add('action');
        this.startPauseBtn.style.background = '';
        this.updateDisplay();
    },
    
    savePreset: function() {
        if (this.totalTime <= 0) return;
        const minutes = Math.floor(this.totalTime / 1000 / 60);
        const seconds = Math.floor((this.totalTime / 1000) % 60);
        const preset = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (!this.presets.includes(preset)) {
            this.presets.push(preset);
            this.updatePresets();
        }
    },
    
    updateTime: function() {
        this.remainingTime -= 100;
        if (this.remainingTime <= 0) {
            clearInterval(this.intervalId);
            this.remainingTime = 0;
            this.isRunning = false;
            this.startPauseBtn.textContent = 'Start';
            this.startPauseBtn.classList.remove('pause');
            this.startPauseBtn.classList.add('action');
            this.startPauseBtn.style.background = '';
            alert('Timer finished!');
        }
        this.updateDisplay();
    },
    
    formatTime: function(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    
    updateDisplay: function() {
        if (this.totalTime <= 0 && !this.isRunning) {
            this.displayElement.textContent = '00:00';
        } else {
            this.displayElement.textContent = this.formatTime(this.remainingTime);
        }
        this.displayElement.style.animation = 'none';
        this.displayElement.offsetHeight; // Trigger reflow
        this.displayElement.style.animation = 'fadeIn 0.3s ease-in-out';
    },
    
    updatePresets: function() {
        this.presetsElement.innerHTML = this.presets.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.presetsElement.parentElement.scrollTop = this.presetsElement.parentElement.scrollHeight;
    }
};

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    timerFunctions.initialize();
});