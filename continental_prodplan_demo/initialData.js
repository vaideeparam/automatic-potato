// Production Planning Automation Demo Data
// Automotive Parts Manufacturing - Indian Context

// Contracts Data
window.contractsData = [
    {
        id: "CT-2024-001",
        customer: "Maruti Suzuki",
        product: "Brake Pads",
        quantity: "15,000",
        deliveryDate: "2024-03-15",
        status: "Green",
        priority: "High"
    },
    {
        id: "CT-2024-002", 
        customer: "Hyundai Motors",
        product: "Air Filters",
        quantity: "22,000",
        deliveryDate: "2024-03-20",
        status: "Yellow",
        priority: "Medium"
    },
    {
        id: "CT-2024-003",
        customer: "Tata Motors",
        product: "Spark Plugs",
        quantity: "35,000",
        deliveryDate: "2024-03-25",
        status: "Green",
        priority: "High"
    },
    {
        id: "CT-2024-004",
        customer: "Mahindra & Mahindra",
        product: "Fuel Injectors",
        quantity: "8,500",
        deliveryDate: "2024-03-30",
        status: "Red",
        priority: "Critical"
    },
    {
        id: "CT-2024-005",
        customer: "Honda Cars",
        product: "ECU Modules",
        quantity: "12,000",
        deliveryDate: "2024-04-05",
        status: "Green",
        priority: "Medium"
    },
    {
        id: "CT-2024-006",
        customer: "Bajaj Auto",
        product: "Brake Discs",
        quantity: "18,500",
        deliveryDate: "2024-04-10",
        status: "Yellow",
        priority: "High"
    },
    {
        id: "CT-2024-007",
        customer: "Force Motors",
        product: "Clutch Plates",
        quantity: "6,800",
        deliveryDate: "2024-04-15",
        status: "Green",
        priority: "Low"
    }
];

// Monthly Schedule Data
window.monthlyScheduleData = [
    {
        week: "Week 1",
        product: "Brake Pads",
        targetQty: "28,000",
        allocatedLines: "SMT-1, SMT-2",
        rawMaterialReq: "Iron, Ceramic",
        status: "Green"
    },
    {
        week: "Week 1",
        product: "Air Filters",
        targetQty: "35,000",
        allocatedLines: "ASM-A",
        rawMaterialReq: "Paper, Rubber",
        status: "Yellow"
    },
    {
        week: "Week 2",
        product: "Spark Plugs",
        targetQty: "42,000",
        allocatedLines: "SMT-3, ASM-B",
        rawMaterialReq: "Electrode, Ceramic",
        status: "Green"
    },
    {
        week: "Week 2",
        product: "Fuel Injectors",
        targetQty: "15,000",
        allocatedLines: "SMT-1",
        rawMaterialReq: "Steel, Electronics",
        status: "Red"
    },
    {
        week: "Week 3",
        product: "ECU Modules",
        targetQty: "18,000",
        allocatedLines: "SMT-2, SMT-3",
        rawMaterialReq: "PCB, Components",
        status: "Green"
    },
    {
        week: "Week 3",
        product: "Brake Discs",
        targetQty: "25,000",
        allocatedLines: "ASM-A, ASM-B",
        rawMaterialReq: "Cast Iron, Steel",
        status: "Yellow"
    },
    {
        week: "Week 4",
        product: "Clutch Plates",
        targetQty: "12,000",
        allocatedLines: "SMT-1, ASM-A",
        rawMaterialReq: "Friction Material",
        status: "Green"
    }
];

