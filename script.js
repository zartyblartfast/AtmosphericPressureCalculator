// Variables for inputs
let seaLevelPressureInput = document.getElementById('sea-level-pressure');
let temperatureLapseRateInput = document.getElementById('temperature-lapse-rate');
let altitudeInput = document.getElementById('altitude');
let standardTemperatureInput = document.getElementById('standard-temperature');

// Variables for displaying input values
let seaLevelPressureValue = document.getElementById('sea-level-pressure-value');
let temperatureLapseRateValue = document.getElementById('temperature-lapse-rate-value');
let altitudeValue = document.getElementById('altitude-value');
let standardTemperatureValue = document.getElementById('standard-temperature-value');

// Variable for displaying calculated pressure
let calculatedPressureOutput = document.getElementById('calculated-pressure');

// Function to calculate pressure
function calculatePressure(seaLevelPressure, temperatureLapseRate, altitude, standardTemperature) {
  const g = 9.80665; // gravitational acceleration (m/s^2)
  const M = 0.0289644; // molar mass of Earth's air (kg/mol)
  const R = 8.31447; // universal gas constant (J/(mol*K))

  // Adjust temperature lapse rate from K/m to K/km
  const adjustedTemperatureLapseRate = temperatureLapseRate * 1000;

  // Adjust standard temperature from Celsius to Kelvin
  const standardTemperatureK = standardTemperature + 273.15;

  // Calculate the pressure at the given altitude
  const pressure = seaLevelPressure * Math.pow((1 - ((adjustedTemperatureLapseRate * altitude) / standardTemperatureK)), (g * M / (R * adjustedTemperatureLapseRate)));

  return pressure;
}

// Chart.js instance
let chart;

// Function to generate chart
function generatePressureChart(seaLevelPressure, temperatureLapseRate, altitude, standardTemperature) {
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
  for (let i = 0; i <= altitude; i += 0.1) {
    data.labels.push(i.toFixed(1));
    let pressureAtAltitude = calculatePressure(seaLevelPressure, temperatureLapseRate, i, standardTemperature);
    
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

// Function to update the graph and calculation
function update() {
  // Parse input values
  let seaLevelPressure = parseFloat(seaLevelPressureInput.value);
  let temperatureLapseRate = parseFloat(temperatureLapseRateInput.value);
  let altitude = parseFloat(altitudeInput.value);
  let standardTemperature = parseFloat(standardTemperatureInput.value);

  // Ensure altitude is not zero
  if (altitude === 0) {
    altitude = 0.001;
    altitudeInput.value = altitude.toFixed(3);
  }

  // Update displayed input values
  seaLevelPressureValue.textContent = seaLevelPressure.toFixed(2);
  temperatureLapseRateValue.textContent = (temperatureLapseRate * 1000).toFixed(4); // Display as K/km
  altitudeValue.textContent = altitude.toFixed(2);
  standardTemperatureValue.textContent = standardTemperature.toFixed(2);

  // Calculate the pressure
  const calculatedPressure = calculatePressure(seaLevelPressure, temperatureLapseRate, altitude,


// Add event listeners to input fields
seaLevelPressureInput.addEventListener('input', update);
temperatureLapseRateInput.addEventListener('input', update);
altitudeInput.addEventListener('input', update);
standardTemperatureInput.addEventListener('input', update);

// Initial call to update function
window.onload = function() {
  update();
};
