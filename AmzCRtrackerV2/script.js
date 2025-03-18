// Sample Data
const sampleData = {
  projects: [
    { id: "amz-1", name: "Amazon Prime Video" },
    { id: "amz-2", name: "Amazon Music" },
    { id: "amz-3", name: "Amazon Alexa Skills" },
  ],
  milestones: {
    "amz-1": [
      { id: "ms-11", name: "Video Playback Optimization" },
      { id: "ms-12", name: "Recommendation Engine Overhaul" },
    ],
    "amz-2": [
      { id: "ms-21", name: "Music Discovery Feature" },
      { id: "ms-22", name: "Playlist Management Redesign" },
    ],
    "amz-3": [
      { id: "ms-31", name: "Multi-language Support" },
      { id: "ms-32", name: "Device Sync Improvement" },
    ],
  },
  codeDrops: {
    "ms-11": [
      { id: "cd-111", name: "Drop 1.1" },
      { id: "cd-112", name: "Drop 1.2" },
    ],
    "ms-12": [
      { id: "cd-121", name: "Drop 1.1" },
      { id: "cd-122", name: "Drop 1.2" },
    ],
    "ms-21": [
      { id: "cd-211", name: "Drop 1.1" },
      { id: "cd-212", name: "Drop 1.2" },
    ],
    "ms-22": [{ id: "cd-221", name: "Drop 1.1" }],
    "ms-31": [
      { id: "cd-311", name: "Drop 1.1" },
      { id: "cd-312", name: "Drop 1.2" },
    ],
    "ms-32": [{ id: "cd-321", name: "Drop 1.1" }],
  },
  reviewers: [
    { id: "rev-1", name: "Alex Johnson" },
    { id: "rev-2", name: "Sarah Chen" },
    { id: "rev-3", name: "Miguel Rodriguez" },
    { id: "rev-4", name: "Priya Patel" },
  ],
  statuses: [
    { id: "st-1", name: "Attach Code Review Buddy", group: "Code Review" },
    { id: "st-2", name: "Code Review Request", group: "Code Review" },
    { id: "st-3", name: "Code Review Response", group: "Code Review" },
    { id: "st-4", name: "Code Fix & Iteration", group: "Code Review" },
    { id: "st-5", name: "Code Review Request (2nd)", group: "Code Review" },
    { id: "st-6", name: "Code Review Response (2nd)", group: "Code Review" },
    { id: "st-7", name: "Code Merge - Beta Release", group: "Beta" },
    { id: "st-8", name: "QA - Regression Testing", group: "QA" },
    { id: "st-9", name: "QA - Functionality Testing", group: "QA" },
    { id: "st-10", name: "QA - Sanity Testing", group: "QA" },
    { id: "st-11", name: "SIM Tickets Filed", group: "QA" },
    { id: "st-12", name: "Dev Fixes", group: "QA" },
    { id: "st-13", name: "QA Confirmation", group: "QA" },
    { id: "st-14", name: "UAT by Amazon", group: "UAT" },
    { id: "st-15", name: "UAT Confirmation", group: "UAT" },
    { id: "st-16", name: "Final Sign-off", group: "Sign-off" },
  ],
  statusGroups: ["Code Review", "Beta", "QA", "UAT", "Sign-off"],
};

// Sample CR Data
let crData = [
  {
    id: "cr-1",
    projectId: "amz-1",
    milestoneId: "ms-11",
    codeDropId: "cd-111",
    statusId: "st-7",
    reviewerId: "rev-2",
    date: "2025-03-10",
    notes: "Successfully merged to beta branch",
    history: [
      { statusId: "st-1", date: "2025-03-01", reviewerId: "rev-2" },
      { statusId: "st-2", date: "2025-03-03" },
      { statusId: "st-3", date: "2025-03-05" },
      { statusId: "st-4", date: "2025-03-07" },
      { statusId: "st-5", date: "2025-03-08" },
      { statusId: "st-6", date: "2025-03-09" },
      { statusId: "st-7", date: "2025-03-10" },
    ],
  },
  {
    id: "cr-2",
    projectId: "amz-1",
    milestoneId: "ms-11",
    codeDropId: "cd-112",
    statusId: "st-4",
    reviewerId: "rev-1",
    date: "2025-03-15",
    notes: "Fixing issues identified in code review",
    history: [
      { statusId: "st-1", date: "2025-03-10", reviewerId: "rev-1" },
      { statusId: "st-2", date: "2025-03-12" },
      { statusId: "st-3", date: "2025-03-15" },
      { statusId: "st-4", date: "2025-03-15" },
    ],
  },
  {
    id: "cr-3",
    projectId: "amz-2",
    milestoneId: "ms-21",
    codeDropId: "cd-211",
    statusId: "st-13",
    reviewerId: "rev-3",
    date: "2025-03-12",
    notes: "QA team confirmed all issues are resolved",
    history: [
      { statusId: "st-1", date: "2025-02-20", reviewerId: "rev-3" },
      { statusId: "st-2", date: "2025-02-22" },
      { statusId: "st-3", date: "2025-02-24" },
      { statusId: "st-4", date: "2025-02-26" },
      { statusId: "st-5", date: "2025-02-28" },
      { statusId: "st-6", date: "2025-03-01" },
      { statusId: "st-7", date: "2025-03-03" },
      { statusId: "st-8", date: "2025-03-05" },
      { statusId: "st-9", date: "2025-03-06" },
      { statusId: "st-10", date: "2025-03-07" },
      { statusId: "st-11", date: "2025-03-08" },
      { statusId: "st-12", date: "2025-03-10" },
      { statusId: "st-13", date: "2025-03-12" },
    ],
  },
  {
    id: "cr-4",
    projectId: "amz-3",
    milestoneId: "ms-31",
    codeDropId: "cd-311",
    statusId: "st-16",
    reviewerId: "rev-4",
    date: "2025-03-14",
    notes: "Final sign-off received from Amazon team",
    history: [
      { statusId: "st-1", date: "2025-02-15", reviewerId: "rev-4" },
      { statusId: "st-2", date: "2025-02-17" },
      { statusId: "st-3", date: "2025-02-18" },
      { statusId: "st-4", date: "2025-02-20" },
      { statusId: "st-5", date: "2025-02-21" },
      { statusId: "st-6", date: "2025-02-22" },
      { statusId: "st-7", date: "2025-02-24" },
      { statusId: "st-8", date: "2025-02-26" },
      { statusId: "st-9", date: "2025-02-28" },
      { statusId: "st-10", date: "2025-03-01" },
      { statusId: "st-13", date: "2025-03-03" },
      { statusId: "st-14", date: "2025-03-08" },
      { statusId: "st-15", date: "2025-03-12" },
      { statusId: "st-16", date: "2025-03-14" },
    ],
  },
  {
    id: "cr-5",
    projectId: "amz-2",
    milestoneId: "ms-22",
    codeDropId: "cd-221",
    statusId: "st-2",
    reviewerId: "rev-2",
    date: "2025-03-16",
    notes: "Initial code review request sent",
    history: [
      { statusId: "st-1", date: "2025-03-15", reviewerId: "rev-2" },
      { statusId: "st-2", date: "2025-03-16" },
    ],
  },
];