// Daily Schedule Data
window.dailyScheduleData = [
    {
        timeSlot: "06:00-08:00",
        line: "SMT-1",
        product: "Brake Pads",
        target: "320",
        actual: "315",
        status: "Green"
    },
    {
        timeSlot: "06:00-08:00",
        line: "SMT-2",
        product: "Air Filters", 
        target: "280",
        actual: "265",
        status: "Yellow"
    },
    {
        timeSlot: "08:00-10:00",
        line: "SMT-1",
        product: "Brake Pads",
        target: "320",
        actual: "330",
        status: "Green"
    },
    {
        timeSlot: "08:00-10:00",
        line: "SMT-3",
        product: "Spark Plugs",
        target: "450",
        actual: "420",
        status: "Yellow"
    },
    {
        timeSlot: "10:00-12:00",
        line: "ASM-A",
        product: "ECU Modules",
        target: "180",
        actual: "190",
        status: "Green"
    },
    {
        timeSlot: "10:00-12:00",
        line: "ASM-B",
        product: "Brake Discs",
        target: "240",
        actual: "185",
        status: "Red"
    },
    {
        timeSlot: "12:00-14:00",
        line: "SMT-2",
        product: "Fuel Injectors",
        target: "150",
        actual: "148",
        status: "Green"
    },
    {
        timeSlot: "14:00-16:00",
        line: "SMT-1",
        product: "Clutch Plates",
        target: "200",
        actual: "205",
        status: "Green"
    },
    {
        timeSlot: "14:00-16:00",
        line: "SMT-3",
        product: "Spark Plugs",
        target: "450",
        actual: "440",
        status: "Yellow"
    },
    {
        timeSlot: "16:00-18:00",
        line: "ASM-A",
        product: "Air Filters",
        target: "280",
        actual: "290",
        status: "Green"
    }
];

// Dispatch Data
window.dispatchData = [
    {
        id: "DS-001",
        customer: "Maruti Suzuki",
        product: "Brake Pads",
        quantity: "2,500",
        truckNo: "MH-12-AB-1234",
        departureTime: "08:30",
        status: "Green"
    },
    {
        id: "DS-002",
        customer: "Hyundai Motors", 
        product: "Air Filters",
        quantity: "3,200",
        truckNo: "TN-09-CD-5678",
        departureTime: "09:15",
        status: "Green"
    },
    {
        id: "DS-003",
        customer: "Tata Motors",
        product: "Spark Plugs",
        quantity: "4,800",
        truckNo: "WB-06-EF-9012",
        departureTime: "10:00",
        status: "Yellow"
    },
    {
        id: "DS-004",
        customer: "Mahindra & Mahindra",
        product: "Fuel Injectors",
        quantity: "1,200",
        truckNo: "MH-14-GH-3456",
        departureTime: "11:30",
        status: "Red"
    },
    {
        id: "DS-005",
        customer: "Honda Cars",
        product: "ECU Modules",
        quantity: "1,800",
        truckNo: "KA-05-IJ-7890",
        departureTime: "12:45",
        status: "Green"
    },
    {
        id: "DS-006",
        customer: "Bajaj Auto",
        product: "Brake Discs",
        quantity: "2,100",
        truckNo: "UP-16-KL-2345",
        departureTime: "14:00",
        status: "Green"
    },
    {
        id: "DS-007",
        customer: "Force Motors",
        product: "Clutch Plates",
        quantity: "950",
        truckNo: "MH-20-MN-6789",
        departureTime: "15:30",
        status: "Yellow"
    },
    {
        id: "DS-008",
        customer: "Maruti Suzuki",
        product: "Air Filters",
        quantity: "2,800",
        truckNo: "HR-26-OP-0123",
        departureTime: "16:15",
        status: "Green"
    }
];

// Inventory Data
window.inventoryData = [
    {
        product: "Brake Pads",
        currentStock: "8,500",
        minLevel: "5,000",
        maxLevel: "15,000",
        reorderPoint: "6,000",
        status: "Green"
    },
    {
        product: "Air Filters",
        currentStock: "12,800",
        minLevel: "8,000", 
        maxLevel: "20,000",
        reorderPoint: "10,000",
        status: "Green"
    },
    {
        product: "Spark Plugs",
        currentStock: "3,200",
        minLevel: "4,000",
        maxLevel: "18,000",
        reorderPoint: "5,000",
        status: "Red"
    },
    {
        product: "Fuel Injectors",
        currentStock: "2,100",
        minLevel: "2,500",
        maxLevel: "8,000",
        reorderPoint: "3,000",
        status: "Red"
    },
    {
        product: "ECU Modules",
        currentStock: "4,800",
        minLevel: "3,000",
        maxLevel: "12,000",
        reorderPoint: "4,000",
        status: "Green"
    },
    {
        product: "Brake Discs",
        currentStock: "6,500",
        minLevel: "4,000",
        maxLevel: "16,000",
        reorderPoint: "5,000",
        status: "Green"
    },
    {
        product: "Clutch Plates",
        currentStock: "1,800",
        minLevel: "2,000",
        maxLevel: "8,000",
        reorderPoint: "2,500",
        status: "Red"
    },
    {
        product: "Oil Filters",
        currentStock: "15,200",
        minLevel: "6,000",
        maxLevel: "18,000",
        reorderPoint: "8,000",
        status: "Yellow"
    },
    {
        product: "Gaskets",
        currentStock: "25,600",
        minLevel: "10,000",
        maxLevel: "30,000",
        reorderPoint: "12,000",
        status: "Green"
    },
    {
        product: "Bearings",
        currentStock: "8,900",
        minLevel: "5,000",
        maxLevel: "15,000",
        reorderPoint: "6,500",
        status: "Green"
    }
];

