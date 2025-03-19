// Global chart instances object to track and manage charts
const chartInstances = {};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing core page elements...');
    
    // Initialize Platform Diagram
    initPlatformDiagram();
    
    // Initialize Security Architecture Diagram
    initSecurityArchitecture();
    
    // Initialize Industry Tabs
    initIndustryTabs();
    
    // Set up lazy loading for charts
    setupLazyChartLoading();
    
    // Specifically force the pie chart to initialize after a delay
    setTimeout(() => {
        initDifferentiatorsPieChart();
    }, 300);
});

// Setup lazy loading observer for charts
function setupLazyChartLoading() {
    console.log('Setting up chart loading...');
    
    // Always initialize these two main charts immediately
    setTimeout(() => {
        initTimeToInsightChart();
        initDifferentiatorsPieChart();
        initCrossIndustryRadarChart();
        console.log('Main charts initialized');
    }, 100);
    
    // If IntersectionObserver is not supported, fall back to loading all charts
    if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver not supported, loading all charts immediately');
        setTimeout(() => {
            initManufacturingChart();
            initFinancialChart();
            initHealthcareChart();
            initRetailChart();
        }, 200);
        return;
    }
    
    const chartContainers = document.querySelectorAll('.chart-container');
    console.log(`Found ${chartContainers.length} chart containers`);
    
    // Create options for the observer with very generous margins
    const options = {
        root: null,
        rootMargin: '500px', // Much larger margin to detect charts far from viewport
        threshold: 0.01      // Very low threshold to trigger even with minimal visibility
    };
    
    // Log all chart canvases for debugging
    document.querySelectorAll('canvas').forEach(canvas => {
        console.log(`Found canvas: ${canvas.id}`);
    });
    
    // Create observer instance
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const chartId = container.querySelector('canvas')?.id;
                
                if (chartId) {
                    console.log(`Observer detected chart: ${chartId}`);
                    
                    // Initialize the appropriate chart based on its ID
                    switch (chartId) {
                        case 'timeToInsightChart':
                            initTimeToInsightChart();
                            break;
                        case 'differentiatorsPieChart':
                            initDifferentiatorsPieChart();
                            break;
                        case 'manufacturingChart':
                            initManufacturingChart();
                            break;
                        case 'financialChart':
                            initFinancialChart();
                            break;
                        case 'healthcareChart':
                            initHealthcareChart();
                            break;
                        case 'retailChart':
                            initRetailChart();
                            break;
                        case 'crossIndustryRadarChart':
                            initCrossIndustryRadarChart();
                            break;
                        default:
                            console.log(`No initialization function for chart: ${chartId}`);
                    }
                    
                    // Stop observing this element once initialized
                    observer.unobserve(container);
                }
            }
        });
    }, options);
    
    // Start observing each chart container
    chartContainers.forEach(container => {
        observer.observe(container);
        console.log(`Observing container with canvas: ${container.querySelector('canvas')?.id || 'no canvas'}`);
    });
    
    // Fallback: Load all charts after a delay if they haven't loaded yet
    setTimeout(() => {
        console.log('Fallback: Loading any remaining charts');
        const chartIds = ['differentiatorsPieChart', 'manufacturingChart', 'financialChart', 
                          'healthcareChart', 'retailChart', 'crossIndustryRadarChart'];
                          
        chartIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas && !chartInstances[id]) {
                console.log(`Fallback loading: ${id}`);
                switch (id) {
                    case 'differentiatorsPieChart':
                        initDifferentiatorsPieChart();
                        break;
                    case 'manufacturingChart':
                        initManufacturingChart();
                        break; 
                    case 'financialChart':
                        initFinancialChart();
                        break;
                    case 'healthcareChart':
                        initHealthcareChart();
                        break;
                    case 'retailChart':
                        initRetailChart();
                        break;
                    case 'crossIndustryRadarChart':
                        initCrossIndustryRadarChart();
                        break;
                }
            }
        });
    }, 1000);
}

