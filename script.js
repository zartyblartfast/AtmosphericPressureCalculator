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