// Real-time Production Data
window.productionMetrics = {
    currentShift: 2,
    shiftStartTime: "14:00",
    shiftEndTime: "22:00",
    overallOEE: 84.2,
    plannedProductionTime: 480, // minutes
    actualProductionTime: 435, // minutes
    totalProduced: 1890,
    totalTarget: 2450,
    efficiency: 77.1,
    qualityRate: 98.7,
    availability: 90.6,
    performance: 86.5
};

// Line Status Data
window.lineStatus = [
    {
        line: "SMT-1",
        status: "Active",
        currentProduct: "Brake Pads",
        efficiency: 92.5,
        lastMaintenance: "2024-03-01",
        nextMaintenance: "2024-03-15"
    },
    {
        line: "SMT-2", 
        status: "Active",
        currentProduct: "Air Filters",
        efficiency: 88.7,
        lastMaintenance: "2024-02-28",
        nextMaintenance: "2024-03-14"
    },
    {
        line: "SMT-3",
        status: "Buffer Low",
        currentProduct: "Spark Plugs", 
        efficiency: 75.2,
        lastMaintenance: "2024-03-03",
        nextMaintenance: "2024-03-17"
    },
    {
        line: "ASM-A",
        status: "Active",
        currentProduct: "ECU Modules",
        efficiency: 91.8,
        lastMaintenance: "2024-02-25",
        nextMaintenance: "2024-03-11"
    },
    {
        line: "ASM-B",
        status: "Maintenance",
        currentProduct: "N/A",
        efficiency: 0,
        lastMaintenance: "2024-03-08",
        nextMaintenance: "2024-03-08"
    }
];

// Quality Control Data
window.qualityData = [
    {
        product: "Brake Pads",
        batchId: "BP-2024-0308-001",
        testedUnits: 500,
        passedUnits: 495,
        failedUnits: 5,
        passRate: 99.0,
        inspector: "Rajesh Kumar"
    },
    {
        product: "Air Filters",
        batchId: "AF-2024-0308-002", 
        testedUnits: 350,
        passedUnits: 342,
        failedUnits: 8,
        passRate: 97.7,
        inspector: "Priya Sharma"
    },
    {
        product: "Spark Plugs",
        batchId: "SP-2024-0308-003",
        testedUnits: 800,
        passedUnits: 792,
        failedUnits: 8,
        passRate: 99.0,
        inspector: "Anil Verma"
    }
];

// Supplier Data
window.supplierData = [
    {
        supplier: "Bharat Electronics Ltd",
        material: "PCB Components",
        deliveryStatus: "On Time",
        qualityRating: 4.8,
        lastDelivery: "2024-03-07",
        nextDelivery: "2024-03-12"
    },
    {
        supplier: "TATA Steel",
        material: "Steel Sheets",
        deliveryStatus: "Delayed",
        qualityRating: 4.6,
        lastDelivery: "2024-03-05",
        nextDelivery: "2024-03-10"
    },
    {
        supplier: "Mahindra Casting",
        material: "Cast Iron Parts",
        deliveryStatus: "On Time", 
        qualityRating: 4.9,
        lastDelivery: "2024-03-06",
        nextDelivery: "2024-03-13"
    }
];

// Energy and Utility Data
window.utilityData = {
    powerConsumption: {
        current: 850, // kWh
        peak: 950,
        average: 820,
        cost: "₹68,000"
    },
    waterUsage: {
        current: 2400, // liters
        peak: 2800,
        average: 2200,
        cost: "₹1,200"
    },
    compressedAir: {
        pressure: 7.2, // bar
        consumption: 450, // CFM
        efficiency: 85.5
    }
};