// Platform Diagram SVG
function initPlatformDiagram() {
    const container = document.getElementById('platform-diagram');
    if (!container) return;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 800 600");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    
    // ParamAI Studio
    const studioRect = createRect(250, 50, 300, 80, "#FDCC4E", 8);
    const studioText = createText("ParamAI Studio", 400, 100, 24, "#1a1a1a", "middle", true);
    
    // Connection lines from ParamAI to products
    const line1 = createPath("M400 130 L400 170 L200 170 L200 190", "#1a1a1a", 2, "5,5");
    const line2 = createPath("M400 130 L400 170 L600 170 L600 190", "#1a1a1a", 2, "5,5");
    
    // Quantum Minds
    const quantumRect = createRect(50, 190, 300, 80, "#B066F7", 8);
    const quantumText = createText("Quantum Minds", 200, 240, 24, "#ffffff", "middle", true);
    
    // Lightning RAG
    const lightningRect = createRect(450, 190, 300, 80, "#62A9FB", 8);
    const lightningText = createText("Lightning ⚡ RAG", 600, 240, 24, "#ffffff", "middle", true);
    
    // Connection lines from products to data types
    const line3 = createPath("M200 270 L200 310 L400 310 L400 340", "#1a1a1a", 2, "5,5");
    const line4 = createPath("M600 270 L600 310 L400 310 L400 340", "#1a1a1a", 2, "5,5");
    
    // Data structure types
    const structuredRect = createRect(50, 340, 200, 60, "#62A9FB", 8);
    const structuredText = createText("Structured", 150, 375, 18, "#ffffff", "middle");
    
    const semiStructuredRect = createRect(300, 340, 200, 60, "#62A9FB", 8);
    const semiStructuredText = createText("Semi-Structured", 400, 375, 18, "#ffffff", "middle");
    
    const unstructuredRect = createRect(550, 340, 200, 60, "#62A9FB", 8);
    const unstructuredText = createText("Unstructured", 650, 375, 18, "#ffffff", "middle");
    
    // Connection lines from structure types to data sources
    const line5 = createPath("M150 400 L150 450", "#1a1a1a", 2, "5,5");
    const line6 = createPath("M400 400 L300 450", "#1a1a1a", 2, "5,5");
    const line7 = createPath("M400 400 L500 450", "#1a1a1a", 2, "5,5");
    const line8 = createPath("M650 400 L650 450", "#1a1a1a", 2, "5,5");
    
    // Data sources
    const sqlRect = createRect(50, 450, 200, 60, "#62A9FB", 8);
    const sqlText = createText("SQL", 150, 485, 18, "#ffffff", "middle");
    
    const mongoRect = createRect(200, 450, 200, 60, "#62A9FB", 8);
    const mongoText = createText("MongoDB", 300, 485, 18, "#ffffff", "middle");
    
    const apiRect = createRect(400, 450, 200, 60, "#62A9FB", 8);
    const apiText = createText("APIs", 500, 485, 18, "#ffffff", "middle");
    
    const docRect = createRect(550, 450, 200, 60, "#62A9FB", 8);
    const docText = createText("Documents", 650, 485, 18, "#ffffff", "middle");
    
    // Add elements to SVG
    svg.appendChild(studioRect);
    svg.appendChild(studioText);
    
    svg.appendChild(line1);
    svg.appendChild(line2);
    
    svg.appendChild(quantumRect);
    svg.appendChild(quantumText);
    
    svg.appendChild(lightningRect);
    svg.appendChild(lightningText);
    
    svg.appendChild(line3);
    svg.appendChild(line4);
    
    svg.appendChild(structuredRect);
    svg.appendChild(structuredText);
    
    svg.appendChild(semiStructuredRect);
    svg.appendChild(semiStructuredText);
    
    svg.appendChild(unstructuredRect);
    svg.appendChild(unstructuredText);
    
    svg.appendChild(line5);
    svg.appendChild(line6);
    svg.appendChild(line7);
    svg.appendChild(line8);
    
    svg.appendChild(sqlRect);
    svg.appendChild(sqlText);
    
    svg.appendChild(mongoRect);
    svg.appendChild(mongoText);
    
    svg.appendChild(apiRect);
    svg.appendChild(apiText);
    
    svg.appendChild(docRect);
    svg.appendChild(docText);
    
    container.appendChild(svg);
}

