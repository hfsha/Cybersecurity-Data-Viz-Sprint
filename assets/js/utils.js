/**
 * Utility functions for the dashboard
 */

// Parse CSV data
async function loadCSVData(filePath) {
    const response = await fetch(filePath);
    const csvData = await response.text();
    const rows = csvData.split('\n').slice(1); // Skip header row
    const data = [];
    
    // Regex to split CSV by comma, but not commas within double quotes
    const csvSplitRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

    rows.forEach(row => {
        if (row.trim() === '') return;
        const [cveID, vendorProject, product, dateAdded] = row.split(csvSplitRegex).map(item => item.trim().replace(/^"|"$/g, ''));
        data.push({
            cveID,
            vendorProject,
            product,
            dateAdded: new Date(dateAdded)
        });
    });
    
    return data;
}

// Filter data by date range
function filterByDate(data, filterType) {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    switch(filterType) {
        case '2025':
            return data.filter(item => item.dateAdded.getFullYear() === 2025);
        case '2024':
            return data.filter(item => item.dateAdded.getFullYear() === 2024);
        case 'last6m':
            return data.filter(item => item.dateAdded >= sixMonthsAgo);
        default:
            return data;
    }
}

// Get top N products by count
function getTopProducts(data, n) {
    const productCounts = {};
    
    data.forEach(item => {
        const key = `${item.vendorProject} - ${item.product}`;
        productCounts[key] = (productCounts[key] || 0) + 1;
    });
    
    return Object.entries(productCounts)
        .map(([product, count]) => ({ product, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, n);
}

// Get statistics
function getStatistics(data) {
    const vendors = {};
    let totalExploits = data.length;
    let uniqueProducts = new Set();
    
    data.forEach(item => {
        const key = `${item.vendorProject} - ${item.product}`;
        uniqueProducts.add(key);
        vendors[item.vendorProject] = (vendors[item.vendorProject] || 0) + 1;
    });
    
    const topVendor = Object.entries(vendors)
        .sort((a, b) => b[1] - a[1])[0] || ['-', 0];
    
    return {
        totalExploits,
        uniqueProducts: uniqueProducts.size,
        topVendor: `${topVendor[0]} (${topVendor[1]})`
    };
}

export { loadCSVData, filterByDate, getTopProducts, getStatistics };