// --- QR Code Library Embedded (Placeholder - using CDN above) ---
// If not using CDN, you'd paste the minified library code here.
// Example: var QRCode = function(){ /* ... library code ... */ }();

// --- Tool Implementation ---
const tools = {
    // --- Basic Tools ---
    calculator: {
        name: "Calculator",
        icon: "fas fa-calculator",
        category: "utility",
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
        icon: "fas fa-exchange-alt",
        category: "utility",
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
        icon: "fas fa-calendar-day",
        category: "utility",
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
        icon: "fas fa-stopwatch",
        category: "utility",
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
        icon: "fas fa-hourglass-half",
        category: "utility",
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
        icon: "fas fa-sort-numeric-up",
        category: "utility",
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
        icon: "fas fa-dice",
        category: "utility",
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
        icon: "fas fa-receipt",
        category: "utility",
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
        icon: "fas fa-bell",
        category: "utility",
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
        icon: "fas fa-ruler",
        category: "utility",
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
        icon: "fas fa-paint-brush",
        category: "media",
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
        icon: "fas fa-music",
        category: "media",
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
        icon: "fas fa-volume-up",
        category: "media",
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
        icon: "fas fa-record-vinyl",
        category: "media",
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
        icon: "fas fa-microphone",
        category: "media",
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
        icon: "fas fa-qrcode",
        category: "communication",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <div class="qr-container" style="padding: 20px; text-align: center;">
                    <h3>QR Code Generator</h3>
                    <div class="qr-input-container" style="margin: 20px 0;">
                        <label for="qrInput" style="display: block; margin-bottom: 10px; font-weight: 500;">Enter text or URL:</label>
                        <input type="text" id="qrInput" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #ccc; margin-bottom: 15px;" placeholder="https://example.com">
                        
                        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                            <div style="flex: 1;">
                                <label for="qrSize" style="display: block; margin-bottom: 5px;">Size:</label>
                                <select id="qrSize" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ccc;">
                                    <option value="128">Small (128px)</option>
                                    <option value="200" selected>Medium (200px)</option>
                                    <option value="300">Large (300px)</option>
                                </select>
                            </div>
                            <div style="flex: 1;">
                                <label for="qrColor" style="display: block; margin-bottom: 5px;">Color:</label>
                                <input type="color" id="qrColor" value="#000000" style="width: 100%; padding: 5px; height: 42px; border-radius: 8px; border: 1px solid #ccc;">
                            </div>
                        </div>
                        
                        <button id="generateQrBtn" style="background-color: var(--primary-color); color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; width: 100%;">Generate QR Code</button>
                    </div>
                    
                    <div id="qrOutput" style="margin-top: 20px; display: flex; flex-direction: column; align-items: center; min-height: 200px;">
                        <p style="color: var(--text-secondary);">QR code will appear here</p>
                    </div>
                    
                    <button id="downloadQrBtn" style="background-color: var(--secondary-color); color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; margin-top: 15px; display: none;">Download QR Code</button>
                </div>
            `;
            
            const qrInput = modalContent.querySelector('#qrInput');
            const qrSize = modalContent.querySelector('#qrSize');
            const qrColor = modalContent.querySelector('#qrColor');
            const generateBtn = modalContent.querySelector('#generateQrBtn');
            const downloadBtn = modalContent.querySelector('#downloadQrBtn');
            const qrOutput = modalContent.querySelector('#qrOutput');
            
            let qrcode = null;
            
            generateBtn.addEventListener('click', () => {
                const text = qrInput.value.trim();
                if (!text) {
                    qrOutput.innerHTML = `<p style="color: #e53935;">Please enter text or URL first</p>`;
                    downloadBtn.style.display = 'none';
                    return;
                }
                
                // Clear previous QR code
                qrOutput.innerHTML = '';
                
                // Create new QR code
                qrcode = new QRCode(qrOutput, {
                    text: text,
                    width: parseInt(qrSize.value),
                    height: parseInt(qrSize.value),
                    colorDark: qrColor.value,
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
                
                // Show download button
                downloadBtn.style.display = 'block';
            });
            
            downloadBtn.addEventListener('click', () => {
                const img = qrOutput.querySelector('img');
                if (img) {
                    // Create a temporary link
                    const link = document.createElement('a');
                    link.href = img.src;
                    link.download = 'qrcode.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
            
            // Initialize with a placeholder QR code
            setTimeout(() => {
                if (qrInput.value.trim() === '') {
                    qrInput.value = 'https://example.com';
                    generateBtn.click();
                    qrInput.value = '';
                    qrOutput.innerHTML = `<p style="color: var(--text-secondary);">QR code will appear here</p>`;
                    downloadBtn.style.display = 'none';
                }
            }, 500);
        },
        
        cleanup: function() {
            // Nothing to clean up
        }
    },


    morseCode: {
        name: "Morse Code",
        icon: "fas fa-comment-dots",
        category: "communication",
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
        icon: "fas fa-microphone-alt",
        category: "communication",
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
        icon: "fas fa-compass",
        category: "sensors",
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
        icon: "fas fa-balance-scale",
        category: "sensors",
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
        icon: "fas fa-map-marker-alt",
        category: "sensors",
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
        icon: "fas fa-tachometer-alt",
        category: "sensors",
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
        icon: "fas fa-mountain",
        category: "sensors",
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
        icon: "fas fa-mobile-alt",
        category: "sensors",
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
        icon: "fas fa-wave-square",
        category: "sensors",
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
        icon: "fas fa-car",
        category: "sensors",
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
        icon: "fas fa-drafting-compass",
        category: "sensors",
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
        icon: "fas fa-info-circle",
        category: "sensors",
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
        icon: "fas fa-volume-up",
        category: "communication",
        init: function (modalContent) {
            modalContent.innerHTML = `
                <iframe src="views/tts.html" style="width: 100%; height: 460px; border: none; overflow: hidden;"></iframe>
            `;
        },
        
        cleanup: function() {
            // Nothing to clean up - cleanup is handled in the iframe
        }
    },


    // Placeholder for removed/impossible tools
    placeholder: {
        name: "Tool Not Available",
        icon: "fas fa-exclamation-triangle",
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
    speechToText: {
        name: "Speech to Text",
        icon: "fas fa-microphone-alt",
        category: "communication",
        description: "Convert speech to text",
        tool: tools.speechToText
    },
    textToSpeech: {
        name: "Text to Speech",
        icon: "fas fa-volume-up",
        category: "communication",
        description: "Read text aloud",
        tool: tools.textToSpeech
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
        icon: "fas fa-car",
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
    loadThemePreference();
    
    // Assign categories to tools if not already assigned
    Object.keys(tools).forEach(key => {
        // Default category assignment logic based on tool type
        if (!tools[key].category) {
            if (key.includes('calculator') || key.includes('Counter') || 
                key.includes('timer') || key.includes('watch') || 
                key.includes('Generator') || key.includes('billing') || 
                key.includes('converter') || key.includes('reminder')) {
                tools[key].category = 'utility';
            } else if (key.includes('paint') || key.includes('music') || 
                       key.includes('recorder') || key.includes('sound') || 
                       key.includes('mike')) {
                tools[key].category = 'media';
            } else if (key.includes('qr') || key.includes('morse') || 
                       key.includes('stt') || key.includes('tts')) {
                tools[key].category = 'communication';
            } else if (key.includes('compass') || key.includes('level') || 
                       key.includes('location') || key.includes('meter') || 
                       key.includes('altitude') || key.includes('motion')) {
                tools[key].category = 'sensors';
            } else {
                tools[key].category = 'utility'; // Default category
            }
        }
    });
    
    updateAppCountBadges();
    renderApps('all');
    setupEventListeners();
    updateTimeDisplay();
    setupResponsiveBehavior();
}

// Set up responsive behavior based on screen size
function setupResponsiveBehavior() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    // Auto-collapse sidebar on narrow screens
    function checkScreenSize() {
        if (window.innerWidth < 1024 && window.innerWidth > 768) {
            sidebar.classList.add('collapsed');
            sidebar.style.width = '70px';
        } else if (window.innerWidth >= 1024) {
            sidebar.classList.remove('collapsed');
            sidebar.style.width = '280px';
        }
    }
    
    // Initial check
    checkScreenSize();
    
    // Listen for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Make sidebar toggle visible on larger screens
    if (window.innerWidth >= 768) {
        sidebarToggle.style.display = 'block';
    }
}

// Render apps based on category filter
function renderApps(category = 'all') {
    const appGrid = document.getElementById('appGrid');
    appGrid.innerHTML = '';
    
    // Update section title
    const sectionTitle = document.querySelector('.section-title');
    if (category === 'all') {
        sectionTitle.textContent = 'All Applications';
    } else {
        // Get category name from the nav button text
        const categoryBtn = document.querySelector(`.nav-btn[data-category="${category}"]`);
        if (categoryBtn) {
            const categoryName = categoryBtn.querySelector('span').textContent;
            sectionTitle.textContent = categoryName;
        }
    }
    
    // Filter and render apps
    Object.keys(tools).forEach(appKey => {
        const app = tools[appKey];
        const appCategory = app.category || 'utility';
        
        if (category === 'all' || category === appCategory) {
            const appElement = createAppElement(appKey, app);
            appGrid.appendChild(appElement);
        }
    });
}

// Create app element for the grid
function createAppElement(appKey, app) {
    const appElement = document.createElement('div');
    appElement.className = 'app-item';
    appElement.setAttribute('data-app', appKey);
    
    // Determine app icon
    let iconClass = 'fas fa-cube'; // Default icon
    if (app.icon) {
        iconClass = app.icon;
    }
    
    appElement.innerHTML = `
        <div class="app-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="app-name">${app.name}</div>
    `;
    
    appElement.addEventListener('click', () => openAppModal(appKey));
    
    return appElement;
}

// Open app modal
function openAppModal(appKey) {
    const app = tools[appKey];
    if (!app) return;
    
    const modalContainer = document.getElementById('modalContainer');
    
    // Get the icon from the app or use default
    const iconClass = app.icon || 'fas fa-cube';
    
    // Check if mobile view
    const isMobile = window.innerWidth <= 768;
    
    // Create modal HTML
    const modalHTML = `
        <div class="app-modal" data-app="${appKey}">
            ${isMobile ? '<div class="modal-pull-handle"></div>' : ''}
            <div class="modal-header">
                <div class="modal-title">
                    <div class="modal-title-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    ${app.name}
                </div>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content"></div>
        </div>
    `;
    
    modalContainer.innerHTML = modalHTML;
    
    // Show the modal
    modalContainer.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Initialize the app in the modal
    const modalContent = modalContainer.querySelector('.modal-content');
    if (typeof app.init === 'function') {
        app.init(modalContent);
    }
    
    // Add touch swipe to close on mobile
    if (isMobile) {
        setupModalSwipeToClose();
    }
}

// Set up swipe to close for mobile modals
function setupModalSwipeToClose() {
    const modal = document.querySelector('.app-modal');
    const pullHandle = document.querySelector('.modal-pull-handle');
    let startY = 0;
    let currentY = 0;
    
    // Only set up swipe events if elements exist
    if (!modal || !pullHandle) return;
    
    // Animation for pull handle
    function updatePullHandleAnimation(deltaY) {
        if (deltaY > 0) {
            const progress = Math.min(deltaY / 100, 1);
            modal.classList.add('dragging');
            pullHandle.style.transform = `scaleX(${1 - (progress * 0.3)})`;
            pullHandle.style.opacity = 1 - (progress * 0.5);
        }
    }
    
    function resetPullHandle() {
        modal.classList.remove('dragging');
        pullHandle.style.transform = '';
        pullHandle.style.opacity = '';
    }
    
    // Touch start handler
    const handleTouchStart = (e) => {
        startY = e.touches[0].clientY;
        currentY = startY;
        
        // Add transitions during swipe
        modal.style.transition = 'transform 0.05s ease-out';
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    };
    
    // Touch move handler
    const handleTouchMove = (e) => {
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        // Only allow pulling down, not up
        if (deltaY > 0) {
            modal.style.transform = `translateY(${deltaY}px)`;
            updatePullHandleAnimation(deltaY);
        }
    };
    
    // Touch end handler
    const handleTouchEnd = () => {
        const deltaY = currentY - startY;
        
        // Remove event listeners
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        
        // If pulled down far enough, close modal
        if (deltaY > 100) {
            closeModal();
        } else {
            // Otherwise, snap back with animation
            modal.style.transition = 'transform 0.2s cubic-bezier(0.2, 0.9, 0.3, 1.2)';
            modal.style.transform = 'translateY(0)';
            resetPullHandle();
            
            setTimeout(() => {
                modal.style.transition = '';
            }, 300);
        }
    };
    
    // Add event listener to pull handle
    pullHandle.addEventListener('touchstart', handleTouchStart);
    
    // Make pull handle pulsate slightly to indicate it's draggable
    setTimeout(() => {
        pullHandle.style.transition = 'transform 1s ease-in-out';
        pullHandle.style.transform = 'scaleX(0.8)';
        
        setTimeout(() => {
            pullHandle.style.transform = 'scaleX(1)';
            setTimeout(() => {
                pullHandle.style.transition = '';
            }, 1000);
        }, 1000);
    }, 500);
}

// Close the active modal
function closeModal() {
    const activeModal = modalContainer.querySelector('.app-modal');
    if (!activeModal) return;
    
    const appKey = activeModal.dataset.app;
    const app = tools[appKey];
    
    // Run cleanup if available
    if (app && typeof app.cleanup === 'function') {
        app.cleanup();
    }
    
    modalContainer.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Filter apps based on search term
function filterApps(searchTerm) {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    const appGrid = document.getElementById('appGrid');
    let anyVisible = false;
    
    document.querySelectorAll('.app-item').forEach(appItem => {
        const appKey = appItem.dataset.app;
        const app = tools[appKey];
        
        if (!normalizedTerm || 
            app.name.toLowerCase().includes(normalizedTerm) || 
            appKey.toLowerCase().includes(normalizedTerm)) {
            appItem.style.display = '';
            anyVisible = true;
        } else {
            appItem.style.display = 'none';
        }
    });
    
    // Show "no results" message if needed
    if (!anyVisible && appGrid.children.length > 0) {
        if (!document.querySelector('.no-results')) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <p>No apps found matching "${searchTerm}"</p>
            `;
            appGrid.appendChild(noResults);
        }
    } else {
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }
}

