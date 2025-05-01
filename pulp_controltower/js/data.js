/**
 * Data Management for Pulp Procurement Control Tower
 * This file contains mock data and data handling functions.
 * In a production environment, this would connect to a backend API.
 */

const DATA = {
    // Mock Data Storage
    storage: {
        shipments: [],
        suppliers: [],
        plants: [],
        inventory: [],
        customs: [],
        qualityChecks: [],
        portMapping: [],
        userPreferences: {}
    },
    
    // Init function to populate mock data
    init: function() {
        // Populate mock data
        this.storage.suppliers = this.getMockSuppliers();
        this.storage.plants = this.getMockPlants();
        this.storage.shipments = this.getMockShipments();
        this.storage.inventory = this.getMockInventory();
        this.storage.customs = this.getMockCustoms();
        this.storage.qualityChecks = this.getMockQualityChecks();
        this.storage.portMapping = this.getMockPortMapping();
        
        // Load user preferences from localStorage if available
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
            this.storage.userPreferences = JSON.parse(savedPreferences);
        } else {
            // Default preferences
            this.storage.userPreferences = {
                theme: 'light',
                pageSize: CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
                alertsEnabled: true,
                defaultTab: 'shipment-tracking'
            };
            // Save to localStorage
            localStorage.setItem('userPreferences', JSON.stringify(this.storage.userPreferences));
        }
        
        console.log('Data initialized');
    },
    
    // Get shipments with filtering and sorting options
    getShipments: function(filters = {}, sort = { field: 'shipmentDate', ascending: false }) {
        let filteredShipments = [...this.storage.shipments];
        
        // Apply filters
        if (filters.supplier) {
            filteredShipments = filteredShipments.filter(s => s.supplierId === filters.supplier);
        }
        
        if (filters.plant) {
            filteredShipments = filteredShipments.filter(s => s.plantId === filters.plant);
        }
        
        if (filters.status) {
            filteredShipments = filteredShipments.filter(s => s.status === filters.status);
        }
        
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filteredShipments = filteredShipments.filter(s => new Date(s.shipmentDate) >= fromDate);
        }
        
        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            filteredShipments = filteredShipments.filter(s => new Date(s.shipmentDate) <= toDate);
        }
        
        if (filters.search) {
            const searchFields = ['id', 'vesselName', 'blNumber', 'originPort'];
            filteredShipments = HELPERS.filterArray(filteredShipments, filters.search, searchFields);
        }
        
        // Apply sorting
        if (sort && sort.field) {
            filteredShipments = HELPERS.sortArray(filteredShipments, sort.field, sort.ascending);
        }
        
        return filteredShipments;
    },
    
    // Get a specific shipment by ID
    getShipmentById: function(id) {
        return this.storage.shipments.find(s => s.id === id) || null;
    },
    
    // Add a new shipment
    addShipment: function(shipment) {
        // Generate ID if not provided
        if (!shipment.id) {
            shipment.id = 'SHIP-' + HELPERS.generateId();
        }
        
        // Add timestamps
        shipment.createdAt = new Date().toISOString();
        shipment.updatedAt = new Date().toISOString();
        
        // Add to storage
        this.storage.shipments.push(shipment);
        
        return shipment;
    },
    
    // Update an existing shipment
    updateShipment: function(id, updates) {
        const index = this.storage.shipments.findIndex(s => s.id === id);
        if (index === -1) return null;
        
        // Update the shipment
        const updatedShipment = {
            ...this.storage.shipments[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        // Replace in the array
        this.storage.shipments[index] = updatedShipment;
        
        return updatedShipment;
    },
    
    // Delete a shipment
    deleteShipment: function(id) {
        const index = this.storage.shipments.findIndex(s => s.id === id);
        if (index === -1) return false;
        
        // Remove from the array
        this.storage.shipments.splice(index, 1);
        
        return true;
    },
    
    // Get suppliers
    getSuppliers: function(filters = {}) {
        let filteredSuppliers = [...this.storage.suppliers];
        
        // Apply filters if needed
        if (filters.search) {
            const searchFields = ['id', 'name', 'country', 'contactName'];
            filteredSuppliers = HELPERS.filterArray(filteredSuppliers, filters.search, searchFields);
        }
        
        return filteredSuppliers;
    },
    
    // Get a specific supplier by ID
    getSupplierById: function(id) {
        return this.storage.suppliers.find(s => s.id === id) || null;
    },
    
    // Get plants
    getPlants: function(filters = {}) {
        let filteredPlants = [...this.storage.plants];
        
        // Apply filters if needed
        if (filters.country) {
            filteredPlants = filteredPlants.filter(p => p.country === filters.country);
        }
        
        if (filters.search) {
            const searchFields = ['id', 'name', 'location', 'country'];
            filteredPlants = HELPERS.filterArray(filteredPlants, filters.search, searchFields);
        }
        
        return filteredPlants;
    },
    
    // Get a specific plant by ID
    getPlantById: function(id) {
        return this.storage.plants.find(p => p.id === id) || null;
    },
    
    // Get inventory data
    getInventory: function(filters = {}) {
        let filteredInventory = [...this.storage.inventory];
        
        // Apply filters
        if (filters.plant) {
            filteredInventory = filteredInventory.filter(i => i.plantId === filters.plant);
        }
        
        if (filters.pulpType) {
            filteredInventory = filteredInventory.filter(i => i.pulpType === filters.pulpType);
        }
        
        if (filters.search) {
            const searchFields = ['id', 'pulpType', 'location'];
            filteredInventory = HELPERS.filterArray(filteredInventory, filters.search, searchFields);
        }
        
        return filteredInventory;
    },
    
    // Get customs data
    getCustoms: function(filters = {}) {
        let filteredCustoms = [...this.storage.customs];
        
        // Apply filters
        if (filters.plant) {
            filteredCustoms = filteredCustoms.filter(c => c.plantId === filters.plant);
        }
        
        if (filters.status) {
            filteredCustoms = filteredCustoms.filter(c => c.status === filters.status);
        }
        
        if (filters.shipmentId) {
            filteredCustoms = filteredCustoms.filter(c => c.shipmentId === filters.shipmentId);
        }
        
        if (filters.search) {
            const searchFields = ['id', 'blNumber', 'customsReference'];
            filteredCustoms = HELPERS.filterArray(filteredCustoms, filters.search, searchFields);
        }
        
        return filteredCustoms;
    },
    
    // Get quality checks
    getQualityChecks: function(filters = {}) {
        let filteredQualityChecks = [...this.storage.qualityChecks];
        
        // Apply filters
        if (filters.shipmentId) {
            filteredQualityChecks = filteredQualityChecks.filter(q => q.shipmentId === filters.shipmentId);
        }
        
        if (filters.plant) {
            filteredQualityChecks = filteredQualityChecks.filter(q => q.plantId === filters.plant);
        }
        
        if (filters.supplierId) {
            filteredQualityChecks = filteredQualityChecks.filter(q => q.supplierId === filters.supplierId);
        }
        
        return filteredQualityChecks;
    },
    
    // Get port to plant mapping
    getPortMapping: function() {
        return this.storage.portMapping;
    },
    
    // Get transit time between ports
    getTransitTime: function(originPort, destinationPort) {
        const mapping = this.storage.portMapping.find(
            m => m.originPort === originPort && m.destinationPort === destinationPort
        );
        
        return mapping ? mapping.transitDays : 30; // Default to 30 days if not found
    },
    
    // Get user preferences
    getUserPreferences: function() {
        return this.storage.userPreferences;
    },
    
    // Update user preferences
    updateUserPreferences: function(preferences) {
        this.storage.userPreferences = {
            ...this.storage.userPreferences,
            ...preferences
        };
        
        // Save to localStorage
        localStorage.setItem('userPreferences', JSON.stringify(this.storage.userPreferences));
        
        return this.storage.userPreferences;
    },
    
    // Get all shipment statuses with counts
    getShipmentStatusCounts: function() {
        const counts = {};
        const statuses = Object.values(CONFIG.STATUS_TYPES);
        
        // Initialize counts for all statuses
        statuses.forEach(status => {
            counts[status] = 0;
        });
        
        // Count shipments by status
        this.storage.shipments.forEach(shipment => {
            if (counts[shipment.status] !== undefined) {
                counts[shipment.status]++;
            }
        });
        
        return counts;
    },
    
    // Get total pulp in transit
    getTotalPulpInTransit: function() {
        return this.storage.shipments
            .filter(s => s.status === CONFIG.STATUS_TYPES.IN_TRANSIT)
            .reduce((total, shipment) => total + shipment.quantity, 0);
    },
    
    // Get potential detention risks
    getDetentionRisks: function() {
        const risks = [];
        const today = new Date();
        
        this.storage.shipments
            .filter(s => s.status === CONFIG.STATUS_TYPES.AT_PORT)
            .forEach(shipment => {
                // Check if at port for more than 5 days
                const arrivalDate = new Date(shipment.arrivalDate || shipment.eta);
                const daysAtPort = HELPERS.dateDiffInDays(arrivalDate, today);
                
                if (daysAtPort > 5) {
                    risks.push({
                        shipmentId: shipment.id,
                        blNumber: shipment.blNumber,
                        port: shipment.destinationPort,
                        daysAtPort,
                        containers: shipment.containers || 1,
                        potentialFees: HELPERS.calculateDetention(shipment.containers || 1, daysAtPort - 5)
                    });
                }
            });
        
        return risks;
    },
    
    // Generate Mock Data
    getMockSuppliers: function() {
        return [
            {
                id: 'SUP-001',
                name: 'Arauco',
                country: 'Chile',
                contactName: 'Carlos Mendoza',
                contactEmail: 'c.mendoza@arauco.com',
                contactPhone: '+56 2 2461 7200',
                paymentTerms: 'Net 60',
                activeContract: true,
                contractStart: '2023-01-01',
                contractEnd: '2025-12-31',
                pulpTypes: ['Eucalyptus', 'Radiata Pine'],
                rating: 4.8,
                shippingPorts: ['San Vicente', 'Lirquén'],
                address: '25 El Bosque Norte Street, Santiago, Chile',
                notes: 'Premium supplier of Eucalyptus Pulp'
            },
            {
                id: 'SUP-002',
                name: 'Suzano',
                country: 'Brazil',
                contactName: 'Luiz Silva',
                contactEmail: 'l.silva@suzano.com',
                contactPhone: '+55 11 3503 9000',
                paymentTerms: 'Net 45',
                activeContract: true,
                contractStart: '2024-01-01',
                contractEnd: '2026-12-31',
                pulpTypes: ['Eucalyptus', 'Hardwood'],
                rating: 4.6,
                shippingPorts: ['Santos', 'Paranaguá'],
                address: 'Av. Brigadeiro Faria Lima, 1355, São Paulo, Brazil',
                notes: 'Large supplier with consistent quality'
            },
            {
                id: 'SUP-003',
                name: 'APRIL',
                country: 'Indonesia',
                contactName: 'Sanjay Kumar',
                contactEmail: 's.kumar@aprilasia.com',
                contactPhone: '+62 761 491 000',
                paymentTerms: 'Net 60',
                activeContract: true,
                contractStart: '2023-06-15',
                contractEnd: '2025-06-14',
                pulpTypes: ['Acacia', 'Tropical Hardwood'],
                rating: 4.3,
                shippingPorts: ['Jakarta', 'Surabaya'],
                address: 'Pangkalan Kerinci, Riau, Indonesia',
                notes: 'Specializes in tropical hardwood pulp'
            },
            {
                id: 'SUP-004',
                name: 'Metsä Fibre',
                country: 'Finland',
                contactName: 'Anna Korhonen',
                contactEmail: 'anna.korhonen@metsagroup.com',
                contactPhone: '+358 10 4601',
                paymentTerms: 'Net 30',
                activeContract: true,
                contractStart: '2023-03-01',
                contractEnd: '2025-02-28',
                pulpTypes: ['Northern Softwood', 'Pine', 'Spruce'],
                rating: 4.9,
                shippingPorts: ['Helsinki', 'Rauma'],
                address: 'Revontulenpuisto 2, 02100 Espoo, Finland',
                notes: 'High-quality Nordic softwood pulp supplier'
            },
            {
                id: 'SUP-005',
                name: 'Ilim Group',
                country: 'Russia',
                contactName: 'Vladimir Petrov',
                contactEmail: 'v.petrov@ilimgroup.ru',
                contactPhone: '+7 495 970 1600',
                paymentTerms: 'Net 45',
                activeContract: true,
                contractStart: '2023-09-01',
                contractEnd: '2025-08-31',
                pulpTypes: ['Softwood', 'Hardwood'],
                rating: 4.2,
                shippingPorts: ['St. Petersburg', 'Arkhangelsk'],
                address: 'Bolshaya Andronyevskaya 17, Moscow, Russia',
                notes: 'Major Russian pulp producer'
            },
            {
                id: 'SUP-006',
                name: 'Harihar Polyfibers',
                country: 'India',
                contactName: 'Rahul Sharma',
                contactEmail: 'r.sharma@hariharpolyfibers.com',
                contactPhone: '+91 12345 67890',
                paymentTerms: 'Net 30',
                activeContract: true,
                contractStart: '2023-04-01',
                contractEnd: '2025-03-31',
                pulpTypes: ['Domestic Hardwood', 'Eucalyptus'],
                rating: 4.4,
                shippingPorts: ['Domestic Only'],
                address: 'Harihar, Karnataka, India',
                notes: 'Domestic pulp source for Harihar plant'
            }
        ];
    },
    
    getMockPlants: function() {
        return [
            {
                id: 'PLANT-001',
                name: 'Harihar',
                location: 'Karnataka',
                country: 'India',
                capacity: 6000,
                pulpTypes: ['Eucalyptus', 'Radiata Pine', 'Domestic Hardwood'],
                nearestPorts: ['Nhava Sheva'],
                headCount: 420,
                hasLocalPulpSource: true
            },
            {
                id: 'PLANT-002',
                name: 'Nagda',
                location: 'Madhya Pradesh',
                country: 'India',
                capacity: 5200,
                pulpTypes: ['Eucalyptus', 'Hardwood'],
                nearestPorts: ['Mundra', 'Nhava Sheva'],
                headCount: 380,
                hasLocalPulpSource: false
            },
            {
                id: 'PLANT-003',
                name: 'China Plant',
                location: 'Guangdong',
                country: 'China',
                capacity: 7800,
                pulpTypes: ['Northern Softwood', 'Hardwood', 'Acacia'],
                nearestPorts: ['Guangzhou', 'Hong Kong'],
                headCount: 530,
                hasLocalPulpSource: false
            },
            {
                id: 'PLANT-004',
                name: 'Indonesia Plant',
                location: 'Jakarta',
                country: 'Indonesia',
                capacity: 4500,
                pulpTypes: ['Acacia', 'Tropical Hardwood'],
                nearestPorts: ['Jakarta', 'Surabaya'],
                headCount: 350,
                hasLocalPulpSource: true
            },
            {
                id: 'PLANT-005',
                name: 'Thailand Plant',
                location: 'Bangkok',
                country: 'Thailand',
                capacity: 3900,
                pulpTypes: ['Eucalyptus', 'Acacia', 'Hardwood'],
                nearestPorts: ['Bangkok', 'Laem Chabang'],
                headCount: 310,
                hasLocalPulpSource: false
            }
        ];
    },
    
    getMockShipments: function() {
        return [
            {
                id: 'SHIP-001',
                supplierId: 'SUP-001',
                supplierName: 'Arauco',
                vesselName: 'Atlantic Trader',
                blNumber: 'BL-ARAUCO-23845',
                quantity: 1200,
                originPort: 'San Vicente, Chile',
                destinationPort: 'Nhava Sheva, India',
                shipmentDate: '2025-03-15',
                eta: '2025-04-20',
                plantId: 'PLANT-001',
                plantName: 'Harihar',
                status: CONFIG.STATUS_TYPES.AT_PORT,
                containers: 14,
                purchaseOrderRef: 'PO-78945',
                pulpType: 'Eucalyptus',
                moisture: 8.5,
                qualityChecked: false,
                arrivalDate: '2025-04-18',
                customsCleared: false,
                destuffType: 'FD', // Factory Destuff
                notes: 'Regular monthly shipment',
                createdAt: '2025-03-10T08:30:00Z',
                updatedAt: '2025-04-18T16:45:00Z'
            },
            {
                id: 'SHIP-002',
                supplierId: 'SUP-002',
                supplierName: 'Suzano',
                vesselName: 'Pacific Guardian',
                blNumber: 'BL-SUZANO-45621',
                quantity: 1600,
                originPort: 'Santos, Brazil',
                destinationPort: 'Mundra, India',
                shipmentDate: '2025-04-01',
                eta: '2025-05-05',
                plantId: 'PLANT-002',
                plantName: 'Nagda',
                status: CONFIG.STATUS_TYPES.IN_TRANSIT,
                containers: 18,
                purchaseOrderRef: 'PO-78946',
                pulpType: 'Hardwood',
                moisture: 9.2,
                qualityChecked: false,
                arrivalDate: null,
                customsCleared: false,
                destuffType: 'DD', // Dock Destuff
                notes: 'Increased order for Q2 production',
                createdAt: '2025-03-25T10:15:00Z',
                updatedAt: '2025-04-10T14:20:00Z'
            },
            {
                id: 'SHIP-003',
                supplierId: 'SUP-003',
                supplierName: 'APRIL',
                vesselName: 'Nordic Voyager',
                blNumber: 'BL-APRIL-72134',
                quantity: 800,
                originPort: 'Jakarta, Indonesia',
                destinationPort: 'Guangzhou, China',
                shipmentDate: '2025-04-05',
                eta: '2025-04-18',
                plantId: 'PLANT-003',
                plantName: 'China Plant',
                status: CONFIG.STATUS_TYPES.IN_CUSTOMS,
                containers: 10,
                purchaseOrderRef: 'PO-78947',
                pulpType: 'Acacia',
                moisture: 8.8,
                qualityChecked: false,
                arrivalDate: '2025-04-17',
                customsCleared: false,
                destuffType: 'DD', // Dock Destuff
                notes: 'Special grade for high-end products',
                createdAt: '2025-04-01T09:45:00Z',
                updatedAt: '2025-04-17T11:30:00Z'
            },
            {
                id: 'SHIP-004',
                supplierId: 'SUP-004',
                supplierName: 'Metsä Fibre',
                vesselName: 'Baltic Courier',
                blNumber: 'BL-METSA-32176',
                quantity: 1400,
                originPort: 'Helsinki, Finland',
                destinationPort: 'Nhava Sheva, India',
                shipmentDate: '2025-03-22',
                eta: '2025-04-28',
                plantId: 'PLANT-001',
                plantName: 'Harihar',
                status: CONFIG.STATUS_TYPES.IN_TRANSIT,
                containers: 16,
                purchaseOrderRef: 'PO-78948',
                pulpType: 'Northern Softwood',
                moisture: 7.9,
                qualityChecked: false,
                arrivalDate: null,
                customsCleared: false,
                destuffType: 'FD', // Factory Destuff
                notes: 'Premium grade for specialty papers',
                createdAt: '2025-03-18T11:20:00Z',
                updatedAt: '2025-04-05T16:10:00Z'
            },
            {
                id: 'SHIP-005',
                supplierId: 'SUP-005',
                supplierName: 'Ilim Group',
                vesselName: 'Siberian Express',
                blNumber: 'BL-ILIM-94572',
                quantity: 950,
                originPort: 'St. Petersburg, Russia',
                destinationPort: 'Jakarta, Indonesia',
                shipmentDate: '2025-03-10',
                eta: '2025-04-16',
                plantId: 'PLANT-004',
                plantName: 'Indonesia Plant',
                status: CONFIG.STATUS_TYPES.DELAYED,
                containers: 12,
                purchaseOrderRef: 'PO-78949',
                pulpType: 'Softwood',
                moisture: 8.3,
                qualityChecked: false,
                arrivalDate: null,
                customsCleared: false,
                destuffType: 'DD', // Dock Destuff
                notes: 'Delayed due to port congestion',
                createdAt: '2025-03-05T14:25:00Z',
                updatedAt: '2025-04-12T10:45:00Z'
            },
            {
                id: 'SHIP-006',
                supplierId: 'SUP-001',
                supplierName: 'Arauco',
                vesselName: 'Southern Cross',
                blNumber: 'BL-ARAUCO-24567',
                quantity: 1800,
                originPort: 'San Vicente, Chile',
                destinationPort: 'Bangkok, Thailand',
                shipmentDate: '2025-04-05',
                eta: '2025-05-12',
                plantId: 'PLANT-005',
                plantName: 'Thailand Plant',
                status: CONFIG.STATUS_TYPES.IN_TRANSIT,
                containers: 20,
                purchaseOrderRef: 'PO-78950',
                pulpType: 'Radiata Pine',
                moisture: 8.7,
                qualityChecked: false,
                arrivalDate: null,
                customsCleared: false,
                destuffType: 'FD', // Factory Destuff
                notes: 'Large order for production ramp-up',
                createdAt: '2025-04-01T08:10:00Z',
                updatedAt: '2025-04-10T09:55:00Z'
            }
        ];
    },
    
    getMockInventory: function() {
        return [
            {
                id: 'INV-001',
                plantId: 'PLANT-001',
                plantName: 'Harihar',
                pulpType: 'Eucalyptus',
                quantity: 850,
                location: 'Main Warehouse',
                bales: 4250,
                moisture: 8.2,
                lastReceived: '2025-04-10',
                dailyConsumption: 65,
                reservedQuantity: 200,
                availableQuantity: 650,
                minLevel: 400,
                maxLevel: 1200,
                reorderPoint: 500
            },
            {
                id: 'INV-002',
                plantId: 'PLANT-001',
                plantName: 'Harihar',
                pulpType: 'Radiata Pine',
                quantity: 620,
                location: 'Main Warehouse',
                bales: 3100,
                moisture: 7.9,
                lastReceived: '2025-03-25',
                dailyConsumption: 50,
                reservedQuantity: 100,
                availableQuantity: 520,
                minLevel: 350,
                maxLevel: 1000,
                reorderPoint: 450
            },
            {
                id: 'INV-003',
                plantId: 'PLANT-001',
                plantName: 'Harihar',
                pulpType: 'Domestic Hardwood',
                quantity: 480,
                location: 'Secondary Warehouse',
                bales: 2400,
                moisture: 9.1,
                lastReceived: '2025-04-15',
                dailyConsumption: 40,
                reservedQuantity: 50,
                availableQuantity: 430,
                minLevel: 300,
                maxLevel: 800,
                reorderPoint: 350
            },
            {
                id: 'INV-004',
                plantId: 'PLANT-002',
                plantName: 'Nagda',
                pulpType: 'Eucalyptus',
                quantity: 720,
                location: 'Main Warehouse',
                bales: 3600,
                moisture: 8.4,
                lastReceived: '2025-04-05',
                dailyConsumption: 60,
                reservedQuantity: 150,
                availableQuantity: 570,
                minLevel: 350,
                maxLevel: 1100,
                reorderPoint: 450
            },
            {
                id: 'INV-005',
                plantId: 'PLANT-002',
                plantName: 'Nagda',
                pulpType: 'Hardwood',
                quantity: 530,
                location: 'Main Warehouse',
                bales: 2650,
                moisture: 8.9,
                lastReceived: '2025-03-20',
                dailyConsumption: 45,
                reservedQuantity: 80,
                availableQuantity: 450,
                minLevel: 300,
                maxLevel: 900,
                reorderPoint: 400
            }
        ];
    },
    
    getMockCustoms: function() {
        return [
            {
                id: 'CUST-001',
                shipmentId: 'SHIP-001',
                blNumber: 'BL-ARAUCO-23845',
                plantId: 'PLANT-001',
                status: 'in-progress',
                arrivalDate: '2025-04-18',
                customsReference: 'CUS-REF-78945',
                chaId: 'CHA-001',
                chaName: 'Global Customs Solutions',
                importGeneralManifest: 'IGM-78945',
                billOfEntryDate: null,
                billOfEntryNumber: null,
                dutyPaid: false,
                dutyAmount: 345000,
                cfsName: 'Nhava Sheva CFS',
                transporters: [
                    {
                        id: 'TRANS-001',
                        name: 'Express Logistics',
                        vehicles: [
                            { number: 'MH-01-AB-1234', capacity: 28 },
                            { number: 'MH-01-AB-5678', capacity: 28 }
                        ]
                    }
                ],
                containers: [
                    { number: 'CONT-45678', type: '40HC', status: 'at-port' },
                    { number: 'CONT-45679', type: '40HC', status: 'at-port' }
                ],
                timeline: [
                    { date: '2025-04-18', event: 'Vessel arrived', status: 'completed' },
                    { date: '2025-04-19', event: 'IGM Filed', status: 'completed' },
                    { date: '2025-04-20', event: 'CFS Nominated', status: 'completed' },
                    { date: '2025-04-22', event: 'Bill of Entry Filing', status: 'pending' },
                    { date: '2025-04-24', event: 'Customs Examination', status: 'pending' },
                    { date: '2025-04-26', event: 'Duty Payment', status: 'pending' },
                    { date: '2025-04-28', event: 'Delivery Order', status: 'pending' }
                ]
            },
            {
                id: 'CUST-002',
                shipmentId: 'SHIP-003',
                blNumber: 'BL-APRIL-72134',
                plantId: 'PLANT-003',
                status: 'in-progress',
                arrivalDate: '2025-04-17',
                customsReference: 'CUS-REF-78946',
                chaId: 'CHA-002',
                chaName: 'China Customs Agency',
                importGeneralManifest: 'IGM-78946',
                billOfEntryDate: '2025-04-19',
                billOfEntryNumber: 'BOE-78946',
                dutyPaid: true,
                dutyAmount: 290000,
                cfsName: 'Guangzhou Port CFS',
                transporters: [
                    {
                        id: 'TRANS-002',
                        name: 'Dragon Logistics',
                        vehicles: [
                            { number: 'GZ-12345', capacity: 30 },
                            { number: 'GZ-12346', capacity: 30 }
                        ]
                    }
                ],
                containers: [
                    { number: 'CONT-56789', type: '40HC', status: 'in-customs' },
                    { number: 'CONT-56790', type: '40HC', status: 'in-customs' }
                ],
                timeline: [
                    { date: '2025-04-17', event: 'Vessel arrived', status: 'completed' },
                    { date: '2025-04-18', event: 'IGM Filed', status: 'completed' },
                    { date: '2025-04-19', event: 'Bill of Entry Filing', status: 'completed' },
                    { date: '2025-04-19', event: 'Duty Payment', status: 'completed' },
                    { date: '2025-04-20', event: 'Customs Examination', status: 'in-progress' },
                    { date: '2025-04-22', event: 'Delivery Order', status: 'pending' }
                ]
            }
        ];
    },
    
    getMockQualityChecks: function() {
        return [
            {
                id: 'QC-001',
                shipmentId: 'SHIP-001',
                blNumber: 'BL-ARAUCO-23845',
                plantId: 'PLANT-001',
                supplierId: 'SUP-001',
                date: '2025-04-19',
                pulpType: 'Eucalyptus',
                batchNumber: 'BATCH-001',
                
                // Supplier reported values
                supplierValues: {
                    moisture: 8.5,
                    weight: 200.2, // kg per bale
                    brightness: 88.5,
                    viscosity: 650,
                    dirt: 0.8,
                    shives: 0.3
                },
                
                // Plant measured values
                plantValues: {
                    moisture: 8.7,
                    weight: 198.6, // kg per bale
                    brightness: 87.9,
                    viscosity: 645,
                    dirt: 0.9,
                    shives: 0.4
                },
                
                // Detailed bale sampling
                balesSampled: [
                    { id: 'BALE-001', weight: 198.2, moisture: 8.8, airDryWeight: 181.2 },
                    { id: 'BALE-002', weight: 199.5, moisture: 8.6, airDryWeight: 182.9 },
                    { id: 'BALE-003', weight: 197.8, moisture: 8.7, airDryWeight: 180.8 },
                    { id: 'BALE-004', weight: 198.9, moisture: 8.5, airDryWeight: 182.3 }
                ],
                
                // Analysis
                deviation: {
                    moisture: 0.2,
                    weight: -1.6,
                    brightness: -0.6,
                    viscosity: -5,
                    dirt: 0.1,
                    shives: 0.1
                },
                
                overallRating: 'Acceptable',
                notes: 'Within acceptable deviation range',
                approvedBy: 'Rajesh Kumar',
                status: 'approved'
            },
            {
                id: 'QC-002',
                shipmentId: 'SHIP-004',
                blNumber: 'BL-METSA-32176',
                plantId: 'PLANT-001',
                supplierId: 'SUP-004',
                date: '2025-03-15', // Previous shipment
                pulpType: 'Northern Softwood',
                batchNumber: 'BATCH-002',
                
                // Supplier reported values
                supplierValues: {
                    moisture: 7.9,
                    weight: 201.1, // kg per bale
                    brightness: 89.2,
                    viscosity: 670,
                    dirt: 0.7,
                    shives: 0.2
                },
                
                // Plant measured values
                plantValues: {
                    moisture: 8.2,
                    weight: 198.3, // kg per bale
                    brightness: 88.7,
                    viscosity: 665,
                    dirt: 0.8,
                    shives: 0.3
                },
                
                // Detailed bale sampling
                balesSampled: [
                    { id: 'BALE-005', weight: 198.5, moisture: 8.3, airDryWeight: 182.1 },
                    { id: 'BALE-006', weight: 197.9, moisture: 8.2, airDryWeight: 181.6 },
                    { id: 'BALE-007', weight: 198.7, moisture: 8.0, airDryWeight: 182.8 },
                    { id: 'BALE-008', weight: 198.1, moisture: 8.3, airDryWeight: 181.7 }
                ],
                
                // Analysis
                deviation: {
                    moisture: 0.3,
                    weight: -2.8,
                    brightness: -0.5,
                    viscosity: -5,
                    dirt: 0.1,
                    shives: 0.1
                },
                
                overallRating: 'Acceptable',
                notes: 'Consistent quality from supplier',
                approvedBy: 'Rajesh Kumar',
                status: 'approved'
            }
        ];
    },
    
    getMockPortMapping: function() {
        return [
            { originPort: 'San Vicente, Chile', destinationPort: 'Nhava Sheva, India', transitDays: 35 },
            { originPort: 'San Vicente, Chile', destinationPort: 'Mundra, India', transitDays: 38 },
            { originPort: 'San Vicente, Chile', destinationPort: 'Bangkok, Thailand', transitDays: 32 },
            { originPort: 'Santos, Brazil', destinationPort: 'Nhava Sheva, India', transitDays: 30 },
            { originPort: 'Santos, Brazil', destinationPort: 'Mundra, India', transitDays: 32 },
            { originPort: 'Jakarta, Indonesia', destinationPort: 'Guangzhou, China', transitDays: 12 },
            { originPort: 'Jakarta, Indonesia', destinationPort: 'Bangkok, Thailand', transitDays: 8 },
            { originPort: 'Helsinki, Finland', destinationPort: 'Nhava Sheva, India', transitDays: 28 },
            { originPort: 'St. Petersburg, Russia', destinationPort: 'Jakarta, Indonesia', transitDays: 34 },
            { originPort: 'Arkhangelsk, Russia', destinationPort: 'Guangzhou, China', transitDays: 40 },
            { originPort: 'Penang, Malaysia', destinationPort: 'Nhava Sheva, India', transitDays: 18 },
            { originPort: 'Penang, Malaysia', destinationPort: 'Bangkok, Thailand', transitDays: 6 }
        ];
    }
};