// State variables
let selectedProjectId = null;
let selectedMilestoneId = null;
let lastCodeDropId = 100; // For generating new code drop IDs

// Helper function to calculate business days between two dates
function getBusinessDaysDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  let current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

// Helper function to get next status ID
function getNextStatusId(currentStatusId) {
  const currentStatusIndex = sampleData.statuses.findIndex(
    (status) => status.id === currentStatusId,
  );
  if (currentStatusIndex < sampleData.statuses.length - 1) {
    return sampleData.statuses[currentStatusIndex + 1].id;
  }
  return currentStatusId; // No next status, stay at current
}

// Show Add Code Drop Modal
function showAddCodeDropModal() {
  // Ensure we have a selected project/milestone
  if (!selectedProjectId) {
    showSuccessModal("Error", "Please select a project first", false);
    return;
  }

  // Reset form
  addCodeDropForm.reset();

  // Pre-select the current project
  newDropProject.value = selectedProjectId;
  populateNewDropMilestones(selectedProjectId);

  // Pre-select the current milestone if any
  if (selectedMilestoneId) {
    newDropMilestone.value = selectedMilestoneId;
  }

  addCodeDropModal.style.display = "block";
}

// Show Update Status Modal
function showUpdateStatusModal(drop) {
  // Reset form
  updateStatusForm.reset();

  // Set drop ID
  updateDropId.value = drop.id;

  // Set modal title
  const project = sampleData.projects.find((p) => p.id === drop.projectId);
  const milestone = sampleData.milestones[drop.projectId].find(
    (m) => m.id === drop.milestoneId,
  );
  statusModalTitle.textContent = `${project.name} > ${milestone.name} > ${drop.name}`;

  // Set current stage
  const status = drop.statusId
    ? sampleData.statuses.find((s) => s.id === drop.statusId)
    : null;
  statusModalCurrentStage.textContent = `Current Stage: ${status ? status.name : "Not Started"}`;

  // Show modal
  updateStatusModal.style.display = "block";
}

// Close all modals
function closeAllModals() {
  addCodeDropModal.style.display = "none";
  updateStatusModal.style.display = "none";
  successModal.style.display = "none";
}

// Show success modal
function showSuccessModal(title, message, isSuccess = true) {
  successModalTitle.textContent = title;
  successModalMessage.textContent = message;

  if (!isSuccess) {
    document.querySelector(".success-icon").textContent = "!";
    document.querySelector(".success-icon").style.backgroundColor = "#d32f2f";
  } else {
    document.querySelector(".success-icon").textContent = "✓";
    document.querySelector(".success-icon").style.backgroundColor = "#2e7d32";
  }

  successModal.style.display = "block";
}

// Helper function to get status progress percentage
function getStatusProgress(statusId) {
  const totalStatuses = sampleData.statuses.length;
  const currentStatusIndex = sampleData.statuses.findIndex(
    (status) => status.id === statusId,
  );
  return Math.round((currentStatusIndex / (totalStatuses - 1)) * 100);
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Helper function to get date from offset
function getDateFromOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + parseInt(offset));
  return date.toISOString().split("T")[0];
}

// DOM Elements
const projectTree = document.getElementById("projectTree");
const codeDropCards = document.getElementById("codeDropCards");
const currentPathTitle = document.getElementById("currentPathTitle");
const explorerSearch = document.getElementById("explorerSearch");
const addCodeDropBtn = document.getElementById("addCodeDropBtn");
const viewReportBtn = document.getElementById("viewReportBtn");
const refreshBtn = document.getElementById("refreshBtn");
const timelineProjectFilter = document.getElementById("timelineProjectFilter");
const timelineMilestoneFilter = document.getElementById(
  "timelineMilestoneFilter",
);
const exportTimelineBtn = document.getElementById("exportTimelineBtn");
const backToDropsBtn = document.getElementById("backToDropsBtn");
const timelineChart = document.getElementById("timelineChart");
const codeDropsView = document.getElementById("codeDropsView");
const timelineView = document.getElementById("timelineView");