// Update the time display
function updateTimeDisplay() {
    const now = new Date();
    const timeElement = document.querySelector('.time');
    timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Toggle dark/light theme
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    
    // Update icon for both theme toggle buttons
    const moonIcon = 'fa-moon';
    const sunIcon = 'fa-sun';
    
    const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-sidebar');
    themeToggles.forEach(toggle => {
        const icon = toggle.querySelector('i');
        if (body.classList.contains('dark-theme')) {
            icon.classList.replace(moonIcon, sunIcon);
        } else {
            icon.classList.replace(sunIcon, moonIcon);
        }
    });
    
    // Save theme preference
    const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
    
    if (sidebar.classList.contains('collapsed')) {
        sidebar.style.width = '70px';
    } else {
        sidebar.style.width = '280px';
    }
}

// Update the app count badges in sidebar
function updateAppCountBadges() {
    // Count apps per category
    const counts = {
        all: Object.keys(tools).length,
        utility: 0,
        media: 0,
        communication: 0,
        sensors: 0
    };
    
    // Count apps in each category
    Object.values(tools).forEach(app => {
        const category = app.category || 'utility';
        if (counts[category] !== undefined) {
            counts[category]++;
        }
    });
    
    // Update the badges
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const category = btn.dataset.category;
        const countElement = btn.querySelector(category === 'all' ? '.nav-badge' : '.nav-count');
        if (countElement && counts[category] !== undefined) {
            countElement.textContent = counts[category];
        }
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Nav button click events
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderApps(category);
        });
    });
    
    // Mobile nav button click events
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Also update regular sidebar nav if visible
            document.querySelectorAll('.nav-btn').forEach(b => {
                if (b.dataset.category === category) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
            
            renderApps(category);
        });
    });
    
    // Search input functionality
    const searchInput = document.getElementById('appSearch');
    searchInput.addEventListener('input', function() {
        filterApps(this.value.trim().toLowerCase());
    });
    
    // Keyboard shortcut for search (press /)
    document.addEventListener('keydown', function(e) {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // Theme toggle functionality
    const themeToggleBtn = document.querySelector('.theme-toggle');
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Sidebar theme toggle functionality
    const themeToggleSidebarBtn = document.querySelector('.theme-toggle-sidebar');
    if (themeToggleSidebarBtn) {
        themeToggleSidebarBtn.addEventListener('click', toggleTheme);
    }
    
    // Sidebar toggle functionality
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle');
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', toggleSidebar);
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('modalContainer').style.display === 'flex') {
            closeModal();
        }
    });
    
    // Click outside modal to close
    document.getElementById('modalContainer').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalContainer')) {
            closeModal();
        }
    });
    
    // Update time display
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 60000); // Update time every minute
}

// Load saved theme preference
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        
        // Update icon for both theme toggle buttons
        const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-sidebar');
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.replace('fa-moon', 'fa-sun');
            }
        });
    }
}

// When the DOM is fully loaded, initialize the app
document.addEventListener('DOMContentLoaded', initializeApp);
