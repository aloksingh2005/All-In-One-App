const remindersFunctions = {
    reminders: [],
    history: [],
    filter: 'all',
    editingIndex: null,
    
    initialize: function() {
        this.titleElement = document.getElementById('title');
        this.dateElement = document.getElementById('date');
        this.timeElement = document.getElementById('time');
        this.priorityElement = document.getElementById('priority');
        this.notesElement = document.getElementById('notes');
        this.filterElement = document.getElementById('filter');
        this.displayElement = document.getElementById('display');
        this.remindersElement = document.getElementById('reminders').querySelector('tbody');
        this.historyElement = document.getElementById('history').querySelector('tbody');
        this.loadFromStorage();
        this.addEventListeners();
        this.updateDisplay();
        requestAnimationFrame(() => this.checkReminders());
    },
    
    addEventListeners: function() {
        this.titleElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addReminder();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.activeElement !== this.titleElement) {
                e.preventDefault();
                this.addReminder();
            }
            if (e.key === 'r' || e.key === 'R') this.clear();
            if (e.key === 'd' || e.key === 'D') this.deleteLastReminder();
            if (e.key === 'm' || e.key === 'M') this.markLastAsDone();
            if (e.key === 'e' || e.key === 'E') this.editLastReminder();
            if (e.key === 'f' || e.key === 'F') this.toggleFilter();
        });
        this.remindersElement.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('.action-btn');
            if (actionBtn) {
                const index = parseInt(actionBtn.dataset.index);
                if (actionBtn.classList.contains('delete')) {
                    this.deleteReminder(index);
                } else if (actionBtn.classList.contains('done')) {
                    this.markAsDone(index);
                } else if (actionBtn.classList.contains('edit')) {
                    this.editReminder(index);
                }
            }
        });
        this.filterElement.addEventListener('change', (e) => {
            this.filter = e.target.value;
            this.updateReminders();
        });
    },
    
    addReminder: function() {
        const title = this.titleElement.value.trim();
        const date = this.dateElement.value;
        const time = this.timeElement.value;
        const priority = this.priorityElement.value;
        const notes = this.notesElement.value.trim();
        
        if (!title) {
            this.displayElement.classList.add('error');
            this.displayElement.innerHTML = '<h3>Error</h3><p>Enter reminder title</p>';
            return;
        }
        
        if (!date || !time) {
            this.displayElement.classList.add('error');
            this.displayElement.innerHTML = '<h3>Error</h3><p>Select date and time</p>';
            return;
        }
        
        const reminderDateTime = new Date(`${date}T${time}`);
        if (reminderDateTime < new Date()) {
            this.displayElement.classList.add('error');
            this.displayElement.innerHTML = '<h3>Error</h3><p>Cannot set reminder in the past</p>';
            return;
        }
        
        const reminder = {
            title,
            dateTime: reminderDateTime,
            priority,
            notes,
            status: 'pending'
        };
        
        if (this.editingIndex !== null) {
            this.reminders[this.editingIndex] = reminder;
            this.history.push(`Edited: ${title} to ${this.formatDateTime(reminderDateTime)}, Priority: ${priority}`);
            this.editingIndex = null;
        } else {
            this.reminders.push(reminder);
            this.history.push(`Added: ${title} at ${this.formatDateTime(reminderDateTime)}, Priority: ${priority}`);
        }
        
        this.titleElement.value = '';
        this.dateElement.value = '';
        this.timeElement.value = '';
        this.priorityElement.value = 'low';
        this.notesElement.value = '';
        
        this.saveToStorage();
        this.updateReminders();
        this.updateHistory();
        this.updateDisplay();
    },
    
    deleteReminder: function(index) {
        const reminder = this.reminders[index];
        this.history.push(`Deleted: ${reminder.title}`);
        this.reminders.splice(index, 1);
        this.saveToStorage();
        this.updateReminders();
        this.updateHistory();
        this.updateDisplay();
    },
    
    deleteLastReminder: function() {
        if (this.reminders.length > 0) {
            this.deleteReminder(this.reminders.length - 1);
        }
    },
    
    markAsDone: function(index) {
        const reminder = this.reminders[index];
        reminder.status = 'done';
        this.history.push(`Completed: ${reminder.title}`);
        this.saveToStorage();
        this.updateReminders();
        this.updateHistory();
        this.updateDisplay();
    },
    
    markLastAsDone: function() {
        if (this.reminders.length > 0) {
            this.markAsDone(this.reminders.length - 1);
        }
    },
    
    editReminder: function(index) {
        const reminder = this.reminders[index];
        this.titleElement.value = reminder.title;
        this.dateElement.value = reminder.dateTime.toISOString().split('T')[0];
        this.timeElement.value = reminder.dateTime.toTimeString().slice(0, 5);
        this.priorityElement.value = reminder.priority;
        this.notesElement.value = reminder.notes;
        this.editingIndex = index;
        this.history.push(`Started editing: ${reminder.title}`);
        this.updateHistory();
    },
    
    editLastReminder: function() {
        if (this.reminders.length > 0) {
            this.editReminder(this.reminders.length - 1);
        }
    },
    
    clear: function() {
        this.reminders = [];
        this.titleElement.value = '';
        this.dateElement.value = '';
        this.timeElement.value = '';
        this.priorityElement.value = 'low';
        this.notesElement.value = '';
        this.displayElement.classList.remove('error');
        this.displayElement.innerHTML = '<h3>No Upcoming Reminders</h3><p>Start by adding a reminder</p>';
        this.history.push('Cleared all reminders');
        this.saveToStorage();
        this.updateReminders();
        this.updateHistory();
    },
    
    toggleFilter: function() {
        const options = ['all', 'pending', 'done', 'high', 'medium', 'low'];
        const currentIndex = options.indexOf(this.filter);
        this.filter = options[(currentIndex + 1) % options.length];
        this.filterElement.value = this.filter;
        this.updateReminders();
    },
    
    checkReminders: function() {
        const now = new Date();
        this.reminders.forEach((reminder, index) => {
            if (reminder.status === 'pending' && reminder.dateTime <= now) {
                this.showNotification(`Reminder: ${reminder.title}`, reminder.notes);
                this.markAsDone(index);
            }
        });
        this.updateDisplay();
        requestAnimationFrame(() => this.checkReminders());
    },
    
    showNotification: function(title, notes) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `<strong>${title}</strong>${notes ? `<br>${notes}` : ''}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
        // Optional sound (uncomment to enable):
        // const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/24/09-13-28-74_140.mp3');
        // audio.play();
    },
    
    formatDateTime: function(date) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '');
    },
    
    saveToStorage: function() {
        localStorage.setItem('reminders', JSON.stringify(this.reminders));
        localStorage.setItem('history', JSON.stringify(this.history));
    },
    
    loadFromStorage: function() {
        const savedReminders = localStorage.getItem('reminders');
        const savedHistory = localStorage.getItem('history');
        if (savedReminders) {
            this.reminders = JSON.parse(savedReminders).map(r => ({
                ...r,
                dateTime: new Date(r.dateTime)
            }));
        }
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
        }
    },
    
    updateDisplay: function() {
        const pendingReminders = this.reminders.filter(r => r.status === 'pending');
        if (pendingReminders.length === 0) {
            this.displayElement.classList.remove('error');
            this.displayElement.innerHTML = '<h3>No Upcoming Reminders</h3><p>Start by adding a reminder</p>';
        } else {
            const nextReminder = pendingReminders.reduce((prev, curr) => 
                prev.dateTime < curr.dateTime ? prev : curr
            );
            this.displayElement.classList.remove('error');
            this.displayElement.innerHTML = `
                <h3>${nextReminder.title}</h3>
                <p>Due: ${this.formatDateTime(nextReminder.dateTime)}</p>
                <p>Priority: ${nextReminder.priority}</p>
                ${nextReminder.notes ? `<p>Notes: ${nextReminder.notes}</p>` : ''}
            `;
        }
    },
    
    updateReminders: function() {
        let filteredReminders = this.reminders;
        if (this.filter === 'pending') {
            filteredReminders = this.reminders.filter(r => r.status === 'pending');
        } else if (this.filter === 'done') {
            filteredReminders = this.reminders.filter(r => r.status === 'done');
        } else if (['high', 'medium', 'low'].includes(this.filter)) {
            filteredReminders = this.reminders.filter(r => r.priority === this.filter);
        }
        filteredReminders.sort((a, b) => a.dateTime - b.dateTime);
        this.remindersElement.innerHTML = filteredReminders.map((reminder, index) => 
            `<tr>
                <td><span class="priority-dot priority-${reminder.priority}"></span>${reminder.title} (${this.formatDateTime(reminder.dateTime)})</td>
                <td class="${reminder.status === 'done' ? 'done' : ''}">${reminder.status}</td>
                <td>
                    ${reminder.status === 'pending' ? `<span class="action-btn done" data-index="${index}">Done</span>` : ''}
                    <span class="action-btn edit" data-index="${index}">Edit</span>
                    <span class="action-btn delete" data-index="${index}">Delete</span>
                </td>
            </tr>`
        ).join('');
        this.remindersElement.parentElement.scrollTop = this.remindersElement.parentElement.scrollHeight;
    },
    
    updateHistory: function() {
        this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
        this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
    }
};

// Initialize reminders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    remindersFunctions.initialize();
});