// Modal Elements
const addCodeDropModal = document.getElementById("addCodeDropModal");
const addCodeDropForm = document.getElementById("addCodeDropForm");
const newDropProject = document.getElementById("newDropProject");
const newDropMilestone = document.getElementById("newDropMilestone");
const newDropName = document.getElementById("newDropName");
const newDropReviewer = document.getElementById("newDropReviewer");

const updateStatusModal = document.getElementById("updateStatusModal");
const updateStatusForm = document.getElementById("updateStatusForm");
const statusModalTitle = document.getElementById("statusModalTitle");
const statusModalCurrentStage = document.getElementById(
  "statusModalCurrentStage",
);
const updateDropId = document.getElementById("updateDropId");
const updateNotes = document.getElementById("updateNotes");

const successModal = document.getElementById("successModal");
const successModalTitle = document.getElementById("successModalTitle");
const successModalMessage = document.getElementById("successModalMessage");

const closeButtons = document.querySelectorAll(".close");
const modalCloseBtn = document.querySelector(".modal-close-btn");

// Populate New Drop Project Options
function populateNewDropProjectOptions() {
  newDropProject.innerHTML = '<option value="">Select Project</option>';

  sampleData.projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    newDropProject.appendChild(option);
  });
}

// Populate New Drop Milestone Options
function populateNewDropMilestones(projectId) {
  newDropMilestone.innerHTML = '<option value="">Select Milestone</option>';

  if (!projectId) return;

  sampleData.milestones[projectId].forEach((milestone) => {
    const option = document.createElement("option");
    option.value = milestone.id;
    option.textContent = milestone.name;
    newDropMilestone.appendChild(option);
  });
}

// Populate New Drop Reviewer Options
function populateNewDropReviewerOptions() {
  newDropReviewer.innerHTML = '<option value="">Select Reviewer</option>';

  sampleData.reviewers.forEach((reviewer) => {
    const option = document.createElement("option");
    option.value = reviewer.id;
    option.textContent = reviewer.name;
    newDropReviewer.appendChild(option);
  });
}

// Populate Timeline Filters
function populateTimelineFilters() {
  timelineProjectFilter.innerHTML = '<option value="">All Projects</option>';

  sampleData.projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    timelineProjectFilter.appendChild(option);
  });
}

// Populate Timeline Milestone Filter
function populateTimelineMilestoneFilter(projectId) {
  timelineMilestoneFilter.innerHTML =
    '<option value="">All Milestones</option>';

  if (!projectId) return;

  sampleData.milestones[projectId].forEach((milestone) => {
    const option = document.createElement("option");
    option.value = milestone.id;
    option.textContent = milestone.name;
    timelineMilestoneFilter.appendChild(option);
  });
}

