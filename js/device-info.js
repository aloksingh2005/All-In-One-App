const deviceInfoFunctions = {
    display: null,
    historyElement: null,
    history: [],
    deviceInfo: {},
    
    initialize: function() {
        this.display = document.getElementById('display');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.addEventListeners();
        this.loadFromStorage();
        this.refresh();
    },
    
    addEventListeners: function() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.refresh();
            }
            if (e.key === 'c' || e.key === 'C') this.copy();
        });
    },
    
    async refresh() {
        this.deviceInfo = {};
        const nav = navigator;
        
        // Browser Info
        this.deviceInfo.browser = {
            name: nav.userAgent.match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/)?.[1] || 'Unknown',
            version: nav.userAgent.match(/Version\/[\d.]+/)?.[0] || 'Unknown',
            userAgent: nav.userAgent,
            language: nav.language || 'Unknown',
            cookies: nav.cookieEnabled ? 'Enabled' : 'Disabled'
        };
        
        // Device Info
        this.deviceInfo.device = {
            platform: nav.platform || 'Unknown',
            cores: nav.hardwareConcurrency || 'Unknown',
            memory: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'Unknown'
        };
        
        // Screen Info
        this.deviceInfo.screen = {
            resolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth || 'Unknown',
            pixelRatio: window.devicePixelRatio || 'Unknown'
        };
        
        // Battery Info
        try {
            const battery = await nav.getBattery?.();
            this.deviceInfo.battery = {
                level: battery ? `${(battery.level * 100).toFixed(0)}%` : 'Unknown',
                charging: battery ? (battery.charging ? 'Yes' : 'No') : 'Unknown'
            };
        } catch {
            this.deviceInfo.battery = { level: 'Unknown', charging: 'Unknown' };
        }
        
        // Network Info
        this.deviceInfo.network = {
            type: nav.connection?.effectiveType || 'Unknown',
            downlink: nav.connection?.downlink ? `${nav.connection.downlink} Mbps` : 'Unknown'
        };
        
        this.history.push('Refreshed device info');
        this.updateHistory();
        this.saveToStorage();
        this.updateDisplay();
    },
    
    copy: function() {
        const infoText = `
Browser: ${this.deviceInfo.browser?.name || 'Unknown'} (${this.deviceInfo.browser?.version || 'Unknown'})
User Agent: ${this.deviceInfo.browser?.userAgent || 'Unknown'}
Language: ${this.deviceInfo.browser?.language || 'Unknown'}
Cookies: ${this.deviceInfo.browser?.cookies || 'Unknown'}
Platform: ${this.deviceInfo.device?.platform || 'Unknown'}
Cores: ${this.deviceInfo.device?.cores || 'Unknown'}
Memory: ${this.deviceInfo.device?.memory || 'Unknown'}
Resolution: ${this.deviceInfo.screen?.resolution || 'Unknown'}
Color Depth: ${this.deviceInfo.screen?.colorDepth || 'Unknown'}
Pixel Ratio: ${this.deviceInfo.screen?.pixelRatio || 'Unknown'}
Battery: ${this.deviceInfo.battery?.level || 'Unknown'} (${this.deviceInfo.battery?.charging || 'Unknown'})
Network: ${this.deviceInfo.network?.type || 'Unknown'} (${this.deviceInfo.network?.downlink || 'Unknown'})
        `.trim();
        navigator.clipboard.writeText(infoText).then(() => {
            this.history.push('Copied device info');
            this.updateHistory();
            this.saveToStorage();
        });
    },
    
    updateDisplay: function() {
        this.display.classList.remove('error');
        this.display.innerHTML = `
            <h3>Device Info</h3>
            ${this.deviceInfo.browser ? `
                <p><strong>Browser:</strong> ${this.deviceInfo.browser.name} (${this.deviceInfo.browser.version})</p>
                <p><strong>User Agent:</strong> ${this.deviceInfo.browser.userAgent}</p>
                <p><strong>Language:</strong> ${this.deviceInfo.browser.language}</p>
                <p><strong>Cookies:</strong> ${this.deviceInfo.browser.cookies}</p>
                <p><strong>Platform:</strong> ${this.deviceInfo.device.platform}</p>
                <p><strong>Cores:</strong> ${this.deviceInfo.device.cores}</p>
                <p><strong>Memory:</strong> ${this.deviceInfo.device.memory}</p>
                <p><strong>Resolution:</strong> ${this.deviceInfo.screen.resolution}</p>
                <p><strong>Color Depth:</strong> ${this.deviceInfo.screen.colorDepth}</p>
                <p><strong>Pixel Ratio:</strong> ${this.deviceInfo.screen.pixelRatio}</p>
                <p><strong>Battery:</strong> ${this.deviceInfo.battery.level} (${this.deviceInfo.battery.charging})</p>
                <p><strong>Network:</strong> ${this.deviceInfo.network.type} (${this.deviceInfo.network.downlink})</p>
            ` : '<p>Click Refresh to load</p>'}
        `;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    },
    
    saveToStorage: function() {
        localStorage.setItem('deviceInfoHistory', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedHistory = localStorage.getItem('deviceInfoHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistory();
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    deviceInfoFunctions.initialize();
});