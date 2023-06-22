let chart;

// Accessing DOM elements
const seaLevelPressureInput = document.getElementById('sea-level-pressure');
const temperatureLapseRateInput = document.getElementById('temperature-lapse-rate');
const altitudeInput = document.getElementById('altitude');
const standardTemperatureInput = document.getElementById('standard-temperature');
const calculatedPressureOutput = document.getElementById('calculated-pressure');
const inputSliderValues = document.querySelectorAll('.slider-value');

// Function to generate a pressure chart
function generatePressureChart() {
    const ctx = document.getElementById('pressure-chart').getContext('2d');

    const data = {
        labels: generateRange(0, 50, 0.5), // x-axis: altitude from 0 to 50km in 0.5km steps
        datasets: [{
            label: 'Air Pressure (hPa)',
            data: calculatePressureForRange(0, 50, 0.5), // y-axis: calculated air pressure
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true
        }
    });
}

// Function to generate a range of numbers
function generateRange(start, end, step) {
    let range = [];
    for (let i = start; i <= end; i += step) {
        range.push(i);
    }
    return range;
}

// Function to calculate a range of pressures
function calculatePressureForRange(start, end, step) {
    let pressures = [];
    for (let altitude = start; altitude <= end; altitude += step) {
        pressures.push(calculatePressure(altitude));
    }
    return pressures;
}

// Function to calculate pressure
function calculatePressure(altitude) {
    // Retrieve user inputs
    const seaLevelPressure = parseFloat(seaLevelPressureInput.value);
    const temperatureLapseRate = parseFloat(temperatureLapseRateInput.value);
    const standardTemperatureCelsius = parseFloat(standardTemperatureInput.value);

    // Convert Celsius temperature to Kelvin
    const standardTemperatureKelvin = standardTemperatureCelsius + 273.15;

    // Calculate pressure using the provided formula
    const calculatedPressure = seaLevelPressure * Math.exp((-1 * altitude) / (temperatureLapseRate * standardTemperatureKelvin));

    return calculatedPressure;
}

// Function to update chart when a slider is moved
function updateChart() {
    const newChartData = {
        labels: generateRange(0, 50, 0.5),
        datasets: [{
            label: 'Air Pressure (hPa)',
            data: calculatePressureForRange(0, 50, 0.5),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    // Update chart data and redraw
    chart.data = newChartData;
    chart.update();
}

// Add event listeners to sliders
document.querySelectorAll('.input-slider').forEach(slider => {
    slider.addEventListener('input', () => {
        const sliderValueElement = slider.nextElementSibling;
        sliderValueElement.textContent = slider.value; // Update slider value display

        updateChart(); // Update chart when a slider is moved
    });
});

// Initial setup
window.onload = () => {
    // Set default values for input fields
    seaLevelPressureInput.value = '1013.25';
    temperatureLapseRateInput.value = '6.5';
    standardTemperatureInput.value = (288.15 - 273.15).toFixed(2); // Convert Kelvin to Celsius and round to 2 decimal places

    // Display initial slider values
    inputSliderValues.forEach(sliderValue => {
        sliderValue.textContent = sliderValue.previousElementSibling.value;
    });

    // Generate initial pressure chart
    generatePressureChart();
};
