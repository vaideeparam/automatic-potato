/**
 * Quality Control Management for Pulp Procurement Control Tower
 * This file handles the Quality Control tab functionality.
 */

const QUALITY = {
    // Current state
    state: {
        qualityChecks: [],
        filteredQualityChecks: [],
        currentPage: 1,
        pageSize: CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
        filters: {
            supplier: '',
            plant: '',
            search: '',
            dateFrom: '',
            dateTo: ''
        },
        sort: {
            field: 'date',
            ascending: false
        },
        selectedCheck: null,
        detailsMode: false
    },
    
    // Initialize quality module
    init: function() {
        // Set page size from user preferences
        const userPreferences = DATA.getUserPreferences();
        this.state.pageSize = userPreferences.pageSize || CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
        
        // Load quality data
        this.loadQualityChecks();
        
        console.log('Quality module initialized');
    },
    
    // Load quality checks data
    loadQualityChecks: function() {
        // Get quality checks with current filters
        this.state.qualityChecks = DATA.getQualityChecks();
        this.applyFilters();
    },
    
    // Apply filters to quality checks
    applyFilters: function() {
        this.state.filteredQualityChecks = DATA.getQualityChecks(this.state.filters);
        
        // Apply sorting
        if (this.state.sort.field) {
            this.state.filteredQualityChecks = HELPERS.sortArray(
                this.state.filteredQualityChecks,
                this.state.sort.field,
                this.state.sort.ascending
            );
        }
        
        // Reset to first page when filters change
        this.state.currentPage = 1;
        
        // If in details mode, check if selected check still matches filters
        if (this.state.detailsMode && this.state.selectedCheck) {
            const stillExists = this.state.filteredQualityChecks.some(c => c.id === this.state.selectedCheck.id);
            
            if (!stillExists) {
                // Exit details mode if filtered out
                this.state.detailsMode = false;
                this.state.selectedCheck = null;
            }
        }
    },
    
    // Render the quality tab
    renderTab: function() {
        const contentContainer = document.getElementById('tab-content-container');
        
        // Check if in details mode
        if (this.state.detailsMode && this.state.selectedCheck) {
            this.renderQualityDetails(contentContainer);
        } else {
            this.renderQualityList(contentContainer);
        }
    },
    
    // Render the quality list view
    renderQualityList: function(container) {
        // Calculate pagination values
        const totalItems = this.state.filteredQualityChecks.length;
        const totalPages = Math.ceil(totalItems / this.state.pageSize);
        const startIndex = (this.state.currentPage - 1) * this.state.pageSize;
        const endIndex = Math.min(startIndex + this.state.pageSize, totalItems);
        const currentPageItems = this.state.filteredQualityChecks.slice(startIndex, endIndex);
        
        // Calculate quality metrics
        const approvedChecks = this.state.qualityChecks.filter(check => check.status === 'approved').length;
        const totalChecks = this.state.qualityChecks.length;
        const approvalRate = totalChecks ? (approvedChecks / totalChecks) * 100 : 0;
        const avgMoistureDeviation = this.getAverageMoistureDeviation();
        
        // Prepare HTML content
        let content = `
            <!-- Dashboard Cards -->
            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Total QC Checks</div>
                    </div>
                    <div class="card-value">${totalChecks}</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Approval Rate</div>
                    </div>
                    <div class="card-value">${HELPERS.formatNumber(approvalRate, 1)}%</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Avg. Moisture Deviation</div>
                    </div>
                    <div class="card-value">${HELPERS.formatNumber(avgMoistureDeviation, 2)}%</div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">Pending Checks</div>
                    </div>
                    <div class="card-value">${this.state.qualityChecks.filter(check => check.status !== 'approved').length}</div>
                </div>
            </div>
            
            <!-- Filter Section -->
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
                        <span class="filter-label">Search:</span>
                        <input type="text" class="filter-control" id="filter-search" placeholder="Search by BL number, batch...">
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
            
            <!-- Quality Check Table -->
            <div class="section-header">
                <h2 class="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Quality Control
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button class="filter-btn" id="export-quality">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export
                    </button>
                    <button class="add-btn" id="add-quality-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Quality Check
                    </button>
                </div>
            </div>
            
            <table class="data-table" id="quality-table">
                <thead>
                    <tr>
                        <th class="sortable" data-sort="id">ID</th>
                        <th class="sortable" data-sort="blNumber">BL Number</th>
                        <th class="sortable" data-sort="supplierId">Supplier</th>
                        <th class="sortable" data-sort="plantId">Plant</th>
                        <th class="sortable" data-sort="date">Check Date</th>
                        <th class="sortable" data-sort="pulpType">Pulp Type</th>
                        <th class="sortable" data-sort="batchNumber">Batch Number</th>
                        <th class="sortable" data-sort="supplierValues.moisture">Supplier Moisture</th>
                        <th class="sortable" data-sort="plantValues.moisture">Plant Moisture</th>
                        <th class="sortable" data-sort="deviation.moisture">Deviation</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Add quality check rows
        if (currentPageItems.length === 0) {
            content += `
                <tr>
                    <td colspan="12" style="text-align: center;">No quality checks found matching the filters</td>
                </tr>
            `;
        } else {
            currentPageItems.forEach(check => {
                // Calculate status pill style
                let statusPill = '';
                if (check.status === 'approved') {
                    statusPill = 'status-delivered';
                } else if (check.status === 'rejected') {
                    statusPill = 'status-delayed';
                } else {
                    statusPill = 'status-in-transit';
                }
                
                content += `
                    <tr data-id="${check.id}">
                        <td>${check.id}</td>
                        <td>${check.blNumber}</td>
                        <td>${check.supplierId}</td>
                        <td>${check.plantId}</td>
                        <td>${HELPERS.formatDate(check.date)}</td>
                        <td>${check.pulpType}</td>
                        <td>${check.batchNumber}</td>
                        <td>${check.supplierValues.moisture}%</td>
                        <td>${check.plantValues.moisture}%</td>
                        <td>${HELPERS.formatNumber(check.deviation.moisture, 2)}%</td>
                        <td><span class="status-pill ${statusPill}">${HELPERS.toTitleCase(check.status)}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn edit-quality" data-id="${check.id}" title="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button class="action-btn view-quality" data-id="${check.id}" title="View Details">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                                <button class="action-btn update-status" data-id="${check.id}" title="Update Status">
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
    
    // Render quality check details view
    renderQualityDetails: function(container) {
        const check = this.state.selectedCheck;
        
        // Calculate absolute deviations
        const moistureDeviation = Math.abs(check.deviation.moisture);
        const weightDeviation = Math.abs(check.deviation.weight);
        
        // Determine quality status colors
        const getDeviationColor = (value, threshold1, threshold2) => {
            if (value <= threshold1) return '#16a34a'; // Good (green)
            if (value <= threshold2) return '#f97316'; // Warning (orange)
            return '#dc2626'; // Bad (red)
        };
        
        const moistureColor = getDeviationColor(moistureDeviation, 0.3, 0.8);
        const weightColor = getDeviationColor(weightDeviation, 1.0, 3.0);
        
        // Prepare HTML content
        let content = `
            <!-- Back button -->
            <div style="margin-bottom: 20px;">
                <button class="filter-btn" id="back-to-list">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Quality Checks
                </button>
            </div>
            
            <!-- Quality Check Header -->
            <div class="section-header">
                <h2 class="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Quality Check: ${check.id}
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button class="filter-btn" id="edit-quality-btn">
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
                    <div class="summary-title">Overall Rating</div>
                    <div class="summary-value">${check.overallRating}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Status</div>
                    <div>
                        <span class="status-pill ${check.status === 'approved' ? 'status-delivered' : 
                                                 check.status === 'rejected' ? 'status-delayed' : 'status-in-transit'}">
                            ${HELPERS.toTitleCase(check.status)}
                        </span>
                    </div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Check Date</div>
                    <div class="summary-value">${HELPERS.formatDate(check.date)}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Approved By</div>
                    <div class="summary-value">${check.approvedBy || 'Pending'}</div>
                </div>
            </div>
            
            <!-- Shipment Information -->
            <div class="detail-section">
                <h3 class="detail-title">Shipment Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">QC ID</div>
                        <div class="detail-value">${check.id}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Shipment ID</div>
                        <div class="detail-value">${check.shipmentId}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">BL Number</div>
                        <div class="detail-value">${check.blNumber}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Supplier</div>
                        <div class="detail-value">${check.supplierId}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Plant</div>
                        <div class="detail-value">${check.plantId}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Pulp Type</div>
                        <div class="detail-value">${check.pulpType}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Batch Number</div>
                        <div class="detail-value">${check.batchNumber}</div>
                    </div>
                </div>
            </div>
            
            <!-- Quality Parameters Comparison -->
            <div class="detail-section">
                <h3 class="detail-title">Quality Parameters Comparison</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Supplier Value</th>
                            <th>Plant Value</th>
                            <th>Deviation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Moisture (%)</td>
                            <td>${check.supplierValues.moisture}</td>
                            <td>${check.plantValues.moisture}</td>
                            <td style="color: ${moistureColor}">${check.deviation.moisture > 0 ? '+' : ''}${HELPERS.formatNumber(check.deviation.moisture, 2)}</td>
                        </tr>
                        <tr>
                            <td>Weight per Bale (kg)</td>
                            <td>${check.supplierValues.weight}</td>
                            <td>${check.plantValues.weight}</td>
                            <td style="color: ${weightColor}">${check.deviation.weight > 0 ? '+' : ''}${HELPERS.formatNumber(check.deviation.weight, 2)}</td>
                        </tr>
                        <tr>
                            <td>Brightness</td>
                            <td>${check.supplierValues.brightness}</td>
                            <td>${check.plantValues.brightness}</td>
                            <td>${check.deviation.brightness > 0 ? '+' : ''}${HELPERS.formatNumber(check.deviation.brightness, 2)}</td>
                        </tr>
                        <tr>
                            <td>Viscosity</td>
                            <td>${check.supplierValues.viscosity}</td>
                            <td>${check.plantValues.viscosity}</td>
                            <td>${check.deviation.viscosity > 0 ? '+' : ''}${HELPERS.formatNumber(check.deviation.viscosity, 1)}</td>
                        </tr>
                        <tr>
                            <td>Dirt (%)</td>
                            <td>${check.supplierValues.dirt}</td>
                            <td>${check.plantValues.dirt}</td>
                            <td>${check.deviation.dirt > 0 ? '+' : ''}${HELPERS.formatNumber(check.deviation.dirt, 2)}</td>
                        </tr>
                        <tr>
                            <td>Shives (%)</td>
                            <td>${check.supplierValues.shives}</td>
                            <td>${check.plantValues.shives}</td>
                            <td>${check.deviation.shives > 0 ? '+' : ''}${HELPERS.formatNumber(check.deviation.shives, 2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Bale Sampling Details -->
            <div class="detail-section">
                <h3 class="detail-title">Bale Sampling Details</h3>
                ${!check.balesSampled || check.balesSampled.length === 0 ? 
                    '<p>No bale sampling data available</p>' : 
                    `<table class="data-table">
                        <thead>
                            <tr>
                                <th>Bale ID</th>
                                <th>Weight (kg)</th>
                                <th>Moisture (%)</th>
                                <th>Air Dry Weight (kg)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${check.balesSampled.map(bale => `
                                <tr>
                                    <td>${bale.id}</td>
                                    <td>${HELPERS.formatNumber(bale.weight, 1)}</td>
                                    <td>${HELPERS.formatNumber(bale.moisture, 1)}</td>
                                    <td>${HELPERS.formatNumber(bale.airDryWeight, 1)}</td>
                                </tr>
                            `).join('')}
                            <tr style="font-weight: bold; background-color: #f3f4f6;">
                                <td>Average</td>
                                <td>${HELPERS.formatNumber(this.calculateAverage(check.balesSampled, 'weight'), 1)}</td>
                                <td>${HELPERS.formatNumber(this.calculateAverage(check.balesSampled, 'moisture'), 1)}</td>
                                <td>${HELPERS.formatNumber(this.calculateAverage(check.balesSampled, 'airDryWeight'), 1)}</td>
                            </tr>
                        </tbody>
                    </table>`
                }
            </div>
            
            <!-- Notes -->
            <div class="detail-section">
                <h3 class="detail-title">Notes</h3>
                <p>${check.notes || 'No notes available'}</p>
            </div>
        `;
        
        // Set the content
        container.innerHTML = content;
        
        // Set up event handlers
        document.getElementById('back-to-list').addEventListener('click', () => {
            this.state.detailsMode = false;
            this.state.selectedCheck = null;
            this.renderTab();
        });
        
        document.getElementById('edit-quality-btn').addEventListener('click', () => {
            UI.notification.info(`Edit form for quality check ${check.id} would be displayed here (simulation)`);
        });
        
        document.getElementById('update-status-btn').addEventListener('click', () => {
            UI.notification.info(`Status update form for quality check ${check.id} would be displayed here (simulation)`);
        });
    },
    
    // Set up event handlers
    setupEventHandlers: function() {
        // Add quality check button
        const addQualityBtn = document.getElementById('add-quality-btn');
        if (addQualityBtn) {
            addQualityBtn.addEventListener('click', () => {
                UI.notification.info('Add quality check form would be displayed here (simulation)');
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('export-quality');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                UI.notification.success('Quality data exported successfully (simulation)');
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
        const sortableHeaders = document.querySelectorAll('#quality-table th.sortable');
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
        const viewBtns = document.querySelectorAll('.view-quality');
        const editBtns = document.querySelectorAll('.edit-quality');
        const updateBtns = document.querySelectorAll('.update-status');
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                this.viewQualityDetails(id);
            });
        });
        
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                UI.notification.info(`Edit form for quality check ${id} would be displayed here (simulation)`);
            });
        });
        
        updateBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                UI.notification.info(`Status update form for quality check ${id} would be displayed here (simulation)`);
            });
        });
        
        // Table row click for details view
        const tableRows = document.querySelectorAll('#quality-table tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('click', (e) => {
                // Only trigger if not clicking an action button
                if (!e.target.closest('.action-buttons')) {
                    const id = row.getAttribute('data-id');
                    if (id) {
                        this.viewQualityDetails(id);
                    }
                }
            });
        });
        
        // Set filter inputs from state
        this.setFilterInputs();
    },
    
    // View quality check details
    viewQualityDetails: function(id) {
        // Find the quality check in the list
        const check = this.state.qualityChecks.find(c => c.id === id);
        
        if (check) {
            this.state.selectedCheck = check;
            this.state.detailsMode = true;
            this.renderTab();
        } else {
            UI.notification.error('Quality check not found');
        }
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
        const searchInput = document.getElementById('filter-search');
        
        if (supplierSelect) {
            supplierSelect.value = this.state.filters.supplier;
        }
        
        if (plantSelect) {
            plantSelect.value = this.state.filters.plant;
        }
        
        if (searchInput) {
            searchInput.value = this.state.filters.search;
        }
    },
    
    // Update filters from input values
    updateFiltersFromInputs: function() {
        const supplierSelect = document.getElementById('filter-supplier');
        const plantSelect = document.getElementById('filter-plant');
        const searchInput = document.getElementById('filter-search');
        
        if (supplierSelect) {
            this.state.filters.supplier = supplierSelect.value;
        }
        
        if (plantSelect) {
            this.state.filters.plant = plantSelect.value;
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
            search: '',
            dateFrom: '',
            dateTo: ''
        };
        
        this.applyFilters();
    },
    
    // Calculate average moisture deviation
    getAverageMoistureDeviation: function() {
        if (this.state.qualityChecks.length === 0) return 0;
        
        // Take absolute values of deviations for proper average calculation
        const totalDeviation = this.state.qualityChecks.reduce((sum, check) => {
            return sum + Math.abs(check.deviation.moisture);
        }, 0);
        
        return totalDeviation / this.state.qualityChecks.length;
    },
    
    // Calculate average of a property in an array of objects
    calculateAverage: function(array, property) {
        if (!array || array.length === 0) return 0;
        
        const sum = array.reduce((total, item) => total + (item[property] || 0), 0);
        return sum / array.length;
    }
};
