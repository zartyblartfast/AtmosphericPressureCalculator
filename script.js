// Admospheric Pressure Calculator
// Variables for inputs
let seaLevelPressureInput = document.getElementById('sea-level-pressure');
let temperatureLapseRateInput = document.getElementById('temperature-lapse-rate');
let altitudeInput = document.getElementById('altitude');
let standardTemperatureInput = document.getElementById('standard-temperature');

// Variables for displaying input values
let seaLevelPressureValue = document.getElementById('sea-level-pressure-number');
let temperatureLapseRateValue = document.getElementById('temperature-lapse-rate-number');
let altitudeValue = document.getElementById('altitude-number');
let standardTemperatureValue = document.getElementById('standard-temperature-number');

// Variable for displaying calculated pressure
let calculatedPressureOutput = document.getElementById('calculated-pressure');

// Function to calculate pressure
function calculatePressure(seaLevelPressure, temperatureLapseRate, altitude, standardTemperature) {
  const g = 9.80665; // gravitational acceleration
  const m = 0.0289644; // molar mass of dry air
  const R = 8.3144598; // universal gas constant

  // Adjust temperature lapse rate from K/m to K/km
  const adjustedTemperatureLapseRate = temperatureLapseRate * 1000;

  // Calculate the temperature at the given altitude
  let temperatureAtAltitude = standardTemperature - (adjustedTemperatureLapseRate * altitude);

  // Ensure temperature doesn't go below absolute zero
  if (temperatureAtAltitude < -273.15) {
    temperatureAtAltitude = -273.15;
  }

  // Adjust temperature from Celsius to Kelvin
  const temperatureAtAltitudeK = temperatureAtAltitude + 273.15;

  // Calculate the pressure at the given altitude
  const pressure = seaLevelPressure * Math.exp(-(g * m * altitude * 1000) / (R * temperatureAtAltitudeK));

  return pressure;
}

// Chart.js instance
let chart;

// Function to generate chart
function generatePressureChart(seaLevelPressure, temperatureLapseRate, standardTemperature) {
  const ctx = document.getElementById('pressure-chart').getContext('2d');
  
  // Data for chart
  let data = {
    labels: [], // This array will be populated with altitude values
    datasets: [{
      label: 'Air Pressure (hPa)',
      data: [], // This array will be populated with pressure values
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
  
  // Generate data
  for (let i = 0; i <= 100; i += 1) { // Fixed range to 100 Km
    data.labels.push(i.toFixed(1));
    let pressureAtAltitude = calculatePressure(seaLevelPressure, temperatureLapseRate, i, standardTemperature);
    
    data.datasets[0].data.push(pressureAtAltitude);

    // Log the altitude and corresponding pressure
    console.log(`Altitude: ${i.toFixed(1)}, Pressure: ${pressureAtAltitude}`);
  }
  
  // If chart exists, destroy it before creating a new one
  if (chart) {
    chart.destroy();
  }
  
  // Create new chart
  chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      scales: {
        x: {
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Altitude (km)'
          },
          ticks: {
            callback: function(value) {
              return Number(value).toFixed(0); // Display only integer values on the x-axis
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Air Pressure (hPa)'
          },
          beginAtZero: true
        }
      }
    }
  });
}

function update() {
  // Parse input values
  let seaLevelPressure = parseFloat(seaLevelPressureInput.value);
  let temperatureLapseRate = parseFloat(temperatureLapseRateInput.value);
  let altitude = parseFloat(altitudeInput.value);
  let standardTemperature = parseFloat(standardTemperatureInput.value);

  // Basic input validation
  if (isNaN(seaLevelPressure) || isNaN(temperatureLapseRate) || isNaN(altitude) || isNaN(standardTemperature)) {
    calculatedPressureOutput.textContent = "Invalid input";
    return;
  }

  console.log("Sea Level Pressure: " + seaLevelPressure);
  console.log("Temperature Lapse Rate: " + temperatureLapseRate);
  console.log("Altitude: " + altitude);
  console.log("Standard Temperature: " + standardTemperature);

  // Update displayed input values
  seaLevelPressureValue.value = seaLevelPressure.toFixed(2);
  temperatureLapseRateValue.value = (temperatureLapseRate * 1000).toFixed(4); // Display as K/km
  altitudeValue.value = altitude.toFixed(2);
  standardTemperatureValue.value = standardTemperature.toFixed(2);

  // Calculate the pressure using the user's altitude input
  const calculatedPressure = calculatePressure(seaLevelPressure, temperatureLapseRate, altitude, standardTemperature);
  calculatedPressureOutput.textContent = calculatedPressure.toFixed(2);

  // Generate the pressure chart
  generatePressureChart(seaLevelPressure, temperatureLapseRate, standardTemperature);
}

// Add event listeners to input fields
seaLevelPressureInput.addEventListener('input', update);
temperatureLapseRateInput.addEventListener('input', update);
altitudeInput.addEventListener('input', update);
standardTemperatureInput.addEventListener('input', update);

// Initial call to update function
//window.onload = function() {
//  update();
//};
document.addEventListener('DOMContentLoaded', function() {
  update();
});