// Workforce Data
window.workforceData = {
    totalEmployees: 245,
    presentToday: 238,
    onLeave: 7,
    shifts: {
        shift1: { scheduled: 82, present: 80 },
        shift2: { scheduled: 85, present: 84 },
        shift3: { scheduled: 78, present: 74 }
    },
    productivity: 92.3,
    safetyRecord: {
        daysWithoutIncident: 45,
        totalIncidents: 2,
        safetyRating: "Good"
    }
};

// Cost Analysis Data
window.costData = {
    dailyCosts: {
        rawMaterials: "₹2,45,000",
        labor: "₹85,000", 
        energy: "₹68,000",
        maintenance: "₹35,000",
        overhead: "₹45,000",
        total: "₹4,78,000"
    },
    costPerUnit: {
        brakePads: "₹145",
        airFilters: "₹85",
        sparkPlugs: "₹65",
        fuelInjectors: "₹380",
        ecuModules: "₹1,250"
    }
};

// Environmental Data
window.environmentalData = {
    carbonFootprint: {
        daily: "2.8 tons CO2",
        monthly: "84 tons CO2",
        yearly: "1,008 tons CO2"
    },
    wasteGeneration: {
        metalWaste: "145 kg",
        plasticWaste: "68 kg", 
        electronicWaste: "23 kg",
        recyclingRate: "78%"
    },
    compliance: {
        airQuality: "Within Limits",
        waterDischarge: "Within Limits", 
        noiseLevel: "Within Limits"
    }
};

// Equipment Maintenance Schedule
window.maintenanceSchedule = [
    {
        equipment: "SMT Line 1",
        type: "Preventive",
        scheduledDate: "2024-03-15",
        duration: "4 hours",
        technician: "Maintenance Team A",
        status: "Scheduled"
    },
    {
        equipment: "Compressor Unit 2",
        type: "Corrective",
        scheduledDate: "2024-03-10",
        duration: "2 hours", 
        technician: "Maintenance Team B",
        status: "In Progress"
    },
    {
        equipment: "Assembly Line A",
        type: "Calibration",
        scheduledDate: "2024-03-12",
        duration: "3 hours",
        technician: "Maintenance Team C", 
        status: "Scheduled"
    }
];

// Customer Satisfaction Data
window.customerSatisfaction = {
    averageRating: 4.6,
    onTimeDelivery: 96.2,
    qualityComplaints: 0.8, // percentage
    customerRetention: 94.5,
    feedback: [
        { customer: "Maruti Suzuki", rating: 4.8, comment: "Excellent quality and timely delivery" },
        { customer: "Hyundai Motors", rating: 4.5, comment: "Good quality, minor packaging issues" },
        { customer: "Tata Motors", rating: 4.7, comment: "Consistent quality and reliability" }
    ]
};

// Market Analysis Data
window.marketData = {
    demandForecast: {
        brakePads: { current: "High", nextMonth: "High", trend: "Stable" },
        airFilters: { current: "Medium", nextMonth: "High", trend: "Increasing" },
        sparkPlugs: { current: "High", nextMonth: "Medium", trend: "Decreasing" },
        fuelInjectors: { current: "Low", nextMonth: "Medium", trend: "Increasing" },
        ecuModules: { current: "Medium", nextMonth: "Medium", trend: "Stable" }
    },
    competitorAnalysis: {
        marketShare: "12.5%",
        ranking: "3rd in region",
        pricePosition: "Competitive",
        qualityPosition: "Above Average"
    }
};

// Export all data for global access
console.log("Demo data loaded successfully!");
console.log("Available datasets:", Object.keys(window).filter(key => key.includes('Data') || key.includes('Metrics')));

