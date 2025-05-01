/**
 * Helper Functions for the Pulp Procurement Control Tower
 */

const HELPERS = {
    /**
     * Format a date for display
     * @param {string|Date} date - Date to format
     * @param {string} format - Format to use (defaults to CONFIG.DATE_FORMAT.DISPLAY)
     * @returns {string} Formatted date string
     */
    formatDate: function(date, format = CONFIG.DATE_FORMAT.DISPLAY) {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        if (format === CONFIG.DATE_FORMAT.DISPLAY) {
            // Format as DD/MM/YYYY
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        } else {
            // Default format for input elements (YYYY-MM-DD)
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${year}-${month}-${day}`;
        }
    },
    
    /**
     * Format a number with commas as thousands separators
     * @param {number} number - Number to format
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted number string
     */
    formatNumber: function(number, decimals = 0) {
        if (number === null || number === undefined) return '';
        
        return number.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    /**
     * Generate a unique ID
     * @param {string} prefix - Prefix for the ID
     * @returns {string} Unique ID
     */
    generateId: function(prefix = '') {
        return prefix + Math.random().toString(36).substr(2, 9);
    },
    
    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    /**
     * Check if two objects are equal
     * @param {Object} obj1 - First object
     * @param {Object} obj2 - Second object
     * @returns {boolean} Whether the objects are equal
     */
    objectsEqual: function(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    },
    
    /**
     * Debounce a function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Time to wait in milliseconds
     * @returns {Function} Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },
    
    /**
     * Convert a string to title case
     * @param {string} str - String to convert
     * @returns {string} Title case string
     */
    toTitleCase: function(str) {
        if (!str) return '';
        
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },
    
    /**
     * Filter an array of objects based on a search string
     * @param {Array} array - Array to filter
     * @param {string} searchStr - Search string
     * @param {Array} fields - Fields to search in
     * @returns {Array} Filtered array
     */
    filterArray: function(array, searchStr, fields) {
        if (!searchStr || !Array.isArray(array) || !Array.isArray(fields)) {
            return array;
        }
        
        const search = searchStr.toLowerCase();
        
        return array.filter(item => {
            return fields.some(field => {
                const value = item[field];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(search);
            });
        });
    },
    
    /**
     * Sort an array of objects by a property
     * @param {Array} array - Array to sort
     * @param {string} property - Property to sort by
     * @param {boolean} ascending - Whether to sort in ascending order
     * @returns {Array} Sorted array
     */
    sortArray: function(array, property, ascending = true) {
        if (!Array.isArray(array) || !property) {
            return array;
        }
        
        return [...array].sort((a, b) => {
            let valA = a[property];
            let valB = b[property];
            
            // Handle dates
            if (valA instanceof Date || (typeof valA === 'string' && !isNaN(Date.parse(valA)))) {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            }
            // Handle numbers and strings
            else if (typeof valA === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }
            
            // Perform comparison
            if (valA < valB) return ascending ? -1 : 1;
            if (valA > valB) return ascending ? 1 : -1;
            return 0;
        });
    },
    
    /**
     * Format a currency value
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code ('INR', 'USD', etc.)
     * @returns {string} Formatted currency string
     */
    formatCurrency: function(amount, currency = 'INR') {
        if (amount === null || amount === undefined) return '';
        
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },
    
    /**
     * Calculate the difference in days between two dates
     * @param {string|Date} date1 - First date
     * @param {string|Date} date2 - Second date
     * @returns {number} Difference in days
     */
    dateDiffInDays: function(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
            return 0;
        }
        
        // Calculate difference in milliseconds
        const diffTime = Math.abs(d2 - d1);
        // Convert to days
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    
    /**
     * Calculate detention charges based on days
     * @param {number} containers - Number of containers
     * @param {number} days - Number of days
     * @returns {number} Detention charges
     */
    calculateDetention: function(containers, days) {
        if (!containers || !days) return 0;
        return containers * days * CONFIG.CONSTANTS.DETENTION_RATE;
    },
    
    /**
     * Calculate total weight in MT from bales
     * @param {number} bales - Number of bales
     * @returns {number} Weight in MT
     */
    balesToMT: function(bales) {
        if (!bales) return 0;
        return (bales * CONFIG.CONSTANTS.BALE_WEIGHT) / 1000; // Convert kg to MT
    },
    
    /**
     * Calculate number of bales from MT
     * @param {number} mt - Weight in MT
     * @returns {number} Number of bales
     */
    mtToBales: function(mt) {
        if (!mt) return 0;
        return Math.round((mt * 1000) / CONFIG.CONSTANTS.BALE_WEIGHT); // Convert MT to kg, then to bales
    },
    
    /**
     * Convert bales to bundles
     * @param {number} bales - Number of bales
     * @returns {object} Bundles and remaining bales
     */
    balesToBundles: function(bales) {
        if (!bales) return { bundles: 0, remainingBales: 0 };
        
        const bundles = Math.floor(bales / CONFIG.CONSTANTS.BUNDLE_BALES);
        const remainingBales = bales % CONFIG.CONSTANTS.BUNDLE_BALES;
        
        return { bundles, remainingBales };
    },
    
    /**
     * Get a readable status label from status code
     * @param {string} statusCode - Status code
     * @returns {string} Readable status label
     */
    getStatusLabel: function(statusCode) {
        const statusMap = {
            [CONFIG.STATUS_TYPES.IN_TRANSIT]: 'In Transit',
            [CONFIG.STATUS_TYPES.AT_PORT]: 'At Port',
            [CONFIG.STATUS_TYPES.IN_CUSTOMS]: 'In Customs',
            [CONFIG.STATUS_TYPES.IN_CFS]: 'In CFS',
            [CONFIG.STATUS_TYPES.DELIVERED]: 'Delivered',
            [CONFIG.STATUS_TYPES.DELAYED]: 'Delayed'
        };
        
        return statusMap[statusCode] || 'Unknown';
    },
    
    /**
     * Set a cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Days until expiration
     */
    setCookie: function(name, value, days = 30) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    },
    
    /**
     * Get a cookie value
     * @param {string} name - Cookie name
     * @returns {string} Cookie value
     */
    getCookie: function(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        
        return null;
    },
    
    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     */
    deleteCookie: function(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    },
    
    /**
     * Download a CSV file
     * @param {Array} data - Array of objects to convert to CSV
     * @param {string} filename - Filename for the download
     */
    downloadCSV: function(data, filename) {
        if (!data || !data.length) return;
        
        // Get headers from first object
        const headers = Object.keys(data[0]);
        
        // Create CSV rows
        const csvRows = [
            headers.join(','), // Header row
            ...data.map(row => {
                return headers.map(header => {
                    // Handle special characters and commas in the value
                    const value = row[header] !== null && row[header] !== undefined ? row[header] : '';
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',');
            })
        ];
        
        // Create CSV content
        const csvContent = csvRows.join('\n');
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename || 'export.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    /**
     * Format a timestamp to a relative time string (e.g., "3 days ago")
     * @param {string|Date} timestamp - Timestamp to format
     * @returns {string} Relative time string
     */
    timeAgo: function(timestamp) {
        if (!timestamp) return '';
        
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';
        
        const now = new Date();
        const diff = Math.abs(now - date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
        
        if (years > 0) return `${years} year${years === 1 ? '' : 's'} ago`;
        if (months > 0) return `${months} month${months === 1 ? '' : 's'} ago`;
        if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
        if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
        if (seconds > 10) return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
        return 'just now';
    },
    
    /**
     * Check if a string is a valid date
     * @param {string} dateStr - Date string to check
     * @returns {boolean} Whether the string is a valid date
     */
    isValidDate: function(dateStr) {
        if (!dateStr) return false;
        
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
    }
};
