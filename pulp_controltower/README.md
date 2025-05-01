# Pulp Procurement Control Tower Simulator

A lightweight, offline-capable simulator for monitoring and managing pulp procurement operations across multiple plants, suppliers, and shipments.

## Overview

The Pulp Procurement Control Tower Simulator is a comprehensive dashboard application designed to help procurement teams manage their pulp supply chain efficiently. The simulator allows tracking of shipments, inventory levels, supplier performance, customs processes, and quality control.

## Features

- **Shipment Tracking**: Monitor all pulp shipments with status updates, ETA tracking, and detention risk alerts
- **Supplier Management**: Track supplier performance, contracts, and quality metrics
- **Plant Inventory**: Manage pulp inventory across plants, with reorder points and consumption tracking
- **Customs & Logistics**: Follow shipments through customs clearance and logistics processes
- **Quality Control**: Record and analyze quality parameters with deviation tracking
- **Reports**: Generate comprehensive reports and analytics on procurement operations

## Getting Started

### Running the Application

1. Download all the files to a local directory
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge)
3. The application runs entirely in your browser with no server requirements

### File Structure

```
pulp-procurement-simulator/
├── index.html         # Main HTML file
├── css/
│   └── styles.css     # CSS styles
├── js/
│   ├── app.js         # Main application code
│   ├── config.js      # Configuration constants
│   ├── helpers.js     # Helper functions
│   ├── data.js        # Mock data and data management
│   ├── ui.js          # UI utilities (modals, notifications)
│   ├── shipments.js   # Shipment tracking functionality
│   ├── suppliers.js   # Supplier management functionality
│   ├── inventory.js   # Inventory management functionality
│   ├── customs.js     # Customs & logistics functionality
│   ├── quality.js     # Quality control functionality
│   └── reports.js     # Reports generation functionality
└── README.md          # This file
```

## Usage Guide

### Shipment Tracking

The Shipment Tracking tab provides a comprehensive view of all pulp shipments, with real-time status updates.

- **Dashboard Cards**: View key metrics such as active shipments, shipments at port, delayed shipments, and total pulp in transit
- **Detention Alerts**: Get notified of potential container detention risks
- **Filtering**: Filter shipments by supplier, plant, status, or search terms
- **Shipment Management**: Add, edit, view, or delete shipments
- **Shipment Details**: View comprehensive information about each shipment

### Supplier Management

The Supplier Management tab helps track supplier performance and contractual information.

- **Supplier List**: View all suppliers with key information
- **Supplier Details**: Access detailed information about each supplier including contracts and performance metrics
- **Supplier-Specific Shipments**: Track shipments associated with specific suppliers

### Plant Inventory

The Inventory tab provides visibility into current pulp stock levels across all plants.

- **Inventory Status**: Monitor current inventory levels, reorder points, and consumption rates
- **Low Stock Alerts**: Identify items that need reordering

### Customs & Logistics

The Customs & Logistics tab tracks shipments through the customs clearance process.

- **Customs Process Tracking**: Follow each step of the customs process
- **Container Management**: Track container status and location
- **Timeline Visualization**: Visualize the entire clearance process timeline

### Quality Control

The Quality Control tab manages quality checks performed on received shipments.

- **Quality Metrics**: Track key quality parameters such as moisture content and weight
- **Supplier vs. Plant Measurements**: Compare supplier-reported values with plant measurements
- **Deviation Analysis**: Analyze deviations to identify quality trends

### Reports

The Reports tab generates analytics and insights across various aspects of the procurement process.

- **Multiple Report Types**: Choose from procurement summaries, supplier performance analyses, quality assessments, inventory forecasts, and logistics efficiency reports
- **Data Visualization**: View charts and graphs to understand trends
- **Export Options**: Export reports for sharing with stakeholders

## Simulation Features

The simulator includes several features to mimic real-world operations:

- **Month Advancement**: Use the "Advance to Next Month" button to simulate the passage of time and see how inventory levels and shipment statuses change
- **Data Persistence**: Changes made in the simulator are stored in the browser's local storage
- **Random Events**: Simulated random events such as shipment delays and quality issues

## Development Information

This simulator is built with vanilla JavaScript, HTML, and CSS, making it easy to run in any modern browser without additional dependencies. All data is simulated within the browser for demonstration purposes.

## Notes

This is a simulation tool designed for training and demonstration purposes. In a production environment, it would connect to real database systems and integrate with ERP and shipping systems.