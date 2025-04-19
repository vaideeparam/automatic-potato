// Define global navigation functions first so they're available to HTML
let currentSlideIndex = 0;
let slides;

// Global navigation functions that can be called from HTML
window.prevSlide = function () {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    showSlide(currentSlideIndex);
  }
};

window.nextSlide = function () {
  if (slides && currentSlideIndex < slides.length - 1) {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
  }
};

// Main function to show a specific slide
function showSlide(index) {
  if (!slides) return;

  // Hide all slides
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });

  // Show the current slide
  slides[index].classList.add("active");

  // Update the slide indicator
  document.getElementById("slide-indicator").textContent =
    `${index + 1} / ${slides.length}`;

  // Update navigation buttons
  document.getElementById("prev-slide").disabled = index === 0;
  document.getElementById("next-slide").disabled = index === slides.length - 1;
}

// Set up slide functionality
document.addEventListener("DOMContentLoaded", function () {
  // Initialize slides
  slides = document.querySelectorAll(".slide");

  // Show initial slide
  showSlide(currentSlideIndex);

  // Set up event listeners for navigation
  document.getElementById("prev-slide").addEventListener("click", prevSlide);
  document.getElementById("next-slide").addEventListener("click", nextSlide);

  // Add keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      nextSlide();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      prevSlide();
    }
  });

  // Add progress bar animation for roadmap phases
  const roadmapPhases = document.querySelectorAll(".roadmap-phase");

  // Animate elements when they come into view
  const animateOnScroll = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }
    });
  };

  // Set up the intersection observer
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(animateOnScroll, {
      root: null,
      threshold: 0.2,
    });

    document
      .querySelectorAll(
        ".metric, .challenge-item, .use-case-card, .highlight-box",
      )
      .forEach((item) => {
        observer.observe(item);
      });
  }

  // Add swipe gesture support for touch devices
  let touchstartX = 0;
  let touchendX = 0;

  document.addEventListener("touchstart", (e) => {
    touchstartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    touchendX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const threshold = 50; // Minimum swipe distance

    if (touchendX < touchstartX - threshold) {
      // Swipe left, go to next slide
      nextSlide();
    }

    if (touchendX > touchstartX + threshold) {
      // Swipe right, go to previous slide
      prevSlide();
    }
  }

  // Automatic cycling for dashboard widgets
  const dashboardWidgets = document.querySelectorAll(".dashboard-widget");
  let widgetIndex = 0;

  function highlightWidget() {
    dashboardWidgets.forEach((widget, index) => {
      if (index === widgetIndex) {
        widget.style.boxShadow = "0 0 0 2px var(--primary-color)";
      } else {
        widget.style.boxShadow = "none";
      }
    });

    widgetIndex = (widgetIndex + 1) % dashboardWidgets.length;
  }

  // Start widget cycling if we have dashboard widgets
  if (dashboardWidgets.length > 0) {
    setInterval(highlightWidget, 2000);
  }

  // Add countdown animation for benefits metrics
  const metrics = document.querySelectorAll(".metric-value");

  function animateMetrics() {
    metrics.forEach((metric) => {
      const slide = metric.closest(".slide");
      if (slide.classList.contains("active")) {
        const targetValue = metric.textContent;
        const numericValue = parseInt(targetValue);

        // Only animate if we haven't already
        if (!metric.dataset.animated) {
          animateCounter(metric, 0, numericValue);
          metric.dataset.animated = true;
        }
      } else {
        // Reset when slide is not active
        metric.dataset.animated = false;
      }
    });
  }

  function animateCounter(element, start, end) {
    const duration = 1500; // milliseconds
    const frameRate = 30; // frames per second
    const totalFrames = (duration / 1000) * frameRate;
    const increment = (end - start) / totalFrames;
    let currentFrame = 0;
    let currentValue = start;

    const animation = setInterval(() => {
      currentFrame++;
      currentValue += increment;

      if (currentFrame === totalFrames) {
        clearInterval(animation);
        element.textContent = end + "%";
      } else {
        element.textContent = Math.round(currentValue) + "%";
      }
    }, 1000 / frameRate);
  }

  // Check for metrics animation when changing slides
  const slideObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        animateMetrics();
      }
    });
  });

  slides.forEach((slide) => {
    slideObserver.observe(slide, { attributes: true });
  });
});