// Time to Insight Chart
function initTimeToInsightChart() {
    const canvasId = 'timeToInsightChart';
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return;
    }
    
    // Destroy existing chart if it exists
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
        delete chartInstances[canvasId];
    }
    
    try {
        chartInstances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Data Analysis', 'Document Processing', 'Compliance Reporting', 'Market Intelligence'],
                datasets: [
                    {
                        label: 'Traditional Approach (hours)',
                        data: [4.7, 2.3, 6.2, 8.4],
                        backgroundColor: '#666666',
                        order: 2
                    },
                    {
                        label: 'ParamAI Studio (hours)',
                        data: [0.14, 0.10, 0.24, 0.36],
                        backgroundColor: '#4F46E5',
                        order: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
        
        console.log(`${canvasId} initialized successfully`);
    } catch (error) {
        console.error(`Error initializing ${canvasId}:`, error);
    }
}

// Differentiators Pie Chart
function initDifferentiatorsPieChart() {
    const canvasId = 'differentiatorsPieChart';
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return;
    }
    
    console.log(`Initializing ${canvasId} with direct approach`);
    
    // Set proper dimensions for pie chart to prevent chopping
    ctx.style.height = '350px';
    ctx.style.width = '100%';
    if (ctx.parentElement) {
        ctx.parentElement.style.height = '450px'; // Increased height
        ctx.parentElement.style.maxHeight = '450px'; // Increased max height
        ctx.parentElement.style.overflow = 'visible'; // Allow content to be visible
        ctx.parentElement.style.position = 'relative';
    }
    
    // Destroy existing chart if it exists
    if (chartInstances[canvasId]) {
        console.log(`Destroying existing ${canvasId} instance`);
        chartInstances[canvasId].destroy();
        delete chartInstances[canvasId];
    }
    
    try {
        // Simpler configuration with fewer options
        chartInstances[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'All-in-One Platform',
                    'Human-AI Collaboration',
                    'Enterprise Security',
                    'Implementation Speed',
                    'Cost Efficiency'
                ],
                datasets: [{
                    data: [35, 28, 18, 12, 7],
                    backgroundColor: [
                        '#4F46E5',
                        '#818CF8',
                        '#3730A3',
                        '#A78BFA',
                        '#C7D2FE'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,  // Changed to true for more stability
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        },
                        align: 'center',
                        display: true,
                        fullSize: true
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                layout: {
                    padding: 20
                },
                animation: {
                    duration: 500 // Shorter animation time
                }
            }
        });
        
        console.log(`${canvasId} initialized successfully`);
    } catch (error) {
        console.error(`Error initializing ${canvasId}:`, error);
    }
}

// Industry Charts
function initIndustryCharts() {
    console.log('Initializing industry charts');
    // Initialize all industry charts at once
    setTimeout(() => {
        initManufacturingChart();
        initFinancialChart();
        initHealthcareChart();
        initRetailChart();
        console.log('All industry charts initialized');
    }, 100);
}

function initManufacturingChart() {
    const canvasId = 'manufacturingChart';
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return;
    }
    
    // Destroy existing chart if it exists
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
        delete chartInstances[canvasId];
    }
    
    try {
        chartInstances[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'Predictive Maintenance (30% cost reduction)',
                    'Quality Control (25% defect reduction)',
                    'Supply Chain (20% efficiency improvement)'
                ],
                datasets: [{
                    data: [42, 35, 23],
                    backgroundColor: [
                        '#4F46E5',
                        '#818CF8',
                        '#C7D2FE'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
        
        console.log(`${canvasId} initialized successfully`);
    } catch (error) {
        console.error(`Error initializing ${canvasId}:`, error);
    }
}

function initFinancialChart() {
    const canvasId = 'financialChart';
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return;
    }
    
    // Destroy existing chart if it exists
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
        delete chartInstances[canvasId];
    }
    
    try {
        chartInstances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Risk Assessment', 'Fraud Detection', 'Regulatory Compliance'],
                datasets: [{
                    label: 'Improvement (%)',
                    data: [70, 40, 65],
                    backgroundColor: '#4F46E5'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
        
        console.log(`${canvasId} initialized successfully`);
    } catch (error) {
        console.error(`Error initializing ${canvasId}:`, error);
    }
}

function initHealthcareChart() {
    const canvasId = 'healthcareChart';
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return;
    }
    
    // Destroy existing chart if it exists
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
        delete chartInstances[canvasId];
    }
    
    try {
        chartInstances[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Patient Data Analysis',
                    'Administrative Automation',
                    'Research Processing',
                    'Readmission Reduction',
                    'Patient Satisfaction'
                ],
                datasets: [{
                    label: 'Improvement (%)',
                    data: [35, 50, 60, 27, 31],
                    fill: true,
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: '#4F46E5',
                    pointBackgroundColor: '#4F46E5',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#4F46E5'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        borderWidth: 3
                    }
                }
            }
        });
        
        console.log(`${canvasId} initialized successfully`);
    } catch (error) {
        console.error(`Error initializing ${canvasId}:`, error);
    }
}