// Add New Code Drop
function addNewCodeDrop() {
  try {
    const projectId = newDropProject.value;
    const milestoneId = newDropMilestone.value;
    const name = newDropName.value;
    const reviewerId = newDropReviewer.value;
    const completionPercentage =
      document.getElementById("newDropCompletion").value;

    if (!projectId || !milestoneId || !name) {
      showSuccessModal("Error", "Please fill out all required fields", false);
      return;
    }

    // Validate percentage
    const percentage = parseInt(completionPercentage);
    if (isNaN(percentage) || percentage < 1 || percentage > 100) {
      showSuccessModal(
        "Error",
        "Completion percentage must be between 1 and 100",
        false,
      );
      return;
    }

    // Validate code drop name format
    if (!/^Drop \d+\.\d+$/.test(name) && !/^CR \d+\.\d+$/.test(name)) {
      if (
        !confirm(
          'The code drop name does not follow the recommended format (e.g., "Drop 1.3" or "CR 2.1"). Continue anyway?',
        )
      ) {
        return;
      }
    }

    // Check for duplicate names
    const existingDrops = sampleData.codeDrops[milestoneId] || [];
    if (
      existingDrops.some(
        (drop) => drop.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      showSuccessModal(
        "Error",
        "A code drop with this name already exists for this milestone",
        false,
      );
      return;
    }

    // Generate new code drop ID
    lastCodeDropId++;
    const newCodeDropId = `cd-${lastCodeDropId}`;

    // Add to sampleData.codeDrops
    if (!sampleData.codeDrops[milestoneId]) {
      sampleData.codeDrops[milestoneId] = [];
    }

    sampleData.codeDrops[milestoneId].push({
      id: newCodeDropId,
      name: name,
      completionPercentage: percentage,
    });

    // Create initial CR data if reviewer is selected
    if (reviewerId) {
      const today = new Date().toISOString().split("T")[0];

      crData.push({
        id: `cr-${crData.length + 1}`,
        projectId: projectId,
        milestoneId: milestoneId,
        codeDropId: newCodeDropId,
        statusId: "st-1", // Attach Code Review Buddy
        reviewerId: reviewerId,
        date: today,
        notes: "Initial code drop created",
        history: [{ statusId: "st-1", date: today, reviewerId: reviewerId }],
      });
    }

    // Save data
    saveData();

    // Close modal and refresh
    closeAllModals();
    showSuccessModal("Success", "New code drop created successfully");

    // Update selected project/milestone if not already set
    if (!selectedProjectId) {
      selectedProjectId = projectId;
    }
    if (!selectedMilestoneId) {
      selectedMilestoneId = milestoneId;
    }

    // Refresh code drop cards
    refreshCodeDropCards();
  } catch (e) {
    handleError(e, "adding new code drop");
  }
}

// Update CR Status
function updateCRStatus() {
  try {
    const dropId = updateDropId.value;
    const dateOffset = document.querySelector(
      'input[name="dateOffset"]:checked',
    ).value;
    const notes = updateNotes.value;
    const date = getDateFromOffset(dateOffset);

    // Find the CR data for this drop
    const drop = getCodeDropsForMilestone(selectedMilestoneId).find(
      (d) => d.id === dropId,
    );
    if (!drop) {
      showSuccessModal("Error", "Code drop not found", false);
      return;
    }

    // Find the CR in crData
    let cr = crData.find(
      (item) =>
        item.projectId === drop.projectId &&
        item.milestoneId === drop.milestoneId &&
        item.codeDropId === drop.id,
    );

    // If CR doesn't exist, create it
    if (!cr) {
      // Ask for reviewer if not started yet
      if (!drop.reviewerId) {
        const reviewerPrompt = prompt(
          "Please enter a code review buddy for this code drop:",
          "",
        );

        if (!reviewerPrompt) {
          showSuccessModal(
            "Error",
            "A code review buddy is required to start the process",
            false,
          );
          return;
        }

        // Find or create reviewer
        let reviewer = sampleData.reviewers.find(
          (r) => r.name.toLowerCase() === reviewerPrompt.toLowerCase(),
        );

        if (!reviewer) {
          // Create new reviewer
          reviewer = {
            id: `rev-${sampleData.reviewers.length + 1}`,
            name: reviewerPrompt,
          };
          sampleData.reviewers.push(reviewer);
        }

        drop.reviewerId = reviewer.id;
      }

      cr = {
        id: `cr-${crData.length + 1}`,
        projectId: drop.projectId,
        milestoneId: drop.milestoneId,
        codeDropId: drop.id,
        statusId: "st-1", // Start with first status
        reviewerId: drop.reviewerId,
        date: date,
        notes: notes || "Code review process started",
        history: [
          { statusId: "st-1", date: date, reviewerId: drop.reviewerId },
        ],
      };
      crData.push(cr);
    } else {
      // Get next status
      const nextStatusId = getNextStatusId(cr.statusId);

      // If moving to final sign-off, confirm
      if (nextStatusId === "st-16") {
        if (
          !confirm(
            "This will mark the code drop as complete with final sign-off. Continue?",
          )
        ) {
          return;
        }
      }

      // Update CR
      cr.statusId = nextStatusId;
      cr.date = date;
      if (notes) cr.notes = notes;

      // Add to history
      cr.history.push({
        statusId: nextStatusId,
        date: date,
      });
    }

    // Save data
    saveData();

    // Close modal and refresh
    closeAllModals();

    // Get the new status name
    const newStatus = sampleData.statuses.find((s) => s.id === cr.statusId);
    showSuccessModal("Status Updated", `Status advanced to: ${newStatus.name}`);

    // Refresh code drop cards
    refreshCodeDropCards();
  } catch (e) {
    handleError(e, "updating status");
  }
}

// Switch to Timeline View
function OldswitchToTimelineView() {
  codeDropsView.classList.remove("active");
  timelineView.classList.add("active");
  updateTimelineChart();
}

// Switch to Code Drops View
function OldswitchToCodeDropsView() {
  timelineView.classList.remove("active");
  codeDropsView.classList.add("active");
}

// Update Timeline Chart
function OldupdateTimelineChart() {
  timelineChart.innerHTML = "";

  // Get filters
  const projectFilterValue = timelineProjectFilter.value;
  const milestoneFilterValue = timelineMilestoneFilter.value;

  // Filter CR data
  let filteredCRs = crData;

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
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = "<p>No data available for the selected filters</p>";
    timelineChart.appendChild(emptyState);
    return;
  }

  // Find date range for all CRs
  let minDate = new Date();
  let maxDate = new Date("2000-01-01");

  filteredCRs.forEach((cr) => {
    cr.history.forEach((hist) => {
      const histDate = new Date(hist.date);
      if (histDate < minDate) minDate = histDate;
      if (histDate > maxDate) maxDate = histDate;
    });
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
    const [projectId, milestoneId] = key.split("-");
    const project = sampleData.projects.find((p) => p.id === projectId);
    const milestone = sampleData.milestones[projectId].find(
      (m) => m.id === milestoneId,
    );

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
      if (cr.history.length > 0) {
        const firstDate = new Date(cr.history[0].date);
        const lastDate = new Date(cr.date);

        const startDays = Math.ceil(
          (firstDate - minDate) / (1000 * 60 * 60 * 24),
        );
        const endDays = Math.ceil((lastDate - minDate) / (1000 * 60 * 60 * 24));

        const startPosition = (startDays / totalDays) * 100;
        const width = ((endDays - startDays) / totalDays) * 100;

        const bar = document.createElement("div");
        bar.className = "timeline-bar";
        bar.style.left = `${startPosition}%`;
        bar.style.width = `${width}%`;
        bar.title = `${cr.codeDropId}: ${firstDate.toLocaleDateString()} to ${lastDate.toLocaleDateString()}`;

        // Status-based color
        const status = sampleData.statuses.find((s) => s.id === cr.statusId);
        if (status.id === "st-16") {
          bar.style.backgroundColor = "var(--success-color)";
        } else if (startDays > 10) {
          bar.style.backgroundColor = "var(--danger-color)";
        } else if (startDays > 5) {
          bar.style.backgroundColor = "var(--warning-color)";
        }

        rowContent.appendChild(bar);
      }
    });

    timelineRow.appendChild(rowContent);
    timelineChart.appendChild(timelineRow);
  });
}

