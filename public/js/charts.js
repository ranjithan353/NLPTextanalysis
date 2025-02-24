async function fetchData(api, chartId, type, label, colors = [], options = {}) {
    try {
        const response = await fetch(api);
        if (!response.ok) throw new Error(`Failed to fetch data from ${api}`);
        const data = await response.json();

        const labels = data.map(entry => entry._id);
        const values = data.map(entry => entry.count);

        // Auto-generate colors if not provided
        if (colors.length === 0) {
            colors = values.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
        }

        // Destroy existing chart if it exists
        const existingChart = Chart.getChart(chartId);
        if (existingChart) existingChart.destroy();

        new Chart(document.getElementById(chartId), {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: values,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { enabled: true }
                },
                ...options
            }
        });
    } catch (error) {
        console.error(`Error loading chart '${chartId}':`, error);
        document.getElementById(chartId).parentElement.innerHTML = `<p style="color: red;">Failed to load chart: ${label}</p>`;
    }
}

// Load all charts
document.addEventListener("DOMContentLoaded", function () {
    fetchData('/api/genre-stats', 'genreChart', 'polarArea', 'Books by Genre');
    fetchData('/api/yearly-sales', 'yearlyChart', 'radar', 'Yearly Bestsellers');
    fetchData('/api/rating-distribution', 'ratingChart', 'bar', 'Rating Distribution', [], { indexAxis: 'y' });
    fetchData('/api/price-distribution', 'priceChart', 'line', 'Price Distribution');
    fetchData('/api/yearly-sales', 'reviewsChart', 'bar', 'Reviews Distribution', ['#8e44ad']);
    fetchData('/api/top-authors', 'authorChart', 'doughnut', 'Top Authors');
    fetchData('/api/text-analysis', 'sentimentChart', 'radar', 'Sentiment Analysis');
});
