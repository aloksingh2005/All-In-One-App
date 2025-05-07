const counterFunctions = {
    history: [],

    initialize: function () {
        this.startDateElement = document.getElementById('startDate');
        this.endDateElement = document.getElementById('endDate');
        this.workingDaysElement = document.getElementById('workingDays');
        this.resultElement = document.getElementById('result');
        this.historyElement = document.getElementById('history');
        this.addEventListeners();
        this.resultElement.textContent = '0 days';
    },

    addEventListeners: function () {
        this.startDateElement.addEventListener('change', () => this.count());
        this.endDateElement.addEventListener('change', () => this.count());
        this.workingDaysElement.addEventListener('change', () => this.count());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.count();
            if (e.key === 'Escape') this.clear();
        });
    },

    clear: function () {
        this.startDateElement.value = '';
        this.endDateElement.value = '';
        this.workingDaysElement.checked = false;
        this.resultElement.textContent = '0 days';
        this.updateHistory();
    },

    count: function () {
        const startDate = new Date(this.startDateElement.value);
        const endDate = new Date(this.endDateElement.value);
        const workingDaysOnly = this.workingDaysElement.checked;

        if (isNaN(startDate) || isNaN(endDate)) {
            this.resultElement.textContent = 'Select both dates';
            return;
        }

        if (startDate > endDate) {
            this.resultElement.textContent = 'End date must be after start date';
            return;
        }

        let days;
        if (workingDaysOnly) {
            days = this.countWorkingDays(startDate, endDate);
        } else {
            const diffTime = endDate - startDate;
            days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        this.resultElement.textContent = `${days} day${days !== 1 ? 's' : ''}`;
        this.history.push(`${this.startDateElement.value} to ${this.endDateElement.value} = ${days} day${days !== 1 ? 's' : ''}${workingDaysOnly ? ' (working)' : ''}`);
        this.updateHistory();
    },

    countWorkingDays: function (startDate, endDate) {
        let count = 0;
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return count;
    },

    updateHistory: function () {
        this.historyElement.innerHTML = this.history.map(item => `<p>${item}</p>`).join('');
        this.historyElement.scrollTop = this.historyElement.scrollHeight;
    }
};

// Initialize counter when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    counterFunctions.initialize();
});