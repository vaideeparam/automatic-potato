// Global variables to store our data
let retailSalesData = [];
let productPositioningData = [];
let dashboardData = {}; // Will store all our processed data
let charts = []; // Store chart references for updating

// DOM Elements
const loadingIndicator = document.getElementById('loading');
const dashboardContent = document.getElementById('dashboard-content');
const analyzeBtn = document.getElementById('analyze-btn');
const retailSalesInput = document.getElementById('retail-sales');
const productPositioningInput = document.getElementById('product-positioning');
const exportExcelBtn = document.getElementById('export-excel');
const toggleThemeBtn = document.getElementById('toggle-theme');

// Initialize and set up event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading indicator initially
    loadingIndicator.style.display = 'none';
    
    // Set up event listeners
    analyzeBtn.addEventListener('click', analyzeData);
    exportExcelBtn.addEventListener('click', exportToExcel);
    toggleThemeBtn.addEventListener('click', toggleTheme);
    
    // Check if we have demo data
    checkForDemoData();
});

// Check if we're working with demo files
function checkForDemoData() {
    // Simple check to see if files exist in the expected location
    const fileCheck = new XMLHttpRequest();
    fileCheck.open('HEAD', 'retail_sales_dataset.csv', true);
    fileCheck.onreadystatechange = function() {
        if (fileCheck.readyState === 4) {
            if (fileCheck.status === 200) {
                console.log('Demo data detected');
                loadDemoData();
            } else {
                console.log('No demo data detected. Please upload files.');
            }
        }
    };
    fileCheck.send();
}

// Load demo data if available
function loadDemoData() {
    Promise.all([
        fetch('retail_sales_dataset.csv').then(response => response.text()),
        fetch('Product Positioning.csv').then(response => response.text())
    ])
    .then(([retailData, positioningData]) => {
        retailSalesData = Papa.parse(retailData, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        }).data;
        
        productPositioningData = Papa.parse(positioningData, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        }).data;
        
        // Process and display data
        analyzeData();
    })
    .catch(error => {
        console.error('Error loading demo data:', error);
    });
}

// Main function to analyze our data
function analyzeData() {
    // Show loading indicator
    loadingIndicator.style.display = 'flex';
    dashboardContent.classList.add('dashboard-hidden');
    
    // If files are uploaded, process them
    if (retailSalesInput.files.length > 0 || productPositioningInput.files.length > 0) {
        processUploadedFiles();
    } else if (retailSalesData.length === 0 || productPositioningData.length === 0) {
        alert('Please upload both datasets or wait for demo data to load.');
        loadingIndicator.style.display = 'none';
        return;
    } else {
        // We already have data (from demo), process it
        processData();
    }
}

// Process uploaded files
function processUploadedFiles() {
    const retailFilePromise = retailSalesInput.files.length > 0 
        ? new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => {
                const csv = e.target.result;
                retailSalesData = Papa.parse(csv, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true
                }).data;
                resolve();
            };
            reader.readAsText(retailSalesInput.files[0]);
        })
        : Promise.resolve();
        
    const positioningFilePromise = productPositioningInput.files.length > 0
        ? new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => {
                const csv = e.target.result;
                productPositioningData = Papa.parse(csv, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true
                }).data;
                resolve();
            };
            reader.readAsText(productPositioningInput.files[0]);
        })
        : Promise.resolve();
        
    Promise.all([retailFilePromise, positioningFilePromise])
        .then(() => {
            processData();
        })
        .catch(error => {
            console.error('Error processing files:', error);
            loadingIndicator.style.display = 'none';
            alert('Error processing files. Please check the file format.');
        });
}

// Process the data to generate insights
function processData() {
    console.log('Processing data...');
    // Create a delay to show loading indicator (for demonstration purposes)
    setTimeout(() => {
        try {
            // Calculate all our insights
            dashboardData = {
                kpis: calculateKPIs(),
                categoryAnalysis: analyzeCategoryPerformance(),
                customerSegmentation: analyzeCustomerSegmentation(),
                pricingAnalysis: analyzePricing(),
                promotionAnalysis: analyzePromotions(),
                marketBasket: performMarketBasketAnalysis(),
                seasonalAnalysis: analyzeSeasonalTrends(),
                recommendations: generateRecommendations()
            };
            
            // Update dashboard with our findings
            updateDashboard();
            
            // Hide loading and show dashboard
            loadingIndicator.style.display = 'none';
            dashboardContent.classList.remove('dashboard-hidden');
        } catch (error) {
            console.error('Error during data processing:', error);
            loadingIndicator.style.display = 'none';
            alert('Error analyzing data. Please check the console for details.');
        }
    }, 1000);
}

