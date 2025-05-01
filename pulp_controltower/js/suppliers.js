/**
 * Supplier Management for Pulp Procurement Control Tower
 * This file handles the Supplier Management tab functionality.
 */

const SUPPLIERS = {
    // Current state
    state: {
        suppliers: [],
        filteredSuppliers: [],
        currentPage: 1,
        pageSize: CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
        filters: {
            country: '',
            search: ''
        },
        sort: {
            field: 'name',
            ascending: true
        },
        selectedSupplier: null,
        detailsMode: false
    },
    
    // Initialize supplier management module
    init: function() {
        // Set page size from user preferences
        const userPreferences = DATA.getUserPreferences();
        this.state.pageSize = userPreferences.pageSize || CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
        
        // Load suppliers data
        this.loadSuppliers();
        
        console.log('Suppliers module initialized');
    },
    
    // Load suppliers data
    loadSuppliers: function() {
        // Get suppliers with current filters and sort
        this.state.suppliers = DATA.getSuppliers();
        this.applyFilters();
    },
    
    // Apply filters to suppliers
    applyFilters: function() {
        let filteredSuppliers = [...this.state.suppliers];
        
        // Apply country filter
        if (this.state.filters.country) {
            filteredSuppliers = filteredSuppliers.filter(s => s.country === this.state.filters.country);
        }
        
        // Apply search filter
        if (this.state.filters.search) {
            const searchFields = ['id', 'name', 'contactName', 'contactEmail', 'country'];
            filteredSuppliers = HELPERS.filterArray(filteredSuppliers, this.state.filters.search, searchFields);
        }
        
        // Apply sorting
        filteredSuppliers = HELPERS.sortArray(filteredSuppliers, this.state.sort.field, this.state.sort.ascending);
        
        this.state.filteredSuppliers = filteredSuppliers;
        
        // Reset to first page when filters change
        this.state.currentPage = 1;
        
        // If in details mode, check if selected supplier still matches filters
        if (this.state.detailsMode && this.state.selectedSupplier) {
            const stillExists = this.state.filteredSuppliers.some(s => s.id === this.state.selectedSupplier.id);
            
            if (!stillExists) {
                // Exit details mode if filtered out
                this.state.detailsMode = false;
                this.state.selectedSupplier = null;
            }
        }
    },
    
    // Render the supplier management tab
    renderTab: function() {
        const contentContainer = document.getElementById('tab-content-container');
        
        // Check if in details mode
        if (this.state.detailsMode && this.state.selectedSupplier) {
            this.renderSupplierDetails(contentContainer);
        } else {
            this.renderSuppliersList(contentContainer);
        }
    },
    
    // Render the suppliers list view
    renderSuppliersList: function(container) {
        // Calculate pagination values
        const totalItems = this.state.filteredSuppliers.length;
        const totalPages = Math.ceil(totalItems / this.state.pageSize);
        const startIndex = (this.state.currentPage - 1) * this.state.pageSize;
        const endIndex = Math.min(startIndex + this.state.pageSize, totalItems);
        const currentPageItems = this.state.filteredSuppliers.slice(startIndex, endIndex);
        
        // Prepare HTML content
        let content = `
            <!-- Dashboard Cards -->
            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Total Suppliers</div>
                    </div>
                    <div class="card-value">${this.state.suppliers.length}</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Active Contracts</div>
                    </div>
                    <div class="card-value">${this.state.suppliers.filter(s => s.activeContract).length}</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Average Rating</div>
                    </div>
                    <div class="card-value">${this.getAverageRating().toFixed(1)}</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Countries</div>
                    </div>
                    <div class="card-value">${this.getUniqueCountries().length}</div>
                </div>
            </div>
            
            <!-- Filter Section -->
            <div class="filter-section">
                <div class="filter-row">
                    <div class="filter-group">
                        <span class="filter-label">Country:</span>
                        <select class="filter-control" id="filter-country">
                            <option value="">All Countries</option>
                            ${this.getCountryOptions()}
                        </select>
                    </div>
                    <div class="filter-group">
                        <span class="filter-label">Search:</span>
                        <input type="text" class="filter-control" id="filter-search" placeholder="Search suppliers...">
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
            
            <!-- Supplier List Section -->
            <div class="section-header">
                <h2 class="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Supplier Management
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button class="filter-btn" id="export-suppliers">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export
                    </button>
                    <button class="add-btn" id="add-supplier-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add New Supplier
                    </button>
                </div>
            </div>
            
            <table class="data-table" id="suppliers-table">
                <thead>
                    <tr>
                        <th class="sortable" data-sort="id">Supplier ID</th>
                        <th class="sortable" data-sort="name">Name</th>
                        <th class="sortable" data-sort="country">Country</th>
                        <th class="sortable" data-sort="contactName">Contact Person</th>
                        <th class="sortable" data-sort="paymentTerms">Payment Terms</th>
                        <th class="sortable" data-sort="activeContract">Contract Status</th>
                        <th class="sortable" data-sort="rating">Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Add supplier rows
        if (currentPageItems.length === 0) {
            content += `
                <tr>
                    <td colspan="8" style="text-align: center;">No suppliers found matching the filters</td>
                </tr>
            `;
        } else {
            currentPageItems.forEach(supplier => {
                content += `
                    <tr data-id="${supplier.id}">
                        <td>${supplier.id}</td>
                        <td>${supplier.name}</td>
                        <td>${supplier.country}</td>
                        <td>${supplier.contactName}</td>
                        <td>${supplier.paymentTerms}</td>
                        <td>
                            <span class="status-pill ${supplier.activeContract ? 'status-delivered' : 'status-delayed'}">
                                ${supplier.activeContract ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td>${supplier.rating} / 5</td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn edit-supplier" data-id="${supplier.id}" title="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button class="action-btn view-supplier" data-id="${supplier.id}" title="View Details">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                                <button class="action-btn delete-supplier" data-id="${supplier.id}" title="Delete">
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
        container.innerHTML = content;
        
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
            
            container.appendChild(paginationContainer);
        }
        
        // Set up event handlers
        this.setupEventHandlers();
    },
    
    // Render supplier details view
    renderSupplierDetails: function(container) {
        const supplier = this.state.selectedSupplier;
        
        // Get supplier shipments data
        const supplierShipments = DATA.getShipments({ supplier: supplier.id });
        
        // Calculate some stats
        const totalShipments = supplierShipments.length;
        const totalQuantity = supplierShipments.reduce((sum, s) => sum + s.quantity, 0);
        
        // Prepare HTML content
        let content = `
            <!-- Back button -->
            <div style="margin-bottom: 20px;">
                <button class="filter-btn" id="back-to-list">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Suppliers
                </button>
            </div>
            
            <!-- Supplier Header -->
            <div class="section-header">
                <h2 class="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Supplier Details: ${supplier.name}
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button class="filter-btn" id="edit-details-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="add-btn" id="new-shipment-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Shipment
                    </button>
                </div>
            </div>
            
            <!-- Status and Summary -->
            <div class="summary-boxes">
                <div class="summary-box">
                    <div class="summary-title">Contract Status</div>
                    <div>
                        <span class="status-pill ${supplier.activeContract ? 'status-delivered' : 'status-delayed'}">
                            ${supplier.activeContract ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Total Shipments</div>
                    <div class="summary-value">${totalShipments}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Total Quantity</div>
                    <div class="summary-value">${HELPERS.formatNumber(totalQuantity)} MT</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Rating</div>
                    <div class="summary-value">${supplier.rating} / 5</div>
                </div>
            </div>
            
            <!-- Supplier Details -->
            <div class="detail-section">
                <h3 class="detail-title">Supplier Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Supplier ID</div>
                        <div class="detail-value">${supplier.id}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Company Name</div>
                        <div class="detail-value">${supplier.name}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Country</div>
                        <div class="detail-value">${supplier.country}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Address</div>
                        <div class="detail-value">${supplier.address || 'Not provided'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Contact Person</div>
                        <div class="detail-value">${supplier.contactName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Contact Email</div>
                        <div class="detail-value">${supplier.contactEmail}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Contact Phone</div>
                        <div class="detail-value">${supplier.contactPhone}</div>
                    </div>
                </div>
            </div>
            
            <!-- Contract Information -->
            <div class="detail-section">
                <h3 class="detail-title">Contract Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Contract Status</div>
                        <div class="detail-value">${supplier.activeContract ? 'Active' : 'Inactive'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Contract Start</div>
                        <div class="detail-value">${HELPERS.formatDate(supplier.contractStart)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Contract End</div>
                        <div class="detail-value">${HELPERS.formatDate(supplier.contractEnd)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Payment Terms</div>
                        <div class="detail-value">${supplier.paymentTerms}</div>
                    </div>
                </div>
            </div>
            
            <!-- Product Information -->
            <div class="detail-section">
                <h3 class="detail-title">Product Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Pulp Types</div>
                        <div class="detail-value">${supplier.pulpTypes ? supplier.pulpTypes.join(', ') : 'Not specified'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Shipping Ports</div>
                        <div class="detail-value">${supplier.shippingPorts ? supplier.shippingPorts.join(', ') : 'Not specified'}</div>
                    </div>
                </div>
            </div>
            
            <!-- Notes -->
            <div class="detail-section">
                <h3 class="detail-title">Notes</h3>
                <p>${supplier.notes || 'No notes available'}</p>
            </div>
            
            <!-- Recent Shipments -->
            <div class="detail-section">
                <h3 class="detail-title">Recent Shipments</h3>
                ${supplierShipments.length === 0 ? '<p>No shipments found for this supplier</p>' : ''}
                ${supplierShipments.length > 0 ? `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Shipment ID</th>
                            <th>BL Number</th>
                            <th>Vessel Name</th>
                            <th>Quantity (MT)</th>
                            <th>Shipment Date</th>
                            <th>ETA</th>
                            <th>Plant</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${supplierShipments.slice(0, 5).map(shipment => `
                            <tr data-id="${shipment.id}" class="shipment-row">
                                <td>${shipment.id}</td>
                                <td>${shipment.blNumber}</td>
                                <td>${shipment.vesselName}</td>
                                <td>${HELPERS.formatNumber(shipment.quantity)}</td>
                                <td>${HELPERS.formatDate(shipment.shipmentDate)}</td>
                                <td>${HELPERS.formatDate(shipment.eta)}</td>
                                <td>${shipment.plantName}</td>
                                <td>${UI.createStatusPill(shipment.status)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${supplierShipments.length > 5 ? `<div style="text-align: center; margin-top: 10px;"><button class="filter-btn" id="view-all-shipments">View All ${supplierShipments.length} Shipments</button></div>` : ''}
                ` : ''}
            </div>
        `;
        
        // Set the content
        container.innerHTML = content;
        
        // Set up event handlers
        document.getElementById('back-to-list').addEventListener('click', () => {
            this.state.detailsMode = false;
            this.state.selectedSupplier = null;
            this.renderTab();
        });
        
        document.getElementById('edit-details-btn').addEventListener('click', () => {
            this.showEditSupplierForm(supplier.id);
        });
        
        document.getElementById('new-shipment-btn').addEventListener('click', () => {
            // Switch to shipments tab and open new shipment form with this supplier preselected
            UI.tabs.switchTo('shipment-tracking');
            
            // Allow time for tab switch to complete
            setTimeout(() => {
                if (typeof SHIPMENTS !== 'undefined' && SHIPMENTS.showAddShipmentForm) {
                    SHIPMENTS.showAddShipmentForm(supplier.id);
                }
            }, 500);
        });
        
        // Add click handlers for shipment rows
        const shipmentRows = document.querySelectorAll('.shipment-row');
        shipmentRows.forEach(row => {
            row.addEventListener('click', () => {
                const shipmentId = row.getAttribute('data-id');
                
                // Switch to shipments tab and open shipment details
                UI.tabs.switchTo('shipment-tracking');
                
                // Allow time for tab switch to complete
                setTimeout(() => {
                    if (typeof SHIPMENTS !== 'undefined' && SHIPMENTS.viewShipmentDetails) {
                        SHIPMENTS.viewShipmentDetails(shipmentId);
                    }
                }, 500);
            });
        });
        
        // Add click handler for view all shipments button
        const viewAllBtn = document.getElementById('view-all-shipments');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                // Switch to shipments tab with this supplier filter applied
                UI.tabs.switchTo('shipment-tracking');
                
                // Allow time for tab switch to complete
                setTimeout(() => {
                    if (typeof SHIPMENTS !== 'undefined') {
                        // Set supplier filter and apply
                        SHIPMENTS.state.filters.supplier = supplier.id;
                        SHIPMENTS.applyFilters();
                        SHIPMENTS.renderTab();
                    }
                }, 500);
            });
        }
    },
    
    // Set up event handlers for the suppliers list view
    setupEventHandlers: function() {
        // Add supplier button
        const addSupplierBtn = document.getElementById('add-supplier-btn');
        if (addSupplierBtn) {
            addSupplierBtn.addEventListener('click', () => {
                this.showAddSupplierForm();
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('export-suppliers');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportSuppliers();
            });
        }
        
        // Table row click for details view
        const tableRows = document.querySelectorAll('#suppliers-table tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('click', (e) => {
                // Only trigger if not clicking an action button
                if (!e.target.closest('.action-buttons')) {
                    const id = row.getAttribute('data-id');
                    this.viewSupplierDetails(id);
                }
            });
        });
        
        // View supplier buttons
        const viewBtns = document.querySelectorAll('.view-supplier');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.viewSupplierDetails(id);
            });
        });
        
        // Edit supplier buttons
        const editBtns = document.querySelectorAll('.edit-supplier');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.showEditSupplierForm(id);
            });
        });
        
        // Delete supplier buttons
        const deleteBtns = document.querySelectorAll('.delete-supplier');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.showDeleteConfirmation(id);
            });
        });
        
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
        
        // Search input - apply filters on Enter key
        const searchInput = document.getElementById('filter-search');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.updateFiltersFromInputs();
                    this.applyFilters();
                    this.renderTab();
                }
            });
        }
        
        // Table header sort
        const sortableHeaders = document.querySelectorAll('#suppliers-table th.sortable');
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
        
        // Set initial filter values from state
        this.setFilterInputs();
    },
    
    // Show supplier details
    viewSupplierDetails: function(id) {
        const supplier = DATA.getSupplierById(id);
        
        if (supplier) {
            this.state.selectedSupplier = supplier;
            this.state.detailsMode = true;
            this.renderTab();
        } else {
            UI.notification.error('Supplier not found');
        }
    },
    
    // Show form to add a new supplier
    showAddSupplierForm: function() {
        UI.modal.form({
            title: 'Add New Supplier',
            fields: [
                {
                    id: 'name',
                    label: 'Company Name',
                    type: 'text',
                    required: true,
                    row: 1
                },
                {
                    id: 'country',
                    label: 'Country',
                    type: 'text',
                    required: true,
                    row: 1
                },
                {
                    id: 'contactName',
                    label: 'Contact Person',
                    type: 'text',
                    required: true,
                    row: 2
                },
                {
                    id: 'contactEmail',
                    label: 'Contact Email',
                    type: 'email',
                    required: true,
                    row: 2
                },
                {
                    id: 'contactPhone',
                    label: 'Contact Phone',
                    type: 'text',
                    row: 3
                },
                {
                    id: 'paymentTerms',
                    label: 'Payment Terms',
                    type: 'text',
                    row: 3,
                    placeholder: 'e.g. Net 60'
                },
                {
                    id: 'activeContract',
                    type: 'checkbox',
                    checkboxLabel: 'Active Contract',
                    value: true,
                    row: 4
                },
                {
                    id: 'contractStart',
                    label: 'Contract Start Date',
                    type: 'date',
                    row: 5
                },
                {
                    id: 'contractEnd',
                    label: 'Contract End Date',
                    type: 'date',
                    row: 5
                },
                {
                    id: 'pulpTypes',
                    label: 'Pulp Types (comma-separated)',
                    type: 'text',
                    row: 6,
                    placeholder: 'e.g. Eucalyptus, Radiata Pine'
                },
                {
                    id: 'rating',
                    label: 'Rating (1-5)',
                    type: 'number',
                    min: 1,
                    max: 5,
                    step: 0.1,
                    row: 6,
                    value: 4.0
                },
                {
                    id: 'address',
                    label: 'Address',
                    type: 'textarea',
                    row: 7
                },
                {
                    id: 'notes',
                    label: 'Notes',
                    type: 'textarea',
                    row: 8
                }
            ],
            submitText: 'Add Supplier'
        }).then(formData => {
            if (formData) {
                // Process form data
                
                // Generate ID if not provided
                formData.id = 'SUP-' + HELPERS.generateId();
                
                // Convert string fields to arrays
                if (formData.pulpTypes) {
                    formData.pulpTypes = formData.pulpTypes.split(',').map(type => type.trim());
                }
                
                // Convert numeric fields
                formData.rating = parseFloat(formData.rating);
                
                // TODO: Add the supplier (mock implementation)
                UI.notification.success('Supplier added successfully (simulated)');
                
                // In a real application, you would add the supplier to the database
                // For now, we'll simulate the addition
                this.loadSuppliers();
                this.renderTab();
            }
        });
    },
    
    // Show form to edit an existing supplier
    showEditSupplierForm: function(id) {
        const supplier = DATA.getSupplierById(id);
        
        if (!supplier) {
            UI.notification.error('Supplier not found');
            return;
        }
        
        // Prepare pulp types for form
        const pulpTypesStr = supplier.pulpTypes ? supplier.pulpTypes.join(', ') : '';
        
        UI.modal.form({
            title: 'Edit Supplier',
            fields: [
                {
                    id: 'name',
                    label: 'Company Name',
                    type: 'text',
                    required: true,
                    value: supplier.name,
                    row: 1
                },
                {
                    id: 'country',
                    label: 'Country',
                    type: 'text',
                    required: true,
                    value: supplier.country,
                    row: 1
                },
                {
                    id: 'contactName',
                    label: 'Contact Person',
                    type: 'text',
                    required: true,
                    value: supplier.contactName,
                    row: 2
                },
                {
                    id: 'contactEmail',
                    label: 'Contact Email',
                    type: 'email',
                    required: true,
                    value: supplier.contactEmail,
                    row: 2
                },
                {
                    id: 'contactPhone',
                    label: 'Contact Phone',
                    type: 'text',
                    value: supplier.contactPhone,
                    row: 3
                },
                {
                    id: 'paymentTerms',
                    label: 'Payment Terms',
                    type: 'text',
                    value: supplier.paymentTerms,
                    row: 3
                },
                {
                    id: 'activeContract',
                    type: 'checkbox',
                    checkboxLabel: 'Active Contract',
                    value: supplier.activeContract,
                    row: 4
                },
                {
                    id: 'contractStart',
                    label: 'Contract Start Date',
                    type: 'date',
                    value: HELPERS.formatDate(supplier.contractStart, CONFIG.DATE_FORMAT.INPUT),
                    row: 5
                },
                {
                    id: 'contractEnd',
                    label: 'Contract End Date',
                    type: 'date',
                    value: HELPERS.formatDate(supplier.contractEnd, CONFIG.DATE_FORMAT.INPUT),
                    row: 5
                },
                {
                    id: 'pulpTypes',
                    label: 'Pulp Types (comma-separated)',
                    type: 'text',
                    value: pulpTypesStr,
                    row: 6
                },
                {
                    id: 'rating',
                    label: 'Rating (1-5)',
                    type: 'number',
                    min: 1,
                    max: 5,
                    step: 0.1,
                    value: supplier.rating,
                    row: 6
                },
                {
                    id: 'address',
                    label: 'Address',
                    type: 'textarea',
                    value: supplier.address,
                    row: 7
                },
                {
                    id: 'notes',
                    label: 'Notes',
                    type: 'textarea',
                    value: supplier.notes,
                    row: 8
                }
            ],
            submitText: 'Update Supplier'
        }).then(formData => {
            if (formData) {
                // Process form data
                
                // Convert string fields to arrays
                if (formData.pulpTypes) {
                    formData.pulpTypes = formData.pulpTypes.split(',').map(type => type.trim());
                }
                
                // Convert numeric fields
                formData.rating = parseFloat(formData.rating);
                
                // TODO: Update the supplier (mock implementation)
                UI.notification.success('Supplier updated successfully (simulated)');
                
                // In a real application, you would update the supplier in the database
                // For now, we'll simulate the update
                this.loadSuppliers();
                
                // If in details mode, update the displayed supplier
                if (this.state.detailsMode && this.state.selectedSupplier && this.state.selectedSupplier.id === id) {
                    this.state.selectedSupplier = { ...this.state.selectedSupplier, ...formData };
                }
                
                this.renderTab();
            }
        });
    },
    
    // Show confirmation dialog for deleting a supplier
    showDeleteConfirmation: function(id) {
        const supplier = DATA.getSupplierById(id);
        
        if (!supplier) {
            UI.notification.error('Supplier not found');
            return;
        }
        
        UI.modal.confirm({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete supplier <strong>${supplier.name}</strong>?<br><br>This action cannot be undone.`,
            confirmText: 'Delete',
            isDanger: true
        }).then(confirmed => {
            if (confirmed) {
                // TODO: Delete the supplier (mock implementation)
                UI.notification.success('Supplier deleted successfully (simulated)');
                
                // In a real application, you would delete the supplier from the database
                // For now, we'll simulate the deletion
                
                // Exit details mode if the deleted supplier was selected
                if (this.state.detailsMode && this.state.selectedSupplier && this.state.selectedSupplier.id === id) {
                    this.state.detailsMode = false;
                    this.state.selectedSupplier = null;
                }
                
                this.loadSuppliers();
                this.renderTab();
            }
        });
    },
    
    // Export suppliers to CSV
    exportSuppliers: function() {
        const data = this.state.filteredSuppliers.map(supplier => ({
            'Supplier ID': supplier.id,
            'Company Name': supplier.name,
            'Country': supplier.country,
            'Contact Person': supplier.contactName,
            'Contact Email': supplier.contactEmail,
            'Contact Phone': supplier.contactPhone,
            'Payment Terms': supplier.paymentTerms,
            'Active Contract': supplier.activeContract ? 'Yes' : 'No',
            'Contract Start': HELPERS.formatDate(supplier.contractStart),
            'Contract End': HELPERS.formatDate(supplier.contractEnd),
            'Pulp Types': supplier.pulpTypes ? supplier.pulpTypes.join(', ') : '',
            'Rating': supplier.rating,
            'Address': supplier.address,
            'Notes': supplier.notes
        }));
        
        HELPERS.downloadCSV(data, 'suppliers_export.csv');
        
        UI.notification.success('Suppliers exported successfully');
    },
    
    // Get country options for filter dropdown
    getCountryOptions: function() {
        const countries = this.getUniqueCountries();
        return countries.map(country => 
            `<option value="${country}" ${this.state.filters.country === country ? 'selected' : ''}>${country}</option>`
        ).join('');
    },
    
    // Get unique countries from suppliers
    getUniqueCountries: function() {
        const countries = new Set();
        this.state.suppliers.forEach(supplier => {
            if (supplier.country) {
                countries.add(supplier.country);
            }
        });
        return Array.from(countries).sort();
    },
    
    // Calculate average supplier rating
    getAverageRating: function() {
        if (this.state.suppliers.length === 0) {
            return 0;
        }
        
        const sum = this.state.suppliers.reduce((total, supplier) => total + (supplier.rating || 0), 0);
        return sum / this.state.suppliers.length;
    },
    
    // Set filter input values from state
    setFilterInputs: function() {
        const countrySelect = document.getElementById('filter-country');
        const searchInput = document.getElementById('filter-search');
        
        if (countrySelect) {
            countrySelect.value = this.state.filters.country;
        }
        
        if (searchInput) {
            searchInput.value = this.state.filters.search;
        }
    },
    
    // Update filters from input values
    updateFiltersFromInputs: function() {
        const countrySelect = document.getElementById('filter-country');
        const searchInput = document.getElementById('filter-search');
        
        if (countrySelect) {
            this.state.filters.country = countrySelect.value;
        }
        
        if (searchInput) {
            this.state.filters.search = searchInput.value;
        }
    },
    
    // Reset all filters
    resetFilters: function() {
        this.state.filters = {
            country: '',
            search: ''
        };
        
        this.applyFilters();
    }
};
