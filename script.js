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
  const R = 287.053; // specific gas constant for dry air (J/(kg*K))

  // Adjust temperature lapse rate from °C/km to K/m
  const adjustedTemperatureLapseRate = temperatureLapseRate / 1000;

  // Adjust standard temperature from Celsius to Kelvin
  const standardTemperatureK = standardTemperature + 273.15;

  const altitudeTemperature = standardTemperatureK - adjustedTemperatureLapseRate * altitude * 1000; // Temperature at given altitude (K)
  const pressure = seaLevelPressure * Math.exp((-g * altitude * 1000) / (R * altitudeTemperature));

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
  temperatureLapseRateValue.textContent = (temperatureLapseRate / 1000).toFixed(4); // Display as K/m
  altitudeValue.textContent = altitude.toFixed(2);
  standardTemperatureValue.textContent = standardTemperature.toFixed(2);

  // Calculate the pressure
  const calculatedPressure = calculatePressure(seaLevelPressure, temperatureLapseRate, altitude, standardTemperature);
  calculatedPressureOutput.textContent = calculatedPressure.toFixed(2) + ' hPa';

  // Update the chart
  generatePressureChart(seaLevelPressure, temperatureLapseRate, altitude, standardTemperature);
}

// Add event listeners to input fields
seaLevelPressureInput.addEventListener('input', update);
temperatureLapseRateInput.addEventListener('input', update);
altitudeInput.addEventListener('input', update);
standardTemperatureInput.addEventListener('input', update);

// Initial call to update function
window.onload = function() {
  update();
};
