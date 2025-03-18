// Sample Data
const sampleData = {
    projects: [
        { id: 'amz-1', name: 'Amazon Prime Video' },
        { id: 'amz-2', name: 'Amazon Music' },
        { id: 'amz-3', name: 'Amazon Alexa Skills' }
    ],
    milestones: {
        'amz-1': [
            { id: 'ms-11', name: 'Video Playback Optimization' },
            { id: 'ms-12', name: 'Recommendation Engine Overhaul' }
        ],
        'amz-2': [
            { id: 'ms-21', name: 'Music Discovery Feature' },
            { id: 'ms-22', name: 'Playlist Management Redesign' }
        ],
        'amz-3': [
            { id: 'ms-31', name: 'Multi-language Support' },
            { id: 'ms-32', name: 'Device Sync Improvement' }
        ]
    },
    codeDrops: {
        'ms-11': [{ id: 'cd-111', name: 'Drop 1.1' }, { id: 'cd-112', name: 'Drop 1.2' }],
        'ms-12': [{ id: 'cd-121', name: 'Drop 1.1' }, { id: 'cd-122', name: 'Drop 1.2' }],
        'ms-21': [{ id: 'cd-211', name: 'Drop 1.1' }, { id: 'cd-212', name: 'Drop 1.2' }],
        'ms-22': [{ id: 'cd-221', name: 'Drop 1.1' }],
        'ms-31': [{ id: 'cd-311', name: 'Drop 1.1' }, { id: 'cd-312', name: 'Drop 1.2' }],
        'ms-32': [{ id: 'cd-321', name: 'Drop 1.1' }]
    },
    reviewers: [
        { id: 'rev-1', name: 'Alex Johnson' },
        { id: 'rev-2', name: 'Sarah Chen' },
        { id: 'rev-3', name: 'Miguel Rodriguez' },
        { id: 'rev-4', name: 'Priya Patel' }
    ],
    statuses: [
        { id: 'st-1', name: 'Attach Code Review Buddy' },
        { id: 'st-2', name: 'Code Review Request' },
        { id: 'st-3', name: 'Code Review Response' },
        { id: 'st-4', name: 'Code Fix & Iteration' },
        { id: 'st-5', name: 'Code Review Request (2nd)' },
        { id: 'st-6', name: 'Code Review Response (2nd)' },
        { id: 'st-7', name: 'Code Merge - Beta Release' },
        { id: 'st-8', name: 'QA - Regression Testing' },
        { id: 'st-9', name: 'QA - Functionality Testing' },
        { id: 'st-10', name: 'QA - Sanity Testing' },
        { id: 'st-11', name: 'SIM Tickets Filed' },
        { id: 'st-12', name: 'Dev Fixes' },
        { id: 'st-13', name: 'QA Confirmation' },
        { id: 'st-14', name: 'UAT by Amazon' },
        { id: 'st-15', name: 'UAT Confirmation' },
        { id: 'st-16', name: 'Final Sign-off' }
    ]
};

// Helper function to calculate business days between two dates
function getBusinessDaysDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    let current = new Date(start);
    
    while (current <= end) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    
    return count;
}