// Export Timeline
function OldexportTimeline() {
  // Create CSV content
  let csvContent =
    "Project,Milestone,Code Drop,Start Date,Current Status,Days in Progress\n";

  // Get filters
  const projectFilterValue = timelineProjectFilter.value;
  const milestoneFilterValue = timelineMilestoneFilter.value;

  // Filter CR data
  let filteredCRs = crData;

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
    const project = sampleData.projects.find((p) => p.id === cr.projectId);
    const milestone = sampleData.milestones[cr.projectId].find(
      (m) => m.id === cr.milestoneId,
    );
    const codeDrop = sampleData.codeDrops[cr.milestoneId].find(
      (cd) => cd.id === cr.codeDropId,
    );
    const status = sampleData.statuses.find((s) => s.id === cr.statusId);

    const startDate =
      cr.history.length > 0 ? new Date(cr.history[0].date) : new Date(cr.date);
    const today = new Date();
    const daysInProgress = Math.ceil(
      (today - startDate) / (1000 * 60 * 60 * 24),
    );

    csvContent += `"${project.name}","${milestone.name}","${codeDrop.name}","${formatDate(startDate.toISOString())}","${status.name}",${daysInProgress}\n`;
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

// Initialize the application
function initApp() {
  buildProjectTree();
  registerEventListeners();
  refreshCodeDropCards();
}

// Export all data
function exportAllData() {
  try {
    const allData = {
      crData: crData,
      codeDrops: sampleData.codeDrops,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `cr_tracker_backup_${new Date().toISOString().split("T")[0]}.json`,
    );
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccessModal(
      "Data Exported",
      "All data has been exported successfully.",
    );
  } catch (e) {
    handleError(e, "exporting data");
  }
}

// Import data
function importData() {
  try {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = function (event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const importedData = JSON.parse(e.target.result);

          // Validate data
          if (!importedData.crData || !importedData.codeDrops) {
            showSuccessModal(
              "Import Failed",
              "The imported file does not contain valid CR tracker data.",
              false,
            );
            return;
          }

          // Confirm import
          if (
            confirm(
              `Are you sure you want to import this data? It will replace your current data and cannot be undone.\n\nBackup created: ${importedData.timestamp || "Unknown"}`,
            )
          ) {
            crData = importedData.crData;
            sampleData.codeDrops = importedData.codeDrops;
            saveData();

            showSuccessModal(
              "Data Imported",
              "All data has been imported successfully.",
            );
            refreshCodeDropCards();
          }
        } catch (e) {
          showSuccessModal(
            "Import Failed",
            "The imported file contains invalid data.",
            false,
          );
          console.error("Error parsing imported data:", e);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  } catch (e) {
    handleError(e, "importing data");
  }
}

// Register all event listeners
function registerEventListeners() {
  // Project Explorer Search
  explorerSearch.addEventListener("input", filterProjectTree);

  // Add Code Drop Button
  addCodeDropBtn.addEventListener("click", showAddCodeDropModal);

  // View Report Button
  //viewReportBtn.addEventListener("click", switchToTimelineView);

  // Refresh Button
  refreshBtn.addEventListener("click", refreshCodeDropCards);

  // Back to Drops Button
  //backToDropsBtn.addEventListener("click", switchToCodeDropsView);

  // Export Timeline Button
  //exportTimelineBtn.addEventListener("click", exportTimeline);

  // Export/Import/Reset Data Buttons
  document
    .getElementById("exportDataBtn")
    .addEventListener("click", exportAllData);
  document
    .getElementById("importDataBtn")
    .addEventListener("click", importData);
  document.getElementById("resetDataBtn").addEventListener("click", resetData);

  // Timeline Filters
  timelineProjectFilter.addEventListener("change", function () {
    populateTimelineMilestoneFilter(this.value);
    //updateTimelineChart();
  });
  //timelineMilestoneFilter.addEventListener("change", updateTimelineChart);

  // Add Code Drop Form
  addCodeDropForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addNewCodeDrop();
  });

  // Update Status Form
  updateStatusForm.addEventListener("submit", function (e) {
    e.preventDefault();
    updateCRStatus();
  });

  // Modal Close Buttons
  closeButtons.forEach((button) => {
    button.addEventListener("click", closeAllModals);
  });
  modalCloseBtn.addEventListener("click", closeAllModals);

  // Project selection in Add Code Drop modal
  newDropProject.addEventListener("change", function () {
    populateNewDropMilestones(this.value);
  });

  // Close modals when clicking outside
  window.addEventListener("click", function (event) {
    if (
      event.target === addCodeDropModal ||
      event.target === updateStatusModal ||
      event.target === successModal
    ) {
      closeAllModals();
    }
  });
}

// Build the project tree in the sidebar
function buildProjectTree() {
  projectTree.innerHTML = "";

  // Populate project filters for timeline view
  populateTimelineFilters();

  // Populate project dropdown for new code drop
  populateNewDropProjectOptions();

  // Populate reviewer dropdown for new code drop
  populateNewDropReviewerOptions();

  // Add projects to tree
  sampleData.projects.forEach((project) => {
    const projectItem = createTreeItem(project.name, project.id, "project");

    const milestoneChildren = document.createElement("div");
    milestoneChildren.className = "tree-children";

    // Add milestones to project
    if (sampleData.milestones[project.id]) {
      sampleData.milestones[project.id].forEach((milestone) => {
        const milestoneItem = createTreeItem(
          milestone.name,
          milestone.id,
          "milestone",
          project.id,
        );
        milestoneChildren.appendChild(milestoneItem);
      });
    }

    projectItem.appendChild(milestoneChildren);
    projectTree.appendChild(projectItem);
  });
}