function initRetailChart() {
    const canvasId = 'retailChart';
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return;
    }
    
    // Destroy existing chart if it exists
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
        delete chartInstances[canvasId];
    }
    
    try {
        chartInstances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Inventory Stockouts', 'Sales from Insights', 'Supply Chain Efficiency'],
                datasets: [
                    {
                        label: 'Before ParamAI',
                        data: [60, 75, 70],
                        backgroundColor: '#666666'
                    },
                    {
                        label: 'After ParamAI',
                        data: [100, 100, 100],
                        type: 'line',
                        borderColor: '#4F46E5',
                        borderWidth: 2,
                        fill: false,
                        pointBackgroundColor: '#4F46E5'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Performance'
                        }
                    }
                }
            }
        });
        
        console.log(`${canvasId} initialized successfully`);
    } catch (error) {
        console.error(`Error initializing ${canvasId}:`, error);
    }
}

// Cross-Industry Radar Chart
function initCrossIndustryRadarChart() {
    const canvasId = 'crossIndustryRadarChart';
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return;
    }
    
    // Destroy existing chart if it exists
    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
        delete chartInstances[canvasId];
    }
    
    try {
        chartInstances[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Cost Reduction',
                    'Efficiency Gain',
                    'Time Savings',
                    'Error Reduction',
                    'Performance Increase'
                ],
                datasets: [
                    {
                        label: 'Manufacturing',
                        data: [30, 25, 20, 43, 38],
                        backgroundColor: 'rgba(79, 70, 229, 0.2)',
                        borderColor: '#4F46E5',
                        pointBackgroundColor: '#4F46E5'
                    },
                    {
                        label: 'Financial',
                        data: [70, 40, 65, 62, 58],
                        backgroundColor: 'rgba(129, 140, 248, 0.2)',
                        borderColor: '#818CF8',
                        pointBackgroundColor: '#818CF8'
                    },
                    {
                        label: 'Healthcare',
                        data: [35, 50, 60, 27, 31],
                        backgroundColor: 'rgba(55, 48, 163, 0.2)',
                        borderColor: '#3730A3',
                        pointBackgroundColor: '#3730A3'
                    },
                    {
                        label: 'Retail',
                        data: [40, 25, 30, 92, 23],
                        backgroundColor: 'rgba(167, 139, 250, 0.2)',
                        borderColor: '#A78BFA',
                        pointBackgroundColor: '#A78BFA'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        borderWidth: 2
                    }
                }
            }
        });
        
        console.log(`${canvasId} initialized successfully`);
    } catch (error) {
        console.error(`Error initializing ${canvasId}:`, error);
    }
}

// Security Architecture Diagram
function initSecurityArchitecture() {
    const svg = document.getElementById('security-architecture');
    if (!svg) return;
    
    // Define groups
    const securityLayer = createGroup();
    const dataLayer = createGroup();
    const aiLayer = createGroup();
    const userLayer = createGroup();
    
    // Security Layer
    const securityText = createText("Security Layer", 300, 50, 16, "#1a1a1a", "middle", true);
    const securityRect = createRect(100, 70, 400, 80, "#f0f0ff", 8);
    
    const encryptionText = createText("AES-256 Encryption", 180, 100, 12, "#1a1a1a", "middle");
    const zeroTrustText = createText("Zero Trust Architecture", 180, 130, 12, "#1a1a1a", "middle");
    const mfaText = createText("MFA", 320, 100, 12, "#1a1a1a", "middle");
    const rbacText = createText("RBAC", 320, 130, 12, "#1a1a1a", "middle");
    
    securityLayer.appendChild(securityText);
    securityLayer.appendChild(securityRect);
    securityLayer.appendChild(encryptionText);
    securityLayer.appendChild(zeroTrustText);
    securityLayer.appendChild(mfaText);
    securityLayer.appendChild(rbacText);
    
    // Data Layer
    const dataText = createText("Data Layer", 300, 170, 16, "#1a1a1a", "middle", true);
    const dataRect = createRect(100, 190, 400, 80, "#f5f5f5", 8);
    
    const vectorText = createText("Vector Database", 180, 220, 12, "#1a1a1a", "middle");
    const relationalText = createText("Relational Store", 180, 250, 12, "#1a1a1a", "middle");
    const documentText = createText("Document Store", 320, 220, 12, "#1a1a1a", "middle");
    const processingText = createText("Data Processing", 320, 250, 12, "#1a1a1a", "middle");
    
    dataLayer.appendChild(dataText);
    dataLayer.appendChild(dataRect);
    dataLayer.appendChild(vectorText);
    dataLayer.appendChild(relationalText);
    dataLayer.appendChild(documentText);
    dataLayer.appendChild(processingText);
    
    // AI Layer
    const aiText = createText("AI Layer", 300, 290, 16, "#1a1a1a", "middle", true);
    const aiRect = createRect(100, 310, 400, 80, "#f5f5f5", 8);
    
    const modelText = createText("Model Management", 180, 340, 12, "#1a1a1a", "middle");
    const llmText = createText("LLM Adapters", 180, 370, 12, "#1a1a1a", "middle");
    const executionText = createText("AI Execution", 320, 340, 12, "#1a1a1a", "middle");
    const observabilityText = createText("Model Observability", 320, 370, 12, "#1a1a1a", "middle");
    
    aiLayer.appendChild(aiText);
    aiLayer.appendChild(aiRect);
    aiLayer.appendChild(modelText);
    aiLayer.appendChild(llmText);
    aiLayer.appendChild(executionText);
    aiLayer.appendChild(observabilityText);
    
    // Connection arrows
    const arrow1 = createPath("M300 150 L300 190", "#1a1a1a", 2);
    const arrow2 = createPath("M300 270 L300 310", "#1a1a1a", 2);
    
    const arrow1Head = createPolygon("300,190 295,180 305,180", "#1a1a1a");
    const arrow2Head = createPolygon("300,310 295,300 305,300", "#1a1a1a");
    
    // Append all groups to the svg
    svg.appendChild(securityLayer);
    svg.appendChild(dataLayer);
    svg.appendChild(aiLayer);
    
    svg.appendChild(arrow1);
    svg.appendChild(arrow1Head);
    svg.appendChild(arrow2);
    svg.appendChild(arrow2Head);
}