// Sample CR Data
let crData = [
    {
        id: 'cr-1',
        projectId: 'amz-1',
        milestoneId: 'ms-11',
        codeDropId: 'cd-111',
        statusId: 'st-7',
        reviewerId: 'rev-2',
        date: '2025-03-10',
        notes: 'Successfully merged to beta branch',
        history: [
            { statusId: 'st-1', date: '2025-03-01', reviewerId: 'rev-2' },
            { statusId: 'st-2', date: '2025-03-03' },
            { statusId: 'st-3', date: '2025-03-05' },
            { statusId: 'st-4', date: '2025-03-07' },
            { statusId: 'st-5', date: '2025-03-08' },
            { statusId: 'st-6', date: '2025-03-09' },
            { statusId: 'st-7', date: '2025-03-10' }
        ]
    },
    {
        id: 'cr-2',
        projectId: 'amz-1',
        milestoneId: 'ms-11',
        codeDropId: 'cd-112',
        statusId: 'st-4',
        reviewerId: 'rev-1',
        date: '2025-03-15',
        notes: 'Fixing issues identified in code review',
        history: [
            { statusId: 'st-1', date: '2025-03-10', reviewerId: 'rev-1' },
            { statusId: 'st-2', date: '2025-03-12' },
            { statusId: 'st-3', date: '2025-03-15' },
            { statusId: 'st-4', date: '2025-03-15' }
        ]
    },
    {
        id: 'cr-3',
        projectId: 'amz-2',
        milestoneId: 'ms-21',
        codeDropId: 'cd-211',
        statusId: 'st-13',
        reviewerId: 'rev-3',
        date: '2025-03-12',
        notes: 'QA team confirmed all issues are resolved',
        history: [
            { statusId: 'st-1', date: '2025-02-20', reviewerId: 'rev-3' },
            { statusId: 'st-2', date: '2025-02-22' },
            { statusId: 'st-3', date: '2025-02-24' },
            { statusId: 'st-4', date: '2025-02-26' },
            { statusId: 'st-5', date: '2025-02-28' },
            { statusId: 'st-6', date: '2025-03-01' },
            { statusId: 'st-7', date: '2025-03-03' },
            { statusId: 'st-8', date: '2025-03-05' },
            { statusId: 'st-9', date: '2025-03-06' },
            { statusId: 'st-10', date: '2025-03-07' },
            { statusId: 'st-11', date: '2025-03-08' },
            { statusId: 'st-12', date: '2025-03-10' },
            { statusId: 'st-13', date: '2025-03-12' }
        ]
    },
    {
        id: 'cr-4',
        projectId: 'amz-3',
        milestoneId: 'ms-31',
        codeDropId: 'cd-311',
        statusId: 'st-16',
        reviewerId: 'rev-4',
        date: '2025-03-14',
        notes: 'Final sign-off received from Amazon team',
        history: [
            { statusId: 'st-1', date: '2025-02-15', reviewerId: 'rev-4' },
            { statusId: 'st-2', date: '2025-02-17' },
            { statusId: 'st-3', date: '2025-02-18' },
            { statusId: 'st-4', date: '2025-02-20' },
            { statusId: 'st-5', date: '2025-02-21' },
            { statusId: 'st-6', date: '2025-02-22' },
            { statusId: 'st-7', date: '2025-02-24' },
            { statusId: 'st-8', date: '2025-02-26' },
            { statusId: 'st-9', date: '2025-02-28' },
            { statusId: 'st-10', date: '2025-03-01' },
            { statusId: 'st-13', date: '2025-03-03' },
            { statusId: 'st-14', date: '2025-03-08' },
            { statusId: 'st-15', date: '2025-03-12' },
            { statusId: 'st-16', date: '2025-03-14' }
        ]
    },
    {
        id: 'cr-5',
        projectId: 'amz-2',
        milestoneId: 'ms-22',
        codeDropId: 'cd-221',
        statusId: 'st-2',
        reviewerId: 'rev-2',
        date: '2025-03-16',
        notes: 'Initial code review request sent',
        history: [
            { statusId: 'st-1', date: '2025-03-15', reviewerId: 'rev-2' },
            { statusId: 'st-2', date: '2025-03-16' }
        ]
    }
];

// DOM Elements
const projectSelect = document.getElementById('project');
const milestoneSelect = document.getElementById('milestone');
const codeDropSelect = document.getElementById('codeDrop');
const statusSelect = document.getElementById('status');
const reviewerSelect = document.getElementById('reviewer');
const dateInput = document.getElementById('date');
const notesInput = document.getElementById('notes');
const crUpdateForm = document.getElementById('cr-update-form');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const reportTable = document.getElementById('reportTable');
const searchInput = document.getElementById('searchInput');
const projectFilter = document.getElementById('projectFilter');
const milestoneFilter = document.getElementById('milestoneFilter');
const statusFilter = document.getElementById('statusFilter');
const exportBtn = document.getElementById('exportBtn');
const statusModal = document.getElementById('statusModal');
const closeModalBtn = document.querySelector('.close');
const modalCloseBtn = document.querySelector('.modal-close-btn');

// Initialize the application
function initApp() {
    populateDropdowns();
    registerEventListeners();
    updateReportTable();
    setCurrentDate();
}

// Populate all dropdowns with sample data
function populateDropdowns() {
    // Populate projects
    sampleData.projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        projectSelect.appendChild(option);
        
        // Also populate project filter
        const filterOption = option.cloneNode(true);
        projectFilter.appendChild(filterOption);
    });
    
    // Populate reviewers
    sampleData.reviewers.forEach(reviewer => {
        const option = document.createElement('option');
        option.value = reviewer.id;
        option.textContent = reviewer.name;
        reviewerSelect.appendChild(option);
    });
    
    // Populate statuses
    sampleData.statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status.id;
        option.textContent = status.name;
        statusSelect.appendChild(option);
        
        // Also populate status filter
        const filterOption = option.cloneNode(true);
        statusFilter.appendChild(filterOption);
    });
}