// Create a tree item (project or milestone)
function createTreeItem(name, id, type, parentId = null) {
  const treeItem = document.createElement("div");
  treeItem.className = "tree-item";
  treeItem.dataset.id = id;
  treeItem.dataset.type = type;
  if (parentId) {
    treeItem.dataset.parentId = parentId;
  }

  const treeHeader = document.createElement("div");
  treeHeader.className = "tree-item-header";

  // Only add toggle for projects
  if (type === "project") {
    const treeToggle = document.createElement("span");
    treeToggle.className = "tree-toggle";
    treeToggle.textContent = "▶";
    treeToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleTreeItem(treeItem);
    });
    treeHeader.appendChild(treeToggle);
  }

  const treeName = document.createElement("span");
  treeName.className = "tree-name";
  treeName.textContent = name;
  treeHeader.appendChild(treeName);

  treeHeader.addEventListener("click", function () {
    selectTreeItem(treeItem);

    if (type === "project") {
      toggleTreeItem(treeItem);
    }
  });

  treeItem.appendChild(treeHeader);
  return treeItem;
}

// Toggle expand/collapse of a tree item
function toggleTreeItem(treeItem) {
  const treeToggle = treeItem.querySelector(".tree-toggle");
  const treeChildren = treeItem.querySelector(".tree-children");

  if (treeChildren) {
    treeChildren.classList.toggle("expanded");
    treeToggle.classList.toggle("expanded");

    if (treeToggle.classList.contains("expanded")) {
      treeToggle.textContent = "▼";
    } else {
      treeToggle.textContent = "▶";
    }
  }
}

// Select a tree item (project or milestone)
function selectTreeItem(treeItem) {
  // Remove active class from all tree items
  document.querySelectorAll(".tree-item-header").forEach((item) => {
    item.classList.remove("active");
  });

  // Add active class to selected item
  treeItem.querySelector(".tree-item-header").classList.add("active");

  const type = treeItem.dataset.type;
  const id = treeItem.dataset.id;

  if (type === "project") {
    selectedProjectId = id;
    selectedMilestoneId = null;
    currentPathTitle.textContent = sampleData.projects.find(
      (p) => p.id === id,
    ).name;
  } else if (type === "milestone") {
    selectedProjectId = treeItem.dataset.parentId;
    selectedMilestoneId = id;

    const project = sampleData.projects.find((p) => p.id === selectedProjectId);
    const milestone = sampleData.milestones[selectedProjectId].find(
      (m) => m.id === id,
    );

    currentPathTitle.textContent = `${project.name} > ${milestone.name}`;
  }

  refreshCodeDropCards();
}

// Filter project tree based on search input
function filterProjectTree() {
  const searchTerm = explorerSearch.value.toLowerCase();

  document.querySelectorAll(".tree-item").forEach((item) => {
    const type = item.dataset.type;
    const name = item.querySelector(".tree-name").textContent.toLowerCase();

    if (type === "project") {
      const milestones = item.querySelectorAll(
        '.tree-item[data-type="milestone"]',
      );
      let hasVisibleMilestone = false;

      milestones.forEach((milestone) => {
        const milestoneName = milestone
          .querySelector(".tree-name")
          .textContent.toLowerCase();
        if (milestoneName.includes(searchTerm)) {
          milestone.style.display = "block";
          hasVisibleMilestone = true;
        } else {
          milestone.style.display = "none";
        }
      });

      if (name.includes(searchTerm) || hasVisibleMilestone) {
        item.style.display = "block";
        // Expand if there's a match and there are visible milestones
        if (hasVisibleMilestone) {
          const treeChildren = item.querySelector(".tree-children");
          const treeToggle = item.querySelector(".tree-toggle");
          if (treeChildren && !treeChildren.classList.contains("expanded")) {
            treeChildren.classList.add("expanded");
            treeToggle.classList.add("expanded");
            treeToggle.textContent = "▼";
          }
        }
      } else {
        item.style.display = "none";
      }
    }
  });
}

// Refresh code drop cards based on selected project/milestone
function refreshCodeDropCards() {
  codeDropCards.innerHTML = "";

  if (!selectedProjectId && !selectedMilestoneId) {
    // No selection, show empty state
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML =
      "<p>Select a project and milestone from the explorer to view code drops</p>";
    codeDropCards.appendChild(emptyState);
    return;
  }

  if (selectedProjectId && !selectedMilestoneId) {
    // Only project selected, show all milestones
    const milestones = sampleData.milestones[selectedProjectId];
    if (!milestones || milestones.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = "<p>No milestones found for this project</p>";
      codeDropCards.appendChild(emptyState);
      return;
    }

    milestones.forEach((milestone) => {
      const milestoneDrops = getCodeDropsForMilestone(milestone.id);
      if (milestoneDrops.length > 0) {
        milestoneDrops.forEach((drop) => {
          codeDropCards.appendChild(createCodeDropCard(drop));
        });
      }
    });
  } else if (selectedProjectId && selectedMilestoneId) {
    // Both project and milestone selected
    const drops = getCodeDropsForMilestone(selectedMilestoneId);

    if (drops.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML =
        '<p>No code drops found for this milestone. Click "+ Add Code Drop" to create one.</p>';
      codeDropCards.appendChild(emptyState);
      return;
    }

    drops.forEach((drop) => {
      codeDropCards.appendChild(createCodeDropCard(drop));
    });
  }
}

// Get code drops for a milestone
function getCodeDropsForMilestone(milestoneId) {
  // Get code drop definitions
  const codeDropDefs = sampleData.codeDrops[milestoneId] || [];

  // Get CR data for these code drops
  return codeDropDefs.map((dropDef) => {
    const cr = crData.find(
      (item) =>
        item.milestoneId === milestoneId && item.codeDropId === dropDef.id,
    );

    if (cr) {
      return {
        id: dropDef.id,
        name: dropDef.name,
        milestoneId: milestoneId,
        projectId: cr.projectId,
        statusId: cr.statusId,
        reviewerId: cr.reviewerId,
        date: cr.date,
        notes: cr.notes,
        history: cr.history,
      };
    } else {
      // Code drop exists but no CR data yet
      const projectId = Object.keys(sampleData.milestones).find((pid) =>
        sampleData.milestones[pid].some((m) => m.id === milestoneId),
      );

      return {
        id: dropDef.id,
        name: dropDef.name,
        milestoneId: milestoneId,
        projectId: projectId,
        statusId: null,
        reviewerId: null,
        date: null,
        notes: null,
        history: [],
      };
    }
  });
}

