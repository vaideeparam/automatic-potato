document.addEventListener('DOMContentLoaded', function() {
    // Get slide elements
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    const slideIndicator = document.getElementById('slide-indicator');
    
    let currentSlideIndex = 0;
    const totalSlides = slides.length;
    
    // Initialize slide indicator
    updateSlideIndicator();
    
    // Navigation event listeners
    prevButton.addEventListener('click', showPreviousSlide);
    nextButton.addEventListener('click', showNextSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            showNextSlide();
        } else if (e.key === 'ArrowLeft') {
            showPreviousSlide();
        }
    });
    
    // Touch navigation for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right - go to previous slide
            showPreviousSlide();
        } else if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left - go to next slide
            showNextSlide();
        }
    }
    
    // Navigation functions
    function showNextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex++;
            slides[currentSlideIndex].classList.add('active');
            updateSlideIndicator();
            animateSlideContent();
        }
    }
    
    function showPreviousSlide() {
        if (currentSlideIndex > 0) {
            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex--;
            slides[currentSlideIndex].classList.add('active');
            updateSlideIndicator();
            animateSlideContent();
        }
    }
    
    function updateSlideIndicator() {
        slideIndicator.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;
    }
    
    // Animation for slide content
    function animateSlideContent() {
        // Get current slide content
        const currentSlide = slides[currentSlideIndex];
        const slideContent = currentSlide.querySelector('.slide-content');
        
        // Apply fade-in animation
        slideContent.style.opacity = '0';
        slideContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            slideContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            slideContent.style.opacity = '1';
            slideContent.style.transform = 'translateY(0)';
            
            // Reset transition after animation
            setTimeout(() => {
                slideContent.style.transition = '';
            }, 500);
        }, 50);
    }
    
    // Initialize charts and visualizations
    initializeCharts();
    
    // Initialize first slide content animation
    animateSlideContent();
    
    // Add some simple animations to the charts and visual elements
    function initializeCharts() {
        // Bar Chart Animation
        const barCharts = document.querySelectorAll('.bar-chart');
        barCharts.forEach(chart => {
            animateElement(chart, 'bar-chart-animated');
        });
        
        // Pie Chart Animation
        const pieCharts = document.querySelectorAll('.pie-chart');
        pieCharts.forEach(chart => {
            animateElement(chart, 'pie-chart-animated');
        });
        
        // Map Chart Animation
        const mapCharts = document.querySelectorAll('.map-chart');
        mapCharts.forEach(chart => {
            animateElement(chart, 'map-chart-animated');
        });
        
        // Image Placeholders Animation
        const imagePlaceholders = document.querySelectorAll('.image-placeholder');
        imagePlaceholders.forEach(placeholder => {
            animateElement(placeholder, 'image-placeholder-animated');
        });
    }
    
    function animateElement(element, animationClass) {
        // Add animation when slide becomes visible
        const parentSlide = element.closest('.slide');
        if (parentSlide) {
            const slideIndex = Array.from(slides).indexOf(parentSlide);
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && currentSlideIndex === slideIndex) {
                        element.classList.add(animationClass);
                    } else {
                        element.classList.remove(animationClass);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(parentSlide);
        }
    }
    
    // Add chart loading animations
    const style = document.createElement('style');
    style.textContent = `
        .bar-chart-animated::before {
            animation: barChartLoad 1s ease-out forwards;
            transform-origin: bottom left;
            transform: scaleX(0);
        }
        
        @keyframes barChartLoad {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
        }
        
        .pie-chart-animated::before {
            animation: pieChartLoad 1.5s ease-out forwards;
            clip-path: circle(0% at center);
        }
        
        @keyframes pieChartLoad {
            0% { clip-path: circle(0% at center); }
            100% { clip-path: circle(100% at center); }
        }
        
        .map-chart-animated::before {
            animation: mapChartLoad 1s ease-out forwards;
            opacity: 0;
        }
        
        @keyframes mapChartLoad {
            0% { opacity: 0; }
            100% { opacity: 0.7; }
        }
        
        .image-placeholder-animated::before,
        .image-placeholder-animated::after {
            animation: fadeIn 0.8s ease-out forwards;
            opacity: 0;
        }
        
        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    
    // Add interactivity to dashboard demo
    addDashboardInteractivity();
    
    function addDashboardInteractivity() {
        // Get dashboard elements if they exist
        const dashboardDemo = document.querySelector('.dashboard-preview');
        if (!dashboardDemo) return;
        
        const searchInput = dashboardDemo.querySelector('input[type="text"]');
        const searchButton = dashboardDemo.querySelector('button');
        
        if (searchInput && searchButton) {
            searchButton.addEventListener('click', function() {
                const query = searchInput.value.trim();
                if (query) {
                    // Show a fake response
                    showFakeResponse(query);
                    searchInput.value = '';
                }
            });
            
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        // Show a fake response
                        showFakeResponse(query);
                        searchInput.value = '';
                    }
                }
            });
        }
        
        function showFakeResponse(query) {
            // Create a toast notification
            const toast = document.createElement('div');
            toast.className = 'dashboard-toast';
            toast.innerHTML = `<div class="toast-content">
                <div class="toast-icon"><i class="fas fa-robot"></i></div>
                <div class="toast-message">
                    <p><strong>AI Response:</strong></p>
                    <p>"${getAIResponse(query)}"</p>
                </div>
                <div class="toast-close"><i class="fas fa-times"></i></div>
            </div>`;
            
            // Add toast styles
            toast.style.position = 'absolute';
            toast.style.bottom = '20px';
            toast.style.right = '20px';
            toast.style.backgroundColor = 'white';
            toast.style.borderRadius = '8px';
            toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            toast.style.zIndex = '1000';
            toast.style.maxWidth = '300px';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            const toastContent = toast.querySelector('.toast-content');
            toastContent.style.padding = '15px';
            toastContent.style.display = 'flex';
            
            const toastIcon = toast.querySelector('.toast-icon');
            toastIcon.style.marginRight = '15px';
            toastIcon.style.color = '#0066cc';
            toastIcon.style.fontSize = '1.5rem';
            
            const toastClose = toast.querySelector('.toast-close');
            toastClose.style.marginLeft = '10px';
            toastClose.style.cursor = 'pointer';
            toastClose.style.fontSize = '0.8rem';
            toastClose.style.color = '#777';
            toastClose.style.alignSelf = 'flex-start';
            
            // Add to the body
            document.body.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            }, 10);
            
            // Add close functionality
            const closeButton = toast.querySelector('.toast-close');
            closeButton.addEventListener('click', function() {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            });
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }, 5000);
        }
        
        function getAIResponse(query) {
            const responses = [
                "Based on current trends, Maharashtra is showing the highest lead conversion rate at 32%.",
                "Waterproofing services have increased by 15% in the last quarter across tier 2 cities.",
                "I'm seeing a correlation between rainwater harvesting inquiries and the monsoon forecast for this season.",
                "The dashboard has been updated with the latest lead data from yesterday.",
                "Customer acquisition costs have decreased by 18% since implementing the AI chat assistant."
            ];
            
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    
    // Add interactivity to chat demo
    addChatInteractivity();
    
    function addChatInteractivity() {
        // Get chat elements if they exist
        const chatDemo = document.querySelector('.chat-demo');
        if (!chatDemo) return;
        
        const chatInput = chatDemo.querySelector('input[type="text"]');
        const sendButton = chatDemo.querySelector('button');
        const chatMessages = chatDemo.querySelector('.chat-messages');
        
        if (chatInput && sendButton && chatMessages) {
            sendButton.addEventListener('click', function() {
                const message = chatInput.value.trim();
                if (message) {
                    // Add user message
                    addMessage(message, 'user');
                    chatInput.value = '';
                    
                    // Simulate AI response
                    setTimeout(() => {
                        addMessage(getRandomResponse(message), 'system');
                        // Scroll to bottom
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 1000);
                }
            });
            
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const message = chatInput.value.trim();
                    if (message) {
                        // Add user message
                        addMessage(message, 'user');
                        chatInput.value = '';
                        
                        // Simulate AI response
                        setTimeout(() => {
                            addMessage(getRandomResponse(message), 'system');
                            // Scroll to bottom
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }, 1000);
                    }
                }
            });
        }
        
        function addMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${type}`;
            messageDiv.innerHTML = `<p>${text}</p>`;
            chatMessages.appendChild(messageDiv);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function getRandomResponse(message) {
            const responses = [
                "I can help you with that! Let me find the information about our construction services.",
                "That's a great question about our waterproofing solutions. We offer several options depending on your needs.",
                "Looking at our database, we have several experts available in your area for consultation.",
                "Our rainwater harvesting systems are designed specifically for residential properties like yours.",
                "I'd be happy to explain the different financing options we have for home construction projects."
            ];
            
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
});