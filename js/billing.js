        const billingFunctions = {
            items: [],
            history: [],
            presets: [],
            
            initialize: function() {
                this.itemNameElement = document.getElementById('itemName');
                this.quantityElement = document.getElementById('quantity');
                this.unitElement = document.getElementById('unit');
                this.unitPriceElement = document.getElementById('unitPrice');
                this.discountElement = document.getElementById('discount');
                this.discountTypeElement = document.getElementById('discountType');
                this.taxElement = document.getElementById('tax');
                this.taxTypeElement = document.getElementById('taxType');
                this.displayElement = document.getElementById('display');
                this.itemsElement = document.getElementById('items').querySelector('tbody');
                this.historyElement = document.getElementById('history').querySelector('tbody');
                this.presetsElement = document.getElementById('presets').querySelector('tbody');
                this.addEventListeners();
                this.updateDisplay();
            },
            
            addEventListeners: function() {
                this.itemNameElement.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addItem();
                });
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && document.activeElement !== this.itemNameElement) {
                        e.preventDefault();
                        this.addItem();
                    }
                    if (e.key === 'r' || e.key === 'R') this.clear();
                    if (e.key === 's' || e.key === 'S') this.saveBill();
                    if (e.key === 'd' || e.key === 'D') this.deleteLastItem();
                });
                this.itemsElement.addEventListener('click', (e) => {
                    const deleteBtn = e.target.closest('.delete-btn');
                    if (deleteBtn) {
                        const index = parseInt(deleteBtn.dataset.index);
                        this.deleteItem(index);
                    }
                });
                this.presetsElement.addEventListener('click', (e) => {
                    const preset = e.target.closest('td');
                    if (preset) {
                        const index = parseInt(preset.dataset.index);
                        this.items = JSON.parse(JSON.stringify(this.presets[index].items));
                        this.discountElement.value = this.presets[index].discount;
                        this.discountTypeElement.value = this.presets[index].discountType;
                        this.taxElement.value = this.presets[index].tax;
                        this.taxTypeElement.value = this.presets[index].taxType;
                        this.history.push(`Loaded preset: ${this.presets[index].name}`);
                        this.updateItems();
                        this.updateHistory();
                        this.updateDisplay();
                    }
                });
            },
            
            addItem: function() {
                const name = this.itemNameElement.value.trim();
                const quantity = parseFloat(this.quantityElement.value) || 0;
                const unit = this.unitElement.value;
                const unitPrice = parseFloat(this.unitPriceElement.value) || 0;
                
                if (!name) {
                    this.displayElement.classList.add('error');
                    this.displayElement.innerHTML = 'Enter item name';
                    return;
                }
                
                if (quantity <= 0) {
                    this.displayElement.classList.add('error');
                    this.displayElement.innerHTML = 'Invalid quantity';
                    return;
                }
                
                if (unitPrice < 0) {
                    this.displayElement.classList.add('error');
                    this.displayElement.innerHTML = 'Invalid unit price';
                    return;
                }
                
                this.items.push({ name, quantity, unit, unitPrice });
                this.itemNameElement.value = '';
                this.quantityElement.value = 1;
                this.unitElement.value = 'kg';
                this.unitPriceElement.value = 0;
                
                this.history.push(`Added: ${quantity} ${unit} ${name} @ $${unitPrice.toFixed(2)}`);
                this.updateItems();
                this.updateHistory();
                this.updateDisplay();
            },
            
            deleteItem: function(index) {
                const item = this.items[index];
                this.items.splice(index, 1);
                this.history.push(`Deleted: ${item.quantity} ${item.unit} ${item.name}`);
                this.updateItems();
                this.updateHistory();
                this.updateDisplay();
            },
            
            deleteLastItem: function() {
                if (this.items.length > 0) {
                    this.deleteItem(this.items.length - 1);
                }
            },
            
            clear: function() {
                this.items = [];
                this.itemNameElement.value = '';
                this.quantityElement.value = 1;
                this.unitElement.value = 'kg';
                this.unitPriceElement.value = 0;
                this.discountElement.value = 0;
                this.discountTypeElement.value = 'percent';
                this.taxElement.value = 0;
                this.taxTypeElement.value = 'percent';
                this.displayElement.classList.remove('error');
                this.displayElement.innerHTML = '<div>Subtotal: $0.00</div><div>Discount: $0.00</div><div>Tax: $0.00</div><div>Total: $0.00</div>';
                this.history.push('Cleared');
                this.updateItems();
                this.updateHistory();
            },
            
            saveBill: function() {
                if (this.items.length === 0) return;
                const discount = parseFloat(this.discountElement.value) || 0;
                const discountType = this.discountTypeElement.value;
                const tax = parseFloat(this.taxElement.value) || 0;
                const taxType = this.taxTypeElement.value;
                const preset = {
                    name: `Bill ${this.presets.length + 1}`,
                    items: JSON.parse(JSON.stringify(this.items)),
                    discount,
                    discountType,
                    tax,
                    taxType
                };
                this.presets.push(preset);
                this.history.push(`Saved bill: ${preset.name} (Total: $${this.calculateTotal().toFixed(2)})`);
                this.updatePresets();
                this.updateHistory();
            },
            
            calculateTotal: function() {
                let subtotal = 0;
                this.items.forEach(item => {
                    subtotal += item.quantity * item.unitPrice;
                });
                
                const discount = parseFloat(this.discountElement.value) || 0;
                const discountType = this.discountTypeElement.value;
                const tax = parseFloat(this.taxElement.value) || 0;
                const taxType = this.taxTypeElement.value;
                
                if (discount < 0 || (discountType === 'percent' && discount > 100)) {
                    this.displayElement.classList.add('error');
                    this.displayElement.innerHTML = 'Invalid discount';
                    return null;
                }
                
                if (tax < 0) {
                    this.displayElement.classList.add('error');
                    this.displayElement.innerHTML = 'Invalid tax';
                    return null;
                }
                
                let discountAmount = discountType === 'percent' ? subtotal * (discount / 100) : discount;
                const taxableAmount = subtotal - discountAmount;
                const taxAmount = taxType === 'percent' ? taxableAmount * (tax / 100) : tax;
                const total = taxableAmount + taxAmount;
                
                return { subtotal, discountAmount, taxAmount, total };
            },
            
            updateDisplay: function() {
                const result = this.calculateTotal();
                if (result !== null) {
                    this.displayElement.classList.remove('error');
                    this.displayElement.innerHTML = `
                        <div>Subtotal: $${result.subtotal.toFixed(2)}</div>
                        <div>Discount: $${result.discountAmount.toFixed(2)}</div>
                        <div>Tax: $${result.taxAmount.toFixed(2)}</div>
                        <div>Total: $${result.total.toFixed(2)}</div>
                    `;
                }
                this.displayElement.style.animation = 'none';
                this.displayElement.offsetHeight; // Trigger reflow
                this.displayElement.style.animation = 'fadeIn 0.3s ease-in-out';
            },
            
            updateItems: function() {
                this.itemsElement.innerHTML = this.items.map((item, index) => 
                    `<tr>
                        <td>${item.quantity} ${item.unit} ${item.name} @ $${item.unitPrice.toFixed(2)}</td>
                        <td><span class="delete-btn" data-index="${index}">Delete</span></td>
                    </tr>`
                ).join('');
                this.itemsElement.parentElement.scrollTop = this.itemsElement.parentElement.scrollHeight;
            },
            
            updateHistory: function() {
                this.historyElement.innerHTML = this.history.map(item => `<tr><td>${item}</td></tr>`).join('');
                this.historyElement.parentElement.scrollTop = this.historyElement.parentElement.scrollHeight;
            },
            
            updatePresets: function() {
                this.presetsElement.innerHTML = this.presets.map((preset, index) => 
                    `<tr><td data-index="${index}">${preset.name}</td></tr>`
                ).join('');
                this.presetsElement.parentElement.scrollTop = this.presetsElement.parentElement.scrollHeight;
            }
        };

        // Initialize billing when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            billingFunctions.initialize();
        });