/**
 * Main application logic
 */

import { loadCSVData, filterByDate, getStatistics } from './utils.js';
import { renderChart, updateChart } from './chart.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load data
    const rawData = await loadCSVData('data/cleaned_known_exploited_vulnerabilities.csv');
    let filteredData = rawData;
    
    // Get DOM elements
    const topNSlider = document.getElementById('topN');
    const topNValue = document.getElementById('topNValue');
    const timeFilter = document.getElementById('timeFilter');
    const totalExploitsEl = document.getElementById('totalExploits');
    const uniqueProductsEl = document.getElementById('uniqueProducts');
    const topVendorEl = document.getElementById('topVendor');
    const exploitsTable = document.querySelector('#exploitsTable tbody');
    
    // Initialize with default values
    const initialTopN = parseInt(topNSlider.value);
    topNValue.textContent = initialTopN;
    
    // Render initial chart
    renderChart(filteredData, initialTopN);
    updateStatistics(filteredData);
    renderRecentExploits(filteredData);
    
    // Event listeners
    topNSlider.addEventListener('input', function() {
        const value = this.value;
        topNValue.textContent = value;
        updateChart(filteredData, parseInt(value));
    });
    
    timeFilter.addEventListener('change', function() {
        filteredData = filterByDate(rawData, this.value);
        updateChart(filteredData, parseInt(topNSlider.value));
        updateStatistics(filteredData);
        renderRecentExploits(filteredData);
    });
    
    // Update statistics
    function updateStatistics(data) {
        const stats = getStatistics(data);
        totalExploitsEl.textContent = stats.totalExploits;
        uniqueProductsEl.textContent = stats.uniqueProducts;
        topVendorEl.textContent = stats.topVendor;
    }
    
    // Render recent exploits table
    function renderRecentExploits(data) {
        exploitsTable.innerHTML = '';
        
        // Sort by date (newest first) and take top 10
        const recent = [...data]
            .sort((a, b) => b.dateAdded - a.dateAdded)
            .slice(0, 10);
        
        recent.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="CVE ID">${item.cveID}</td>
                <td data-label="Vendor">${item.vendorProject}</td>
                <td data-label="Product">${item.product}</td>
                <td data-label="Date Added">${item.dateAdded.toISOString().split('T')[0]}</td>
            `;
            exploitsTable.appendChild(row);
        });
    }
});