/**
 * UI Management for Pulp Procurement Control Tower
 * This file handles common UI operations like modals, notifications, etc.
 */

const UI = {
    // Initialize UI elements
    init: function() {
        this.initModalContainer();
        this.initNotificationContainer();
        console.log('UI initialized');
    },
    
    // Tab Management
    tabs: {
        // Switch to a specific tab
        switchTo: function(tabId) {
            // Update active tab button
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
            if (tabBtn) {
                tabBtn.classList.add('active');
            }
            
            // Load tab content
            this.loadContent(tabId);
        },
        
        // Load content for a tab
        loadContent: function(tabId) {
            const contentContainer = document.getElementById('tab-content-container');
            
            // Show loading indicator
            contentContainer.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Loading ${tabId.replace('-', ' ')}...</p>
                </div>
            `;
            
            // Simulate loading delay (would be real data fetch in production)
            setTimeout(() => {
                // Call the appropriate module's render function
                switch (tabId) {
                    case 'shipment-tracking':
                        SHIPMENTS.renderTab();
                        break;
                    case 'supplier-mgmt':
                        SUPPLIERS.renderTab();
                        break;
                    case 'inventory':
                        INVENTORY.renderTab();
                        break;
                    case 'customs':
                        CUSTOMS.renderTab();
                        break;
                    case 'quality':
                        QUALITY.renderTab();
                        break;
                    case 'reports':
                        REPORTS.renderTab();
                        break;
                    default:
                        contentContainer.innerHTML = `
                            <div class="tab-placeholder">
                                <h2>Tab Not Found</h2>
                                <p>The requested tab "${tabId}" could not be found.</p>
                            </div>
                        `;
                }
                
                // Update user preferences with the last active tab
                DATA.updateUserPreferences({ defaultTab: tabId });
            }, 500);
        }
    },
    
    // Modal Management
    modal: {
        // Create modal backdrop if it doesn't exist
        initBackdrop: function() {
            if (!document.querySelector('.modal-backdrop')) {
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop';
                backdrop.addEventListener('click', (e) => {
                    if (e.target === backdrop) {
                        this.closeAll();
                    }
                });
                document.getElementById('modals-container').appendChild(backdrop);
            }
        },
        
        // Create and show a modal
        create: function(options) {
            this.initBackdrop();
            
            // Create modal container
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = options.id || 'modal-' + HELPERS.generateId();
            
            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            
            // Add header if title is provided
            if (options.title) {
                const modalHeader = document.createElement('div');
                modalHeader.className = 'modal-header';
                
                const modalTitle = document.createElement('h3');
                modalTitle.className = 'modal-title';
                modalTitle.textContent = options.title;
                
                const closeButton = document.createElement('button');
                closeButton.className = 'close-modal';
                closeButton.innerHTML = '&times;';
                closeButton.addEventListener('click', () => this.close(modal.id));
                
                modalHeader.appendChild(modalTitle);
                modalHeader.appendChild(closeButton);
                modalContent.appendChild(modalHeader);
            }
            
            // Add content
            if (options.content) {
                if (typeof options.content === 'string') {
                    modalContent.innerHTML += options.content;
                } else if (options.content instanceof Node) {
                    modalContent.appendChild(options.content);
                }
            }
            
            // Add to DOM
            modal.appendChild(modalContent);
            document.getElementById('modals-container').appendChild(modal);
            
            // Show backdrop and modal
            this.show(modal.id);
            
            return modal.id;
        },
        
        // Show an existing modal
        show: function(modalId) {
            const backdrop = document.querySelector('.modal-backdrop');
            const modal = document.getElementById(modalId);
            
            if (backdrop && modal) {
                backdrop.style.display = 'block';
                modal.style.display = 'block';
                
                // Add event listener for ESC key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeAll();
                    }
                }, { once: true });
            }
        },
        
        // Close a specific modal
        close: function(modalId) {
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.style.display = 'none';
                
                // Check if there are any other open modals
                const openModals = document.querySelectorAll('.modal[style="display: block;"]');
                if (openModals.length === 0) {
                    // Hide backdrop if no other modals are open
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.style.display = 'none';
                    }
                }
            }
        },
        
        // Close all open modals
        closeAll: function() {
            const modals = document.querySelectorAll('.modal');
            const backdrop = document.querySelector('.modal-backdrop');
            
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
            
            if (backdrop) {
                backdrop.style.display = 'none';
            }
        },
        
        // Remove a modal from the DOM
        remove: function(modalId) {
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.remove();
                
                // Check if there are any other modals
                const remainingModals = document.querySelectorAll('.modal');
                if (remainingModals.length === 0) {
                    // Remove backdrop if no other modals exist
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.remove();
                    }
                }
            }
        },
        
        // Create a confirm dialog
        confirm: function(options) {
            return new Promise((resolve) => {
                const content = document.createElement('div');
                
                // Add message
                const messageDiv = document.createElement('div');
                messageDiv.innerHTML = options.message || 'Are you sure?';
                messageDiv.style.marginBottom = '20px';
                content.appendChild(messageDiv);
                
                // Add buttons
                const actions = document.createElement('div');
                actions.className = 'form-actions';
                
                // Cancel button
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'btn-cancel';
                cancelBtn.textContent = options.cancelText || 'Cancel';
                cancelBtn.addEventListener('click', () => {
                    this.close(modalId);
                    resolve(false);
                    
                    // Remove modal after animation
                    setTimeout(() => {
                        this.remove(modalId);
                    }, CONFIG.MODAL.ANIMATION_DURATION);
                });
                
                // Confirm button
                const confirmBtn = document.createElement('button');
                confirmBtn.className = options.isDanger ? 'btn-danger' : 'btn-submit';
                confirmBtn.textContent = options.confirmText || 'Confirm';
                confirmBtn.addEventListener('click', () => {
                    this.close(modalId);
                    resolve(true);
                    
                    // Remove modal after animation
                    setTimeout(() => {
                        this.remove(modalId);
                    }, CONFIG.MODAL.ANIMATION_DURATION);
                });
                
                // Add buttons to actions div
                actions.appendChild(cancelBtn);
                actions.appendChild(confirmBtn);
                content.appendChild(actions);
                
                // Create modal
                const modalId = this.create({
                    title: options.title || 'Confirm Action',
                    content: content
                });
            });
        },
        
        // Create a form modal
        form: function(options) {
            return new Promise((resolve) => {
                const form = document.createElement('form');
                form.id = 'form-' + HELPERS.generateId();
                
                // Add form fields
                if (options.fields && Array.isArray(options.fields)) {
                    // Group fields into rows based on the row property
                    const rows = {};
                    
                    options.fields.forEach(field => {
                        const rowIndex = field.row || 0;
                        
                        if (!rows[rowIndex]) {
                            rows[rowIndex] = [];
                        }
                        
                        rows[rowIndex].push(field);
                    });
                    
                    // Create form rows and fields
                    Object.keys(rows).sort().forEach(rowIndex => {
                        const rowFields = rows[rowIndex];
                        
                        // Create row div if more than one field in the row
                        const rowDiv = document.createElement('div');
                        rowDiv.className = rowFields.length > 1 ? 'form-row' : '';
                        
                        rowFields.forEach(field => {
                            // Create form group
                            const formGroup = document.createElement('div');
                            formGroup.className = 'form-group';
                            
                            // Create label
                            if (field.label) {
                                const label = document.createElement('label');
                                label.setAttribute('for', field.id);
                                label.textContent = field.label;
                                
                                if (field.required) {
                                    label.innerHTML += ' <span style="color: #ef4444;">*</span>';
                                }
                                
                                formGroup.appendChild(label);
                            }
                            
                            // Create input based on type
                            let input;
                            
                            switch (field.type) {
                                case 'select':
                                    const selectContainer = document.createElement('div');
                                    selectContainer.className = 'custom-select';
                                    
                                    input = document.createElement('select');
                                    
                                    // Add options
                                    if (field.options && Array.isArray(field.options)) {
                                        field.options.forEach(option => {
                                            const optionEl = document.createElement('option');
                                            optionEl.value = option.value;
                                            optionEl.textContent = option.label;
                                            
                                            if (option.value === field.value) {
                                                optionEl.selected = true;
                                            }
                                            
                                            input.appendChild(optionEl);
                                        });
                                    }
                                    
                                    selectContainer.appendChild(input);
                                    formGroup.appendChild(selectContainer);
                                    break;
                                
                                case 'textarea':
                                    input = document.createElement('textarea');
                                    input.rows = field.rows || 3;
                                    
                                    formGroup.appendChild(input);
                                    break;
                                
                                case 'checkbox':
                                    const checkboxContainer = document.createElement('div');
                                    checkboxContainer.style.display = 'flex';
                                    checkboxContainer.style.alignItems = 'center';
                                    checkboxContainer.style.gap = '8px';
                                    
                                    input = document.createElement('input');
                                    input.type = 'checkbox';
                                    input.checked = field.value === true;
                                    
                                    const checkboxLabel = document.createElement('span');
                                    checkboxLabel.textContent = field.checkboxLabel || '';
                                    
                                    checkboxContainer.appendChild(input);
                                    checkboxContainer.appendChild(checkboxLabel);
                                    formGroup.appendChild(checkboxContainer);
                                    break;
                                
                                default:
                                    input = document.createElement('input');
                                    input.type = field.type || 'text';
                            }
                            
                            // Set common attributes
                            input.id = field.id;
                            input.name = field.id;
                            input.className = 'form-control';
                            
                            if (field.placeholder) {
                                input.placeholder = field.placeholder;
                            }
                            
                            if (field.value !== undefined && field.type !== 'checkbox') {
                                input.value = field.value;
                            }
                            
                            if (field.required) {
                                input.required = true;
                            }
                            
                            if (field.min !== undefined) {
                                input.min = field.min;
                            }
                            
                            if (field.max !== undefined) {
                                input.max = field.max;
                            }
                            
                            if (field.readonly) {
                                input.readOnly = true;
                            }
                            
                            if (field.disabled) {
                                input.disabled = true;
                            }
                            
                            // Add any missing input to the form group
                            if (field.type !== 'select' && field.type !== 'checkbox') {
                                formGroup.appendChild(input);
                            }
                            
                            // Add helper text if provided
                            if (field.helperText) {
                                const helperText = document.createElement('div');
                                helperText.className = 'helper-text';
                                helperText.innerHTML = field.helperText;
                                helperText.style.fontSize = '12px';
                                helperText.style.color = '#6b7280';
                                helperText.style.marginTop = '4px';
                                
                                formGroup.appendChild(helperText);
                            }
                            
                            // Add to row div
                            rowDiv.appendChild(formGroup);
                        });
                        
                        // Add row to form
                        form.appendChild(rowDiv);
                    });
                }
                
                // Add buttons
                const actions = document.createElement('div');
                actions.className = 'form-actions';
                
                // Cancel button
                const cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.className = 'btn-cancel';
                cancelBtn.textContent = options.cancelText || 'Cancel';
                cancelBtn.addEventListener('click', () => {
                    this.close(modalId);
                    resolve(null);
                    
                    // Remove modal after animation
                    setTimeout(() => {
                        this.remove(modalId);
                    }, CONFIG.MODAL.ANIMATION_DURATION);
                });
                
                // Submit button
                const submitBtn = document.createElement('button');
                submitBtn.type = 'submit';
                submitBtn.className = 'btn-submit';
                submitBtn.textContent = options.submitText || 'Submit';
                
                // Add buttons to actions div
                actions.appendChild(cancelBtn);
                actions.appendChild(submitBtn);
                form.appendChild(actions);
                
                // Form submit handler
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    // Collect form data
                    const formData = {};
                    const formFields = form.querySelectorAll('input, select, textarea');
                    
                    formFields.forEach(field => {
                        if (field.type === 'checkbox') {
                            formData[field.name] = field.checked;
                        } else {
                            formData[field.name] = field.value;
                        }
                    });
                    
                    // Close modal
                    this.close(modalId);
                    
                    // Resolve promise with form data
                    resolve(formData);
                    
                    // Remove modal after animation
                    setTimeout(() => {
                        this.remove(modalId);
                    }, CONFIG.MODAL.ANIMATION_DURATION);
                });
                
                // Create modal
                const modalId = this.create({
                    title: options.title || 'Form',
                    content: form
                });
            });
        }
    },
    
    // Notification Management
    notification: {
        // Show a notification
        show: function(options) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${options.type || 'info'}`;
            notification.id = 'notification-' + HELPERS.generateId();
            
            // Add icon based on type
            let iconSvg;
            
            switch (options.type) {
                case 'success':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notification-icon" style="color: #16a34a;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
                    break;
                case 'error':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notification-icon" style="color: #dc2626;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
                    break;
                case 'warning':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notification-icon" style="color: #f59e0b;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
                    break;
                default:
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="notification-icon" style="color: #2563eb;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
            }
            
            // Create notification content
            notification.innerHTML = `
                ${iconSvg}
                <div class="notification-content">
                    <div class="notification-title">${options.title || 'Notification'}</div>
                    <div class="notification-message">${options.message || ''}</div>
                </div>
            `;
            
            // Add to DOM
            document.getElementById('notification-container').appendChild(notification);
            
            // Set timeout to remove notification
            setTimeout(() => {
                notification.classList.add('removing');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, options.duration || CONFIG.NOTIFICATION.DURATION);
            
            return notification.id;
        },
        
        // Show a success notification
        success: function(message, title = 'Success') {
            return this.show({
                type: CONFIG.NOTIFICATION.TYPES.SUCCESS,
                title,
                message
            });
        },
        
        // Show an error notification
        error: function(message, title = 'Error') {
            return this.show({
                type: CONFIG.NOTIFICATION.TYPES.ERROR,
                title,
                message
            });
        },
        
        // Show a warning notification
        warning: function(message, title = 'Warning') {
            return this.show({
                type: CONFIG.NOTIFICATION.TYPES.WARNING,
                title,
                message
            });
        },
        
        // Show an info notification
        info: function(message, title = 'Information') {
            return this.show({
                type: CONFIG.NOTIFICATION.TYPES.INFO,
                title,
                message
            });
        }
    },
    
    // Initialize modal container
    initModalContainer: function() {
        if (!document.getElementById('modals-container')) {
            const container = document.createElement('div');
            container.id = 'modals-container';
            document.body.appendChild(container);
        }
    },
    
    // Initialize notification container
    initNotificationContainer: function() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }
    },
    
    // Format a date for display
    formatDate: function(date) {
        return HELPERS.formatDate(date);
    },
    
    // Format a number with commas
    formatNumber: function(number, decimals = 0) {
        return HELPERS.formatNumber(number, decimals);
    },
    
    // Create a status pill element
    createStatusPill: function(status) {
        const statusLabel = HELPERS.getStatusLabel(status);
        return `<span class="status-pill status-${status}">${statusLabel}</span>`;
    },
    
    // Create pagination controls
    createPagination: function(options) {
        const {
            currentPage,
            totalPages,
            totalItems,
            pageSize,
            onPageChange,
            onPageSizeChange,
            pageSizeOptions = CONFIG.PAGINATION.PAGE_SIZE_OPTIONS
        } = options;
        
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination';
        
        // Info text
        const startItem = (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, totalItems);
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'pagination-info';
        infoDiv.textContent = `Showing ${startItem} to ${endItem} of ${totalItems} items`;
        
        // Page size selector
        if (onPageSizeChange) {
            const pageSizeSelector = document.createElement('select');
            pageSizeSelector.className = 'filter-control';
            pageSizeSelector.style.marginLeft = '10px';
            pageSizeSelector.addEventListener('change', (e) => {
                onPageSizeChange(parseInt(e.target.value, 10));
            });
            
            pageSizeOptions.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = `${size} per page`;
                
                if (size === pageSize) {
                    option.selected = true;
                }
                
                pageSizeSelector.appendChild(option);
            });
            
            infoDiv.appendChild(pageSizeSelector);
        }
        
        paginationContainer.appendChild(infoDiv);
        
        // Page controls
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'pagination-controls';
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.textContent = '←';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                onPageChange(currentPage - 1);
            }
        });
        controlsDiv.appendChild(prevBtn);
        
        // Page buttons
        const createPageButton = (pageNum) => {
            const btn = document.createElement('button');
            btn.className = `pagination-btn ${pageNum === currentPage ? 'active' : ''}`;
            btn.textContent = pageNum;
            btn.addEventListener('click', () => {
                onPageChange(pageNum);
            });
            return btn;
        };
        
        // Logic for page button display
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust start page if we have less than 5 pages from the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // First page
        if (startPage > 1) {
            controlsDiv.appendChild(createPageButton(1));
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                ellipsis.style.padding = '6px 10px';
                controlsDiv.appendChild(ellipsis);
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            controlsDiv.appendChild(createPageButton(i));
        }
        
        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                ellipsis.style.padding = '6px 10px';
                controlsDiv.appendChild(ellipsis);
            }
            
            controlsDiv.appendChild(createPageButton(totalPages));
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.textContent = '→';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
            }
        });
        controlsDiv.appendChild(nextBtn);
        
        paginationContainer.appendChild(controlsDiv);
        
        return paginationContainer;
    }
};
