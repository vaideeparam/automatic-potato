/**
 * Customs & Logistics Management for Pulp Procurement Control Tower
 * This file handles the Customs & Logistics tab functionality.
 */

const CUSTOMS = {
    // Current state
    state: {
        customs: [],
        filteredCustoms: [],
        currentPage: 1,
        pageSize: CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
        filters: {
            plant: '',
            status: '',
            search: ''
        },
        sort: {
            field: 'arrivalDate',
            ascending: false
        },
        selectedCustoms: null,
        detailsMode: false
    },
    
    // Initialize customs module
    init: function() {
        // Set page size from user preferences
        const userPreferences = DATA.getUserPreferences();
        this.state.pageSize = userPreferences.pageSize || CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
        
        // Load customs data
        this.loadCustoms();
        
        console.log('Customs module initialized');
    },
    
    // Load customs data
    loadCustoms: function() {
        // Get customs with current filters
        this.state.customs = DATA.getCustoms();
        this.applyFilters();
    },
    
    // Apply filters to customs
    applyFilters: function() {
        this.state.filteredCustoms = DATA.getCustoms(this.state.filters);
        
        // Apply sorting
        if (this.state.sort.field) {
            this.state.filteredCustoms = HELPERS.sortArray(
                this.state.filteredCustoms,
                this.state.sort.field,
                this.state.sort.ascending
            );
        }
        
        // Reset to first page when filters change
        this.state.currentPage = 1;
        
        // If in details mode, check if selected customs still matches filters
        if (this.state.detailsMode && this.state.selectedCustoms) {
            const stillExists = this.state.filteredCustoms.some(c => c.id === this.state.selectedCustoms.id);
            
            if (!stillExists) {
                // Exit details mode if filtered out
                this.state.detailsMode = false;
                this.state.selectedCustoms = null;
            }
        }
    },
    
    // Render the customs tab
    renderTab: function() {
        const contentContainer = document.getElementById('tab-content-container');
        
        // Check if in details mode
        if (this.state.detailsMode && this.state.selectedCustoms) {
            this.renderCustomsDetails(contentContainer);
        } else {
            this.renderCustomsList(contentContainer);
        }
    },
    
    // Render the customs list view
    renderCustomsList: function(container) {
        // Calculate pagination values
        const totalItems = this.state.filteredCustoms.length;
        const totalPages = Math.ceil(totalItems / this.state.pageSize);
        const startIndex = (this.state.currentPage - 1) * this.state.pageSize;
        const endIndex = Math.min(startIndex + this.state.pageSize, totalItems);
        const currentPageItems = this.state.filteredCustoms.slice(startIndex, endIndex);
        
        // Prepare HTML content
        let content = `
            <!-- Dashboard Cards -->
            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Open Customs Cases</div>
                    </div>
                    <div class="card-value">${this.state.customs.filter(c => c.status === 'in-progress').length}</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Duty Pending</div>
                    </div>
                    <div class="card-value">${this.state.customs.filter(c => !c.dutyPaid).length}</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Total Duty Amount</div>
                    </div>
                    <div class="card-value">${HELPERS.formatCurrency(this.getTotalDutyAmount())}</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Containers in Process</div>
                    </div>
                    <div class="card-value">${this.getTotalContainers()}</div>
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
                        <span class="filter-label">Status:</span>
                        <select class="filter-control" id="filter-status">
                            <option value="">All Status</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <span class="filter-label">Search:</span>
                        <input type="text" class="filter-control" id="filter-search" placeholder="Search by BL, Reference...">
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
            
            <!-- Customs Table -->
            <div class="section-header">
                <h2 class="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    Customs & Logistics
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button class="filter-btn" id="export-customs">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export
                    </button>
                    <button class="add-btn" id="add-customs-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add New Entry
                    </button>
                </div>
            </div>
            
            <table class="data-table" id="customs-table">
                <thead>
                    <tr>
                        <th class="sortable" data-sort="id">ID</th>
                        <th class="sortable" data-sort="blNumber">BL Number</th>
                        <th class="sortable" data-sort="plantName">Plant</th>
                        <th class="sortable" data-sort="chaName">CHA</th>
                        <th class="sortable" data-sort="arrivalDate">Arrival Date</th>
                        <th class="sortable" data-sort="customsReference">Customs Reference</th>
                        <th class="sortable" data-sort="billOfEntryDate">BOE Date</th>
                        <th class="sortable" data-sort="dutyAmount">Duty Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Add customs rows
        if (currentPageItems.length === 0) {
            content += `
                <tr>
                    <td colspan="10" style="text-align: center;">No customs entries found matching the filters</td>
                </tr>
            `;
        } else {
            currentPageItems.forEach(item => {
                content += `
                    <tr data-id="${item.id}">
                        <td>${item.id}</td>
                        <td>${item.blNumber}</td>
                        <td>${item.plantId}</td>
                        <td>${item.chaName}</td>
                        <td>${HELPERS.formatDate(item.arrivalDate)}</td>
                        <td>${item.customsReference}</td>
                        <td>${item.billOfEntryDate ? HELPERS.formatDate(item.billOfEntryDate) : 'Pending'}</td>
                        <td>${HELPERS.formatCurrency(item.dutyAmount)}</td>
                        <td>
                            <span class="status-pill ${item.status === 'in-progress' ? 'status-in-transit' : 'status-delivered'}">
                                ${item.status === 'in-progress' ? 'In Progress' : 'Completed'}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn edit-customs" data-id="${item.id}" title="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button class="action-btn view-customs" data-id="${item.id}" title="View Details">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                                <button class="action-btn update-status" data-id="${item.id}" title="Update Status">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="9 11 12 14 22 4"></polyline>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
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
    
    // Render customs details view
    renderCustomsDetails: function(container) {
        const item = this.state.selectedCustoms;
        
        // Prepare HTML content
        let content = `
            <!-- Back button -->
            <div style="margin-bottom: 20px;">
                <button class="filter-btn" id="back-to-list">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Customs List
                </button>
            </div>
            
            <!-- Customs Header -->
            <div class="section-header">
                <h2 class="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    Customs Details: ${item.blNumber}
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button class="filter-btn" id="edit-customs-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="add-btn" id="update-status-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                        Update Status
                    </button>
                </div>
            </div>
            
            <!-- Status and Summary -->
            <div class="summary-boxes">
                <div class="summary-box">
                    <div class="summary-title">Current Status</div>
                    <div>
                        <span class="status-pill ${item.status === 'in-progress' ? 'status-in-transit' : 'status-delivered'}">
                            ${item.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                    </div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Duty Payment</div>
                    <div>
                        <span class="status-pill ${item.dutyPaid ? 'status-delivered' : 'status-delayed'}">
                            ${item.dutyPaid ? 'Paid' : 'Pending'}
                        </span>
                    </div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Duty Amount</div>
                    <div class="summary-value">${HELPERS.formatCurrency(item.dutyAmount)}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Containers</div>
                    <div class="summary-value">${item.containers ? item.containers.length : 0}</div>
                </div>
            </div>
            
            <!-- Shipment Details -->
            <div class="detail-section">
                <h3 class="detail-title">Shipment Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Customs ID</div>
                        <div class="detail-value">${item.id}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Shipment ID</div>
                        <div class="detail-value">${item.shipmentId}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">BL Number</div>
                        <div class="detail-value">${item.blNumber}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Plant</div>
                        <div class="detail-value">${item.plantId}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Arrival Date</div>
                        <div class="detail-value">${HELPERS.formatDate(item.arrivalDate)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">CHA</div>
                        <div class="detail-value">${item.chaName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">CFS</div>
                        <div class="detail-value">${item.cfsName}</div>
                    </div>
                </div>
            </div>
            
            <!-- Customs Information -->
            <div class="detail-section">
                <h3 class="detail-title">Customs Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Customs Reference</div>
                        <div class="detail-value">${item.customsReference}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Import General Manifest</div>
                        <div class="detail-value">${item.importGeneralManifest}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Bill of Entry Date</div>
                        <div class="detail-value">${item.billOfEntryDate ? HELPERS.formatDate(item.billOfEntryDate) : 'Pending'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Bill of Entry Number</div>
                        <div class="detail-value">${item.billOfEntryNumber || 'Pending'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Duty Amount</div>
                        <div class="detail-value">${HELPERS.formatCurrency(item.dutyAmount)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Duty Status</div>
                        <div class="detail-value">${item.dutyPaid ? 'Paid' : 'Pending'}</div>
                    </div>
                </div>
            </div>
            
            <!-- Container Information -->
            <div class="detail-section">
                <h3 class="detail-title">Container Information</h3>
                ${!item.containers || item.containers.length === 0 ? 
                    '<p>No container information available</p>' : 
                    `<table class="data-table">
                        <thead>
                            <tr>
                                <th>Container Number</th>
                                <th>Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${item.containers.map(container => `
                                <tr>
                                    <td>${container.number}</td>
                                    <td>${container.type}</td>
                                    <td>
                                        <span class="status-pill status-${container.status === 'at-port' ? 'at-port' : 
                                                                            container.status === 'in-customs' ? 'in-customs' : 
                                                                            container.status === 'in-cfs' ? 'in-cfs' : 'delivered'}">
                                            ${HELPERS.toTitleCase(container.status.replace(/-/g, ' '))}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>`
                }
            </div>
            
            <!-- Transport Information -->
            <div class="detail-section">
                <h3 class="detail-title">Transport Information</h3>
                ${!item.transporters || item.transporters.length === 0 ? 
                    '<p>No transport information available</p>' : 
                    `<table class="data-table">
                        <thead>
                            <tr>
                                <th>Transporter</th>
                                <th>Vehicle Number</th>
                                <th>Capacity (MT)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${item.transporters.map(transporter => 
                                transporter.vehicles.map(vehicle => `
                                    <tr>
                                        <td>${transporter.name}</td>
                                        <td>${vehicle.number}</td>
                                        <td>${vehicle.capacity}</td>
                                    </tr>
                                `).join('')
                            ).join('')}
                        </tbody>
                    </table>`
                }
            </div>
            
            <!-- Timeline -->
            <div class="detail-section">
                <h3 class="detail-title">Process Timeline</h3>
                ${!item.timeline || item.timeline.length === 0 ? 
                    '<p>No timeline information available</p>' : 
                    `<div class="timeline">
                        ${item.timeline.map(event => `
                            <div class="timeline-item">
                                <div class="timeline-icon ${event.status === 'completed' ? 'complete' : 
                                                            event.status === 'in-progress' ? 'current' : 'pending'}">
                                    ${event.status === 'completed' ? 
                                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : 
                                        event.status === 'in-progress' ? 
                                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' : 
                                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>'
                                    }
                                </div>
                                <div class="timeline-content">
                                    <div class="timeline-header">
                                        <div class="timeline-title">${event.event}</div>
                                        <div class="timeline-date">${HELPERS.formatDate(event.date)}</div>
                                    </div>
                                    <div class="timeline-description">
                                        ${event.status === 'completed' ? 'Completed' : 
                                          event.status === 'in-progress' ? 'In Progress' : 'Pending'}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`
                }
            </div>
        `;
        
        // Set the content
        container.innerHTML = content;
        
        // Set up event handlers
        document.getElementById('back-to-list').addEventListener('click', () => {
            this.state.detailsMode = false;
            this.state.selectedCustoms = null;
            this.renderTab();
        });
        
        document.getElementById('edit-customs-btn').addEventListener('click', () => {
            UI.notification.info(`Edit form for customs entry ${item.id} would be displayed here (simulation)`);
        });
        
        document.getElementById('update-status-btn').addEventListener('click', () => {
            UI.notification.info(`Status update form for customs entry ${item.id} would be displayed here (simulation)`);
        });
    },
    
    // Set up event handlers
    setupEventHandlers: function() {
        // Add customs button
        const addCustomsBtn = document.getElementById('add-customs-btn');
        if (addCustomsBtn) {
            addCustomsBtn.addEventListener('click', () => {
                UI.notification.info('Add customs entry form would be displayed here (simulation)');
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('export-customs');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                UI.notification.success('Customs data exported successfully (simulation)');
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
        const sortableHeaders = document.querySelectorAll('#customs-table th.sortable');
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
        
        // View, edit, and update status buttons
        const viewBtns = document.querySelectorAll('.view-customs');
        const editBtns = document.querySelectorAll('.edit-customs');
        const updateBtns = document.querySelectorAll('.update-status');
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.viewCustomsDetails(id);
            });
        });
        
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                UI.notification.info(`Edit form for customs entry ${id} would be displayed here (simulation)`);
            });
        });
        
        updateBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                UI.notification.info(`Status update form for customs entry ${id} would be displayed here (simulation)`);
            });
        });
        
        // Table row click for details view
        const tableRows = document.querySelectorAll('#customs-table tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('click', (e) => {
                // Only trigger if not clicking an action button
                if (!e.target.closest('.action-buttons')) {
                    const id = row.getAttribute('data-id');
                    if (id) {
                        this.viewCustomsDetails(id);
                    }
                }
            });
        });
        
        // Set filter inputs from state
        this.setFilterInputs();
    },
    
    // View customs details
    viewCustomsDetails: function(id) {
        // Find the customs entry in the list
        const customs = this.state.customs.find(c => c.id === id);
        
        if (customs) {
            this.state.selectedCustoms = customs;
            this.state.detailsMode = true;
            this.renderTab();
        } else {
            UI.notification.error('Customs entry not found');
        }
    },
    
    // Get plant options for filter dropdown
    getPlantOptions: function() {
        const plants = DATA.getPlants();
        return plants.map(plant => 
            `<option value="${plant.id}" ${this.state.filters.plant === plant.id ? 'selected' : ''}>${plant.name}</option>`
        ).join('');
    },
    
    // Set filter input values from state
    setFilterInputs: function() {
        const plantSelect = document.getElementById('filter-plant');
        const statusSelect = document.getElementById('filter-status');
        const searchInput = document.getElementById('filter-search');
        
        if (plantSelect) {
            plantSelect.value = this.state.filters.plant;
        }
        
        if (statusSelect) {
            statusSelect.value = this.state.filters.status;
        }
        
        if (searchInput) {
            searchInput.value = this.state.filters.search;
        }
    },
    
    // Update filters from input values
    updateFiltersFromInputs: function() {
        const plantSelect = document.getElementById('filter-plant');
        const statusSelect = document.getElementById('filter-status');
        const searchInput = document.getElementById('filter-search');
        
        if (plantSelect) {
            this.state.filters.plant = plantSelect.value;
        }
        
        if (statusSelect) {
            this.state.filters.status = statusSelect.value;
        }
        
        if (searchInput) {
            this.state.filters.search = searchInput.value;
        }
    },
    
    // Reset all filters
    resetFilters: function() {
        this.state.filters = {
            plant: '',
            status: '',
            search: ''
        };
        
        this.applyFilters();
    },
    
    // Calculate total duty amount
    getTotalDutyAmount: function() {
        return this.state.customs.reduce((total, item) => total + (item.dutyAmount || 0), 0);
    },
    
    // Calculate total containers
    getTotalContainers: function() {
        return this.state.customs.reduce((total, item) => {
            if (item.containers && Array.isArray(item.containers)) {
                return total + item.containers.length;
            }
            return total;
        }, 0);
    }
};