// ANALYSIS FUNCTIONS

// Calculate Key Performance Indicators
function calculateKPIs() {
    if (!retailSalesData || retailSalesData.length === 0) {
        return {
            totalSales: 0,
            totalTransactions: 0,
            averageOrderValue: 0,
            uniqueCustomers: 0
        };
    }
    
    const totalSales = retailSalesData.reduce((sum, row) => {
        return sum + (parseFloat(row['Total Amount']) || 0);
    }, 0);
    
    const totalTransactions = retailSalesData.length;
    
    const averageOrderValue = totalSales / totalTransactions;
    
    const uniqueCustomers = new Set(
        retailSalesData.map(row => row['Customer ID'])
    ).size;
    
    return {
        totalSales,
        totalTransactions,
        averageOrderValue,
        uniqueCustomers
    };
}

// Analyze category performance
function analyzeCategoryPerformance() {
    if (!retailSalesData || retailSalesData.length === 0) {
        return [];
    }
    
    // Get unique categories
    const categories = {};
    
    retailSalesData.forEach(row => {
        const category = row['Product Category'];
        if (!category) return;
        
        if (!categories[category]) {
            categories[category] = {
                sales: 0,
                quantity: 0,
                transactions: 0
            };
        }
        
        categories[category].sales += parseFloat(row['Total Amount']) || 0;
        categories[category].quantity += parseInt(row['Quantity']) || 0;
        categories[category].transactions += 1;
    });
    
    // Convert to array for easier charting
    return Object.entries(categories).map(([category, data]) => ({
        category,
        sales: data.sales,
        quantity: data.quantity,
        transactions: data.transactions,
        avgOrderValue: data.sales / data.transactions
    }));
}

// Analyze customer segmentation
function analyzeCustomerSegmentation() {
    if (!retailSalesData || retailSalesData.length === 0) {
        return {
            age: {},
            gender: {},
            ageGenderHeatmap: []
        };
    }
    
    // Age groups
    const ageGroups = {
        '18-25': 0,
        '26-35': 0,
        '36-45': 0,
        '46-55': 0,
        '56+': 0
    };
    
    // Gender distribution
    const genderDistribution = {};
    
    // Age-Gender spending heatmap
    const ageGenderSpending = {
        '18-25': { male: 0, female: 0 },
        '26-35': { male: 0, female: 0 },
        '36-45': { male: 0, female: 0 },
        '46-55': { male: 0, female: 0 },
        '56+': { male: 0, female: 0 }
    };
    
    // Age-Gender count for average calculation
    const ageGenderCount = {
        '18-25': { male: 0, female: 0 },
        '26-35': { male: 0, female: 0 },
        '36-45': { male: 0, female: 0 },
        '46-55': { male: 0, female: 0 },
        '56+': { male: 0, female: 0 }
    };
    
    retailSalesData.forEach(row => {
        // Get age group
        let ageGroup;
        const age = parseInt(row['Age']);
        
        if (age <= 25) ageGroup = '18-25';
        else if (age <= 35) ageGroup = '26-35';
        else if (age <= 45) ageGroup = '36-45';
        else if (age <= 55) ageGroup = '46-55';
        else ageGroup = '56+';
        
        // Increment age group counter
        ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;
        
        // Process gender
        const gender = (row['Gender'] || '').toLowerCase();
        if (gender === 'male' || gender === 'female') {
            // Update gender distribution
            genderDistribution[gender] = (genderDistribution[gender] || 0) + 1;
            
            // Update age-gender spending
            ageGenderSpending[ageGroup][gender] += parseFloat(row['Total Amount']) || 0;
            ageGenderCount[ageGroup][gender] += 1;
        }
    });
    
    // Calculate average spending for heatmap
    const heatmapData = [];
    const ageGroupNames = Object.keys(ageGroups);
    const genders = Object.keys(genderDistribution);
    
    ageGroupNames.forEach(ageGroup => {
        genders.forEach(gender => {
            const count = ageGenderCount[ageGroup][gender];
            const totalSpending = ageGenderSpending[ageGroup][gender];
            const avgSpending = count > 0 ? totalSpending / count : 0;
            
            heatmapData.push({
                ageGroup,
                gender,
                avgSpending,
                totalSpending,
                count
            });
        });
    });
    
    return {
        age: ageGroups,
        gender: genderDistribution,
        ageGenderHeatmap: heatmapData
    };
}

