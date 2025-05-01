/**
 * Configuration Constants for the Pulp Procurement Control Tower
 */

const CONFIG = {
    // Data refresh intervals (in milliseconds)
    REFRESH_INTERVALS: {
        SHIPMENTS: 60000, // 1 minute
        SUPPLIERS: 300000, // 5 minutes
        INVENTORY: 300000, // 5 minutes
        CUSTOMS: 120000, // 2 minutes
        QUALITY: 300000, // 5 minutes
    },
    
    // Date formats
    DATE_FORMAT: {
        DISPLAY: 'DD/MM/YYYY',
        INPUT: 'YYYY-MM-DD',
    },
    
    // Pagination settings
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
    },
    
    // API Endpoints (for future implementation)
    API: {
        BASE_URL: 'api/',
        ENDPOINTS: {
            SHIPMENTS: 'shipments',
            SUPPLIERS: 'suppliers',
            INVENTORY: 'inventory',
            CUSTOMS: 'customs',
            QUALITY: 'quality',
            REPORTS: 'reports',
        }
    },
    
    // Status types for pill display
    STATUS_TYPES: {
        IN_TRANSIT: 'in-transit',
        AT_PORT: 'at-port',
        IN_CUSTOMS: 'in-customs',
        IN_CFS: 'in-cfs',
        DELIVERED: 'delivered',
        DELAYED: 'delayed'
    },
    
    // Notification settings
    NOTIFICATION: {
        DURATION: 5000, // 5 seconds
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info'
        }
    },
    
    // Modal configuration
    MODAL: {
        ANIMATION_DURATION: 300 // 0.3 seconds
    },
    
    // Chart colors
    CHART_COLORS: {
        PRIMARY: '#4a63ee',
        SECONDARY: '#10b981',
        DANGER: '#ef4444',
        WARNING: '#f59e0b',
        INFO: '#2563eb',
        BACKGROUND: '#f8fafc',
        TEXT: '#333333',
        GRID: '#e2e8f0'
    },
    
    // Units of measurement
    UNITS: {
        WEIGHT: 'MT', // Metric Tons
        MOISTURE: '%'
    },
    
    // Global constants
    CONSTANTS: {
        BALE_WEIGHT: 200, // 200 kg per bale
        BUNDLE_BALES: 8, // 8 bales per bundle
        BUNDLE_WEIGHT: 1600, // 1600 kg per bundle
        DETENTION_RATE: 20000, // ₹20,000 per container per day
    }
};