// BOM and Spool Management Data
window.spoolInventoryData = [
    {
        partNumber: "C2012-100nF",
        spoolId: "C2012-03",
        unitsPerSpool: 50000,
        availableSpools: 1,
        currentUsage: 6000,
        remainingUnits: 44000,
        status: "In Use",
        allocatedTo: "SMT Line 1",
        supplier: "Murata Electronics",
        lastDelivery: "2024-03-05",
        reorderPoint: 25000,
        costPerSpool: "₹12,500"
    },
    {
        partNumber: "R0805-10K",
        spoolId: "R0805-07",
        unitsPerSpool: 25000,
        availableSpools: 0,
        currentUsage: 22800,
        remainingUnits: 2200,
        status: "Critical",
        allocatedTo: "SMT Line 2",
        supplier: "Yageo Corporation",
        lastDelivery: "2024-03-03",
        reorderPoint: 12500,
        costPerSpool: "₹8,200"
    },
    {
        partNumber: "IC7408-DIP",
        spoolId: "IC7408-01",
        unitsPerSpool: 50000,
        availableSpools: 5,
        currentUsage: 12000,
        remainingUnits: 38000,
        status: "Active",
        allocatedTo: "SMT Line 3",
        supplier: "Texas Instruments",
        lastDelivery: "2024-03-07",
        reorderPoint: 25000,
        costPerSpool: "₹45,000"
    },
    {
        partNumber: "L0805-10uH",
        spoolId: "L0805-04",
        unitsPerSpool: 30000,
        availableSpools: 2,
        currentUsage: 0,
        remainingUnits: 30000,
        status: "Available",
        allocatedTo: "None",
        supplier: "TDK Corporation",
        lastDelivery: "2024-03-06",
        reorderPoint: 15000,
        costPerSpool: "₹18,500"
    },
    {
        partNumber: "D1206-Schottky",
        spoolId: "D1206-02",
        unitsPerSpool: 40000,
        availableSpools: 3,
        currentUsage: 8500,
        remainingUnits: 31500,
        status: "Active",
        allocatedTo: "Assembly A",
        supplier: "Vishay Semiconductors",
        lastDelivery: "2024-03-04",
        reorderPoint: 20000,
        costPerSpool: "₹22,800"
    },
    {
        partNumber: "Q-SOT23-N",
        spoolId: "Q-SOT23-05",
        unitsPerSpool: 15000,
        availableSpools: 1,
        currentUsage: 14200,
        remainingUnits: 800,
        status: "Critical",
        allocatedTo: "Assembly A",
        supplier: "Infineon Technologies",
        lastDelivery: "2024-03-02",
        reorderPoint: 7500,
        costPerSpool: "₹35,600"
    }
];

// BOM Mapping Data
window.bomMappingData = [
    {
        productSKU: "BrakePad-ECU-v2.1",
        bomVersion: "v2.1.3",
        components: [
            { partNumber: "C2012-100nF", quantity: 12, usage: "Decoupling" },
            { partNumber: "R0805-10K", quantity: 8, usage: "Pull-up" },
            { partNumber: "IC7408-DIP", quantity: 2, usage: "Logic Gates" },
            { partNumber: "Q-SOT23-N", quantity: 4, usage: "Switching" }
        ],
        unitsPerSpool: 2083, // How many products can be made from one spool set
        estimatedSpoolConsumption: "1.2 spools/day"
    },
    {
        productSKU: "AirFilter-Controller-v1.5",
        bomVersion: "v1.5.2", 
        components: [
            { partNumber: "C2012-100nF", quantity: 8, usage: "Filtering" },
            { partNumber: "R0805-10K", quantity: 15, usage: "Biasing" },
            { partNumber: "L0805-10uH", quantity: 3, usage: "EMI Filter" },
            { partNumber: "D1206-Schottky", quantity: 6, usage: "Protection" }
        ],
        unitsPerSpool: 1666,
        estimatedSpoolConsumption: "1.8 spools/day"
    },
    {
        productSKU: "SparkPlug-Module-v3.0",
        bomVersion: "v3.0.1",
        components: [
            { partNumber: "IC7408-DIP", quantity: 1, usage: "Control Logic" },
            { partNumber: "C2012-100nF", quantity: 6, usage: "Bypass" },
            { partNumber: "R0805-10K", quantity: 10, usage: "Current Limit" },
            { partNumber: "Q-SOT23-N", quantity: 8, usage: "Driver" }
        ],
        unitsPerSpool: 1875,
        estimatedSpoolConsumption: "0.9 spools/day"
    }
];

