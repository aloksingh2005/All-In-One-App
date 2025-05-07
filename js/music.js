const musicFunctions = {
    audio: new Audio(),
    playlist: [],
    currentIndex: -1,
    history: [],
    
    initialize: function() {
        this.display = document.getElementById('display');
        this.progress = document.getElementById('progress');
        this.volume = document.getElementById('volume');
        this.upload = document.getElementById('upload');
        this.playlistElement = document.getElementById('playlist').querySelector('tbody');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
    },
    
    addEventListeners: function() {
        this.audio.addEventListener('timeupdate', () => {
            if (this.audio.duration) {
                this.progress.value = (this.audio.currentTime / this.audio.duration) * 100;
                this.updateDisplay();
            }
        });
        this.audio.addEventListener('ended', () => this.next());
        this.progress.addEventListener('input', () => {
            if (this.audio.duration) {
                this.audio.currentTime = (this.progress.value / 100) * this.audio.duration;
            }
        });
        this.volume.addEventListener('input', () => {
            this.audio.volume = this.volume.value;
        });
        this.upload.addEventListener('change', (e) => {
            for (const file of e.target.files) {
                const url = URL.createObjectURL(file);
                this.playlist.push({ name: file.name, url });
                this.history.push(`Uploaded: ${file.name}`);
            }
            this.updatePlaylist();
            this.updateHistory();
            this.saveToStorage();
            if (this.currentIndex === -1 && this.playlist.length > 0) {
                this.currentIndex = 0;
                this.playSong();
            }
        });
        this.playlistElement.addEventListener('click', (e) => {
            const song = e.target.closest('td');
            if (song) {
                this.currentIndex = parseInt(song.dataset.index);
                this.playSong();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePlay();
            }
            if (e.key === 'n' || e.key === 'N') this.next();
            if (e.key === 'p' || e.key === 'P') this.previous();
            if (e.key === 'u' || e.key === 'U') this.upload.click();
        });
    },
    
    togglePlay: function() {
        if (this.audio.paused && this.currentIndex >= 0) {
            this.audio.play();
            this.history.push(`Played: ${this.playlist[this.currentIndex].name}`);
        } else {
            this.audio.pause();
            this.history.push(`Paused: ${this.playlist[this.currentIndex].name}`);
        }
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    next: function() {
        if (this.currentIndex < this.playlist.length - 1) {
            this.currentIndex++;
            this.playSong();
        }
    },
    
    previous: function() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.playSong();
        }
    },
    
    playSong: function() {
        if (this.currentIndex >= 0 && this.currentIndex < this.playlist.length) {
            this.audio.src = this.playlist[this.currentIndex].url;
            this.audio.play();
            this.history.push(`Played: ${this.playlist[this.currentIndex].name}`);
            this.updateHistory();
            this.saveToStorage();
            this.updateDisplay();
        }
    },
    
    formatTime: function(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    
    updateDisplay: function() {
        if (this.currentIndex >= 0 && this.currentIndex < this.playlist.length) {
            const song = this.playlist[this.currentIndex];
            this.display.innerHTML = `
                <h3>${song.name}</h3>
                <p>${this.formatTime(this.audio.currentTime)} / ${this.formatTime(this.audio.duration || 0)}</p>
                <p>${this.audio.paused ? 'Paused' : 'Playing'}</p>
            `;
        } else {
            this.display.innerHTML = `
                <h3>No Song Playing</h3>
                <p>Upload a song to start</p>
            `;
        }
    },
    
    updatePlaylist: function() {
        this.playlistElement.innerHTML = this.playlist.map((song, index) => 
            `<tr><td data-index="${index}">${song.name}</td></tr>`
        ).join('');
        this.playlistElement.parentElement.scrollTop = this.playlistElement.parentElement.scrollHeight;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('musicHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('musicHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    musicFunctions.initialize();
});