// Create a code drop card
function createCodeDropCard(drop) {
  const card = document.createElement("div");
  card.className = "code-drop-card";
  card.dataset.id = drop.id;

  const status = drop.statusId
    ? sampleData.statuses.find((s) => s.id === drop.statusId)
    : null;
  const reviewer = drop.reviewerId
    ? sampleData.reviewers.find((r) => r.id === drop.reviewerId)
    : null;
  const project = sampleData.projects.find((p) => p.id === drop.projectId);
  const milestone = sampleData.milestones[drop.projectId].find(
    (m) => m.id === drop.milestoneId,
  );

  // Calculate status class and text
  let statusClass = "status-blue";
  let statusText = "Not Started";

  if (status) {
    const today = new Date();
    const lastUpdateDate = new Date(drop.date);
    const daysInStage = getBusinessDaysDifference(lastUpdateDate, today);

    if (status.id === "st-16") {
      statusClass = "status-green";
      statusText = "Complete";
    } else if (daysInStage > 10) {
      statusClass = "status-red";
      statusText = "At Risk";
    } else if (daysInStage > 5) {
      statusClass = "status-amber";
      statusText = "Warning";
    } else {
      statusClass = "status-blue";
      statusText = "On Track";
    }
  }

  // Card Header
  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";

  const cardTitle = document.createElement("div");
  cardTitle.className = "card-title";
  cardTitle.textContent = drop.name;

  const cardSubtitle = document.createElement("div");
  cardSubtitle.className = "card-subtitle";
  cardSubtitle.textContent = `${project.name} > ${milestone.name}`;

  cardHeader.appendChild(cardTitle);
  cardHeader.appendChild(cardSubtitle);

  // Card Body
  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  // Card Info
  const cardInfo = document.createElement("div");
  cardInfo.className = "card-info";

  // Left Column
  const leftCol = document.createElement("div");
  leftCol.className = "info-col";

  // Status
  const statusItem = document.createElement("div");
  statusItem.className = "info-item";

  const statusLabel = document.createElement("div");
  statusLabel.className = "info-label";
  statusLabel.textContent = "Current Status";

  const statusValue = document.createElement("div");
  statusValue.className = "info-value";
  statusValue.innerHTML = `
        <span class="status-badge ${statusClass}">${statusText}</span>
        ${status ? ` - ${status.name}` : ""}
    `;

  statusItem.appendChild(statusLabel);
  statusItem.appendChild(statusValue);
  leftCol.appendChild(statusItem);

  // Last Updated
  if (drop.date) {
    const lastUpdatedItem = document.createElement("div");
    lastUpdatedItem.className = "info-item";

    const lastUpdatedLabel = document.createElement("div");
    lastUpdatedLabel.className = "info-label";
    lastUpdatedLabel.textContent = "Last Updated";

    const lastUpdatedValue = document.createElement("div");
    lastUpdatedValue.className = "info-value";
    lastUpdatedValue.textContent = formatDate(drop.date);

    lastUpdatedItem.appendChild(lastUpdatedLabel);
    lastUpdatedItem.appendChild(lastUpdatedValue);
    leftCol.appendChild(lastUpdatedItem);
  }

  // Right Column
  const rightCol = document.createElement("div");
  rightCol.className = "info-col";

  // Reviewer
  const reviewerItem = document.createElement("div");
  reviewerItem.className = "info-item";

  const reviewerLabel = document.createElement("div");
  reviewerLabel.className = "info-label";
  reviewerLabel.textContent = "Code Review Buddy";

  const reviewerValue = document.createElement("div");
  reviewerValue.className = "info-value";
  reviewerValue.textContent = reviewer ? reviewer.name : "Not Assigned";

  reviewerItem.appendChild(reviewerLabel);
  reviewerItem.appendChild(reviewerValue);
  rightCol.appendChild(reviewerItem);

  // Completion Percentage
  if (drop.completionPercentage) {
    const completionItem = document.createElement("div");
    completionItem.className = "info-item";

    const completionLabel = document.createElement("div");
    completionLabel.className = "info-label";
    completionLabel.textContent = "Milestone Completion";

    const completionValue = document.createElement("div");
    completionValue.className = "info-value";
    completionValue.textContent = `${drop.completionPercentage}%`;

    completionItem.appendChild(completionLabel);
    completionItem.appendChild(completionValue);
    leftCol.appendChild(completionItem);
  }

  // Notes
  if (drop.notes) {
    const notesItem = document.createElement("div");
    notesItem.className = "info-item";

    const notesLabel = document.createElement("div");
    notesLabel.className = "info-label";
    notesLabel.textContent = "Notes";

    const notesValue = document.createElement("div");
    notesValue.className = "info-value";
    notesValue.textContent = drop.notes;

    notesItem.appendChild(notesLabel);
    notesItem.appendChild(notesValue);
    rightCol.appendChild(notesItem);
  }

  cardInfo.appendChild(leftCol);
  cardInfo.appendChild(rightCol);

  // Progress Tracker
  const progressTracker = document.createElement("div");
  progressTracker.className = "progress-tracker";

  const progressTitle = document.createElement("div");
  progressTitle.className = "progress-title";
  progressTitle.textContent = "CR Lifecycle Progress";

  const progressSteps = document.createElement("div");
  progressSteps.className = "progress-steps";

  // Progress line
  const progressLine = document.createElement("div");
  progressLine.className = "progress-line";
  progressSteps.appendChild(progressLine);

  // Progress line filled
  const progressLineFilled = document.createElement("div");
  progressLineFilled.className = "progress-line-filled";

  // Calculate fill width based on current status
  if (status) {
    const progress = getStatusProgress(status.id);
    progressLineFilled.style.width = `${progress}%`;
  } else {
    progressLineFilled.style.width = "0%";
  }

  progressSteps.appendChild(progressLineFilled);

  // Add progress steps (simplified to 5 stages)
  const stages = sampleData.statusGroups;

  stages.forEach((stage) => {
    const step = document.createElement("div");
    step.className = "progress-step";

    // Check if this stage is completed or current
    let isCompleted = false;
    let isCurrent = false;

    if (status) {
      const currentGroup = sampleData.statuses.find(
        (s) => s.id === status.id,
      )?.group;
      const stageIndex = stages.indexOf(stage);
      const currentIndex = stages.indexOf(currentGroup);

      isCompleted = stageIndex < currentIndex;
      isCurrent = stage === currentGroup;
    }

    if (isCompleted) {
      step.classList.add("completed");
    }

    if (isCurrent) {
      step.classList.add("current");
    }

    const stepLabel = document.createElement("div");
    stepLabel.className = "progress-step-label";
    stepLabel.textContent = stage;

    step.appendChild(stepLabel);
    progressSteps.appendChild(step);
  });

  progressTracker.appendChild(progressTitle);
  progressTracker.appendChild(progressSteps);

  // Card Actions
  const cardActions = document.createElement("div");
  cardActions.className = "card-actions";

  // Create Update Status button if not complete
  if (!status || status.id !== "st-16") {
    const updateBtn = document.createElement("button");
    updateBtn.className = "btn btn-primary";
    updateBtn.textContent = status
      ? "Advance to Next Stage"
      : "Start Code Review";
    updateBtn.addEventListener("click", function () {
      showUpdateStatusModal(drop);
    });
    cardActions.appendChild(updateBtn);
  }

  cardBody.appendChild(cardInfo);
  cardBody.appendChild(progressTracker);
  cardBody.appendChild(cardActions);

  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  return card;
}