// Production Schedule with Spool Allocation
window.spoolAllocationSchedule = [
    {
        timeSlot: "06:00-10:00",
        line: "SMT Line 1",
        product: "BrakePad-ECU-v2.1",
        targetUnits: 320,
        requiredSpools: ["C2012-03", "R0805-07"],
        spoolStatus: "Allocated",
        estimatedDepletion: "09:30",
        nextSpoolReady: "C2012-04"
    },
    {
        timeSlot: "10:00-14:00", 
        line: "SMT Line 2",
        product: "AirFilter-Controller-v1.5",
        targetUnits: 280,
        requiredSpools: ["L0805-04", "D1206-02"],
        spoolStatus: "Waiting for R0805",
        estimatedDepletion: "13:15",
        nextSpoolReady: "R0805-08 (ETA: 14:30)"
    },
    {
        timeSlot: "14:00-18:00",
        line: "SMT Line 3", 
        product: "SparkPlug-Module-v3.0",
        targetUnits: 450,
        requiredSpools: ["IC7408-01", "Q-SOT23-05"],
        spoolStatus: "Ready",
        estimatedDepletion: "17:45",
        nextSpoolReady: "IC7408-02"
    }
];

// Spool Changeover History
window.spoolChangeoverData = [
    {
        timestamp: "2024-03-08 08:15",
        line: "SMT Line 1",
        fromSpool: "C2012-02",
        toSpool: "C2012-03",
        changeoverTime: "11 minutes",
        reason: "Spool Depletion",
        operator: "Rajesh Kumar",
        unitsLost: 15
    },
    {
        timestamp: "2024-03-08 11:45",
        line: "SMT Line 2",
        fromSpool: "R0805-06", 
        toSpool: "R0805-07",
        changeoverTime: "13 minutes",
        reason: "Spool Depletion",
        operator: "Priya Sharma",
        unitsLost: 22
    },
    {
        timestamp: "2024-03-07 15:30",
        line: "Assembly A",
        fromSpool: "D1206-01",
        toSpool: "D1206-02", 
        changeoverTime: "8 minutes",
        reason: "Planned Change",
        operator: "Anil Verma",
        unitsLost: 5
    }
];

// Supplier Performance Data
window.spoolSupplierData = [
    {
        supplier: "Murata Electronics",
        partNumbers: ["C2012-100nF", "C1206-1uF"],
        deliveryReliability: 96.8,
        qualityRating: 99.2,
        leadTime: "7-10 days",
        lastOrderDate: "2024-03-05",
        nextDeliveryDate: "2024-03-12",
        pendingOrders: 8,
        averageSpoolCost: "₹12,800"
    },
    {
        supplier: "Yageo Corporation", 
        partNumbers: ["R0805-10K", "R1206-1K"],
        deliveryReliability: 89.4,
        qualityRating: 97.8,
        leadTime: "5-8 days",
        lastOrderDate: "2024-03-03",
        nextDeliveryDate: "2024-03-11",
        pendingOrders: 12,
        averageSpoolCost: "₹8,500"
    },
    {
        supplier: "Texas Instruments",
        partNumbers: ["IC7408-DIP", "IC7404-DIP"],
        deliveryReliability: 94.2,
        qualityRating: 99.8,
        leadTime: "10-14 days", 
        lastOrderDate: "2024-03-07",
        nextDeliveryDate: "2024-03-18",
        pendingOrders: 3,
        averageSpoolCost: "₹42,000"
    }
];

// Real-time Spool Consumption Tracking
window.realTimeSpoolData = [
    {
        timestamp: "2024-03-08 12:00",
        partNumber: "C2012-100nF",
        consumptionRate: 2500, // units per hour
        remainingHours: 17.6,
        efficiency: 94.2,
        wasteRate: 0.8,
        predictedDepletion: "2024-03-09 05:36"
    },
    {
        timestamp: "2024-03-08 12:00",
        partNumber: "R0805-10K", 
        consumptionRate: 1100,
        remainingHours: 2.0,
        efficiency: 91.5,
        wasteRate: 1.2,
        predictedDepletion: "2024-03-08 14:00"
    },
    {
        timestamp: "2024-03-08 12:00",
        partNumber: "IC7408-DIP",
        consumptionRate: 800,
        remainingHours: 47.5,
        efficiency: 97.8,
        wasteRate: 0.3,
        predictedDepletion: "2024-03-10 11:30"
    }
];