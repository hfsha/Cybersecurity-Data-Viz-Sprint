/**
 * Chart rendering functions
 */

import { getTopProducts } from './utils.js';

let chartInstance = null;

function renderChart(data, topN) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    const topProducts = getTopProducts(data, topN);
    
    // Destroy previous chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    // Generate random colors for each bar
    const backgroundColors = topProducts.map(() => {
        const hue = Math.floor(Math.random() * 360);
        return `hsla(${hue}, 70%, 50%, 0.7)`;
    });
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topProducts.map(item => item.product),
            datasets: [{
                label: 'Number of Exploits',
                data: topProducts.map(item => item.count),
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
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
                        text: 'Number of Exploits'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Product'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Exploits: ${context.raw}`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: `Top ${topN} Most Exploited Products`,
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

function updateChart(data, topN) {
    const topProducts = getTopProducts(data, topN);
    
    chartInstance.data.labels = topProducts.map(item => item.product);
    chartInstance.data.datasets[0].data = topProducts.map(item => item.count);
    
    // Update chart title
    chartInstance.options.plugins.title.text = `Top ${topN} Most Exploited Products`;
    
    chartInstance.update();
}

export { renderChart, updateChart };