// Save data to localStorage
function saveData() {
  try {
    localStorage.setItem("cr-tracker-data", JSON.stringify(crData));
    localStorage.setItem(
      "cr-tracker-codedrops",
      JSON.stringify(sampleData.codeDrops),
    );
    localStorage.setItem("cr-tracker-last-id", lastCodeDropId.toString());
  } catch (e) {
    console.error("Error saving data to localStorage:", e);
  }
}

// Load data from localStorage
function loadData() {
  try {
    const savedCRData = localStorage.getItem("cr-tracker-data");
    const savedCodeDrops = localStorage.getItem("cr-tracker-codedrops");
    const savedLastId = localStorage.getItem("cr-tracker-last-id");

    if (savedCRData) {
      crData = JSON.parse(savedCRData);
    }

    if (savedCodeDrops) {
      sampleData.codeDrops = JSON.parse(savedCodeDrops);
    }

    if (savedLastId) {
      lastCodeDropId = parseInt(savedLastId);
    }
  } catch (e) {
    console.error("Error loading data from localStorage:", e);
  }
}

// Add error handling for API operations
function handleError(error, operation) {
  console.error(`Error during ${operation}:`, error);
  showSuccessModal(
    "Operation Failed",
    `An error occurred during ${operation}. Please try again.`,
    false,
  );
}

// Clear all data and reset to defaults
function resetData() {
  if (
    confirm("Are you sure you want to reset all data? This cannot be undone.")
  ) {
    localStorage.removeItem("cr-tracker-data");
    localStorage.removeItem("cr-tracker-codedrops");
    localStorage.removeItem("cr-tracker-last-id");
    location.reload();
  }
}
// Check if all required DOM elements are available
function checkRequiredElements() {
  const requiredElements = [
    "projectTree",
    "codeDropCards",
    "currentPathTitle",
    "explorerSearch",
    "addCodeDropBtn",
    "viewReportBtn",
    "refreshBtn",
    "timelineProjectFilter",
    "timelineMilestoneFilter",
    "exportTimelineBtn",
    "backToDropsBtn",
    "timelineChart",
    "codeDropsView",
    "timelineView",
    "addCodeDropModal",
    "addCodeDropForm",
    "newDropProject",
    "newDropMilestone",
    "newDropName",
    "newDropReviewer",
    "updateStatusModal",
    "updateStatusForm",
    "statusModalTitle",
    "statusModalCurrentStage",
    "updateDropId",
    "updateNotes",
    "successModal",
    "successModalTitle",
    "successModalMessage",
    "exportDataBtn",
    "importDataBtn",
    "resetDataBtn",
  ];

  const missingElements = [];

  requiredElements.forEach((id) => {
    if (!document.getElementById(id)) {
      missingElements.push(id);
    }
  });

  if (missingElements.length > 0) {
    console.error("Missing required DOM elements:", missingElements);
    return false;
  }

  return true;
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  try {
    if (!checkRequiredElements()) {
      alert(
        "Some required elements are missing from the HTML. Please check the console for details.",
      );
      return;
    }

    loadData();
    initApp();

    // Setup auto-save
    window.addEventListener("beforeunload", saveData);
    // Save every 30 seconds
    setInterval(saveData, 30000);
  } catch (e) {
    console.error("Error initializing application:", e);
    alert(
      "An error occurred while initializing the application. Please refresh the page.",
    );
  }

  // Make data available globally for the timeline
  window.crTrackerData = {
    sampleData: sampleData,
    crData: crData,
    getBusinessDaysDifference: getBusinessDaysDifference,
    formatDate: formatDate,
  };
});
