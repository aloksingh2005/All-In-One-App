// --- QR Code Library Embedded (Placeholder - using CDN above) ---
// If not using CDN, you'd paste the minified library code here.
// Example: var QRCode = function(){ /* ... library code ... */ }();

// --- Tool Implementation ---
const tools = {
    // --- Basic Tools ---
    calculator: {
        name: "Calculator",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/calculator.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    unitConverter: {
        name: "Unit Converter",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/unit-converter.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },

    
    daysCounter: {
        name: "Days Counter",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/days-counter.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },

    
    stopwatch: {
        name: "Stopwatch",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/stopwatch.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    timer: {
        name: "Timer",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/timer.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    numberCounter: {
        name: "Num Counter",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/num-counter.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },

    randomGenerator: {
        name: "Random Generator",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/ran-num-gen.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },

    billingSystem: {
        name: "Billing",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/billing.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },

    reminders: {
        name: "Reminder",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/reminder.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    ruler: {
        name: "Ruler",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/ruler.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    paint: {
        name: "Paint",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/paint.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },

    musicPlayer: {
        name: "Music Player",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/music.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },

    soundGenerator: {
        name: "Sound Generator",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/sound-gen.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    screenRecorder: {
        name: "Screen Recorder",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/screen-rec.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    mike: {
        name: "Microphone",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/microphone.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    generateQr: {
        name: "QRCode Generator",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/qr.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    morseCode: {
        name: "Morse Code",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/morse.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    speechToText: {
        name: "Speech To Text",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/stt.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    compass: {
        name: "Compass",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/compass.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    leveler: {
        name: "Leveler",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/leveler.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    myAddress: {
        name: "My Address",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/location.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    speedometer: {
        name: "Speedometer",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/speedometer.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    altitude: {
        name: "Altitude",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/altitude.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    vibrometer: {
        name: "Motion Sensor",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/motion.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    soundIntensity: {
        name: "Sound Meter",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/sound.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    gMeter: {
        name: "G Meter",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/g.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    protractor: {
        name: "Protractor",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/protractor.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    deviceInfo: {
        name: "Device Info",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/device-info.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },




    textToSpeech: {
        name: "Text to Speech",
        init: function (modalContent) {
            modalContent.innerHTML = `
                 <label for="ttsInput">Text to Speak:</label>
                 <textarea id="ttsInput" rows="4" placeholder="Enter text..."></textarea>
                 <button id="ttsSpeakBtn">Speak</button>
                 <p style="font-size: 0.8em; color: #666; margin-top: 10px;">Uses browser's built-in speech synthesis.</p>
             `;
            modalContent.querySelector('#ttsSpeakBtn').onclick = () => {
                const text = modalContent.querySelector('#ttsInput').value;
                if ('speechSynthesis' in window && text) {
                    const utterance = new SpeechSynthesisUtterance(text);
                    window.speechSynthesis.speak(utterance);
                } else {
                    alert('Speech Synthesis not supported or no text entered.');
                }
            };
        }
    },


    // Placeholder for removed/impossible tools
    placeholder: {
        name: "Tool Not Available",
        init: function (modalContent, toolName) {
            modalContent.innerHTML = `<p>The tool '<b>${toolName || 'This tool'}</b>' cannot be implemented in a standard web browser due to security restrictions or lack of hardware access (e.g., IR Blaster, specific sensors, file system lock, etc.).</p>`;
        }
    }
};

// App categories configuration
const appCategories = {
    utility: {
        name: "Utilities",
        icon: "fas fa-calculator"
    },
    media: {
        name: "Media",
        icon: "fas fa-photo-video"
    },
    communication: {
        name: "Communication",
        icon: "fas fa-comments"
    },
    sensors: {
        name: "Sensors",
        icon: "fas fa-compass"
    }
};

// Remap tools to new app structure with categories
const apps = {
    // --- Utility Tools ---
    calculator: {
        name: "Calculator",
        icon: "fas fa-calculator",
        category: "utility",
        description: "Perform basic calculations",
        tool: tools.calculator
    },
    unitConverter: {
        name: "Unit Converter",
        icon: "fas fa-exchange-alt",
        category: "utility",
        description: "Convert between different units",
        tool: tools.unitConverter
    },
    daysCounter: {
        name: "Days Counter",
        icon: "fas fa-calendar-day",
        category: "utility",
        description: "Calculate days between dates",
        tool: tools.daysCounter
    },
    stopwatch: {
        name: "Stopwatch",
        icon: "fas fa-stopwatch",
        category: "utility",
        description: "Measure elapsed time",
        tool: tools.stopwatch
    },
    timer: {
        name: "Timer",
        icon: "fas fa-hourglass-half",
        category: "utility",
        description: "Set countdown timer",
        tool: tools.timer
    },
    numberCounter: {
        name: "Counter",
        icon: "fas fa-sort-numeric-up",
        category: "utility",
        description: "Simple number counter",
        tool: tools.numberCounter
    },
    randomGenerator: {
        name: "Random Generator",
        icon: "fas fa-dice",
        category: "utility",
        description: "Generate random numbers",
        tool: tools.randomGenerator
    },
    billingSystem: {
        name: "Billing",
        icon: "fas fa-receipt",
        category: "utility",
        description: "Simple billing system",
        tool: tools.billingSystem
    },
    reminders: {
        name: "Reminders",
        icon: "fas fa-bell",
        category: "utility",
        description: "Set reminders and notes",
        tool: tools.reminders
    },
    ruler: {
        name: "Ruler",
        icon: "fas fa-ruler",
        category: "utility",
        description: "On-screen measurement",
        tool: tools.ruler
    },

    // --- Media Tools ---
    paint: {
        name: "Paint",
        icon: "fas fa-paint-brush",
        category: "media",
        description: "Simple drawing tool",
        tool: tools.paint
    },
    musicPlayer: {
        name: "Music Player",
        icon: "fas fa-music",
        category: "media",
        description: "Play audio files",
        tool: tools.musicPlayer
    },
    soundGenerator: {
        name: "Sound Generator",
        icon: "fas fa-volume-up",
        category: "media",
        description: "Generate tones and sounds",
        tool: tools.soundGenerator
    },
    screenRecorder: {
        name: "Screen Recorder",
        icon: "fas fa-record-vinyl",
        category: "media",
        description: "Record your screen",
        tool: tools.screenRecorder
    },
    mike: {
        name: "Microphone",
        icon: "fas fa-microphone",
        category: "media",
        description: "Microphone passthrough",
        tool: tools.mike
    },

    // --- Communication Tools ---
    generateQr: {
        name: "QR Generator",
        icon: "fas fa-qrcode",
        category: "communication",
        description: "Generate QR codes",
        tool: tools.generateQr
    },
    morseCode: {
        name: "Morse Code",
        icon: "fas fa-comment-dots",
        category: "communication",
        description: "Convert text to morse code",
        tool: tools.morseCode
    },
    textToSpeech: {
        name: "Text to Speech",
        icon: "fas fa-volume-up",
        category: "communication",
        description: "Read text aloud",
        tool: tools.textToSpeech
    },
    speechToText: {
        name: "Speech to Text",
        icon: "fas fa-microphone-alt",
        category: "communication",
        description: "Convert speech to text",
        tool: tools.speechToText
    },

    // --- Sensor Tools ---
    compass: {
        name: "Compass",
        icon: "fas fa-compass",
        category: "sensors",
        description: "Digital compass",
        tool: tools.compass
    },
    leveler: {
        name: "Leveler",
        icon: "fas fa-balance-scale",
        category: "sensors",
        description: "Device level indicator",
        tool: tools.leveler
    },
    myAddress: {
        name: "Location",
        icon: "fas fa-map-marker-alt",
        category: "sensors",
        description: "Get current location",
        tool: tools.myAddress
    },
    speedometer: {
        name: "Speedometer",
        icon: "fas fa-tachometer-alt",
        category: "sensors",
        description: "Measure speed",
        tool: tools.speedometer
    },
    altitude: {
        name: "Altitude",
        icon: "fas fa-mountain",
        category: "sensors",
        description: "Get current altitude",
        tool: tools.altitude
    },
    vibrometer: {
        name: "Motion Sensor",
        icon: "fas fa-mobile-alt",
        category: "sensors",
        description: "Detect device motion",
        tool: tools.vibrometer
    },
    soundIntensity: {
        name: "Sound Meter",
        icon: "fas fa-wave-square",
        category: "sensors",
        description: "Measure sound intensity",
        tool: tools.soundIntensity
    },
    gMeter: {
        name: "G-Meter",
        icon: "fas fa-car-crash",
        category: "sensors",
        description: "Measure acceleration forces",
        tool: tools.gMeter
    },
    protractor: {
        name: "Protractor",
        icon: "fas fa-drafting-compass",
        category: "sensors",
        description: "Measure angles",
        tool: tools.protractor
    },
    deviceInfo: {
        name: "Device Info",
        icon: "fas fa-info-circle",
        category: "sensors",
        description: "Display device information",
        tool: tools.deviceInfo
    }
};

// DOM Elements
const appGrid = document.getElementById('appGrid');
const appSearch = document.getElementById('appSearch');
const modalContainer = document.getElementById('modalContainer');
const categoryButtons = document.querySelectorAll('.nav-btn');
const themeToggle = document.querySelector('.theme-toggle');

// Initialize the application
function initializeApp() {
    // Render all apps initially
    renderApps();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize time display
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 60000);
}

// Render apps in the grid
function renderApps(category = 'all') {
    appGrid.innerHTML = '';
    
    Object.entries(apps).forEach(([appKey, app]) => {
        if (category === 'all' || app.category === category) {
            const appElement = createAppElement(appKey, app);
            appGrid.appendChild(appElement);
        }
    });
}

// Create an app element
function createAppElement(appKey, app) {
    const appElement = document.createElement('div');
    appElement.className = 'app-item';
    appElement.dataset.appKey = appKey;
    
    appElement.innerHTML = `
        <div class="app-icon">
            <i class="${app.icon}"></i>
        </div>
        <div class="app-name">${app.name}</div>
    `;
    
    appElement.addEventListener('click', () => openAppModal(appKey));
    
    return appElement;
}

// Open an app modal
function openAppModal(appKey) {
    const app = apps[appKey];
    if (!app) return;
    
    const modal = document.createElement('div');
    modal.className = 'app-modal';
    modal.dataset.appKey = appKey;
    
    modal.innerHTML = `
        <div class="modal-header">
            <div class="modal-title">
                <div class="modal-title-icon">
                    <i class="${app.icon}"></i>
                </div>
                <span>${app.name}</span>
            </div>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-content"></div>
    `;
    
    modalContainer.innerHTML = '';
    modalContainer.appendChild(modal);
    modalContainer.style.display = 'flex';
    
    const modalContent = modal.querySelector('.modal-content');
    
    // Initialize the tool in the modal
    if (app.tool && typeof app.tool.init === 'function') {
        app.tool.init(modalContent);
    }
    
    // Setup close button
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
}

// Close the active modal
function closeModal() {
    const activeModal = modalContainer.querySelector('.app-modal');
    if (!activeModal) return;
    
    const appKey = activeModal.dataset.appKey;
    const app = apps[appKey];
    
    // Run cleanup if available
    if (app.tool && typeof app.tool.cleanup === 'function') {
        app.tool.cleanup();
    }
    
    modalContainer.style.display = 'none';
}

// Filter apps by search term
function filterApps(searchTerm) {
    const normalizedTerm = searchTerm.toLowerCase().trim();
    
    document.querySelectorAll('.app-item').forEach(appItem => {
        const appKey = appItem.dataset.appKey;
        const app = apps[appKey];
        
        if (!normalizedTerm || 
            app.name.toLowerCase().includes(normalizedTerm) || 
            (app.description && app.description.toLowerCase().includes(normalizedTerm))) {
            appItem.style.display = 'flex';
        } else {
            appItem.style.display = 'none';
        }
    });
}

// Update the time display
function updateTimeDisplay() {
    const now = new Date();
    const timeElement = document.querySelector('.time');
    timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Toggle dark/light theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    const isDarkTheme = document.body.classList.contains('dark-theme');
    themeToggle.innerHTML = isDarkTheme 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    
    // Save preference to localStorage
    localStorage.setItem('darkTheme', isDarkTheme);
}

// Setup all event listeners
function setupEventListeners() {
    // Category filter buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            renderApps(category);
            
            // Update section title
            const sectionTitle = document.querySelector('.section-title');
            if (category === 'all') {
                sectionTitle.textContent = 'All Applications';
            } else {
                sectionTitle.textContent = appCategories[category].name;
            }
        });
    });
    
    // Search functionality
    appSearch.addEventListener('input', () => {
        filterApps(appSearch.value);
    });
    
    // Keyboard shortcut for search
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== appSearch) {
            e.preventDefault();
            appSearch.focus();
        }
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Click outside modal to close
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
}

// Load saved theme preference
function loadThemePreference() {
    const darkTheme = localStorage.getItem('darkTheme') === 'true';
    if (darkTheme) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
    loadThemePreference();
    initializeApp();
});
