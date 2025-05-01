/**
 * Reports Management for Pulp Procurement Control Tower
 * This file handles the Reports tab functionality.
 */

const REPORTS = {
    // Current state
    state: {
        reportType: 'procurement-summary', // Default report type
        dateRange: 'month', // Default date range
        customDateFrom: '',
        customDateTo: '',
        filters: {
            supplier: '',
            plant: '',
            pulpType: ''
        }
    },
    
    // Define available reports
    availableReports: [
        {
            id: 'procurement-summary',
            name: 'Procurement Summary',
            description: 'Overall summary of procurement activities and metrics',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>'
        },
        {
            id: 'supplier-performance',
            name: 'Supplier Performance',
            description: 'Analysis of supplier performance metrics and quality',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
        },
        {
            id: 'quality-analysis',
            name: 'Quality Analysis',
            description: 'Detailed analysis of quality check results and deviations',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        },
        {
            id: 'inventory-forecast',
            name: 'Inventory Forecast',
            description: 'Projected inventory levels based on current stock and upcoming shipments',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>'
        },
        {
            id: 'logistics-efficiency',
            name: 'Logistics Efficiency',
            description: 'Analysis of logistics performance, transit times, and costs',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>'
        }
    ],
    
    // Initialize reports module
    init: function() {
        console.log('Reports module initialized');
    },
    
    // Render the reports tab
    renderTab: function() {
        const contentContainer = document.getElementById('tab-content-container');
        
        // Prepare HTML content
        let content = `
            <div class="two-columns">
                <!-- Reports Selection Column -->
                <div class="column" style="flex: 0.3;">
                    <div class="detail-section">
                        <h3 class="detail-title">Available Reports</h3>
                        <div class="reports-list">
                            ${this.availableReports.map(report => `
                                <div class="report-item ${this.state.reportType === report.id ? 'active' : ''}" data-report="${report.id}">
                                    <div class="report-icon">${report.icon}</div>
                                    <div class="report-info">
                                        <div class="report-name">${report.name}</div>
                                        <div class="report-description">${report.description}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Report Content Column -->
                <div class="column" style="flex: 0.7;">
                    <!-- Report Controls -->
                    <div class="filter-section">
                        <div class="filter-row">
                            <div class="filter-group">
                                <span class="filter-label">Date Range:</span>
                                <select class="filter-control" id="date-range">
                                    <option value="week" ${this.state.dateRange === 'week' ? 'selected' : ''}>Last Week</option>
                                    <option value="month" ${this.state.dateRange === 'month' ? 'selected' : ''}>Last Month</option>
                                    <option value="quarter" ${this.state.dateRange === 'quarter' ? 'selected' : ''}>Last Quarter</option>
                                    <option value="year" ${this.state.dateRange === 'year' ? 'selected' : ''}>Last Year</option>
                                    <option value="custom" ${this.state.dateRange === 'custom' ? 'selected' : ''}>Custom Range</option>
                                </select>
                            </div>
                            ${this.state.dateRange === 'custom' ? `
                                <div class="filter-group">
                                    <span class="filter-label">From:</span>
                                    <input type="date" class="filter-control" id="custom-date-from" value="${this.state.customDateFrom}">
                                </div>
                                <div class="filter-group">
                                    <span class="filter-label">To:</span>
                                    <input type="date" class="filter-control" id="custom-date-to" value="${this.state.customDateTo}">
                                </div>
                            ` : ''}
                            <button class="filter-btn" id="generate-report">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                                Generate Report
                            </button>
                            <button class="filter-btn" id="export-report">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Export to PDF
                            </button>
                        </div>
                        
                        <!-- Additional Filters based on report type -->
                        <div class="filter-row" style="margin-top: 10px;">
                            ${this.renderReportSpecificFilters()}
                        </div>
                    </div>
                    
                    <!-- Report Content -->
                    <div class="detail-section">
                        <h3 class="detail-title">${this.getReportTitle()}</h3>
                        ${this.renderReportContent()}
                    </div>
                </div>
            </div>
        `;
        
        // Set the content
        contentContainer.innerHTML = content;
        
        // Apply custom styles for reports
        this.applyReportStyles();
        
        // Set up event handlers
        this.setupEventHandlers();
    },
    
    // Render report-specific filters
    renderReportSpecificFilters: function() {
        switch (this.state.reportType) {
            case 'procurement-summary':
                return '';
                
            case 'supplier-performance':
                return `
                    <div class="filter-group">
                        <span class="filter-label">Supplier:</span>
                        <select class="filter-control" id="filter-supplier">
                            <option value="">All Suppliers</option>
                            ${this.getSupplierOptions()}
                        </select>
                    </div>
                `;
                
            case 'quality-analysis':
                return `
                    <div class="filter-group">
                        <span class="filter-label">Supplier:</span>
                        <select class="filter-control" id="filter-supplier">
                            <option value="">All Suppliers</option>
                            ${this.getSupplierOptions()}
                        </select>
                    </div>
                    <div class="filter-group">
                        <span class="filter-label">Pulp Type:</span>
                        <select class="filter-control" id="filter-pulp-type">
                            <option value="">All Types</option>
                            ${this.getPulpTypeOptions()}
                        </select>
                    </div>
                `;
                
            case 'inventory-forecast':
            case 'logistics-efficiency':
                return `
                    <div class="filter-group">
                        <span class="filter-label">Plant:</span>
                        <select class="filter-control" id="filter-plant">
                            <option value="">All Plants</option>
                            ${this.getPlantOptions()}
                        </select>
                    </div>
                `;
                
            default:
                return '';
        }
    },
    
    // Get the title for the current report
    getReportTitle: function() {
        const report = this.availableReports.find(r => r.id === this.state.reportType);
        return report ? report.name : 'Report';
    },
    
    // Render the content for the selected report
    renderReportContent: function() {
        switch (this.state.reportType) {
            case 'procurement-summary':
                return this.renderProcurementSummary();
                
            case 'supplier-performance':
                return this.renderSupplierPerformance();
                
            case 'quality-analysis':
                return this.renderQualityAnalysis();
                
            case 'inventory-forecast':
                return this.renderInventoryForecast();
                
            case 'logistics-efficiency':
                return this.renderLogisticsEfficiency();
                
            default:
                return '<p>Select a report type to generate content.</p>';
        }
    },
    
    // Render procurement summary report
    renderProcurementSummary: function() {
        // Summary cards
        const totalShipments = DATA.getShipments().length;
        const totalQuantity = DATA.getShipments().reduce((sum, s) => sum + s.quantity, 0);
        const totalSuppliers = DATA.getSuppliers().length;
        
        // Get transit shipments
        const transitShipments = DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.IN_TRANSIT);
        const transitQuantity = transitShipments.reduce((sum, s) => sum + s.quantity, 0);
        
        // Calculate inventory metrics
        const totalInventory = DATA.getInventory().reduce((sum, i) => sum + i.quantity, 0);
        const totalConsumption = DATA.getInventory().reduce((sum, i) => sum + (i.dailyConsumption || 0), 0);
        const inventoryDays = totalConsumption > 0 ? Math.round(totalInventory / totalConsumption) : 0;
        
        return `
            <!-- Summary Cards -->
            <div class="summary-boxes">
                <div class="summary-box">
                    <div class="summary-title">Total Shipments</div>
                    <div class="summary-value">${totalShipments}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Total Quantity</div>
                    <div class="summary-value">${HELPERS.formatNumber(totalQuantity)} MT</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Active Suppliers</div>
                    <div class="summary-value">${totalSuppliers}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">In-Transit Quantity</div>
                    <div class="summary-value">${HELPERS.formatNumber(transitQuantity)} MT</div>
                </div>
            </div>
            
            <!-- Inventory Status -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Inventory Status</h4>
                <div class="summary-boxes">
                    <div class="summary-box">
                        <div class="summary-title">Total Inventory</div>
                        <div class="summary-value">${HELPERS.formatNumber(totalInventory)} MT</div>
                    </div>
                    <div class="summary-box">
                        <div class="summary-title">Daily Consumption</div>
                        <div class="summary-value">${HELPERS.formatNumber(totalConsumption)} MT/day</div>
                    </div>
                    <div class="summary-box">
                        <div class="summary-title">Inventory Days</div>
                        <div class="summary-value">${inventoryDays} days</div>
                    </div>
                    <div class="summary-box">
                        <div class="summary-title">Low Stock Items</div>
                        <div class="summary-value">${DATA.getInventory().filter(i => i.availableQuantity <= i.reorderPoint).length}</div>
                    </div>
                </div>
            </div>
            
            <!-- Shipment Status Chart -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Shipment Status Distribution</h4>
                <div class="chart-container" id="shipment-status-chart">
                    <div style="display: flex; height: 100%;">
                        <div style="flex: 0.6; padding-right: 20px;">
                            <div style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
                                <div class="chart-bar-container">
                                    <div class="chart-label">In Transit</div>
                                    <div class="chart-bar" style="width: ${(transitShipments.length / totalShipments) * 100}%; background-color: #f97316;">
                                        <span>${transitShipments.length}</span>
                                    </div>
                                </div>
                                <div class="chart-bar-container">
                                    <div class="chart-label">At Port</div>
                                    <div class="chart-bar" style="width: ${(DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.AT_PORT).length / totalShipments) * 100}%; background-color: #84cc16;">
                                        <span>${DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.AT_PORT).length}</span>
                                    </div>
                                </div>
                                <div class="chart-bar-container">
                                    <div class="chart-label">In Customs</div>
                                    <div class="chart-bar" style="width: ${(DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.IN_CUSTOMS).length / totalShipments) * 100}%; background-color: #3b82f6;">
                                        <span>${DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.IN_CUSTOMS).length}</span>
                                    </div>
                                </div>
                                <div class="chart-bar-container">
                                    <div class="chart-label">Delivered</div>
                                    <div class="chart-bar" style="width: ${(DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.DELIVERED).length / totalShipments) * 100}%; background-color: #10b981;">
                                        <span>${DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.DELIVERED).length}</span>
                                    </div>
                                </div>
                                <div class="chart-bar-container">
                                    <div class="chart-label">Delayed</div>
                                    <div class="chart-bar" style="width: ${(DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.DELAYED).length / totalShipments) * 100}%; background-color: #ef4444;">
                                        <span>${DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.DELAYED).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="flex: 0.4; display: flex; flex-direction: column; justify-content: center;">
                            <div class="pie-chart-container">
                                <div class="pie-chart">
                                    <div class="pie-slice" style="--percentage: ${(transitShipments.length / totalShipments) * 100}; --color: #f97316; --rotation: 0deg;"></div>
                                    <div class="pie-slice" style="--percentage: ${(DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.AT_PORT).length / totalShipments) * 100}; --color: #84cc16; --rotation: ${(transitShipments.length / totalShipments) * 360}deg;"></div>
                                    <div class="pie-slice" style="--percentage: ${(DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.IN_CUSTOMS).length / totalShipments) * 100}; --color: #3b82f6; --rotation: ${((transitShipments.length + DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.AT_PORT).length) / totalShipments) * 360}deg;"></div>
                                    <div class="pie-slice" style="--percentage: ${(DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.DELIVERED).length / totalShipments) * 100}; --color: #10b981; --rotation: ${((transitShipments.length + DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.AT_PORT).length + DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.IN_CUSTOMS).length) / totalShipments) * 360}deg;"></div>
                                    <div class="pie-slice" style="--percentage: ${(DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.DELAYED).length / totalShipments) * 100}; --color: #ef4444; --rotation: ${((transitShipments.length + DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.AT_PORT).length + DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.IN_CUSTOMS).length + DATA.getShipments().filter(s => s.status === CONFIG.STATUS_TYPES.DELIVERED).length) / totalShipments) * 360}deg;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Recent Shipments Table -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Recent Shipments</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Shipment ID</th>
                            <th>Supplier</th>
                            <th>Quantity (MT)</th>
                            <th>Shipment Date</th>
                            <th>ETA</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${DATA.getShipments()
                            .sort((a, b) => new Date(b.shipmentDate) - new Date(a.shipmentDate))
                            .slice(0, 5)
                            .map(shipment => `
                                <tr>
                                    <td>${shipment.id}</td>
                                    <td>${shipment.supplierName}</td>
                                    <td>${HELPERS.formatNumber(shipment.quantity)}</td>
                                    <td>${HELPERS.formatDate(shipment.shipmentDate)}</td>
                                    <td>${HELPERS.formatDate(shipment.eta)}</td>
                                    <td>${UI.createStatusPill(shipment.status)}</td>
                                </tr>
                            `).join('')
                        }
                    </tbody>
                </table>
            </div>
        `;
    },
    
    // Render supplier performance report
    renderSupplierPerformance: function() {
        // Get suppliers and their shipments
        const suppliers = DATA.getSuppliers();
        const shipments = DATA.getShipments();
        
        // Calculate supplier metrics
        const supplierMetrics = suppliers.map(supplier => {
            const supplierShipments = shipments.filter(s => s.supplierId === supplier.id);
            const totalShipments = supplierShipments.length;
            const totalQuantity = supplierShipments.reduce((sum, s) => sum + s.quantity, 0);
            const delayedShipments = supplierShipments.filter(s => s.status === CONFIG.STATUS_TYPES.DELAYED).length;
            const delayRate = totalShipments > 0 ? (delayedShipments / totalShipments) * 100 : 0;
            
            // Get quality checks for this supplier
            const qualityChecks = DATA.getQualityChecks({ supplierId: supplier.id });
            const avgMoistureDeviation = qualityChecks.length > 0 
                ? qualityChecks.reduce((sum, check) => sum + Math.abs(check.deviation.moisture), 0) / qualityChecks.length 
                : 0;
            
            return {
                id: supplier.id,
                name: supplier.name,
                totalShipments,
                totalQuantity,
                delayedShipments,
                delayRate,
                avgMoistureDeviation,
                rating: supplier.rating
            };
        });
        
        // Sort by total quantity
        supplierMetrics.sort((a, b) => b.totalQuantity - a.totalQuantity);
        
        // Calculate total for percentages
        const totalQuantity = supplierMetrics.reduce((sum, s) => sum + s.totalQuantity, 0);
        
        return `
            <!-- Supplier Performance Summary -->
            <div class="summary-boxes">
                <div class="summary-box">
                    <div class="summary-title">Total Suppliers</div>
                    <div class="summary-value">${suppliers.length}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Avg Supplier Rating</div>
                    <div class="summary-value">${HELPERS.formatNumber(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length, 1)}/5</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Total Shipments</div>
                    <div class="summary-value">${shipments.length}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Total Quantity</div>
                    <div class="summary-value">${HELPERS.formatNumber(totalQuantity)} MT</div>
                </div>
            </div>
            
            <!-- Supplier Performance Chart -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Supplier Volume Distribution</h4>
                <div class="chart-container">
                    <div style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
                        ${supplierMetrics.map(supplier => `
                            <div class="chart-bar-container">
                                <div class="chart-label">${supplier.name}</div>
                                <div class="chart-bar" style="width: ${(supplier.totalQuantity / totalQuantity) * 100}%; background-color: #3b82f6;">
                                    <span>${HELPERS.formatNumber(supplier.totalQuantity)} MT (${HELPERS.formatNumber((supplier.totalQuantity / totalQuantity) * 100, 1)}%)</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Supplier Performance Metrics -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Supplier Performance Metrics</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Supplier</th>
                            <th>Total Shipments</th>
                            <th>Total Quantity (MT)</th>
                            <th>Delay Rate</th>
                            <th>Moisture Deviation</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${supplierMetrics.map(supplier => `
                            <tr>
                                <td>${supplier.name}</td>
                                <td>${supplier.totalShipments}</td>
                                <td>${HELPERS.formatNumber(supplier.totalQuantity)}</td>
                                <td style="color: ${supplier.delayRate > 10 ? '#dc2626' : '#16a34a'}">
                                    ${HELPERS.formatNumber(supplier.delayRate, 1)}%
                                </td>
                                <td style="color: ${supplier.avgMoistureDeviation > 0.5 ? '#dc2626' : '#16a34a'}">
                                    ${HELPERS.formatNumber(supplier.avgMoistureDeviation, 2)}%
                                </td>
                                <td>
                                    <div style="display: flex; align-items: center;">
                                        <div style="width: 100px; background-color: #e5e7eb; height: 10px; border-radius: 5px; overflow: hidden;">
                                            <div style="width: ${(supplier.rating / 5) * 100}%; background-color: #f59e0b; height: 10px;"></div>
                                        </div>
                                        <span style="margin-left: 10px;">${supplier.rating}/5</span>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    // Render quality analysis report
    renderQualityAnalysis: function() {
        // Get quality checks
        const qualityChecks = DATA.getQualityChecks();
        
        // Calculate quality metrics
        const totalChecks = qualityChecks.length;
        const approvedChecks = qualityChecks.filter(check => check.status === 'approved').length;
        const rejectedChecks = qualityChecks.filter(check => check.status === 'rejected').length;
        const pendingChecks = totalChecks - approvedChecks - rejectedChecks;
        
        // Calculate average deviations
        const avgMoistureDeviation = totalChecks > 0 
            ? qualityChecks.reduce((sum, check) => sum + Math.abs(check.deviation.moisture), 0) / totalChecks 
            : 0;
        
        const avgWeightDeviation = totalChecks > 0 
            ? qualityChecks.reduce((sum, check) => sum + Math.abs(check.deviation.weight), 0) / totalChecks 
            : 0;
        
        // Group checks by pulp type
        const pulpTypes = {};
        qualityChecks.forEach(check => {
            if (!pulpTypes[check.pulpType]) {
                pulpTypes[check.pulpType] = {
                    count: 0,
                    totalMoistureDeviation: 0
                };
            }
            
            pulpTypes[check.pulpType].count++;
            pulpTypes[check.pulpType].totalMoistureDeviation += Math.abs(check.deviation.moisture);
        });
        
        // Calculate average moisture deviation by pulp type
        Object.keys(pulpTypes).forEach(type => {
            pulpTypes[type].avgMoistureDeviation = pulpTypes[type].totalMoistureDeviation / pulpTypes[type].count;
        });
        
        // Sort pulp types by count
        const sortedPulpTypes = Object.keys(pulpTypes).sort((a, b) => pulpTypes[b].count - pulpTypes[a].count);
        
        return `
            <!-- Quality Analysis Summary -->
            <div class="summary-boxes">
                <div class="summary-box">
                    <div class="summary-title">Total Quality Checks</div>
                    <div class="summary-value">${totalChecks}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Approval Rate</div>
                    <div class="summary-value">${totalChecks > 0 ? HELPERS.formatNumber((approvedChecks / totalChecks) * 100, 1) : 0}%</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Avg Moisture Deviation</div>
                    <div class="summary-value">${HELPERS.formatNumber(avgMoistureDeviation, 2)}%</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Avg Weight Deviation</div>
                    <div class="summary-value">${HELPERS.formatNumber(avgWeightDeviation, 2)} kg</div>
                </div>
            </div>
            
            <!-- Quality Status Chart -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Quality Check Status</h4>
                <div class="chart-container">
                    <div style="display: flex; height: 100%;">
                        <div style="flex: 0.6; padding-right: 20px;">
                            <div style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
                                <div class="chart-bar-container">
                                    <div class="chart-label">Approved</div>
                                    <div class="chart-bar" style="width: ${totalChecks > 0 ? (approvedChecks / totalChecks) * 100 : 0}%; background-color: #10b981;">
                                        <span>${approvedChecks} (${totalChecks > 0 ? HELPERS.formatNumber((approvedChecks / totalChecks) * 100, 1) : 0}%)</span>
                                    </div>
                                </div>
                                <div class="chart-bar-container">
                                    <div class="chart-label">Rejected</div>
                                    <div class="chart-bar" style="width: ${totalChecks > 0 ? (rejectedChecks / totalChecks) * 100 : 0}%; background-color: #ef4444;">
                                        <span>${rejectedChecks} (${totalChecks > 0 ? HELPERS.formatNumber((rejectedChecks / totalChecks) * 100, 1) : 0}%)</span>
                                    </div>
                                </div>
                                <div class="chart-bar-container">
                                    <div class="chart-label">Pending</div>
                                    <div class="chart-bar" style="width: ${totalChecks > 0 ? (pendingChecks / totalChecks) * 100 : 0}%; background-color: #f97316;">
                                        <span>${pendingChecks} (${totalChecks > 0 ? HELPERS.formatNumber((pendingChecks / totalChecks) * 100, 1) : 0}%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="flex: 0.4; display: flex; flex-direction: column; justify-content: center;">
                            <div class="pie-chart-container">
                                <div class="pie-chart">
                                    <div class="pie-slice" style="--percentage: ${totalChecks > 0 ? (approvedChecks / totalChecks) * 100 : 0}; --color: #10b981; --rotation: 0deg;"></div>
                                    <div class="pie-slice" style="--percentage: ${totalChecks > 0 ? (rejectedChecks / totalChecks) * 100 : 0}; --color: #ef4444; --rotation: ${totalChecks > 0 ? (approvedChecks / totalChecks) * 360 : 0}deg;"></div>
                                    <div class="pie-slice" style="--percentage: ${totalChecks > 0 ? (pendingChecks / totalChecks) * 100 : 0}; --color: #f97316; --rotation: ${totalChecks > 0 ? ((approvedChecks + rejectedChecks) / totalChecks) * 360 : 0}deg;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Pulp Type Quality Analysis -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Quality by Pulp Type</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Pulp Type</th>
                            <th>Total Checks</th>
                            <th>Avg Moisture Deviation</th>
                            <th>Quality Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedPulpTypes.map(type => `
                            <tr>
                                <td>${type}</td>
                                <td>${pulpTypes[type].count}</td>
                                <td style="color: ${pulpTypes[type].avgMoistureDeviation > 0.5 ? '#dc2626' : '#16a34a'}">
                                    ${HELPERS.formatNumber(pulpTypes[type].avgMoistureDeviation, 2)}%
                                </td>
                                <td>
                                    <div style="display: flex; align-items: center;">
                                        <div style="width: 100px; background-color: #e5e7eb; height: 10px; border-radius: 5px; overflow: hidden;">
                                            <div style="width: ${Math.max(0, 100 - (pulpTypes[type].avgMoistureDeviation * 50))}%; background-color: ${
                                                pulpTypes[type].avgMoistureDeviation <= 0.3 ? '#10b981' : 
                                                pulpTypes[type].avgMoistureDeviation <= 0.8 ? '#f97316' : '#ef4444'
                                            }; height: 10px;"></div>
                                        </div>
                                        <span style="margin-left: 10px;">${
                                            pulpTypes[type].avgMoistureDeviation <= 0.3 ? 'Excellent' : 
                                            pulpTypes[type].avgMoistureDeviation <= 0.8 ? 'Acceptable' : 'Poor'
                                        }</span>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <!-- Recent Quality Checks -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Recent Quality Checks</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Check ID</th>
                            <th>Date</th>
                            <th>Supplier</th>
                            <th>Pulp Type</th>
                            <th>Moisture Deviation</th>
                            <th>Weight Deviation</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${qualityChecks
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0, 5)
                            .map(check => `
                                <tr>
                                    <td>${check.id}</td>
                                    <td>${HELPERS.formatDate(check.date)}</td>
                                    <td>${check.supplierId}</td>
                                    <td>${check.pulpType}</td>
                                    <td style="color: ${Math.abs(check.deviation.moisture) > 0.5 ? '#dc2626' : '#16a34a'}">
                                        ${check.deviation.moisture > 0 ? '+' : ''}${HELPERS.formatNumber(check.deviation.moisture, 2)}%
                                    </td>
                                    <td style="color: ${Math.abs(check.deviation.weight) > 3 ? '#dc2626' : '#16a34a'}">
                                        ${check.deviation.weight > 0 ? '+' : ''}${HELPERS.formatNumber(check.deviation.weight, 2)} kg
                                    </td>
                                    <td>
                                        <span class="status-pill ${
                                            check.status === 'approved' ? 'status-delivered' : 
                                            check.status === 'rejected' ? 'status-delayed' : 'status-in-transit'
                                        }">
                                            ${HELPERS.toTitleCase(check.status)}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')
                        }
                    </tbody>
                </table>
            </div>
        `;
    },
    
    // Render inventory forecast report
    renderInventoryForecast: function() {
        // Get inventory and shipments
        const inventory = DATA.getInventory();
        const shipments = DATA.getShipments();
        
        // Calculate inventory metrics
        const totalCurrentInventory = inventory.reduce((sum, i) => sum + i.quantity, 0);
        const totalDailyConsumption = inventory.reduce((sum, i) => sum + (i.dailyConsumption || 0), 0);
        const inventoryDays = totalDailyConsumption > 0 ? Math.round(totalCurrentInventory / totalDailyConsumption) : 0;
        
        // Calculate incoming shipments (in transit)
        const incomingShipments = shipments.filter(s => 
            s.status === CONFIG.STATUS_TYPES.IN_TRANSIT || 
            s.status === CONFIG.STATUS_TYPES.AT_PORT || 
            s.status === CONFIG.STATUS_TYPES.IN_CUSTOMS
        );
        
        const incomingQuantity = incomingShipments.reduce((sum, s) => sum + s.quantity, 0);
        const projectedInventory = totalCurrentInventory + incomingQuantity;
        const projectedDays = totalDailyConsumption > 0 ? Math.round(projectedInventory / totalDailyConsumption) : 0;
        
        // Group inventory by plant
        const plantInventory = {};
        inventory.forEach(item => {
            if (!plantInventory[item.plantId]) {
                plantInventory[item.plantId] = {
                    name: item.plantName,
                    totalQuantity: 0,
                    totalConsumption: 0,
                    items: []
                };
            }
            
            plantInventory[item.plantId].totalQuantity += item.quantity;
            plantInventory[item.plantId].totalConsumption += (item.dailyConsumption || 0);
            plantInventory[item.plantId].items.push(item);
        });
        
        // Group incoming shipments by plant
        incomingShipments.forEach(shipment => {
            if (plantInventory[shipment.plantId]) {
                if (!plantInventory[shipment.plantId].incomingQuantity) {
                    plantInventory[shipment.plantId].incomingQuantity = 0;
                }
                plantInventory[shipment.plantId].incomingQuantity += shipment.quantity;
            }
        });
        
        // Calculate days of inventory for each plant
        Object.keys(plantInventory).forEach(plantId => {
            const plant = plantInventory[plantId];
            plant.currentDays = plant.totalConsumption > 0 ? Math.round(plant.totalQuantity / plant.totalConsumption) : 0;
            plant.projectedDays = plant.totalConsumption > 0 ? Math.round((plant.totalQuantity + (plant.incomingQuantity || 0)) / plant.totalConsumption) : 0;
        });
        
        return `
            <!-- Inventory Forecast Summary -->
            <div class="summary-boxes">
                <div class="summary-box">
                    <div class="summary-title">Current Inventory</div>
                    <div class="summary-value">${HELPERS.formatNumber(totalCurrentInventory)} MT</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Daily Consumption</div>
                    <div class="summary-value">${HELPERS.formatNumber(totalDailyConsumption)} MT/day</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Current Days</div>
                    <div class="summary-value">${inventoryDays} days</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Incoming Quantity</div>
                    <div class="summary-value">${HELPERS.formatNumber(incomingQuantity)} MT</div>
                </div>
            </div>
            
            <!-- Forecast Chart -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Inventory Projection</h4>
                <div class="chart-container">
                    <div style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; align-items: center; margin-bottom: 20px;">
                            <div style="flex: 0.25; text-align: center;">
                                <div style="font-weight: bold; margin-bottom: 5px;">Current Inventory</div>
                                <div style="font-size: 24px;">${HELPERS.formatNumber(totalCurrentInventory)} MT</div>
                                <div style="color: #6b7280;">${inventoryDays} days</div>
                            </div>
                            <div style="flex: 0.5; display: flex; align-items: center; justify-content: center;">
                                <div class="projection-arrow" style="display: flex; flex-direction: column; align-items: center;">
                                    <div style="color: #6b7280; margin-bottom: 5px;">+ Incoming Shipments</div>
                                    <div style="font-weight: bold;">${HELPERS.formatNumber(incomingQuantity)} MT</div>
                                    <div style="font-size: 30px; color: #3b82f6; margin: 5px 0;">→</div>
                                </div>
                            </div>
                            <div style="flex: 0.25; text-align: center;">
                                <div style="font-weight: bold; margin-bottom: 5px;">Projected Inventory</div>
                                <div style="font-size: 24px;">${HELPERS.formatNumber(projectedInventory)} MT</div>
                                <div style="color: #6b7280;">${projectedDays} days</div>
                            </div>
                        </div>
                        
                        <!-- Bar chart comparing current and projected inventory -->
                        <div style="margin-top: 20px;">
                            <div class="chart-bar-container" style="margin-bottom: 20px;">
                                <div class="chart-label">Current</div>
                                <div class="chart-bar" style="width: ${(totalCurrentInventory / projectedInventory) * 100}%; background-color: #3b82f6;">
                                    <span>${HELPERS.formatNumber(totalCurrentInventory)} MT</span>
                                </div>
                            </div>
                            <div class="chart-bar-container">
                                <div class="chart-label">Projected</div>
                                <div class="chart-bar" style="width: 100%; background-color: #10b981;">
                                    <span>${HELPERS.formatNumber(projectedInventory)} MT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Plant-wise Inventory Projection -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Plant-wise Inventory Projection</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Plant</th>
                            <th>Current Inventory (MT)</th>
                            <th>Daily Consumption (MT)</th>
                            <th>Current Days</th>
                            <th>Incoming Quantity (MT)</th>
                            <th>Projected Days</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(plantInventory).map(plantId => {
                            const plant = plantInventory[plantId];
                            const currentStatus = plant.currentDays < 15 ? 'Critical' : 
                                                plant.currentDays < 30 ? 'Low' : 'Adequate';
                            const projectedStatus = plant.projectedDays < 15 ? 'Critical' : 
                                                   plant.projectedDays < 30 ? 'Low' : 'Adequate';
                            const statusColor = currentStatus === 'Critical' ? '#ef4444' : 
                                              currentStatus === 'Low' ? '#f97316' : '#10b981';
                            const projectedColor = projectedStatus === 'Critical' ? '#ef4444' : 
                                                 projectedStatus === 'Low' ? '#f97316' : '#10b981';
                            
                            return `
                                <tr>
                                    <td>${plant.name}</td>
                                    <td>${HELPERS.formatNumber(plant.totalQuantity)}</td>
                                    <td>${HELPERS.formatNumber(plant.totalConsumption)}</td>
                                    <td style="color: ${statusColor}">${plant.currentDays} days</td>
                                    <td>${HELPERS.formatNumber(plant.incomingQuantity || 0)}</td>
                                    <td style="color: ${projectedColor}">${plant.projectedDays} days</td>
                                    <td>
                                        <span class="status-pill ${
                                            currentStatus === 'Critical' ? 'status-delayed' : 
                                            currentStatus === 'Low' ? 'status-in-transit' : 'status-delivered'
                                        }">
                                            ${currentStatus}
                                        </span>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <!-- Items Needing Reorder -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Items Needing Reorder</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Plant</th>
                            <th>Pulp Type</th>
                            <th>Current Quantity (MT)</th>
                            <th>Min Level (MT)</th>
                            <th>Reorder Point (MT)</th>
                            <th>Days Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inventory
                            .filter(item => item.availableQuantity <= item.reorderPoint)
                            .sort((a, b) => {
                                // Calculate days remaining
                                const aDays = a.dailyConsumption > 0 ? a.availableQuantity / a.dailyConsumption : Infinity;
                                const bDays = b.dailyConsumption > 0 ? b.availableQuantity / b.dailyConsumption : Infinity;
                                return aDays - bDays;
                            })
                            .map(item => {
                                const daysRemaining = item.dailyConsumption > 0 ? Math.round(item.availableQuantity / item.dailyConsumption) : 'N/A';
                                
                                return `
                                    <tr>
                                        <td>${item.plantName}</td>
                                        <td>${item.pulpType}</td>
                                        <td>${HELPERS.formatNumber(item.availableQuantity)}</td>
                                        <td>${HELPERS.formatNumber(item.minLevel)}</td>
                                        <td>${HELPERS.formatNumber(item.reorderPoint)}</td>
                                        <td style="color: ${
                                            daysRemaining === 'N/A' ? '#6b7280' : 
                                            daysRemaining < 7 ? '#ef4444' : 
                                            daysRemaining < 15 ? '#f97316' : '#10b981'
                                        }">
                                            ${daysRemaining === 'N/A' ? daysRemaining : `${daysRemaining} days`}
                                        </td>
                                    </tr>
                                `;
                            }).join('')
                        }
                    </tbody>
                </table>
            </div>
        `;
    },
    
    // Render logistics efficiency report
    renderLogisticsEfficiency: function() {
        // Get shipments and customs data
        const shipments = DATA.getShipments();
        const customs = DATA.getCustoms();
        
        // Calculate logistics metrics
        const completedShipments = shipments.filter(s => s.arrivalDate);
        const totalTransitDays = completedShipments.reduce((sum, s) => {
            return sum + HELPERS.dateDiffInDays(s.shipmentDate, s.arrivalDate);
        }, 0);
        const avgTransitDays = completedShipments.length > 0 ? Math.round(totalTransitDays / completedShipments.length) : 0;
        
        // Calculate port stay metrics
        const customsProcessed = customs.filter(c => c.status === 'completed');
        const totalPortDays = customsProcessed.reduce((sum, c) => {
            const arrivalDate = new Date(c.arrivalDate);
            const completionEvents = c.timeline.filter(e => e.event.includes('Delivery') && e.status === 'completed');
            
            if (completionEvents.length > 0) {
                const completionDate = new Date(completionEvents[0].date);
                return sum + HELPERS.dateDiffInDays(arrivalDate, completionDate);
            }
            
            return sum;
        }, 0);
        const avgPortDays = customsProcessed.length > 0 ? Math.round(totalPortDays / customsProcessed.length) : 0;
        
        // Calculate detention incidents
        const detentionRisks = DATA.getDetentionRisks();
        const potentialDetentionFees = detentionRisks.reduce((sum, risk) => sum + risk.potentialFees, 0);
        
        // Group transit times by route
        const routes = {};
        completedShipments.forEach(shipment => {
            const routeKey = `${shipment.originPort} → ${shipment.destinationPort}`;
            
            if (!routes[routeKey]) {
                routes[routeKey] = {
                    originPort: shipment.originPort,
                    destinationPort: shipment.destinationPort,
                    shipments: [],
                    totalDays: 0
                };
            }
            
            const transitDays = HELPERS.dateDiffInDays(shipment.shipmentDate, shipment.arrivalDate);
            routes[routeKey].shipments.push(shipment);
            routes[routeKey].totalDays += transitDays;
        });
        
        // Calculate average transit time per route
        Object.keys(routes).forEach(routeKey => {
            const route = routes[routeKey];
            route.avgDays = Math.round(route.totalDays / route.shipments.length);
        });
        
        // Sort routes by number of shipments
        const sortedRoutes = Object.keys(routes).sort((a, b) => routes[b].shipments.length - routes[a].shipments.length);
        
        return `
            <!-- Logistics Efficiency Summary -->
            <div class="summary-boxes">
                <div class="summary-box">
                    <div class="summary-title">Total Shipments</div>
                    <div class="summary-value">${shipments.length}</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Avg Transit Time</div>
                    <div class="summary-value">${avgTransitDays} days</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Avg Port Stay</div>
                    <div class="summary-value">${avgPortDays} days</div>
                </div>
                <div class="summary-box">
                    <div class="summary-title">Detention Incidents</div>
                    <div class="summary-value">${detentionRisks.length}</div>
                </div>
            </div>
            
            <!-- Transit Time Chart -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Transit Time by Route</h4>
                <div class="chart-container">
                    <div style="height: 100%; display: flex; flex-direction: column; justify-content: center;">
                        ${sortedRoutes.slice(0, 5).map(routeKey => {
                            const route = routes[routeKey];
                            const expectedDays = DATA.getTransitTime(route.originPort, route.destinationPort);
                            const deviation = route.avgDays - expectedDays;
                            const deviationColor = deviation > 5 ? '#ef4444' : deviation > 0 ? '#f97316' : '#10b981';
                            
                            return `
                                <div class="chart-bar-container">
                                    <div class="chart-label" style="max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${routeKey}">
                                        ${routeKey}
                                    </div>
                                    <div style="display: flex; flex: 1; align-items: center;">
                                        <div class="chart-bar" style="width: ${(route.avgDays / 50) * 100}%; max-width: 100%; background-color: #3b82f6;">
                                            <span>${route.avgDays} days</span>
                                        </div>
                                        <span style="margin-left: 10px; color: ${deviationColor};">
                                            ${deviation > 0 ? `+${deviation}` : deviation} days
                                        </span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Detention Risk Analysis -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Detention Risk Analysis</h4>
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div style="flex: 0.6; background-color: white; padding: 15px; border-radius: 5px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                        <div style="font-weight: bold; margin-bottom: 10px;">Detention Fee Exposure</div>
                        <div style="font-size: 24px;">${HELPERS.formatCurrency(potentialDetentionFees)}</div>
                        <div style="color: #6b7280; margin-top: 5px;">Based on ${detentionRisks.length} incidents</div>
                    </div>
                    <div style="flex: 0.4; background-color: white; padding: 15px; border-radius: 5px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                        <div style="font-weight: bold; margin-bottom: 10px;">Daily Rate</div>
                        <div style="font-size: 24px;">${HELPERS.formatCurrency(CONFIG.CONSTANTS.DETENTION_RATE)}</div>
                        <div style="color: #6b7280; margin-top: 5px;">Per container per day</div>
                    </div>
                </div>
                
                ${detentionRisks.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Shipment ID</th>
                                <th>BL Number</th>
                                <th>Port</th>
                                <th>Containers</th>
                                <th>Days at Port</th>
                                <th>Detention Fees</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${detentionRisks.map(risk => `
                                <tr>
                                    <td>${risk.shipmentId}</td>
                                    <td>${risk.blNumber}</td>
                                    <td>${risk.port}</td>
                                    <td>${risk.containers}</td>
                                    <td>${risk.daysAtPort}</td>
                                    <td>${HELPERS.formatCurrency(risk.potentialFees)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p>No detention incidents found.</p>'}
            </div>
            
            <!-- Customs Process Efficiency -->
            <div style="margin-top: 20px;">
                <h4 style="margin-bottom: 10px;">Customs Process Efficiency</h4>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Process Step</th>
                            <th>Average Time (days)</th>
                            <th>Success Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Vessel Arrival to IGM Filing</td>
                            <td>1.2</td>
                            <td>98%</td>
                        </tr>
                        <tr>
                            <td>Bill of Entry Filing</td>
                            <td>2.3</td>
                            <td>95%</td>
                        </tr>
                        <tr>
                            <td>Customs Examination</td>
                            <td>1.8</td>
                            <td>92%</td>
                        </tr>
                        <tr>
                            <td>Duty Payment</td>
                            <td>1.5</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <td>Delivery Order to Transport</td>
                            <td>2.1</td>
                            <td>88%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    },
    
    // Apply custom styles for reports
    applyReportStyles: function() {
        // Add custom styles for report components
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .reports-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .report-item {
                padding: 15px;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: all 0.2s ease;
            }
            
            .report-item:hover {
                background-color: #f3f4f6;
            }
            
            .report-item.active {
                background-color: #eff6ff;
                border-left: 3px solid #3b82f6;
            }
            
            .report-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background-color: #e5e7eb;
                border-radius: 8px;
            }
            
            .report-item.active .report-icon {
                background-color: #dbeafe;
                color: #3b82f6;
            }
            
            .report-info {
                flex: 1;
            }
            
            .report-name {
                font-weight: 500;
                margin-bottom: 3px;
            }
            
            .report-description {
                font-size: 13px;
                color: #6b7280;
            }
            
            .chart-bar-container {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
            }
            
            .chart-label {
                width: 150px;
                font-size: 14px;
                padding-right: 10px;
            }
            
            .chart-bar {
                height: 24px;
                min-width: 30px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                padding: 0 10px;
                color: white;
                font-size: 13px;
                position: relative;
                transition: width 0.5s ease;
            }
            
            .chart-bar span {
                white-space: nowrap;
            }
            
            .pie-chart-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
            }
            
            .pie-chart {
                position: relative;
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background-color: #e5e7eb;
                overflow: hidden;
            }
            
            .pie-slice {
                position: absolute;
                width: 100%;
                height: 100%;
                transform-origin: 50% 50%;
                background-color: var(--color);
                transform: rotate(var(--rotation)) skew(calc(90deg - (3.6deg * var(--percentage))));
            }
        `;
        
        document.head.appendChild(styleElement);
    },
    
    // Set up event handlers
    setupEventHandlers: function() {
        // Report selection
        const reportItems = document.querySelectorAll('.report-item');
        reportItems.forEach(item => {
            item.addEventListener('click', () => {
                const reportType = item.getAttribute('data-report');
                this.state.reportType = reportType;
                this.renderTab();
            });
        });
        
        // Date range selection
        const dateRangeSelect = document.getElementById('date-range');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', () => {
                this.state.dateRange = dateRangeSelect.value;
                this.renderTab();
            });
        }
        
        // Custom date inputs
        const customDateFrom = document.getElementById('custom-date-from');
        const customDateTo = document.getElementById('custom-date-to');
        
        if (customDateFrom) {
            customDateFrom.addEventListener('change', () => {
                this.state.customDateFrom = customDateFrom.value;
            });
        }
        
        if (customDateTo) {
            customDateTo.addEventListener('change', () => {
                this.state.customDateTo = customDateTo.value;
            });
        }
        
        // Generate report button
        const generateReportBtn = document.getElementById('generate-report');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => {
                // In a real application, this would refresh the report data based on selected filters
                UI.notification.success('Report generated successfully');
            });
        }
        
        // Export report button
        const exportReportBtn = document.getElementById('export-report');
        if (exportReportBtn) {
            exportReportBtn.addEventListener('click', () => {
                UI.notification.success('Report exported to PDF (simulation)');
            });
        }
        
        // Report-specific filters
        const supplierSelect = document.getElementById('filter-supplier');
        if (supplierSelect) {
            supplierSelect.addEventListener('change', () => {
                this.state.filters.supplier = supplierSelect.value;
            });
        }
        
        const plantSelect = document.getElementById('filter-plant');
        if (plantSelect) {
            plantSelect.addEventListener('change', () => {
                this.state.filters.plant = plantSelect.value;
            });
        }
        
        const pulpTypeSelect = document.getElementById('filter-pulp-type');
        if (pulpTypeSelect) {
            pulpTypeSelect.addEventListener('change', () => {
                this.state.filters.pulpType = pulpTypeSelect.value;
            });
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
    
    // Get pulp type options for filter dropdown
    getPulpTypeOptions: function() {
        const pulpTypes = new Set();
        
        // Get unique pulp types from inventory
        DATA.getInventory().forEach(item => {
            if (item.pulpType) {
                pulpTypes.add(item.pulpType);
            }
        });
        
        // Get unique pulp types from quality checks
        DATA.getQualityChecks().forEach(check => {
            if (check.pulpType) {
                pulpTypes.add(check.pulpType);
            }
        });
        
        return Array.from(pulpTypes).sort().map(type => 
            `<option value="${type}" ${this.state.filters.pulpType === type ? 'selected' : ''}>${type}</option>`
        ).join('');
    }
};
