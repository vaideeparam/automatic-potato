/**
 * Inventory Management for Pulp Procurement Control Tower
 * This file handles the Plant Inventory tab functionality.
 */

const INVENTORY = {
    // Current state
    state: {
        inventory: [],
        filteredInventory: [],
        currentPage: 1,
        pageSize: CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
        filters: {
            plant: '',
            pulpType: '',
            search: ''
        },
        sort: {
            field: 'plantName',
            ascending: true
        }
    },
    
    // Initialize inventory module
    init: function() {
        // Set page size from user preferences
        const userPreferences = DATA.getUserPreferences();
        this.state.pageSize = userPreferences.pageSize || CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
        
        // Load inventory data
        this.loadInventory();
        
        console.log('Inventory module initialized');
    },
    
    // Load inventory data
    loadInventory: function() {
        // Get inventory with current filters
        this.state.inventory = DATA.getInventory();
        this.applyFilters();
    },
    
    // Apply filters to inventory
    applyFilters: function() {
        this.state.filteredInventory = DATA.getInventory(this.state.filters);
        
        // Apply sorting
        if (this.state.sort.field) {
            this.state.filteredInventory = HELPERS.sortArray(
                this.state.filteredInventory,
                this.state.sort.field,
                this.state.sort.ascending
            );
        }
        
        // Reset to first page when filters change
        this.state.currentPage = 1;
    },
    
    // Render the inventory tab
    renderTab: function() {
        const contentContainer = document.getElementById('tab-content-container');
        
        // Calculate pagination values
        const totalItems = this.state.filteredInventory.length;
        const totalPages = Math.ceil(totalItems / this.state.pageSize);
        const startIndex = (this.state.currentPage - 1) * this.state.pageSize;
        const endIndex = Math.min(startIndex + this.state.pageSize, totalItems);
        const currentPageItems = this.state.filteredInventory.slice(startIndex, endIndex);
        
        // Prepare HTML content
        let content = `
            <!-- Dashboard Cards -->
            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Total Inventory</div>
                    </div>
                    <div class="card-value">${HELPERS.formatNumber(this.getTotalInventory())} MT</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Inventory Value</div>
                    </div>
                    <div class="card-value">${HELPERS.formatCurrency(this.getInventoryValue())}</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Low Stock Items</div>
                    </div>
                    <div class="card-value">${this.getLowStockCount()}</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Total Consumption</div>
                    </div>
                    <div class="card-value">${HELPERS.formatNumber(this.getDailyConsumption())} MT/day</div>
                </div>
            </div>
            
            <!-- Filter Section -->
            <div class="filter-section">
                <div class="filter-row">
                    <div class="filter-group">
                        <span class="filter-label">Plant:</span>
                        <select class="filter-control" id="filter-plant">
                            <option value="">All Plants</option>
                            ${this.getPlantOptions()}
                        </select>
                    </div>
                    <div class="filter-group">
                        <span class="filter-label">Pulp Type:</span>
                        <select class="filter-control" id="filter-pulp-type">
                            <option value="">All Types</option>
                            ${this.getPulpTypeOptions()}
                        </select>
                    </div>
                    <div class="filter-group">
                        <span class="filter-label">Search:</span>
                        <input type="text" class="filter-control" id="filter-search" placeholder="Search inventory...">
                    </div>
                    <button class="filter-btn" id="apply-filters">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        Search
                    </button>
                    <button class="filter-btn" id="reset-filters">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Reset
                    </button>
                </div>
            </div>
            
            <!-- Inventory Table -->
            <div class="section-header">
                <h2 class="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    Plant Inventory
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button class="filter-btn" id="export-inventory">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export
                    </button>
                    <button class="add-btn" id="update-inventory-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 5v14"></path>
                            <path d="M5 12h14"></path>
                        </svg>
                        Update Inventory
                    </button>
                </div>
            </div>
            
            <table class="data-table" id="inventory-table">
                <thead>
                    <tr>
                        <th class="sortable" data-sort="id">ID</th>
                        <th class="sortable" data-sort="plantName">Plant</th>
                        <th class="sortable" data-sort="pulpType">Pulp Type</th>
                        <th class="sortable" data-sort="quantity">Quantity (MT)</th>
                        <th class="sortable" data-sort="bales">Bales</th>
                        <th class="sortable" data-sort="location">Location</th>
                        <th class="sortable" data-sort="moisture">Moisture (%)</th>
                        <th class="sortable" data-sort="lastReceived">Last Received</th>
                        <th class="sortable" data-sort="availableQuantity">Available (MT)</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Add inventory rows
        if (currentPageItems.length === 0) {
            content += `
                <tr>
                    <td colspan="11" style="text-align: center;">No inventory items found matching the filters</td>
                </tr>
            `;
        } else {
            currentPageItems.forEach(item => {
                // Calculate stock status
                let stockStatus = 'normal';
                let stockLabel = 'Normal';
                
                if (item.availableQuantity <= item.minLevel) {
                    stockStatus = 'critical';
                    stockLabel = 'Low Stock';
                } else if (item.availableQuantity <= item.reorderPoint) {
                    stockStatus = 'warning';
                    stockLabel = 'Reorder';
                }
                
                content += `
                    <tr data-id="${item.id}">
                        <td>${item.id}</td>
                        <td>${item.plantName}</td>
                        <td>${item.pulpType}</td>
                        <td>${HELPERS.formatNumber(item.quantity, 1)}</td>
                        <td>${HELPERS.formatNumber(item.bales)}</td>
                        <td>${item.location}</td>
                        <td>${item.moisture ? HELPERS.formatNumber(item.moisture, 1) : 'N/A'}</td>
                        <td>${HELPERS.formatDate(item.lastReceived)}</td>
                        <td>${HELPERS.formatNumber(item.availableQuantity, 1)}</td>
                        <td>
                            <span class="status-pill status-${stockStatus === 'critical' ? 'delayed' : (stockStatus === 'warning' ? 'in-transit' : 'delivered')}">
                                ${stockLabel}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn edit-inventory" data-id="${item.id}" title="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button class="action-btn view-inventory" data-id="${item.id}" title="View Details">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                                <button class="action-btn delete-inventory" data-id="${item.id}" title="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
        
        content += `
                </tbody>
            </table>
        `;
        
        // Set the content
        contentContainer.innerHTML = content;
        
        // Add pagination
        if (totalItems > 0) {
            const paginationContainer = UI.createPagination({
                currentPage: this.state.currentPage,
                totalPages,
                totalItems,
                pageSize: this.state.pageSize,
                onPageChange: (page) => {
                    this.state.currentPage = page;
                    this.renderTab();
                },
                onPageSizeChange: (size) => {
                    this.state.pageSize = size;
                    this.state.currentPage = 1;
                    // Save to user preferences
                    DATA.updateUserPreferences({ pageSize: size });
                    this.renderTab();
                }
            });
            
            contentContainer.appendChild(paginationContainer);
        }
        
        // Set up event handlers
        this.setupEventHandlers();
    },
    
    // Set up event handlers
    setupEventHandlers: function() {
        // Update inventory button
        const updateInventoryBtn = document.getElementById('update-inventory-btn');
        if (updateInventoryBtn) {
            updateInventoryBtn.addEventListener('click', () => {
                this.showUpdateInventoryForm();
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('export-inventory');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportInventory();
            });
        }
        
        // Apply filters button
        const applyFiltersBtn = document.getElementById('apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.updateFiltersFromInputs();
                this.applyFilters();
                this.renderTab();
            });
        }
        
        // Reset filters button
        const resetFiltersBtn = document.getElementById('reset-filters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                this.resetFilters();
                this.renderTab();
            });
        }
        
        // Table header sort
        const sortableHeaders = document.querySelectorAll('#inventory-table th.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const field = header.getAttribute('data-sort');
                
                // Toggle sort direction if already sorting by this field
                if (this.state.sort.field === field) {
                    this.state.sort.ascending = !this.state.sort.ascending;
                } else {
                    this.state.sort.field = field;
                    this.state.sort.ascending = true;
                }
                
                this.applyFilters();
                this.renderTab();
            });
        });
        
        // Edit, view, and delete buttons
        const editBtns = document.querySelectorAll('.edit-inventory');
        const viewBtns = document.querySelectorAll('.view-inventory');
        const deleteBtns = document.querySelectorAll('.delete-inventory');
        
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.showEditInventoryForm(id);
            });
        });
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.showInventoryDetails(id);
            });
        });
        
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.confirmDeleteInventory(id);
            });
        });
        
        // Set filter inputs from state
        this.setFilterInputs();
    },
    
    // Show form to update inventory
    showUpdateInventoryForm: function() {
        UI.notification.info('Inventory update form would be displayed here (simulation)');
    },
    
    // Show form to edit inventory item
    showEditInventoryForm: function(id) {
        UI.notification.info(`Edit form for inventory item ${id} would be displayed here (simulation)`);
    },
    
    // Show inventory details
    showInventoryDetails: function(id) {
        UI.notification.info(`Details for inventory item ${id} would be displayed here (simulation)`);
    },
    
    // Confirm deletion of inventory item
    confirmDeleteInventory: function(id) {
        UI.notification.info(`Confirmation dialog for deleting inventory item ${id} would be displayed here (simulation)`);
    },
    
    // Export inventory to CSV
    exportInventory: function() {
        UI.notification.success('Inventory data exported successfully (simulation)');
    },
    
    // Get plant options for filter dropdown
    getPlantOptions: function() {
        const plants = DATA.getPlants();
        return plants.map(plant => 
            `<option value="${plant.id}" ${this.state.filters.plant === plant.id ? 'selected' : ''}>${plant.name}</option>`
        ).join('');
    },
    
    // Get pulp type options for filter dropdown
    getPulpTypeOptions: function() {
        const pulpTypes = this.getUniquePulpTypes();
        return pulpTypes.map(type => 
            `<option value="${type}" ${this.state.filters.pulpType === type ? 'selected' : ''}>${type}</option>`
        ).join('');
    },
    
    // Get unique pulp types from inventory
    getUniquePulpTypes: function() {
        const types = new Set();
        this.state.inventory.forEach(item => {
            if (item.pulpType) {
                types.add(item.pulpType);
            }
        });
        return Array.from(types).sort();
    },
    
    // Set filter input values from state
    setFilterInputs: function() {
        const plantSelect = document.getElementById('filter-plant');
        const pulpTypeSelect = document.getElementById('filter-pulp-type');
        const searchInput = document.getElementById('filter-search');
        
        if (plantSelect) {
            plantSelect.value = this.state.filters.plant;
        }
        
        if (pulpTypeSelect) {
            pulpTypeSelect.value = this.state.filters.pulpType;
        }
        
        if (searchInput) {
            searchInput.value = this.state.filters.search;
        }
    },
    
    // Update filters from input values
    updateFiltersFromInputs: function() {
        const plantSelect = document.getElementById('filter-plant');
        const pulpTypeSelect = document.getElementById('filter-pulp-type');
        const searchInput = document.getElementById('filter-search');
        
        if (plantSelect) {
            this.state.filters.plant = plantSelect.value;
        }
        
        if (pulpTypeSelect) {
            this.state.filters.pulpType = pulpTypeSelect.value;
        }
        
        if (searchInput) {
            this.state.filters.search = searchInput.value;
        }
    },
    
    // Reset all filters
    resetFilters: function() {
        this.state.filters = {
            plant: '',
            pulpType: '',
            search: ''
        };
        
        this.applyFilters();
    },
    
    // Calculate total inventory quantity
    getTotalInventory: function() {
        return this.state.inventory.reduce((total, item) => total + item.quantity, 0);
    },
    
    // Calculate inventory value (mock calculation)
    getInventoryValue: function() {
        // Mock average pulp price of ₹50,000 per MT
        const averagePulpPrice = 50000;
        return this.getTotalInventory() * averagePulpPrice;
    },
    
    // Count low stock items
    getLowStockCount: function() {
        return this.state.inventory.filter(item => item.availableQuantity <= item.reorderPoint).length;
    },
    
    // Calculate total daily consumption
    getDailyConsumption: function() {
        return this.state.inventory.reduce((total, item) => total + (item.dailyConsumption || 0), 0);
    }
};
