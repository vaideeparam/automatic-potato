/**
 * Main Application for Pulp Procurement Control Tower
 * This file initializes the application and handles global functionality.
 */

// Global Application Object
const APP = {
    // Current state
    state: {
        currentMonth: 'April 2025',
        activeTab: 'shipment-tracking'
    },
    
    // Initialize application
    init: function() {
        console.log('Initializing Pulp Procurement Control Tower...');
        
        // Initialize data
        DATA.init();
        
        // Initialize UI components
        UI.init();
        
        // Initialize modules
        SHIPMENTS.init();
        SUPPLIERS.init();
        
        // Add additional module initializations as they are implemented
        if (typeof INVENTORY !== 'undefined') INVENTORY.init();
        if (typeof CUSTOMS !== 'undefined') CUSTOMS.init();
        if (typeof QUALITY !== 'undefined') QUALITY.init();
        if (typeof REPORTS !== 'undefined') REPORTS.init();
        
        // Set up global event handlers
        this.setupEventHandlers();
        
        // Load user preferences
        this.loadUserPreferences();
        
        console.log('Application initialized successfully');
    },
    
    // Set up global event handlers
    setupEventHandlers: function() {
        // Tab navigation
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
        
        // Month navigation
        const nextMonthBtn = document.getElementById('next-month-btn');
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                this.advanceToNextMonth();
            });
        }
        
        // Add global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only process shortcuts if not in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                return;
            }
            
            // Ctrl+S for Settings (future implementation)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.showSettings();
            }
            
            // Ctrl+F for Find (focus search input in current tab)
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                this.focusSearch();
            }
            
            // Ctrl+P for Print
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                window.print();
            }
        });
    },
    
    // Switch to a different tab
    switchTab: function(tabId) {
        this.state.activeTab = tabId;
        
        // Use the UI tabs module to handle the switch
        UI.tabs.switchTo(tabId);
    },
    
    // Advance to the next month
    advanceToNextMonth: function() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const [month, year] = this.state.currentMonth.split(' ');
        
        const currentMonthIndex = months.indexOf(month);
        const nextMonthIndex = (currentMonthIndex + 1) % 12;
        
        // If December -> January, increment year
        const nextYear = nextMonthIndex === 0 ? parseInt(year) + 1 : year;
        
        // Update state and display
        this.state.currentMonth = `${months[nextMonthIndex]} ${nextYear}`;
        
        const monthDisplay = document.getElementById('current-month');
        if (monthDisplay) {
            monthDisplay.textContent = this.state.currentMonth;
        }
        
        // Simulate data changes for the new month
        this.simulateMonthChange();
        
        // Show notification
        UI.notification.info(`Advanced to ${this.state.currentMonth}`);
    },
    
    // Simulate data changes when advancing to a new month
    simulateMonthChange: function() {
        // TODO: Implement data updates for month change
        
        // For now, just refresh the current tab
        this.refreshCurrentTab();
    },
    
    // Refresh the current tab
    refreshCurrentTab: function() {
        switch (this.state.activeTab) {
            case 'shipment-tracking':
                SHIPMENTS.loadShipments();
                SHIPMENTS.renderTab();
                break;
            case 'supplier-mgmt':
                SUPPLIERS.loadSuppliers();
                SUPPLIERS.renderTab();
                break;
            case 'inventory':
                if (typeof INVENTORY !== 'undefined') {
                    INVENTORY.loadInventory();
                    INVENTORY.renderTab();
                }
                break;
            case 'customs':
                if (typeof CUSTOMS !== 'undefined') {
                    CUSTOMS.loadCustoms();
                    CUSTOMS.renderTab();
                }
                break;
            case 'quality':
                if (typeof QUALITY !== 'undefined') {
                    QUALITY.loadQualityChecks();
                    QUALITY.renderTab();
                }
                break;
            case 'reports':
                if (typeof REPORTS !== 'undefined') {
                    REPORTS.renderTab();
                }
                break;
        }
    },
    
    // Show settings dialog
    showSettings: function() {
        const preferences = DATA.getUserPreferences();
        
        UI.modal.form({
            title: 'Settings',
            fields: [
                {
                    id: 'theme',
                    label: 'Theme',
                    type: 'select',
                    value: preferences.theme,
                    row: 1,
                    options: [
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark (Coming Soon)' }
                    ]
                },
                {
                    id: 'pageSize',
                    label: 'Default Page Size',
                    type: 'select',
                    value: preferences.pageSize.toString(),
                    row: 2,
                    options: CONFIG.PAGINATION.PAGE_SIZE_OPTIONS.map(size => ({
                        value: size.toString(),
                        label: `${size} items per page`
                    }))
                },
                {
                    id: 'alertsEnabled',
                    type: 'checkbox',
                    checkboxLabel: 'Enable Alert Notifications',
                    value: preferences.alertsEnabled,
                    row: 3
                }
            ],
            submitText: 'Save Settings'
        }).then(formData => {
            if (formData) {
                // Convert page size to number
                formData.pageSize = parseInt(formData.pageSize, 10);
                
                // Update user preferences
                DATA.updateUserPreferences(formData);
                
                UI.notification.success('Settings saved successfully');
                
                // Apply theme change (future implementation)
                // this.applyTheme(formData.theme);
            }
        });
    },
    
    // Focus search input in current tab
    focusSearch: function() {
        const searchInput = document.getElementById('filter-search');
        if (searchInput) {
            searchInput.focus();
        }
    },
    
    // Load user preferences
    loadUserPreferences: function() {
        const preferences = DATA.getUserPreferences();
        
        // Set default active tab from preferences
        if (preferences.defaultTab) {
            this.state.activeTab = preferences.defaultTab;
            this.switchTab(preferences.defaultTab);
        }
        
        // Apply theme (future implementation)
        // this.applyTheme(preferences.theme);
    }
};

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    APP.init();
});