// Set current date as default for date input
function setCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    
    const formattedDate = yyyy + '-' + mm + '-' + dd;
    dateInput.value = formattedDate;
}

// Register all event listeners
function registerEventListeners() {
    // Project change event
    projectSelect.addEventListener('change', function() {
        populateMilestones(this.value);
    });
    
    // Milestone change event
    milestoneSelect.addEventListener('change', function() {
        populateCodeDrops(this.value);
    });
    
    // Tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Form submission
    crUpdateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateCRStatus();
    });
    
    // Search and filters
    searchInput.addEventListener('input', updateReportTable);
    projectFilter.addEventListener('change', function() {
        populateMilestoneFilter(this.value);
        updateReportTable();
    });
    milestoneFilter.addEventListener('change', updateReportTable);
    statusFilter.addEventListener('change', updateReportTable);
    
    // Export button
    exportBtn.addEventListener('click', exportReport);
    
    // Modal close buttons
    closeModalBtn.addEventListener('click', closeModal);
    modalCloseBtn.addEventListener('click', closeModal);
}

// Populate milestones based on selected project
function populateMilestones(projectId) {
    // Clear previous options
    milestoneSelect.innerHTML = '<option value="">Select Milestone</option>';
    codeDropSelect.innerHTML = '<option value="">Select Code Drop</option>';
    
    if (!projectId) return;
    
    // Add new options
    sampleData.milestones[projectId].forEach(milestone => {
        const option = document.createElement('option');
        option.value = milestone.id;
        option.textContent = milestone.name;
        milestoneSelect.appendChild(option);
    });
}

// Populate code drops based on selected milestone
function populateCodeDrops(milestoneId) {
    // Clear previous options
    codeDropSelect.innerHTML = '<option value="">Select Code Drop</option>';
    
    if (!milestoneId) return;
    
    // Add new options
    sampleData.codeDrops[milestoneId].forEach(codeDrop => {
        const option = document.createElement('option');
        option.value = codeDrop.id;
        option.textContent = codeDrop.name;
        codeDropSelect.appendChild(option);
    });
}

// Populate milestone filter based on selected project filter
function populateMilestoneFilter(projectId) {
    // Clear previous options
    milestoneFilter.innerHTML = '<option value="">All Milestones</option>';
    
    if (!projectId) return;
    
    // Add new options
    sampleData.milestones[projectId].forEach(milestone => {
        const option = document.createElement('option');
        option.value = milestone.id;
        option.textContent = milestone.name;
        milestoneFilter.appendChild(option);
    });
}

// Switch between tabs
function switchTab(tabId) {
    // Remove active class from all tabs
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to selected tab
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Hide all tab panes
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Show selected tab pane
    document.getElementById(tabId).classList.add('active');
    
    // If switching to report tab, refresh the table
    if (tabId === 'report') {
        updateReportTable();
    }
}

// Update CR status
function updateCRStatus() {
    const projectId = projectSelect.value;
    const milestoneId = milestoneSelect.value;
    const codeDropId = codeDropSelect.value;
    const statusId = statusSelect.value;
    const reviewerId = reviewerSelect.value;
    const date = dateInput.value;
    const notes = notesInput.value;
    
    // Find existing CR or create new one
    let cr = crData.find(item => 
        item.projectId === projectId && 
        item.milestoneId === milestoneId && 
        item.codeDropId === codeDropId
    );
    
    if (cr) {
        // Update existing CR
        cr.statusId = statusId;
        if (reviewerId) cr.reviewerId = reviewerId;
        cr.date = date;
        cr.notes = notes;
        
        // Add to history if status changed
        const lastHistoryItem = cr.history[cr.history.length - 1];
        if (lastHistoryItem.statusId !== statusId) {
            const historyItem = { 
                statusId: statusId, 
                date: date 
            };
            if (reviewerId) historyItem.reviewerId = reviewerId;
            cr.history.push(historyItem);
        }
    } else {
        // Create new CR
        const newCR = {
            id: 'cr-' + (crData.length + 1),
            projectId,
            milestoneId,
            codeDropId,
            statusId,
            reviewerId,
            date,
            notes,
            history: [
                { 
                    statusId, 
                    date,
                    reviewerId
                }
            ]
        };
        crData.push(newCR);
    }
    
    // Show success modal
    showModal();
    
    // Reset form
    crUpdateForm.reset();
    setCurrentDate();
    
    // Update report table
    updateReportTable();
}