// Analyze pricing strategies
function analyzePricing() {
    if (!productPositioningData || productPositioningData.length === 0) {
        return {
            priceComparison: [],
            priceSalesRelationship: []
        };
    }
    
    // Price comparison by category
    const priceByCategory = {};
    
    // Price-sales relationship data
    const priceSalesData = [];
    
    productPositioningData.forEach(row => {
        const category = row['Product Category'];
        if (!category) return;
        
        // Price comparison
        if (!priceByCategory[category]) {
            priceByCategory[category] = {
                ourPriceSum: 0,
                competitorPriceSum: 0,
                count: 0
            };
        }
        
        const ourPrice = parseFloat(row['Price']) || 0;
        const competitorPrice = parseFloat(row["Competitor's Price"]) || 0;
        
        priceByCategory[category].ourPriceSum += ourPrice;
        priceByCategory[category].competitorPriceSum += competitorPrice;
        priceByCategory[category].count += 1;
        
        // Price-sales relationship
        priceSalesData.push({
            category,
            price: ourPrice,
            competitorPrice,
            priceDifference: ourPrice - competitorPrice,
            priceRatio: competitorPrice > 0 ? ourPrice / competitorPrice : 1,
            salesVolume: parseInt(row['Sales Volume']) || 0
        });
    });
    
    // Calculate averages for price comparison
    const priceComparison = Object.entries(priceByCategory).map(([category, data]) => ({
        category,
        ourPrice: data.count > 0 ? data.ourPriceSum / data.count : 0,
        competitorPrice: data.count > 0 ? data.competitorPriceSum / data.count : 0
    }));
    
    return {
        priceComparison,
        priceSalesRelationship: priceSalesData
    };
}

// Analyze promotion effectiveness
function analyzePromotions() {
    if (!productPositioningData || productPositioningData.length === 0) {
        return [];
    }
    
    const promotions = {};
    
    productPositioningData.forEach(row => {
        const promotion = row['Promotion'];
        if (!promotion) return;
        
        if (!promotions[promotion]) {
            promotions[promotion] = {
                totalSales: 0,
                count: 0
            };
        }
        
        promotions[promotion].totalSales += parseInt(row['Sales Volume']) || 0;
        promotions[promotion].count += 1;
    });
    
    return Object.entries(promotions).map(([promotion, data]) => ({
        promotion,
        totalSales: data.totalSales,
        productCount: data.count,
        avgSalesPerProduct: data.count > 0 ? data.totalSales / data.count : 0
    }));
}

