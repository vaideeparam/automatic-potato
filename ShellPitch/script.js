// Using document-ready event
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded");

  // Get all slides and navigation elements
  var slides = document.querySelectorAll(".slide");
  var prevBtn = document.getElementById("prev-btn");
  var nextBtn = document.getElementById("next-btn");
  var pdfBtn = document.getElementById("pdf-button");
  var currentSlide = 0;

  console.log("Found " + slides.length + " slides");

  // Function to update slide visibility
  function showSlide(index) {
    // Hide all slides
    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.remove("active");
    }

    // Show the current slide
    slides[index].classList.add("active");

    // Update button states
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;

    // Update current slide index
    currentSlide = index;
  }

  // Add direct click handlers to navigation buttons
  if (prevBtn) {
    prevBtn.onclick = function () {
      if (currentSlide > 0) {
        showSlide(currentSlide - 1);
      }
    };
  }

  if (nextBtn) {
    nextBtn.onclick = function () {
      if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
      }
    };
  }

  // DOM-based PDF export handler that directly modifies the slides
  if (pdfBtn) {
    pdfBtn.onclick = function () {
      console.log(
        "PDF button clicked - preparing all slides for print using DOM manipulation",
      );

      // Store current slide
      var originalSlide = currentSlide;

      // Store original slide states and controls visibility
      var originalSlideStates = [];
      var controlsElement = document.querySelector(".controls");
      var pdfButtonElement = document.getElementById("pdf-button");
      var slideNumberElements = document.querySelectorAll(".slide-number");

      // Remember original controls visibility
      var controlsDisplay = controlsElement
        ? controlsElement.style.display
        : "block";
      var pdfButtonDisplay = pdfButtonElement
        ? pdfButtonElement.style.display
        : "block";

      // Remember original states for all slides
      for (var i = 0; i < slides.length; i++) {
        originalSlideStates.push({
          opacity: slides[i].style.opacity,
          position: slides[i].style.position,
          display: slides[i].style.display,
          zIndex: slides[i].style.zIndex,
          pageBreakAfter: slides[i].style.pageBreakAfter,
        });
      }

      // Create a print-specific container for a cleaner print layout
      var printContainer = document.createElement("div");
      printContainer.id = "print-container";
      printContainer.style.display = "none";
      document.body.appendChild(printContainer);

      // Clone all slides into the print container
      for (var i = 0; i < slides.length; i++) {
        var clonedSlide = slides[i].cloneNode(true);
        // Set print-specific styles directly on the cloned slide
        clonedSlide.style.opacity = "1";
        clonedSlide.style.position = "relative";
        clonedSlide.style.display = "block";
        clonedSlide.style.pageBreakAfter = "always";
        clonedSlide.style.height = "100vh";
        clonedSlide.style.width = "100%";
        clonedSlide.style.overflow = "visible";

        // Remove slide numbers from the clones
        var slideNumbers = clonedSlide.querySelectorAll(".slide-number");
        for (var j = 0; j < slideNumbers.length; j++) {
          slideNumbers[j].style.display = "none";
        }

        printContainer.appendChild(clonedSlide);
      }

      // Hide original slides container and controls
      var slidesContainer = document.querySelector(".slides-container");
      if (slidesContainer) slidesContainer.style.display = "none";
      if (controlsElement) controlsElement.style.display = "none";
      if (pdfButtonElement) pdfButtonElement.style.display = "none";

      // Show the print container
      printContainer.style.display = "block";

      // Start printing
      setTimeout(function () {
        window.print();

        // Cleanup after printing
        setTimeout(function () {
          // Remove the print container
          printContainer.parentNode.removeChild(printContainer);

          // Restore original slides container and controls
          if (slidesContainer) slidesContainer.style.display = "block";
          if (controlsElement) controlsElement.style.display = controlsDisplay;
          if (pdfButtonElement)
            pdfButtonElement.style.display = pdfButtonDisplay;

          // Restore visibility of slide numbers
          for (var i = 0; i < slideNumberElements.length; i++) {
            slideNumberElements[i].style.display = "";
          }

          // Show the original slide again
          showSlide(originalSlide);

          console.log(
            "Print completed, restored to slide " + (originalSlide + 1),
          );
        }, 1000);
      }, 500);
    };
  }

  // Add keyboard navigation
  document.onkeydown = function (event) {
    event = event || window.event;
    var keyCode = event.keyCode || event.which;

    if (keyCode === 37) {
      // Left arrow
      if (currentSlide > 0) {
        showSlide(currentSlide - 1);
      }
    } else if (keyCode === 39) {
      // Right arrow
      if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
      }
    } else if (keyCode === 36) {
      // Home key
      showSlide(0);
    } else if (keyCode === 35) {
      // End key
      showSlide(slides.length - 1);
    } else if (keyCode === 32) {
      // Spacebar
      if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
      }
    }
  };

  // Initialize with the first slide
  showSlide(0);
  console.log("Presentation initialized with " + slides.length + " slides");
});