// Initialize Industry Tabs
function initIndustryTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    if (!tabHeaders.length) return;
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Remove active class from all headers
            tabHeaders.forEach(h => h.classList.remove('active'));
            
            // Add active class to clicked header
            this.classList.add('active');
            
            // Hide all panes
            const panes = document.querySelectorAll('.tab-pane');
            panes.forEach(pane => pane.classList.remove('active'));
            
            // Show the corresponding pane
            const tabId = this.getAttribute('data-tab');
            const activePane = document.getElementById(tabId);
            if (activePane) {
                activePane.classList.add('active');
                
                // Initialize charts in the newly active tab
                console.log(`Tab changed to ${tabId}, initializing charts`);
                const chartCanvases = activePane.querySelectorAll('canvas');
                chartCanvases.forEach(canvas => {
                    if (canvas.id) {
                        console.log(`Found canvas in tab: ${canvas.id}`);
                        switch (canvas.id) {
                            case 'manufacturingChart':
                                initManufacturingChart();
                                break;
                            case 'financialChart':
                                initFinancialChart();
                                break;
                            case 'healthcareChart':
                                initHealthcareChart();
                                break;
                            case 'retailChart':
                                initRetailChart();
                                break;
                            default:
                                console.log(`No specific handler for canvas: ${canvas.id}`);
                        }
                    }
                });
            }
        });
    });
}

// Helper Functions for SVG Creation
function createRect(x, y, width, height, fill, rx = 0) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", fill);
    if (rx > 0) {
        rect.setAttribute("rx", rx);
        rect.setAttribute("ry", rx);
    }
    return rect;
}

function createText(text, x, y, fontSize, fill, anchor = "start", bold = false) {
    const textElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElem.textContent = text;
    textElem.setAttribute("x", x);
    textElem.setAttribute("y", y);
    textElem.setAttribute("font-size", fontSize);
    textElem.setAttribute("fill", fill);
    textElem.setAttribute("font-family", "'Readex Pro', sans-serif");
    if (anchor !== "start") {
        textElem.setAttribute("text-anchor", anchor);
    }
    if (bold) {
        textElem.setAttribute("font-weight", "600");
    }
    return textElem;
}

function createPath(d, stroke, strokeWidth = 2, dashArray = null) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", stroke);
    path.setAttribute("stroke-width", strokeWidth);
    path.setAttribute("fill", "none");
    if (dashArray) {
        path.setAttribute("stroke-dasharray", dashArray);
    }
    return path;
}

function createPolygon(points, fill) {
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", points);
    polygon.setAttribute("fill", fill);
    return polygon;
}

function createGroup() {
    return document.createElementNS("http://www.w3.org/2000/svg", "g");
}

// Animation for hero graphic connection line
function animateConnectionLine() {
    const line = document.querySelector('.connection-line');
    if (!line) return;
    
    setTimeout(() => {
        line.setAttribute('d', 'M170 100 L230 100');
    }, 500);
}
