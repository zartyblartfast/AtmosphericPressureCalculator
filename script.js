// Constants for atmospheric layers (in km)
const tropopauseBoundary = 11;  // end of troposphere
const stratopauseBoundary = 50;  // end of stratosphere
const mesopauseBoundary = 86;  // end of mesosphere

// Lapse rates (in K/km)
const troposphereLapseRate = -6.5;
const stratosphereLapseRate = 0;  // temperature is constant in stratosphere

// Variables for inputs
let seaLevelPressureInput = document.getElementById('sea-level-pressure');
console.log("seaLevelPressureInput: " + seaLevelPressureInput);
let altitudeInput = document.getElementById('altitude');
console.log("altitudeInput: " + altitudeInput);
let standardTemperatureInput = document.getElementById('standard-temperature');
console.log("standardTemperatureInput: " + standardTemperatureInput);

// Variables for displaying input values
let seaLevelPressureValue = document.getElementById('sea-level-pressure-value');
let altitudeValue = document.getElementById('altitude-value');
let standardTemperatureValue = document.getElementById('standard-temperature-value');

// Variable for displaying calculated pressure
let calculatedPressureOutput = document.getElementById('calculated-pressure');

// Constants for pressure calculation
const g = 9.80665; // gravitational acceleration
const M = 0.0289644; // molar mass of dry air
const R = 8.31432; // gas constant for dry air

// Function to calculate pressure
function calculatePressure(seaLevelPressure, altitude, standardTemperature) {
  if (altitude <= tropopauseBoundary) {
    return calculatePressureWithLapseRate(seaLevelPressure, altitude, standardTemperature, troposphereLapseRate);
  } else if (altitude <= stratopauseBoundary) {
    return calculatePressureWithLapseRate(seaLevelPressure, altitude, standardTemperature, stratosphereLapseRate);
  } else {
    return calculatePressureWithLapseRate(seaLevelPressure, altitude, standardTemperature, stratosphereLapseRate);
  }
}

function calculatePressureWithLapseRate(seaLevelPressure, altitude, standardTemperature, lapseRate) {
  const T0_K = standardTemperature + 273.15;
  const T = T0_K + lapseRate * altitude;
  const pressure = seaLevelPressure * Math.pow((T / T0_K), (g * M) / (lapseRate * R));
  return pressure;
}

// Chart.js instance
let chart;

// Function to generate chart
function generatePressureChart(seaLevelPressure, standardTemperature) {
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
  for (let i = 0; i <= mesopauseBoundary; i += 0.1) { // Fixed range to 86 Km
    data.labels.push(i.toFixed(1));
    let pressureAtAltitude = calculatePressure(seaLevelPressure, i, standardTemperature);
    data.datasets[0].data.push(pressureAtAltitude);
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
          max: mesopauseBoundary,
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
  let altitude = parseFloat(altitudeInput.value);
  let standardTemperature = parseFloat(standardTemperatureInput.value);

  // Basic input validation
  if (isNaN(seaLevelPressure) || isNaN(altitude) || isNaN(standardTemperature)) {
    calculatedPressureOutput.textContent = "Invalid input";
    return;
  }

  console.log("Update - Sea Level Pressure: " + seaLevelPressure);
  console.log("Update - Altitude: " + altitude);
  console.log("Update - Standard Temperature: " + standardTemperature);

  // Update displayed input values

  // next line is a valid value
  console.log("Update - again - seaLevelPressureValue: " + seaLevelPressureValue);
  // next line using .toFixed(2) is null
  console.log("Update - again - seaLevelPressureValue.toFixed(2): " + seaLevelPressure.toFixed(2));
  
  seaLevelPressureValue.textContent = seaLevelPressure.toFixed(2);
  altitudeValue.textContent = altitude.toFixed(2);
  standardTemperatureValue.textContent = standardTemperature.toFixed(2);

  // Calculate the pressure using the user's altitude input
  const calculatedPressure = calculatePressure(seaLevelPressure, altitude, standardTemperature);
  calculatedPressureOutput.textContent = calculatedPressure.toFixed(2);
// revert this if necessary but doesn't display the chart
  // Generate the pressure chart
  generatePressureChart(seaLevelPressure, standardTemperature);
}

// Add event listeners to input fields
seaLevelPressureInput.addEventListener('input', update);
altitudeInput.addEventListener('input', update);
standardTemperatureInput.addEventListener('input', update);

// Initial call to update function
//window.onload = function() {
//  update();
//};
document.addEventListener('DOMContentLoaded', function() {
  update();
});
