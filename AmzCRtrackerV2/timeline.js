// timeline.js - Separate file for timeline functionality

// Timeline View Functions
(function () {
  // Variables to store references to global data
  let sampleData;
  let crData;
  let formatDateFn;

  // Initialize data access
  function initializeData() {
    if (window.crTrackerData) {
      sampleData = window.crTrackerData.sampleData;
      crData = window.crTrackerData.crData;
      formatDateFn = window.crTrackerData.formatDate;
      return true;
    }
    console.error("Timeline data not available yet");
    return false;
  }

  // Format date (fallback if global function not available)
  function formatDate(dateString) {
    if (formatDateFn) {
      return formatDateFn(dateString);
    }
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  // Helper function to find milestone's project
  function findProjectForMilestone(milestoneId) {
    if (!sampleData || !sampleData.milestones) return null;

    for (const projectId in sampleData.milestones) {
      const milestones = sampleData.milestones[projectId];
      if (milestones.some((m) => m.id === milestoneId)) {
        return projectId;
      }
    }
    return null;
  }

  // Switch to Timeline View
  function switchToTimelineView() {
    const codeDropsView = document.getElementById("codeDropsView");
    const timelineView = document.getElementById("timelineView");

    if (!initializeData()) {
      alert("Timeline data not available. Please try again in a moment.");
      return;
    }

    codeDropsView.classList.remove("active");
    timelineView.classList.add("active");
    updateTimelineChart();
  }

  // Switch to Code Drops View
  function switchToCodeDropsView() {
    const codeDropsView = document.getElementById("codeDropsView");
    const timelineView = document.getElementById("timelineView");

    timelineView.classList.remove("active");
    codeDropsView.classList.add("active");
  }

  // Populate Timeline Milestone Filter based on project selection
  function populateTimelineMilestoneFilter(projectId) {
    const timelineMilestoneFilter = document.getElementById(
      "timelineMilestoneFilter",
    );
    if (!timelineMilestoneFilter) return;

    timelineMilestoneFilter.innerHTML =
      '<option value="">All Milestones</option>';

    if (!projectId || !sampleData || !sampleData.milestones) return;

    const milestones = sampleData.milestones[projectId];
    if (!milestones) return;

    milestones.forEach((milestone) => {
      const option = document.createElement("option");
      option.value = milestone.id;
      option.textContent = milestone.name;
      timelineMilestoneFilter.appendChild(option);
    });
  }

  // Update Timeline Chart
  function updateTimelineChart() {
    const timelineChart = document.getElementById("timelineChart");
    const timelineProjectFilter = document.getElementById(
      "timelineProjectFilter",
    );
    const timelineMilestoneFilter = document.getElementById(
      "timelineMilestoneFilter",
    );

    if (!timelineChart || !timelineProjectFilter || !timelineMilestoneFilter) {
      console.error("Timeline elements not found");
      return;
    }

    if (!initializeData()) {
      timelineChart.innerHTML =
        '<div class="empty-state"><p>Timeline data is loading. Please try again in a moment.</p></div>';
      return;
    }

    timelineChart.innerHTML = "";

    // Get filters
    const projectFilterValue = timelineProjectFilter.value;
    const milestoneFilterValue = timelineMilestoneFilter.value;

    // Filter CR data
    let filteredCRs = [...crData]; // Create a copy with spread operator

    if (projectFilterValue) {
      filteredCRs = filteredCRs.filter(
        (cr) => cr.projectId === projectFilterValue,
      );
    }

    if (milestoneFilterValue) {
      filteredCRs = filteredCRs.filter(
        (cr) => cr.milestoneId === milestoneFilterValue,
      );
    }

    // If no data, show empty state
    if (filteredCRs.length === 0) {
      timelineChart.innerHTML =
        '<div class="empty-state"><p>No data available for the selected filters</p></div>';
      return;
    }

    // Find date range for all CRs
    let minDate = new Date();
    let maxDate = new Date("2000-01-01");

    filteredCRs.forEach((cr) => {
      if (cr.history && cr.history.length > 0) {
        cr.history.forEach((hist) => {
          if (hist.date) {
            const histDate = new Date(hist.date);
            if (histDate < minDate) minDate = histDate;
            if (histDate > maxDate) maxDate = histDate;
          }
        });
      }

      if (cr.date) {
        const crDate = new Date(cr.date);
        if (crDate > maxDate) maxDate = crDate;
      }
    });

    // Add 7 days buffer
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);

    // Calculate total days
    const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));

    // Create timeline header
    const timelineHeader = document.createElement("div");
    timelineHeader.className = "timeline-header";

    // First cell is empty for labels
    const emptyCell = document.createElement("div");
    emptyCell.className = "timeline-header-cell";
    emptyCell.style.width = "200px";
    timelineHeader.appendChild(emptyCell);

    // Add month headers
    let currentMonth = new Date(minDate);
    while (currentMonth <= maxDate) {
      const monthCell = document.createElement("div");
      monthCell.className = "timeline-header-cell";
      monthCell.textContent = currentMonth.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      timelineHeader.appendChild(monthCell);

      // Move to next month
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    timelineChart.appendChild(timelineHeader);

    // Group CRs by project and milestone
    const crsByProjectMilestone = {};

    filteredCRs.forEach((cr) => {
      if (!cr.projectId || !cr.milestoneId) return;

      const projectId = cr.projectId;
      const milestoneId = cr.milestoneId;
      const key = `${projectId}-${milestoneId}`;

      if (!crsByProjectMilestone[key]) {
        crsByProjectMilestone[key] = [];
      }

      crsByProjectMilestone[key].push(cr);
    });

    // Create timeline rows
    Object.keys(crsByProjectMilestone).forEach((key) => {
      // Extract project and milestone IDs - handle format like "amz-1-ms-11"
      const parts = key.split("-");

      // Project IDs in your data are formatted as "amz-1", "amz-2", etc.
      // Milestone IDs are formatted as "ms-11", "ms-12", etc.
      // So we need to join the first two parts for the project ID
      // and the remaining parts for the milestone ID
      const projectId = parts.slice(0, 2).join("-");
      const milestoneId = parts.slice(2).join("-");

      // Find project
      const project = sampleData.projects.find((p) => p.id === projectId);
      if (!project) {
        console.warn(`Project not found: ${projectId}`);
        return;
      }

      // Find milestone
      const milestones = sampleData.milestones[projectId];
      if (!milestones) {
        console.warn(`No milestones found for project: ${projectId}`);
        return;
      }

      const milestone = milestones.find((m) => m.id === milestoneId);
      if (!milestone) {
        console.warn(
          `Milestone not found: ${milestoneId} in project ${projectId}`,
        );
        return;
      }

      // Create row
      const timelineRow = document.createElement("div");
      timelineRow.className = "timeline-row";

      // Add label
      const rowLabel = document.createElement("div");
      rowLabel.className = "timeline-row-label";
      rowLabel.textContent = `${project.name} > ${milestone.name}`;
      timelineRow.appendChild(rowLabel);

      // Add content
      const rowContent = document.createElement("div");
      rowContent.className = "timeline-row-content";

      // Add markers for each month
      let markerMonth = new Date(minDate);
      while (markerMonth <= maxDate) {
        const marker = document.createElement("div");
        marker.className = "timeline-marker";
        const daysSinceStart = Math.ceil(
          (markerMonth - minDate) / (1000 * 60 * 60 * 24),
        );
        const position = (daysSinceStart / totalDays) * 100;
        marker.style.left = `${position}%`;
        rowContent.appendChild(marker);

        // Move to next month
        markerMonth.setMonth(markerMonth.getMonth() + 1);
      }

      // Add today marker
      const today = new Date();
      if (today >= minDate && today <= maxDate) {
        const todayMarker = document.createElement("div");
        todayMarker.className = "timeline-today";
        const daysSinceStart = Math.ceil(
          (today - minDate) / (1000 * 60 * 60 * 24),
        );
        const position = (daysSinceStart / totalDays) * 100;
        todayMarker.style.left = `${position}%`;
        rowContent.appendChild(todayMarker);
      }

      // Add bars for each CR
      crsByProjectMilestone[key].forEach((cr) => {
        if (cr.history && cr.history.length > 0 && cr.date) {
          const firstDate = new Date(cr.history[0].date);
          const lastDate = new Date(cr.date);

          const startDays = Math.ceil(
            (firstDate - minDate) / (1000 * 60 * 60 * 24),
          );
          const endDays = Math.ceil(
            (lastDate - minDate) / (1000 * 60 * 60 * 24),
          );

          const startPosition = (startDays / totalDays) * 100;
          const width = Math.max(
            ((endDays - startDays) / totalDays) * 100,
            0.5,
          ); // Min width of 0.5%

          const bar = document.createElement("div");
          bar.className = "timeline-bar";
          bar.style.left = `${startPosition}%`;
          bar.style.width = `${width}%`;

          let codeDropName = cr.codeDropId;
          try {
            const codeDrops = sampleData.codeDrops[cr.milestoneId];
            if (codeDrops) {
              const codeDrop = codeDrops.find((cd) => cd.id === cr.codeDropId);
              if (codeDrop) {
                codeDropName = codeDrop.name;
              }
            }
          } catch (e) {
            console.warn(`Error finding code drop: ${cr.codeDropId}`, e);
          }

          bar.title = `${codeDropName}: ${formatDate(firstDate.toISOString())} to ${formatDate(lastDate.toISOString())}`;

          // Status-based color
          try {
            const status = sampleData.statuses.find(
              (s) => s.id === cr.statusId,
            );
            if (status && status.id === "st-16") {
              bar.style.backgroundColor = "var(--success-color)";
            } else {
              const daysInStage = Math.ceil(
                (today - lastDate) / (1000 * 60 * 60 * 24),
              );
              if (daysInStage > 10) {
                bar.style.backgroundColor = "var(--danger-color)";
              } else if (daysInStage > 5) {
                bar.style.backgroundColor = "var(--warning-color)";
              }
            }
          } catch (e) {
            console.warn(`Error processing status: ${cr.statusId}`, e);
          }

          rowContent.appendChild(bar);
        }
      });

      timelineRow.appendChild(rowContent);
      timelineChart.appendChild(timelineRow);
    });
  }

  // Export Timeline
  function exportTimeline() {
    const timelineProjectFilter = document.getElementById(
      "timelineProjectFilter",
    );
    const timelineMilestoneFilter = document.getElementById(
      "timelineMilestoneFilter",
    );

    if (!timelineProjectFilter || !timelineMilestoneFilter) return;

    if (!initializeData()) {
      alert(
        "Timeline data not available for export. Please try again in a moment.",
      );
      return;
    }

    // Create CSV content
    let csvContent =
      "Project,Milestone,Code Drop,Start Date,Current Status,Days in Progress\n";

    // Get filters
    const projectFilterValue = timelineProjectFilter.value;
    const milestoneFilterValue = timelineMilestoneFilter.value;

    // Filter CR data
    let filteredCRs = [...crData]; // Create a copy with spread operator

    if (projectFilterValue) {
      filteredCRs = filteredCRs.filter(
        (cr) => cr.projectId === projectFilterValue,
      );
    }

    if (milestoneFilterValue) {
      filteredCRs = filteredCRs.filter(
        (cr) => cr.milestoneId === milestoneFilterValue,
      );
    }

    filteredCRs.forEach((cr) => {
      try {
        if (!cr.projectId || !cr.milestoneId || !cr.codeDropId || !cr.statusId)
          return;

        const project = sampleData.projects.find((p) => p.id === cr.projectId);
        if (!project) return;

        const milestones = sampleData.milestones[cr.projectId];
        if (!milestones) return;

        const milestone = milestones.find((m) => m.id === cr.milestoneId);
        if (!milestone) return;

        let codeDropName = cr.codeDropId;
        const codeDrops = sampleData.codeDrops[cr.milestoneId];
        if (codeDrops) {
          const codeDrop = codeDrops.find((cd) => cd.id === cr.codeDropId);
          if (codeDrop) {
            codeDropName = codeDrop.name;
          }
        }

        const status = sampleData.statuses.find((s) => s.id === cr.statusId);
        if (!status) return;

        const startDate =
          cr.history && cr.history.length > 0
            ? new Date(cr.history[0].date)
            : new Date(cr.date);
        const today = new Date();
        const daysInProgress = Math.ceil(
          (today - startDate) / (1000 * 60 * 60 * 24),
        );

        csvContent += `"${project.name}","${milestone.name}","${codeDropName}","${formatDate(startDate.toISOString())}","${status.name}",${daysInProgress}\n`;
      } catch (e) {
        console.warn("Error processing CR for export", e);
      }
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `cr_timeline_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Add event listeners when the DOM is fully loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const viewReportBtn = document.getElementById("viewReportBtn");
    const backToDropsBtn = document.getElementById("backToDropsBtn");
    const timelineProjectFilter = document.getElementById(
      "timelineProjectFilter",
    );
    const timelineMilestoneFilter = document.getElementById(
      "timelineMilestoneFilter",
    );
    const exportTimelineBtn = document.getElementById("exportTimelineBtn");

    // Add event listeners if elements exist
    if (viewReportBtn) {
      viewReportBtn.addEventListener("click", switchToTimelineView);
    }

    if (backToDropsBtn) {
      backToDropsBtn.addEventListener("click", switchToCodeDropsView);
    }

    if (exportTimelineBtn) {
      exportTimelineBtn.addEventListener("click", exportTimeline);
    }

    if (timelineProjectFilter) {
      timelineProjectFilter.addEventListener("change", function () {
        populateTimelineMilestoneFilter(this.value);
        updateTimelineChart();
      });
    }

    if (timelineMilestoneFilter) {
      timelineMilestoneFilter.addEventListener("change", updateTimelineChart);
    }
  });
})();
