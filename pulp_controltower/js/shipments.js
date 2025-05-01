/**
 * Shipment Management for Pulp Procurement Control Tower
 * This file handles the Shipment Tracking tab functionality.
 */

const SHIPMENTS = {
    // Current state
    state: {
        shipments: [],
        filteredShipments: [],
        currentPage: 1,
        pageSize: CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
        filters: {
            supplier: '',
            plant: '',
            status: '',
            dateFrom: '',
            dateTo: '',
            search: ''
        },
        sort: {
            field: 'shipmentDate',
            ascending: false
        },
        selectedShipment: null,
        detailsMode: false
    },
    
    // Initialize shipment tracking module
    init: function() {
        // Set page size from user preferences
        const userPreferences = DATA.getUserPreferences();
        this.state.pageSize = userPreferences.pageSize || CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
        
        // Load shipments data
        this.loadShipments();
        
        // Set up refresh interval
        this.setupRefreshInterval();
        
        console.log('Shipments module initialized');
    },
    
    // Load shipments data
    loadShipments: function() {
        // Get shipments with current filters and sort
        this.state.shipments = DATA.getShipments();
        this.applyFilters();
    },
    
    // Apply filters to shipments
    applyFilters: function() {
        this.state.filteredShipments = DATA.getShipments(this.state.filters, this.state.sort);
        
        // Reset to first page when filters change
        this.state.currentPage = 1;
        
        // If in details mode, check if selected shipment still matches filters
        if (this.state.detailsMode && this.state.selectedShipment) {
            const stillExists = this.state.filteredShipments.some(s => s.id === this.state.selectedShipment.id);
            
            if (!stillExists) {
                // Exit details mode if filtered out
                this.state.detailsMode = false;
                this.state.selectedShipment = null;
            }
        }
    },
    
    // Setup refresh interval for shipments data
    setupRefreshInterval: function() {
        setInterval(() => {
            this.loadShipments();
            
            // Only re-render if on shipment tracking tab
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab && activeTab.getAttribute('data-tab') === 'shipment-tracking') {
                this.renderTab();
            }
        }, CONFIG.REFRESH_INTERVALS.SHIPMENTS);
    },
    
    // Render the shipment tracking tab
    renderTab: function() {
        const contentContainer = document.getElementById('tab-content-container');
        
        // Check if in details mode
        if (this.state.detailsMode && this.state.selectedShipment) {
            this.renderShipmentDetails(contentContainer);
        } else {
            this.renderShipmentsList(contentContainer);
        }
    },
    
    // Render the shipments list view
    renderShipmentsList: function(container) {
        // Calculate pagination values
        const totalItems = this.state.filteredShipments.length;
        const totalPages = Math.ceil(totalItems / this.state.pageSize);
        const startIndex = (this.state.currentPage - 1) * this.state.pageSize;
        const endIndex = Math.min(startIndex + this.state.pageSize, totalItems);
        const currentPageItems = this.state.filteredShipments.slice(startIndex, endIndex);
        
        // Prepare HTML content
        let content = `
            <!-- Dashboard Cards -->
            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Active Shipments</div>
                    </div>
                    <div class="card-value">${this.getShipmentCount()}</div>
                    <div class="card-footer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trend-up">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                        <span class="trend-up">+12%</span>
                        <span class="card-subtitle">from last month</span>
                    </div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Shipments at Port</div>
                    </div>
                    <div class="card-value">${this.getShipmentCountByStatus(CONFIG.STATUS_TYPES.AT_PORT)}</div>
                    <div class="card-footer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trend-down">
                            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                            <polyline points="17 18 23 18 23 12"></polyline>
                        </svg>
                        <span class="trend-down">-3%</span>
                        <span class="card-subtitle">from last month</span>
                    </div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Delayed Shipments</div>
                    </div>
                    <div class="card-value">${this.getShipmentCountByStatus(CONFIG.STATUS_TYPES.DELAYED)}</div>
                    <div class="card-footer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trend-up">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                        <span class="trend-up">+2</span>
                        <span class="card-subtitle">from last month</span>
                    </div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Total Pulp in Transit (MT)</div>
                    </div>
                    <div class="card-value">${HELPERS.formatNumber(DATA.getTotalPulpInTransit())}</div>
                    <div class="card-footer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="trend-up">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                        <span class="trend-up">+15%</span>
                        <span class="card-subtitle">from last month</span>
                    </div>
                </div>
            </div>
        `;
        
        // Check for detention risks
        const detentionRisks = DATA.getDetentionRisks();
        if (detentionRisks.length > 0) {
            const risk = detentionRisks[0]; // Show the first risk
            content += `
                <div class="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <div class="alert-content">
                        <div class="alert-title">Potential Container Detention Risk</div>
                        <div class="alert-message">
                            ${risk.containers} containers from ${risk.blNumber} at ${risk.port} for more than ${risk.daysAtPort} days.
                            Potential detention fee: ${HELPERS.formatCurrency(risk.potentialFees)}
                        </div>
                    </div>
                    <div class="alert-actions">
                        <button class="alert-btn" id="view-detention-details">View Details</button>
                        <button class="alert-btn" id="dismiss-detention">Dismiss</button>
                    </div>
                </div>
            `;
        }
        
        // Filter section
        content += `
            <div class="filter-section">
                <div class="filter-row">
                    <div class="filter-group">
                        <span class="filter-label">Supplier:</span>
                        <select class="filter-control" id="filter-supplier">
                            <option value="">All Suppliers</option>
                            ${this.getSupplierOptions()}
                        </select>
                    </div>
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
                            <option value="${CONFIG.STATUS_TYPES.IN_TRANSIT}">${HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_TRANSIT)}</option>
                            <option value="${CONFIG.STATUS_TYPES.AT_PORT}">${HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.AT_PORT)}</option>
                            <option value="${CONFIG.STATUS_TYPES.IN_CUSTOMS}">${HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_CUSTOMS)}</option>
                            <option value="${CONFIG.STATUS_TYPES.IN_CFS}">${HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_CFS)}</option>
                            <option value="${CONFIG.STATUS_TYPES.DELIVERED}">${HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.DELIVERED)}</option>
                            <option value="${CONFIG.STATUS_TYPES.DELAYED}">${HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.DELAYED)}</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <span class="filter-label">Search:</span>
                        <input type="text" class="filter-control" id="filter-search" placeholder="Search shipments...">
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
        `;
        
        // Shipment list section
        content += `
            <div class="section-header">
                <h2 class="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    Shipment Tracking
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button class="filter-btn" id="export-shipments">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export
                    </button>
                    <button class="add-btn" id="add-shipment-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add New Shipment
                    </button>
                </div>
            </div>
            
            <table class="data-table" id="shipments-table">
                <thead>
                    <tr>
                        <th class="sortable" data-sort="id">Shipment ID</th>
                        <th class="sortable" data-sort="supplierName">Supplier</th>
                        <th class="sortable" data-sort="vesselName">Vessel Name</th>
                        <th class="sortable" data-sort="blNumber">BL Number</th>
                        <th class="sortable" data-sort="quantity">Quantity (MT)</th>
                        <th class="sortable" data-sort="originPort">Origin Port</th>
                        <th class="sortable" data-sort="shipmentDate">Shipment Date</th>
                        <th class="sortable" data-sort="eta">ETA</th>
                        <th class="sortable" data-sort="plantName">Plant</th>
                        <th class="sortable" data-sort="status">Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Add shipment rows
        if (currentPageItems.length === 0) {
            content += `
                <tr>
                    <td colspan="11" style="text-align: center;">No shipments found matching the filters</td>
                </tr>
            `;
        } else {
            currentPageItems.forEach(shipment => {
                content += `
                    <tr data-id="${shipment.id}">
                        <td>${shipment.id}</td>
                        <td>${shipment.supplierName}</td>
                        <td>${shipment.vesselName}</td>
                        <td>${shipment.blNumber}</td>
                        <td>${HELPERS.formatNumber(shipment.quantity)}</td>
                        <td>${shipment.originPort}</td>
                        <td>${HELPERS.formatDate(shipment.shipmentDate)}</td>
                        <td>${HELPERS.formatDate(shipment.eta)}</td>
                        <td>${shipment.plantName}</td>
                        <td>${UI.createStatusPill(shipment.status)}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn edit-shipment" data-id="${shipment.id}" title="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button class="action-btn view-shipment" data-id="${shipment.id}" title="View Details">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                                <button class="action-btn delete-shipment" data-id="${shipment.id}" title="Delete">
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
    
    // Render shipment details view
    renderShipmentDetails: function(container) {
        const shipment = this.state.selectedShipment;
        
        // Calculate some derived values
        const bales = HELPERS.mtToBales(shipment.quantity);
        const { bundles, remainingBales } = HELPERS.balesToBundles(bales);
        const daysInTransit = shipment.arrivalDate 
            ? HELPERS.dateDiffInDays(shipment.shipmentDate, shipment.arrivalDate)
            : HELPERS.dateDiffInDays(shipment.shipmentDate, new Date());
        
        // Prepare HTML content
        let content = `
            <!-- Back button -->
            <div style="margin-bottom: 20px;">
                <button class="filter-btn" id="back-to-list">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Shipments
                </button>
            </div>
            
            <!-- Shipment Header -->
            <div class="section-header">
                <h2 class="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    Shipment Details: ${shipment.id}
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button class="filter-btn" id="edit-details-btn">
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
                    <div>${UI.createStatusPill(shipment.status)}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Total Quantity</div>
                    <div class="summary-value">${HELPERS.formatNumber(shipment.quantity)} MT</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Days in Transit</div>
                    <div class="summary-value">${daysInTransit}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Containers</div>
                    <div class="summary-value">${shipment.containers || 'N/A'}</div>
                </div>
            </div>
            
            <!-- Shipment Details -->
            <div class="detail-section">
                <h3 class="detail-title">Shipment Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Shipment ID</div>
                        <div class="detail-value">${shipment.id}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">BL Number</div>
                        <div class="detail-value">${shipment.blNumber}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Vessel Name</div>
                        <div class="detail-value">${shipment.vesselName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Purchase Order</div>
                        <div class="detail-value">${shipment.purchaseOrderRef || 'N/A'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Pulp Type</div>
                        <div class="detail-value">${shipment.pulpType}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Quantity (MT)</div>
                        <div class="detail-value">${HELPERS.formatNumber(shipment.quantity)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Bales</div>
                        <div class="detail-value">${bales}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Bundles</div>
                        <div class="detail-value">${bundles} bundles + ${remainingBales} bales</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Moisture</div>
                        <div class="detail-value">${shipment.moisture ? shipment.moisture + '%' : 'Not measured'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Quality Check</div>
                        <div class="detail-value">${shipment.qualityChecked ? 'Completed' : 'Pending'}</div>
                    </div>
                </div>
            </div>
            
            <!-- Route Information -->
            <div class="detail-section">
                <h3 class="detail-title">Route Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Supplier</div>
                        <div class="detail-value">${shipment.supplierName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Origin Port</div>
                        <div class="detail-value">${shipment.originPort}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Destination Port</div>
                        <div class="detail-value">${shipment.destinationPort}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Destination Plant</div>
                        <div class="detail-value">${shipment.plantName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Shipment Date</div>
                        <div class="detail-value">${HELPERS.formatDate(shipment.shipmentDate)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Estimated Arrival</div>
                        <div class="detail-value">${HELPERS.formatDate(shipment.eta)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Actual Arrival</div>
                        <div class="detail-value">${shipment.arrivalDate ? HELPERS.formatDate(shipment.arrivalDate) : 'Not arrived'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Customs Cleared</div>
                        <div class="detail-value">${shipment.customsCleared ? 'Yes' : 'No'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Destuff Type</div>
                        <div class="detail-value">${shipment.destuffType === 'FD' ? 'Factory Destuff (FD)' : 'Dock Destuff (DD)'}</div>
                    </div>
                </div>
            </div>
            
            <!-- Notes -->
            <div class="detail-section">
                <h3 class="detail-title">Notes</h3>
                <p>${shipment.notes || 'No notes available'}</p>
            </div>
            
            <!-- Timeline Placeholder - Would be populated with real data in a production system -->
            <div class="detail-section">
                <h3 class="detail-title">Shipment Timeline</h3>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-icon complete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <div class="timeline-title">Order Placed</div>
                                <div class="timeline-date">${HELPERS.formatDate(shipment.createdAt)}</div>
                            </div>
                            <div class="timeline-description">Purchase order ${shipment.purchaseOrderRef || 'N/A'} created</div>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-icon complete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <div class="timeline-title">Shipment Departed</div>
                                <div class="timeline-date">${HELPERS.formatDate(shipment.shipmentDate)}</div>
                            </div>
                            <div class="timeline-description">Vessel ${shipment.vesselName} departed from ${shipment.originPort}</div>
                        </div>
                    </div>
                    ${shipment.arrivalDate ? `
                    <div class="timeline-item">
                        <div class="timeline-icon complete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <div class="timeline-title">Vessel Arrived</div>
                                <div class="timeline-date">${HELPERS.formatDate(shipment.arrivalDate)}</div>
                            </div>
                            <div class="timeline-description">Vessel arrived at ${shipment.destinationPort}</div>
                        </div>
                    </div>
                    ` : ''}
                    ${shipment.customsCleared ? `
                    <div class="timeline-item">
                        <div class="timeline-icon complete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <div class="timeline-title">Customs Cleared</div>
                                <div class="timeline-date">-</div>
                            </div>
                            <div class="timeline-description">Shipment cleared customs</div>
                        </div>
                    </div>
                    ` : ''}
                    ${shipment.status === CONFIG.STATUS_TYPES.DELIVERED ? `
                    <div class="timeline-item">
                        <div class="timeline-icon complete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <div class="timeline-title">Delivered to Plant</div>
                                <div class="timeline-date">-</div>
                            </div>
                            <div class="timeline-description">Shipment delivered to ${shipment.plantName}</div>
                        </div>
                    </div>
                    ` : `
                    <div class="timeline-item">
                        <div class="timeline-icon ${shipment.status === CONFIG.STATUS_TYPES.IN_TRANSIT ? 'current' : 'pending'}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <div class="timeline-title">Expected Delivery</div>
                                <div class="timeline-date">${HELPERS.formatDate(shipment.eta)}</div>
                            </div>
                            <div class="timeline-description">Estimated delivery to ${shipment.plantName}</div>
                        </div>
                    </div>
                    `}
                </div>
            </div>
        `;
        
        // Set the content
        container.innerHTML = content;
        
        // Set up event handlers
        document.getElementById('back-to-list').addEventListener('click', () => {
            this.state.detailsMode = false;
            this.state.selectedShipment = null;
            this.renderTab();
        });
        
        document.getElementById('edit-details-btn').addEventListener('click', () => {
            this.showEditShipmentForm(shipment.id);
        });
        
        document.getElementById('update-status-btn').addEventListener('click', () => {
            this.showUpdateStatusForm(shipment.id);
        });
    },
    
    // Set up event handlers for the shipments list view
    setupEventHandlers: function() {
        // Add shipment button
        const addShipmentBtn = document.getElementById('add-shipment-btn');
        if (addShipmentBtn) {
            addShipmentBtn.addEventListener('click', () => {
                this.showAddShipmentForm();
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('export-shipments');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportShipments();
            });
        }
        
        // Table row click for details view
        const tableRows = document.querySelectorAll('#shipments-table tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('click', (e) => {
                // Only trigger if not clicking an action button
                if (!e.target.closest('.action-buttons')) {
                    const id = row.getAttribute('data-id');
                    this.viewShipmentDetails(id);
                }
            });
        });
        
        // View shipment buttons
        const viewBtns = document.querySelectorAll('.view-shipment');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.viewShipmentDetails(id);
            });
        });
        
        // Edit shipment buttons
        const editBtns = document.querySelectorAll('.edit-shipment');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.showEditShipmentForm(id);
            });
        });
        
        // Delete shipment buttons
        const deleteBtns = document.querySelectorAll('.delete-shipment');
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
        const sortableHeaders = document.querySelectorAll('#shipments-table th.sortable');
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
        
        // Detention risk alert buttons
        const viewDetentionBtn = document.getElementById('view-detention-details');
        if (viewDetentionBtn) {
            viewDetentionBtn.addEventListener('click', () => {
                // Find shipment with detention risk
                const risks = DATA.getDetentionRisks();
                if (risks.length > 0) {
                    this.viewShipmentDetails(risks[0].shipmentId);
                }
            });
        }
        
        const dismissDetentionBtn = document.getElementById('dismiss-detention');
        if (dismissDetentionBtn) {
            dismissDetentionBtn.addEventListener('click', () => {
                dismissDetentionBtn.closest('.alert').remove();
            });
        }
        
        // Set initial filter values from state
        this.setFilterInputs();
    },
    
    // Show shipment details
    viewShipmentDetails: function(id) {
        const shipment = DATA.getShipmentById(id);
        
        if (shipment) {
            this.state.selectedShipment = shipment;
            this.state.detailsMode = true;
            this.renderTab();
        } else {
            UI.notification.error('Shipment not found');
        }
    },
    
    // Show form to add a new shipment
    showAddShipmentForm: function() {
        const suppliers = DATA.getSuppliers();
        const plants = DATA.getPlants();
        
        UI.modal.form({
            title: 'Add New Shipment',
            fields: [
                {
                    id: 'supplierId',
                    label: 'Supplier',
                    type: 'select',
                    required: true,
                    row: 1,
                    options: suppliers.map(supplier => ({
                        value: supplier.id,
                        label: supplier.name
                    }))
                },
                {
                    id: 'vesselName',
                    label: 'Vessel Name',
                    type: 'text',
                    required: true,
                    row: 1
                },
                {
                    id: 'blNumber',
                    label: 'BL Number',
                    type: 'text',
                    required: true,
                    row: 2
                },
                {
                    id: 'quantity',
                    label: 'Quantity (MT)',
                    type: 'number',
                    required: true,
                    min: 1,
                    row: 2
                },
                {
                    id: 'originPort',
                    label: 'Origin Port',
                    type: 'text',
                    required: true,
                    row: 3
                },
                {
                    id: 'destinationPort',
                    label: 'Destination Port',
                    type: 'text',
                    required: true,
                    row: 3
                },
                {
                    id: 'plantId',
                    label: 'Destination Plant',
                    type: 'select',
                    required: true,
                    row: 4,
                    options: plants.map(plant => ({
                        value: plant.id,
                        label: plant.name
                    }))
                },
                {
                    id: 'pulpType',
                    label: 'Pulp Type',
                    type: 'text',
                    required: true,
                    row: 4
                },
                {
                    id: 'shipmentDate',
                    label: 'Shipment Date',
                    type: 'date',
                    required: true,
                    row: 5
                },
                {
                    id: 'eta',
                    label: 'Estimated Time of Arrival',
                    type: 'date',
                    required: true,
                    row: 5
                },
                {
                    id: 'containers',
                    label: 'Number of Containers',
                    type: 'number',
                    min: 1,
                    row: 6
                },
                {
                    id: 'purchaseOrderRef',
                    label: 'Purchase Order Reference',
                    type: 'text',
                    row: 6
                },
                {
                    id: 'destuffType',
                    label: 'Destuff Type',
                    type: 'select',
                    row: 7,
                    options: [
                        { value: 'FD', label: 'Factory Destuff (FD)' },
                        { value: 'DD', label: 'Dock Destuff (DD)' }
                    ]
                },
                {
                    id: 'status',
                    label: 'Status',
                    type: 'select',
                    required: true,
                    row: 7,
                    options: [
                        { value: CONFIG.STATUS_TYPES.IN_TRANSIT, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_TRANSIT) },
                        { value: CONFIG.STATUS_TYPES.AT_PORT, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.AT_PORT) },
                        { value: CONFIG.STATUS_TYPES.IN_CUSTOMS, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_CUSTOMS) },
                        { value: CONFIG.STATUS_TYPES.IN_CFS, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_CFS) },
                        { value: CONFIG.STATUS_TYPES.DELIVERED, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.DELIVERED) },
                        { value: CONFIG.STATUS_TYPES.DELAYED, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.DELAYED) }
                    ]
                },
                {
                    id: 'notes',
                    label: 'Notes',
                    type: 'textarea',
                    row: 8
                }
            ],
            submitText: 'Add Shipment'
        }).then(formData => {
            if (formData) {
                // Add supplierName and plantName from selected IDs
                const supplier = suppliers.find(s => s.id === formData.supplierId);
                const plant = plants.find(p => p.id === formData.plantId);
                
                if (supplier) {
                    formData.supplierName = supplier.name;
                }
                
                if (plant) {
                    formData.plantName = plant.name;
                }
                
                // Convert numeric fields
                formData.quantity = parseFloat(formData.quantity);
                formData.containers = formData.containers ? parseInt(formData.containers, 10) : null;
                
                // Add shipment
                const newShipment = DATA.addShipment(formData);
                
                if (newShipment) {
                    UI.notification.success('Shipment added successfully');
                    this.loadShipments();
                    this.renderTab();
                } else {
                    UI.notification.error('Failed to add shipment');
                }
            }
        });
    },
    
    // Show form to edit an existing shipment
    showEditShipmentForm: function(id) {
        const shipment = DATA.getShipmentById(id);
        
        if (!shipment) {
            UI.notification.error('Shipment not found');
            return;
        }
        
        const suppliers = DATA.getSuppliers();
        const plants = DATA.getPlants();
        
        UI.modal.form({
            title: 'Edit Shipment',
            fields: [
                {
                    id: 'supplierId',
                    label: 'Supplier',
                    type: 'select',
                    required: true,
                    value: shipment.supplierId,
                    row: 1,
                    options: suppliers.map(supplier => ({
                        value: supplier.id,
                        label: supplier.name
                    }))
                },
                {
                    id: 'vesselName',
                    label: 'Vessel Name',
                    type: 'text',
                    required: true,
                    value: shipment.vesselName,
                    row: 1
                },
                {
                    id: 'blNumber',
                    label: 'BL Number',
                    type: 'text',
                    required: true,
                    value: shipment.blNumber,
                    row: 2
                },
                {
                    id: 'quantity',
                    label: 'Quantity (MT)',
                    type: 'number',
                    required: true,
                    min: 1,
                    value: shipment.quantity,
                    row: 2
                },
                {
                    id: 'originPort',
                    label: 'Origin Port',
                    type: 'text',
                    required: true,
                    value: shipment.originPort,
                    row: 3
                },
                {
                    id: 'destinationPort',
                    label: 'Destination Port',
                    type: 'text',
                    required: true,
                    value: shipment.destinationPort,
                    row: 3
                },
                {
                    id: 'plantId',
                    label: 'Destination Plant',
                    type: 'select',
                    required: true,
                    value: shipment.plantId,
                    row: 4,
                    options: plants.map(plant => ({
                        value: plant.id,
                        label: plant.name
                    }))
                },
                {
                    id: 'pulpType',
                    label: 'Pulp Type',
                    type: 'text',
                    required: true,
                    value: shipment.pulpType,
                    row: 4
                },
                {
                    id: 'shipmentDate',
                    label: 'Shipment Date',
                    type: 'date',
                    required: true,
                    value: HELPERS.formatDate(shipment.shipmentDate, CONFIG.DATE_FORMAT.INPUT),
                    row: 5
                },
                {
                    id: 'eta',
                    label: 'Estimated Time of Arrival',
                    type: 'date',
                    required: true,
                    value: HELPERS.formatDate(shipment.eta, CONFIG.DATE_FORMAT.INPUT),
                    row: 5
                },
                {
                    id: 'containers',
                    label: 'Number of Containers',
                    type: 'number',
                    min: 1,
                    value: shipment.containers,
                    row: 6
                },
                {
                    id: 'purchaseOrderRef',
                    label: 'Purchase Order Reference',
                    type: 'text',
                    value: shipment.purchaseOrderRef,
                    row: 6
                },
                {
                    id: 'destuffType',
                    label: 'Destuff Type',
                    type: 'select',
                    value: shipment.destuffType,
                    row: 7,
                    options: [
                        { value: 'FD', label: 'Factory Destuff (FD)' },
                        { value: 'DD', label: 'Dock Destuff (DD)' }
                    ]
                },
                {
                    id: 'status',
                    label: 'Status',
                    type: 'select',
                    required: true,
                    value: shipment.status,
                    row: 7,
                    options: [
                        { value: CONFIG.STATUS_TYPES.IN_TRANSIT, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_TRANSIT) },
                        { value: CONFIG.STATUS_TYPES.AT_PORT, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.AT_PORT) },
                        { value: CONFIG.STATUS_TYPES.IN_CUSTOMS, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_CUSTOMS) },
                        { value: CONFIG.STATUS_TYPES.IN_CFS, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_CFS) },
                        { value: CONFIG.STATUS_TYPES.DELIVERED, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.DELIVERED) },
                        { value: CONFIG.STATUS_TYPES.DELAYED, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.DELAYED) }
                    ]
                },
                {
                    id: 'notes',
                    label: 'Notes',
                    type: 'textarea',
                    value: shipment.notes,
                    row: 8
                }
            ],
            submitText: 'Update Shipment'
        }).then(formData => {
            if (formData) {
                // Add supplierName and plantName from selected IDs
                const supplier = suppliers.find(s => s.id === formData.supplierId);
                const plant = plants.find(p => p.id === formData.plantId);
                
                if (supplier) {
                    formData.supplierName = supplier.name;
                }
                
                if (plant) {
                    formData.plantName = plant.name;
                }
                
                // Convert numeric fields
                formData.quantity = parseFloat(formData.quantity);
                formData.containers = formData.containers ? parseInt(formData.containers, 10) : null;
                
                // Update shipment
                const updatedShipment = DATA.updateShipment(id, formData);
                
                if (updatedShipment) {
                    UI.notification.success('Shipment updated successfully');
                    
                    // Update selected shipment if in details mode
                    if (this.state.detailsMode && this.state.selectedShipment && this.state.selectedShipment.id === id) {
                        this.state.selectedShipment = updatedShipment;
                    }
                    
                    this.loadShipments();
                    this.renderTab();
                } else {
                    UI.notification.error('Failed to update shipment');
                }
            }
        });
    },
    
    // Show form to update shipment status
    showUpdateStatusForm: function(id) {
        const shipment = DATA.getShipmentById(id);
        
        if (!shipment) {
            UI.notification.error('Shipment not found');
            return;
        }
        
        UI.modal.form({
            title: 'Update Shipment Status',
            fields: [
                {
                    id: 'status',
                    label: 'Status',
                    type: 'select',
                    required: true,
                    value: shipment.status,
                    row: 1,
                    options: [
                        { value: CONFIG.STATUS_TYPES.IN_TRANSIT, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_TRANSIT) },
                        { value: CONFIG.STATUS_TYPES.AT_PORT, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.AT_PORT) },
                        { value: CONFIG.STATUS_TYPES.IN_CUSTOMS, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_CUSTOMS) },
                        { value: CONFIG.STATUS_TYPES.IN_CFS, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.IN_CFS) },
                        { value: CONFIG.STATUS_TYPES.DELIVERED, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.DELIVERED) },
                        { value: CONFIG.STATUS_TYPES.DELAYED, label: HELPERS.getStatusLabel(CONFIG.STATUS_TYPES.DELAYED) }
                    ]
                },
                {
                    id: 'arrivalDate',
                    label: 'Arrival Date (if arrived)',
                    type: 'date',
                    value: shipment.arrivalDate ? HELPERS.formatDate(shipment.arrivalDate, CONFIG.DATE_FORMAT.INPUT) : '',
                    row: 2
                },
                {
                    id: 'customsCleared',
                    type: 'checkbox',
                    checkboxLabel: 'Customs Cleared',
                    value: shipment.customsCleared,
                    row: 3
                },
                {
                    id: 'statusNotes',
                    label: 'Status Update Notes',
                    type: 'textarea',
                    row: 4
                }
            ],
            submitText: 'Update Status'
        }).then(formData => {
            if (formData) {
                // Create updates object
                const updates = {
                    status: formData.status,
                    customsCleared: formData.customsCleared
                };
                
                // Add arrival date if provided
                if (formData.arrivalDate) {
                    updates.arrivalDate = formData.arrivalDate;
                }
                
                // Append status notes to existing notes if provided
                if (formData.statusNotes) {
                    const date = new Date().toISOString().split('T')[0];
                    const statusNote = `[${date}] Status updated to ${HELPERS.getStatusLabel(formData.status)}: ${formData.statusNotes}`;
                    
                    if (shipment.notes) {
                        updates.notes = `${shipment.notes}\n\n${statusNote}`;
                    } else {
                        updates.notes = statusNote;
                    }
                }
                
                // Update shipment
                const updatedShipment = DATA.updateShipment(id, updates);
                
                if (updatedShipment) {
                    UI.notification.success('Shipment status updated successfully');
                    
                    // Update selected shipment if in details mode
                    if (this.state.detailsMode && this.state.selectedShipment && this.state.selectedShipment.id === id) {
                        this.state.selectedShipment = updatedShipment;
                    }
                    
                    this.loadShipments();
                    this.renderTab();
                } else {
                    UI.notification.error('Failed to update shipment status');
                }
            }
        });
    },
    
    // Show confirmation dialog for deleting a shipment
    showDeleteConfirmation: function(id) {
        const shipment = DATA.getShipmentById(id);
        
        if (!shipment) {
            UI.notification.error('Shipment not found');
            return;
        }
        
        UI.modal.confirm({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete shipment <strong>${shipment.id}</strong> (${shipment.blNumber})?<br><br>This action cannot be undone.`,
            confirmText: 'Delete',
            isDanger: true
        }).then(confirmed => {
            if (confirmed) {
                const deleted = DATA.deleteShipment(id);
                
                if (deleted) {
                    UI.notification.success('Shipment deleted successfully');
                    
                    // Exit details mode if the deleted shipment was selected
                    if (this.state.detailsMode && this.state.selectedShipment && this.state.selectedShipment.id === id) {
                        this.state.detailsMode = false;
                        this.state.selectedShipment = null;
                    }
                    
                    this.loadShipments();
                    this.renderTab();
                } else {
                    UI.notification.error('Failed to delete shipment');
                }
            }
        });
    },
    
    // Export shipments to CSV
    exportShipments: function() {
        const data = this.state.filteredShipments.map(shipment => ({
            'Shipment ID': shipment.id,
            'Supplier': shipment.supplierName,
            'Vessel Name': shipment.vesselName,
            'BL Number': shipment.blNumber,
            'Quantity (MT)': shipment.quantity,
            'Origin Port': shipment.originPort,
            'Destination Port': shipment.destinationPort,
            'Shipment Date': HELPERS.formatDate(shipment.shipmentDate),
            'ETA': HELPERS.formatDate(shipment.eta),
            'Plant': shipment.plantName,
            'Status': HELPERS.getStatusLabel(shipment.status),
            'Pulp Type': shipment.pulpType,
            'Containers': shipment.containers,
            'PO Reference': shipment.purchaseOrderRef,
            'Notes': shipment.notes
        }));
        
        HELPERS.downloadCSV(data, 'shipments_export.csv');
        
        UI.notification.success('Shipments exported successfully');
    },
    
    // Get supplier options for filter dropdown
    getSupplierOptions: function() {
        const suppliers = DATA.getSuppliers();
        return suppliers.map(supplier => 
            `<option value="${supplier.id}" ${this.state.filters.supplier === supplier.id ? 'selected' : ''}>${supplier.name}</option>`
        ).join('');
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
        const supplierSelect = document.getElementById('filter-supplier');
        const plantSelect = document.getElementById('filter-plant');
        const statusSelect = document.getElementById('filter-status');
        const searchInput = document.getElementById('filter-search');
        
        if (supplierSelect) {
            supplierSelect.value = this.state.filters.supplier;
        }
        
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
        const supplierSelect = document.getElementById('filter-supplier');
        const plantSelect = document.getElementById('filter-plant');
        const statusSelect = document.getElementById('filter-status');
        const searchInput = document.getElementById('filter-search');
        
        if (supplierSelect) {
            this.state.filters.supplier = supplierSelect.value;
        }
        
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
            supplier: '',
            plant: '',
            status: '',
            dateFrom: '',
            dateTo: '',
            search: ''
        };
        
        this.applyFilters();
    },
    
    // Get count of all shipments
    getShipmentCount: function() {
        return this.state.shipments.length;
    },
    
    // Get count of shipments by status
    getShipmentCountByStatus: function(status) {
        return this.state.shipments.filter(s => s.status === status).length;
    }
};
