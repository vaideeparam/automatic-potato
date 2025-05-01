/**
 * Setup script for Pulp Procurement Control Tower Simulator
 * This creates the necessary folder structure for the application
 */

// Import required Node.js modules
const fs = require('fs');
const path = require('path');

// Define the folder structure
const folders = [
    'css',
    'js'
];

// Create folders if they don't exist
folders.forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Created folder: ${folder}`);
    }
});

// Move files to their correct locations
const fileMapping = [
    { source: 'styles.css', destination: 'css/styles.css' },
    { source: 'config.js', destination: 'js/config.js' },
    { source: 'helpers.js', destination: 'js/helpers.js' },
    { source: 'data.js', destination: 'js/data.js' },
    { source: 'ui.js', destination: 'js/ui.js' },
    { source: 'shipments.js', destination: 'js/shipments.js' },
    { source: 'suppliers.js', destination: 'js/suppliers.js' },
    { source: 'inventory.js', destination: 'js/inventory.js' },
    { source: 'customs.js', destination: 'js/customs.js' },
    { source: 'quality.js', destination: 'js/quality.js' },
    { source: 'reports.js', destination: 'js/reports.js' },
    { source: 'app.js', destination: 'js/app.js' }
];

fileMapping.forEach(mapping => {
    const sourcePath = path.join(__dirname, mapping.source);
    const destPath = path.join(__dirname, mapping.destination);
    
    // Only attempt to copy if the source file exists
    if (fs.existsSync(sourcePath)) {
        // Read the content of the source file
        const content = fs.readFileSync(sourcePath, 'utf8');
        
        // Write to the destination file
        fs.writeFileSync(destPath, content);
        console.log(`Moved ${mapping.source} to ${mapping.destination}`);
        
        // Delete the source file if it's not in the same location as the destination
        if (mapping.source !== mapping.destination) {
            fs.unlinkSync(sourcePath);
            console.log(`Deleted original file: ${mapping.source}`);
        }
    } else {
        console.log(`Warning: Source file ${mapping.source} does not exist.`);
    }
});

console.log('Setup complete. The application is ready to use.');
console.log('Open index.html in your browser to start the Pulp Procurement Control Tower Simulator.');