// Perform market basket analysis
function performMarketBasketAnalysis() {
    if (!retailSalesData || retailSalesData.length === 0) {
        return {
            productCombinations: [],
            productNetwork: []
        };
    }
    
    // Group transactions by customer and date
    const transactions = {};
    
    retailSalesData.forEach(row => {
        const key = `${row['Customer ID']}-${row['Date']}`;
        if (!transactions[key]) {
            transactions[key] = new Set();
        }
        
        const category = row['Product Category'];
        if (category) {
            transactions[key].add(category);
        }
    });
    
    // Calculate co-occurrences
    const coOccurrences = {};
    const productFrequency = {};
    
    Object.values(transactions).forEach(categories => {
        const categoryArray = Array.from(categories);
        
        // Count individual product frequencies
        categoryArray.forEach(category => {
            productFrequency[category] = (productFrequency[category] || 0) + 1;
        });
        
        // Count co-occurrences
        if (categoryArray.length > 1) {
            for (let i = 0; i < categoryArray.length; i++) {
                for (let j = i + 1; j < categoryArray.length; j++) {
                    const pair = [categoryArray[i], categoryArray[j]].sort().join(' & ');
                    coOccurrences[pair] = (coOccurrences[pair] || 0) + 1;
                }
            }
        }
    });
    
    // Sort and get top combinations
    const combinations = Object.entries(coOccurrences)
        .map(([pair, count]) => {
            const [product1, product2] = pair.split(' & ');
            const support = count / Object.keys(transactions).length;
            const confidence = count / (productFrequency[product1] || 1);
            const lift = confidence / ((productFrequency[product2] || 1) / Object.keys(transactions).length);
            
            return {
                pair,
                product1,
                product2,
                count,
                support,
                confidence,
                lift
            };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
        
    // Create network data
    const networkNodes = new Set();
    const networkLinks = [];
    
    combinations.forEach(combo => {
        networkNodes.add(combo.product1);
        networkNodes.add(combo.product2);
        
        networkLinks.push({
            source: combo.product1,
            target: combo.product2,
            value: combo.count
        });
    });
    
    return {
        productCombinations: combinations,
        productNetwork: {
            nodes: Array.from(networkNodes).map(id => ({ id })),
            links: networkLinks
        }
    };
}

// Analyze seasonal trends
function analyzeSeasonalTrends() {
    if (!productPositioningData || productPositioningData.length === 0) {
        return [];
    }
    
    const seasons = {};
    
    productPositioningData.forEach(row => {
        const season = row['Seasonal'];
        if (!season) return;
        
        if (!seasons[season]) {
            seasons[season] = {
                totalSales: 0,
                count: 0
            };
        }
        
        seasons[season].totalSales += parseInt(row['Sales Volume']) || 0;
        seasons[season].count += 1;
    });
    
    return Object.entries(seasons).map(([season, data]) => ({
        season,
        totalSales: data.totalSales,
        productCount: data.count,
        avgSalesPerProduct: data.count > 0 ? data.totalSales / data.count : 0
    }));
}

// Generate data-driven recommendations
function generateRecommendations() {
    const recommendations = [];
    
    // We'll need data from our other analyses
    const categories = analyzeCategoryPerformance();
    const pricing = analyzePricing();
    const promotions = analyzePromotions();
    const marketBasket = performMarketBasketAnalysis();
    const seasonalTrends = analyzeSeasonalTrends();
    
    // 1. Identify underperforming but high-potential categories
    if (categories.length > 0) {
        const sortedByQuantity = [...categories].sort((a, b) => b.quantity - a.quantity);
        const sortedBySales = [...categories].sort((a, b) => b.sales - a.sales);
        
        // High quantity but low sales value
        const highQuantityLowValue = sortedByQuantity.slice(0, Math.ceil(sortedByQuantity.length / 3))
            .filter(item => !sortedBySales.slice(0, Math.ceil(sortedBySales.length / 3)).some(i => i.category === item.category));
            
        if (highQuantityLowValue.length > 0) {
            recommendations.push({
                title: 'Increase Profitability in High-Volume Categories',
                description: `Categories like ${highQuantityLowValue.map(i => i.category).join(', ')} have high sales volume but lower revenue. Consider premium offerings or bundle deals to increase the average order value.`,
                impact: 'Medium',
                effort: 'Medium',
                category: 'Pricing Strategy'
            });
        }
    }
    
    // 2. Price optimization recommendations
    if (pricing.priceComparison.length > 0) {
        const potentialPriceAdjustments = pricing.priceComparison
            .filter(item => Math.abs(item.ourPrice - item.competitorPrice) / item.competitorPrice > 0.1);
            
        if (potentialPriceAdjustments.length > 0) {
            const overpriced = potentialPriceAdjustments.filter(item => item.ourPrice > item.competitorPrice);
            const underpriced = potentialPriceAdjustments.filter(item => item.ourPrice < item.competitorPrice);
            
            if (overpriced.length > 0) {
                recommendations.push({
                    title: 'Adjust Pricing for Competitive Categories',
                    description: `Categories like ${overpriced.map(i => i.category).slice(0, 3).join(', ')} are priced higher than competitors. Consider strategic price adjustments to maintain competitiveness.`,
                    impact: 'High',
                    effort: 'Low',
                    category: 'Pricing Strategy'
                });
            }
            
            if (underpriced.length > 0) {
                recommendations.push({
                    title: 'Optimize Pricing for Value Perception',
                    description: `Categories like ${underpriced.map(i => i.category).slice(0, 3).join(', ')} are priced lower than competitors. Consider slight price increases while emphasizing value to improve margins.`,
                    impact: 'High',
                    effort: 'Low',
                    category: 'Pricing Strategy'
                });
            }
        }
    }
    
    // 3. Promotion effectiveness recommendations
    if (promotions.length > 0) {
        const sortedPromotions = [...promotions].sort((a, b) => b.avgSalesPerProduct - a.avgSalesPerProduct);
        const topPromotion = sortedPromotions[0];
        const bottomPromotion = sortedPromotions[sortedPromotions.length - 1];
        
        if (topPromotion && bottomPromotion) {
            recommendations.push({
                title: 'Optimize Promotional Strategies',
                description: `"${topPromotion.promotion}" promotions show the highest average sales per product. Consider expanding this approach while reducing or redesigning "${bottomPromotion.promotion}" promotions which show significantly lower performance.`,
                impact: 'High',
                effort: 'Medium',
                category: 'Marketing Strategy'
            });
        }
    }
    
    // 4. Cross-selling recommendations based on market basket analysis
    if (marketBasket.productCombinations.length > 0) {
        const topCombinations = marketBasket.productCombinations.slice(0, 3);
        
        if (topCombinations.length > 0) {
            recommendations.push({
                title: 'Implement Strategic Cross-Selling',
                description: `Frequently purchased together: ${topCombinations.map(c => c.pair).join(', ')}. Create bundle offers, cross-promote these items in-store and online, and train staff to suggest these complementary products.`,
                impact: 'Medium',
                effort: 'Medium',
                category: 'Merchandising'
            });
        }
    }
    
    // 5. Seasonal trend recommendations
    if (seasonalTrends.length > 0) {
        const seasonalItems = seasonalTrends.filter(item => item.season.toLowerCase() === 'yes' || item.season.toLowerCase() === 'true');
        const nonSeasonalItems = seasonalTrends.filter(item => item.season.toLowerCase() === 'no' || item.season.toLowerCase() === 'false');
        
        if (seasonalItems.length > 0 && seasonalItems[0].avgSalesPerProduct > 0) {
            recommendations.push({
                title: 'Leverage Seasonal Product Performance',
                description: 'Seasonal products show strong performance. Implement strategic inventory planning, create season-specific promotions, and develop a seasonal marketing calendar to maximize sales during peak periods.',
                impact: 'High',
                effort: 'Medium',
                category: 'Inventory Planning'
            });
        }
    }
    
    // 6. General recommendation if we have data
    if (categories.length > 0) {
        recommendations.push({
            title: 'Enhance Customer Experience with Data-Driven Insights',
            description: 'Implement a customer loyalty program that captures purchase behavior and preferences. Use this data to personalize marketing communications and create targeted offers that increase repeat purchases and customer lifetime value.',
            impact: 'High',
            effort: 'High',
            category: 'Customer Retention'
        });
    }
    
    return recommendations;
}

// UPDATE DASHBOARD FUNCTIONS

// Update the entire dashboard with our analysis results
function updateDashboard() {
    updateKPIs();
    createCategoryCharts();
    createSegmentationCharts();
    createPricingCharts();
    createPromotionCharts();
    displayMarketBasketAnalysis();
    displayRecommendations();
}

// Update KPI section
function updateKPIs() {
    const { totalSales, totalTransactions, averageOrderValue, uniqueCustomers } = dashboardData.kpis;
    
    document.getElementById('total-sales').textContent = formatCurrency(totalSales);
    document.getElementById('total-transactions').textContent = formatNumber(totalTransactions);
    document.getElementById('avg-order-value').textContent = formatCurrency(averageOrderValue);
    document.getElementById('unique-customers').textContent = formatNumber(uniqueCustomers);
}

// Create category performance charts
function createCategoryCharts() {
    const categoryData = dashboardData.categoryAnalysis;
    
    if (!categoryData || categoryData.length === 0) return;
    
    // Sort categories by sales for better visualization
    const sortedData = [...categoryData].sort((a, b) => b.sales - a.sales);
    
    // Sales by category chart
    const categorySalesCtx = document.getElementById('category-sales-chart').getContext('2d');
    const categorySalesChart = new Chart(categorySalesCtx, {
        type: 'bar',
        data: {
            labels: sortedData.map(item => item.category),
            datasets: [{
                label: 'Sales',
                data: sortedData.map(item => item.sales),
                backgroundColor: 'rgba(67, 97, 238, 0.7)',
                borderColor: 'rgba(67, 97, 238, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value, true);
                        }
                    }
                }
            }
        }
    });
    charts.push(categorySalesChart);
    
    // Quantity by category chart
    const categoryQuantityCtx = document.getElementById('category-quantity-chart').getContext('2d');
    const categoryQuantityChart = new Chart(categoryQuantityCtx, {
        type: 'bar',
        data: {
            labels: sortedData.map(item => item.category),
            datasets: [{
                label: 'Quantity Sold',
                data: sortedData.map(item => item.quantity),
                backgroundColor: 'rgba(114, 9, 183, 0.7)',
                borderColor: 'rgba(114, 9, 183, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });
    charts.push(categoryQuantityChart);
}

// Create customer segmentation charts
function createSegmentationCharts() {
    const segmentationData = dashboardData.customerSegmentation;
    
    if (!segmentationData) return;
    
    // Age distribution chart
    if (segmentationData.age && Object.keys(segmentationData.age).length > 0) {
        const ageCtx = document.getElementById('age-chart').getContext('2d');
        const ageChart = new Chart(ageCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(segmentationData.age),
                datasets: [{
                    data: Object.values(segmentationData.age),
                    backgroundColor: [
                        'rgba(67, 97, 238, 0.7)',
                        'rgba(58, 12, 163, 0.7)',
                        'rgba(114, 9, 183, 0.7)',
                        'rgba(247, 37, 133, 0.7)',
                        'rgba(76, 201, 240, 0.7)'
                    ],
                    borderColor: [
                        'rgba(67, 97, 238, 1)',
                        'rgba(58, 12, 163, 1)',
                        'rgba(114, 9, 183, 1)',
                        'rgba(247, 37, 133, 1)',
                        'rgba(76, 201, 240, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        charts.push(ageChart);
    }
    
    // Gender distribution chart
    if (segmentationData.gender && Object.keys(segmentationData.gender).length > 0) {
        const genderCtx = document.getElementById('gender-chart').getContext('2d');
        const genderChart = new Chart(genderCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(segmentationData.gender).map(g => g.charAt(0).toUpperCase() + g.slice(1)),
                datasets: [{
                    data: Object.values(segmentationData.gender),
                    backgroundColor: [
                        'rgba(67, 97, 238, 0.7)',
                        'rgba(247, 37, 133, 0.7)',
                        'rgba(76, 201, 240, 0.7)'
                    ],
                    borderColor: [
                        'rgba(67, 97, 238, 1)',
                        'rgba(247, 37, 133, 1)',
                        'rgba(76, 201, 240, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        charts.push(genderChart);
    }
    
    // Age-Gender heatmap
    if (segmentationData.ageGenderHeatmap && segmentationData.ageGenderHeatmap.length > 0) {
        createHeatmap(segmentationData.ageGenderHeatmap);
    }
}

// Create pricing analysis charts
function createPricingCharts() {
    const pricingData = dashboardData.pricingAnalysis;
    
    if (!pricingData) return;
    
    // Price comparison chart
    if (pricingData.priceComparison && pricingData.priceComparison.length > 0) {
        const sortedData = [...pricingData.priceComparison].sort((a, b) => b.ourPrice - a.ourPrice);
        
        const priceComparisonCtx = document.getElementById('price-comparison-chart').getContext('2d');
        const priceComparisonChart = new Chart(priceComparisonCtx, {
            type: 'bar',
            data: {
                labels: sortedData.map(item => item.category),
                datasets: [
                    {
                        label: 'Our Price',
                        data: sortedData.map(item => item.ourPrice),
                        backgroundColor: 'rgba(67, 97, 238, 0.7)',
                        borderColor: 'rgba(67, 97, 238, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Competitor Price',
                        data: sortedData.map(item => item.competitorPrice),
                        backgroundColor: 'rgba(247, 37, 133, 0.7)',
                        borderColor: 'rgba(247, 37, 133, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                return `${label}: ${formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value, true);
                            }
                        }
                    }
                }
            }
        });
        charts.push(priceComparisonChart);
    }
    
    // Price-Sales relationship scatter plot
    if (pricingData.priceSalesRelationship && pricingData.priceSalesRelationship.length > 0) {
        const priceSalesCtx = document.getElementById('price-sales-scatter').getContext('2d');
        const priceSalesChart = new Chart(priceSalesCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Price Difference vs Sales Volume',
                    data: pricingData.priceSalesRelationship.map(item => ({
                        x: item.priceDifference,
                        y: item.salesVolume
                    })),
                    backgroundColor: 'rgba(76, 201, 240, 0.7)',
                    borderColor: 'rgba(76, 201, 240, 1)',
                    borderWidth: 1,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Price Diff: ${formatCurrency(context.parsed.x)}, Sales: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Price Difference vs Competitor'
                        },
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value, true);
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Sales Volume'
                        }
                    }
                }
            }
        });
        charts.push(priceSalesChart);
    }
}

// Create promotion and seasonal analysis charts
function createPromotionCharts() {
    // Promotion effectiveness chart
    if (dashboardData.promotionAnalysis && dashboardData.promotionAnalysis.length > 0) {
        const sortedPromotions = [...dashboardData.promotionAnalysis].sort((a, b) => b.avgSalesPerProduct - a.avgSalesPerProduct);
        
        const promotionCtx = document.getElementById('promotion-chart').getContext('2d');
        const promotionChart = new Chart(promotionCtx, {
            type: 'bar',
            data: {
                labels: sortedPromotions.map(item => item.promotion),
                datasets: [{
                    label: 'Average Sales per Product',
                    data: sortedPromotions.map(item => item.avgSalesPerProduct),
                    backgroundColor: 'rgba(67, 97, 238, 0.7)',
                    borderColor: 'rgba(67, 97, 238, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
        charts.push(promotionChart);
    }
    
    // Seasonal analysis chart
    if (dashboardData.seasonalAnalysis && dashboardData.seasonalAnalysis.length > 0) {
        const sortedSeasons = [...dashboardData.seasonalAnalysis].sort((a, b) => b.avgSalesPerProduct - a.avgSalesPerProduct);
        
        const seasonalCtx = document.getElementById('seasonal-chart').getContext('2d');
        const seasonalChart = new Chart(seasonalCtx, {
            type: 'bar',
            data: {
                labels: sortedSeasons.map(item => item.season),
                datasets: [
                    {
                        label: 'Average Sales per Product',
                        data: sortedSeasons.map(item => item.avgSalesPerProduct),
                        backgroundColor: 'rgba(114, 9, 183, 0.7)',
                        borderColor: 'rgba(114, 9, 183, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Product Count',
                        data: sortedSeasons.map(item => item.productCount),
                        backgroundColor: 'rgba(76, 201, 240, 0.7)',
                        borderColor: 'rgba(76, 201, 240, 1)',
                        borderWidth: 1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Avg Sales per Product'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Product Count'
                        }
                    }
                }
            }
        });
        charts.push(seasonalChart);
    }
}

// Display market basket analysis
function displayMarketBasketAnalysis() {
    if (!dashboardData.marketBasket || !dashboardData.marketBasket.productCombinations) return;
    
    const combinationsContainer = document.getElementById('product-combinations-table');
    
    if (dashboardData.marketBasket.productCombinations.length === 0) {
        combinationsContainer.innerHTML = '<p class="placeholder-text">No significant product combinations found.</p>';
        return;
    }
    
    // Create table for top combinations
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Product Combination</th>
                    <th>Frequency</th>
                    <th>Support</th>
                    <th>Confidence</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    dashboardData.marketBasket.productCombinations.forEach(combo => {
        tableHTML += `
            <tr>
                <td>${combo.pair}</td>
                <td>${combo.count}</td>
                <td>${(combo.support * 100).toFixed(2)}%</td>
                <td>${(combo.confidence * 100).toFixed(2)}%</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    combinationsContainer.innerHTML = tableHTML;
    
    // For a more complex dashboard, we would implement a network visualization here
    const networkContainer = document.getElementById('product-network');
    networkContainer.innerHTML = '<p>Network visualization would be implemented here in a full dashboard.</p>';
}

// Display data-driven recommendations
function displayRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations-container');
    
    if (!dashboardData.recommendations || dashboardData.recommendations.length === 0) {
        recommendationsContainer.innerHTML = '<p class="placeholder-text">No recommendations available.</p>';
        return;
    }
    
    let recommendationsHTML = '';
    
    dashboardData.recommendations.forEach(recommendation => {
        recommendationsHTML += `
            <div class="recommendation-card">
                <h3>${recommendation.title}</h3>
                <p>${recommendation.description}</p>
                <div class="metrics">
                    <span class="metric">Impact: ${recommendation.impact}</span>
                    <span class="metric">Effort: ${recommendation.effort}</span>
                    <span class="metric">Category: ${recommendation.category}</span>
                </div>
            </div>
        `;
    });
    
    recommendationsContainer.innerHTML = recommendationsHTML;
}

// Create a heatmap for age-gender spending
function createHeatmap(heatmapData) {
    if (!heatmapData || heatmapData.length === 0) return;
    
    const heatmapContainer = document.getElementById('age-gender-heatmap');
    let html = '';
    
    // Find the maximum value for color scaling
    const maxSpending = Math.max(...heatmapData.map(item => item.avgSpending));
    
    // Generate heatmap cells
    heatmapData.forEach(cell => {
        const intensity = cell.avgSpending / maxSpending;
        const colorIntensity = Math.floor(intensity * 255);
        const backgroundColor = `rgb(${255 - colorIntensity}, ${255 - colorIntensity}, 255)`;
        const textColor = colorIntensity > 150 ? 'white' : 'black';
        
        html += `
            <div class="heatmap-cell" style="background-color: ${backgroundColor}; color: ${textColor};" 
                title="${cell.ageGroup} ${cell.gender.charAt(0).toUpperCase() + cell.gender.slice(1)}: ${formatCurrency(cell.avgSpending)}">
                ${formatCurrency(cell.avgSpending, true)}
            </div>
        `;
    });
    
    heatmapContainer.innerHTML = html;
}

// UTILITY FUNCTIONS

// Format currency values
function formatCurrency(value, abbreviated = false) {
    if (value === undefined || value === null) return '$0';
    
    if (abbreviated && value >= 1000) {
        if (value >= 1000000) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
        } else {
            return '$' + (value / 1000).toFixed(1) + 'K';
        }
    }
    
    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Format numbers with commas
function formatNumber(value, abbreviated = false) {
    if (value === undefined || value === null) return '0';
    
    if (abbreviated && value >= 1000) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else {
            return (value / 1000).toFixed(1) + 'K';
        }
    }
    
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Toggle between light and dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

// Export dashboard data to Excel
function exportToExcel() {
    if (!dashboardData || Object.keys(dashboardData).length === 0) {
        alert('No data to export. Please analyze data first.');
        return;
    }
    
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create KPI worksheet
    const kpiData = [
        ['Key Performance Indicators', ''],
        ['Total Sales', dashboardData.kpis.totalSales],
        ['Total Transactions', dashboardData.kpis.totalTransactions],
        ['Average Order Value', dashboardData.kpis.averageOrderValue],
        ['Unique Customers', dashboardData.kpis.uniqueCustomers]
    ];
    const kpiWS = XLSX.utils.aoa_to_sheet(kpiData);
    XLSX.utils.book_append_sheet(wb, kpiWS, 'KPIs');
    
    // Create Category Performance worksheet
    if (dashboardData.categoryAnalysis && dashboardData.categoryAnalysis.length > 0) {
        const categoryData = [['Category', 'Sales', 'Quantity', 'Transactions', 'Avg Order Value']];
        dashboardData.categoryAnalysis.forEach(category => {
            categoryData.push([
                category.category,
                category.sales,
                category.quantity,
                category.transactions,
                category.avgOrderValue
            ]);
        });
        const categoryWS = XLSX.utils.aoa_to_sheet(categoryData);
        XLSX.utils.book_append_sheet(wb, categoryWS, 'Category Performance');
    }
    
    // Create Recommendations worksheet
    if (dashboardData.recommendations && dashboardData.recommendations.length > 0) {
        const recData = [['Title', 'Description', 'Impact', 'Effort', 'Category']];
        dashboardData.recommendations.forEach(rec => {
            recData.push([
                rec.title,
                rec.description,
                rec.impact,
                rec.effort,
                rec.category
            ]);
        });
        const recWS = XLSX.utils.aoa_to_sheet(recData);
        XLSX.utils.book_append_sheet(wb, recWS, 'Recommendations');
    }
    
    // Create Market Basket Analysis worksheet
    if (dashboardData.marketBasket && dashboardData.marketBasket.productCombinations.length > 0) {
        const mbaData = [['Product Pair', 'Frequency', 'Support', 'Confidence', 'Lift']];
        dashboardData.marketBasket.productCombinations.forEach(combo => {
            mbaData.push([
                combo.pair,
                combo.count,
                combo.support,
                combo.confidence,
                combo.lift
            ]);
        });
        const mbaWS = XLSX.utils.aoa_to_sheet(mbaData);
        XLSX.utils.book_append_sheet(wb, mbaWS, 'Market Basket Analysis');
    }
    
    // Export the workbook
    XLSX.writeFile(wb, 'Retail_Analytics_Dashboard.xlsx');
}
