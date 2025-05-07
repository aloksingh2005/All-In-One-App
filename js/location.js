const locationFunctions = {
    map: null,
    marker: null,
    lat: null,
    lng: null,
    address: '',
    highAccuracy: true,
    zoom: 15,
    history: [],
    
    initialize: function() {
        this.highAccuracyCheckbox = document.getElementById('highAccuracy');
        this.zoomInput = document.getElementById('zoom');
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.map = L.map('map').setView([0, 0], this.zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
        this.addEventListeners();
        this.loadFromStorage();
        this.updateDisplay();
    },
    
    addEventListeners: function() {
        this.highAccuracyCheckbox.addEventListener('change', (e) => {
            this.highAccuracy = e.target.checked;
            this.updateDisplay();
        });
        this.zoomInput.addEventListener('input', (e) => {
            this.zoom = parseInt(e.target.value);
            if (this.lat && this.lng) {
                this.map.setView([this.lat, this.lng], this.zoom);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'l' || e.key === 'L') {
                e.preventDefault();
                this.getLocation();
            }
            if (e.key === 'c' || e.key === 'C') this.copy();
            if (e.key === 'x' || e.key === 'X') this.clear();
        });
    },
    
    getLocation: function() {
        if (!navigator.geolocation) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>Geolocation not supported</p>
            `;
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                this.lat = pos.coords.latitude;
                this.lng = pos.coords.longitude;
                this.map.setView([this.lat, this.lng], this.zoom);
                if (this.marker) this.map.removeLayer(this.marker);
                this.marker = L.marker([this.lat, this.lng]).addTo(this.map);
                this.fetchAddress();
                this.history.push(`Fetched location: ${this.lat.toFixed(4)}, ${this.lng.toFixed(4)}`);
                this.updateHistory();
                this.saveToStorage();
                this.updateDisplay();
            },
            (err) => {
                this.display.classList.add('error');
                this.display.innerHTML = `
                    <h3>Error</h3>
                    <p>Location error: ${err.message}</p>
                `;
                this.history.push(`Error: ${err.message}`);
                this.updateHistory();
                this.saveToStorage();
            },
            { enableHighAccuracy: this.highAccuracy, timeout: 5000 }
        );
    },
    
    async fetchAddress() {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.lat}&lon=${this.lng}`
            );
            const data = await response.json();
            this.address = data.display_name || 'Unknown address';
            this.updateDisplay();
        } catch (err) {
            this.address = 'Failed to fetch address';
            this.updateDisplay();
        }
    },
    
    copy: function() {
        if (!this.lat || !this.lng) {
            this.display.classList.add('error');
            this.display.innerHTML = `
                <h3>Error</h3>
                <p>No location to copy</p>
            `;
            return;
        }
        const coords = `${this.lat}, ${this.lng}`;
        navigator.clipboard.writeText(coords).then(() => {
            this.history.push('Copied coordinates');
            this.updateHistory();
            this.saveToStorage();
        });
    },
    
    clear: function() {
        this.lat = null;
        this.lng = null;
        this.address = '';
        if (this.marker) {
            this.map.removeLayer(this.marker);
            this.marker = null;
        }
        this.map.setView([0, 0], 2);
        this.history.push('Cleared location');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    updateDisplay: function() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Location</h3>
            <p>Coordinates: ${this.lat && this.lng ? `${this.lat.toFixed(4)}, ${this.lng.toFixed(4)}` : 'None'}</p>
            <p>Address: ${this.address || 'None'}</p>
            <p>Accuracy: ${this.highAccuracy ? 'High' : 'Low'}</p>
            <p>Zoom: ${this.zoom}</p>
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('locationHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('locationHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    locationFunctions.initialize();
});