// Update report table
function updateReportTable() {
    const tbody = reportTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    // Apply filters
    const projectFilterValue = projectFilter.value;
    const milestoneFilterValue = milestoneFilter.value;
    const statusFilterValue = statusFilter.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredData = crData.filter(cr => {
        // Get related data for text search
        const project = sampleData.projects.find(p => p.id === cr.projectId);
        const milestone = sampleData.milestones[cr.projectId]?.find(m => m.id === cr.milestoneId);
        const codeDrop = sampleData.codeDrops[cr.milestoneId]?.find(cd => cd.id === cr.codeDropId);
        const status = sampleData.statuses.find(s => s.id === cr.statusId);
        const reviewer = sampleData.reviewers.find(r => r.id === cr.reviewerId);
        
        // Check if matches search term
        const matchesSearch = 
            !searchTerm || 
            project?.name.toLowerCase().includes(searchTerm) ||
            milestone?.name.toLowerCase().includes(searchTerm) ||
            codeDrop?.name.toLowerCase().includes(searchTerm) ||
            status?.name.toLowerCase().includes(searchTerm) ||
            reviewer?.name.toLowerCase().includes(searchTerm);
        
        // Check if matches filters
        const matchesProjectFilter = !projectFilterValue || cr.projectId === projectFilterValue;
        const matchesMilestoneFilter = !milestoneFilterValue || cr.milestoneId === milestoneFilterValue;
        const matchesStatusFilter = !statusFilterValue || cr.statusId === statusFilterValue;
        
        return matchesSearch && matchesProjectFilter && matchesMilestoneFilter && matchesStatusFilter;
    });
    
    // Sort by date (newest first)
    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create table rows
    filteredData.forEach(cr => {
        const project = sampleData.projects.find(p => p.id === cr.projectId);
        const milestone = sampleData.milestones[cr.projectId]?.find(m => m.id === cr.milestoneId);
        const codeDrop = sampleData.codeDrops[cr.milestoneId]?.find(cd => cd.id === cr.codeDropId);
        const status = sampleData.statuses.find(s => s.id === cr.statusId);
        const reviewer = sampleData.reviewers.find(r => r.id === cr.reviewerId);
        
        const today = new Date();
        const lastUpdateDate = new Date(cr.date);
        const daysInStage = getBusinessDaysDifference(lastUpdateDate, today);
        
        // Determine status indicator
        let statusClass = 'status-blue';
        if (daysInStage > 10) {
            statusClass = 'status-red';
        } else if (daysInStage > 5) {
            statusClass = 'status-amber';
        } else if (status?.id === 'st-16') { // Final sign-off
            statusClass = 'status-green';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${project?.name || ''}</td>
            <td>${milestone?.name || ''}</td>
            <td>${codeDrop?.name || ''}</td>
            <td>${status?.name || ''}</td>
            <td>${reviewer?.name || ''}</td>
            <td>${formatDate(cr.date)}</td>
            <td>${daysInStage}</td>
            <td><span class="status-indicator ${statusClass}">
                ${daysInStage > 10 ? 'At Risk' : daysInStage > 5 ? 'Warning' : status?.id === 'st-16' ? 'Complete' : 'On Track'}
            </span></td>
        `;
        tbody.appendChild(row);
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Export report
function exportReport() {
    // Get table data
    const rows = Array.from(reportTable.querySelectorAll('tbody tr'));
    const headers = Array.from(reportTable.querySelectorAll('thead th')).map(th => th.textContent);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    rows.forEach(row => {
        const rowData = Array.from(row.querySelectorAll('td')).map(td => {
            // Remove HTML from status cell and just get text
            const text = td.textContent.trim();
            // Escape quotes and wrap in quotes to handle commas
            return `"${text.replace(/"/g, '""')}"`;
        });
        csvContent += rowData.join(',') + '\n';
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cr_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Show success modal
function showModal() {
    statusModal.style.display = 'block';
}

// Close modal
function closeModal() {
    statusModal.style.display = 'none';
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    if (event.target === statusModal) {
        closeModal();
    }
});
