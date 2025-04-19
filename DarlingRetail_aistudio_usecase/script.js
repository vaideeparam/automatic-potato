// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initChallengesChart();
    initTvPriceChart();
    initPhoneComparisonChart();
    initRoiChart();

    // Add smooth scrolling for navigation
    addSmoothScrolling();
});

// Chart for Challenges Section
function initChallengesChart() {
    const ctx = document.getElementById('challengesChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Manual Price Checking', 'Competitor Analysis', 'Response Time', 'Optimization Level', 'Opportunity Cost'],
            datasets: [{
                label: 'Current Challenges (Hours/Week)',
                data: [28, 18, 72, 15, 35],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1
            }, {
                label: 'With Dynamic Pricing (Hours/Week)',
                data: [2, 3, 1, 1, 4],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(16, 185, 129, 0.7)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(16, 185, 129, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hours per Week'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Time Spent on Pricing Activities'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Chart for TV Price Trends
function initTvPriceChart() {
    const ctx = document.getElementById('tvPriceChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Amazon',
                data: [109990, 109990, 107990, 105990],
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                tension: 0.1
            }, {
                label: 'Flipkart',
                data: [114990, 112990, 109990, 108990],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                tension: 0.1
            }, {
                label: 'Croma',
                data: [119990, 116990, 114990, 109990],
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                tension: 0.1
            }, {
                label: 'DarlingRetail Optimized',
                data: [114490, 112490, 110490, 108490],
                borderColor: 'rgba(139, 92, 246, 1)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 3,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Price (₹)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Samsung Neo QLED TV Price Trends'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString();
                        }
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Chart for Phone Comparison
function initPhoneComparisonChart() {
    const ctx = document.getElementById('phoneComparisonChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['OnePlus 13 Pro', 'iPhone 16'],
            datasets: [{
                label: 'Market Low (₹)',
                data: [64999, 74900],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1
            }, {
                label: 'Market High (₹)',
                data: [68999, 78900],
                backgroundColor: 'rgba(245, 158, 11, 0.7)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 1
            }, {
                label: 'DarlingRetail Optimized (₹)',
                data: [65999, 76490],
                backgroundColor: 'rgba(37, 99, 235, 0.7)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60000,
                    title: {
                        display: true,
                        text: 'Price (₹)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Smartphone Price Comparison'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString();
                        }
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Chart for ROI Analysis
function initRoiChart() {
    const ctx = document.getElementById('roiChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'],
            datasets: [{
                label: 'Investment Cost',
                data: [2500000, 2500000, 2500000, 2500000, 2500000, 2500000, 2700000, 2700000, 2700000, 2700000, 2700000, 2700000],
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.1,
                fill: true
            }, {
                label: 'Cumulative Revenue Increase',
                data: [1000000, 2500000, 4500000, 7000000, 9500000, 12000000, 14500000, 17000000, 19500000, 22000000, 24500000, 27000000],
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Amount (₹)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + (value/100000).toFixed(1) + ' L';
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Projected ROI Over 12 Months'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return context.dataset.label + ': ₹' + (value/100000).toFixed(2) + ' Lakhs';
                        }
                    }
                },
                legend: {
                    position: 'bottom'
                },
                annotation: {
                    annotations: {
                        roi: {
                            type: 'line',
                            mode: 'horizontal',
                            scaleID: 'y',
                            value: 2500000,
                            borderColor: 'rgba(107, 114, 128, 0.5)',
                            borderWidth: 2,
                            borderDash: [6, 6],
                            label: {
                                content: 'Break-even Point',
                                enabled: true,
                                position: 'end'
                            }
                        }
                    }
                }
            }
        }
    });
}

// Add smooth scrolling for all links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Initialize mobile navigation toggle if needed
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Helper function to format currency
function formatCurrency(value) {
    return '₹' + value.toLocaleString('en-IN');
}