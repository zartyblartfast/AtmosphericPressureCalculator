// Constants for atmospheric layers (in km)
const tropopauseBoundary = 11;  // end of troposphere
const stratopauseBoundary = 50;  // end of stratosphere
const mesopauseBoundary = 86;  // end of mesosphere

// Lapse rates (in K/km)
const troposphereLapseRate = -6.5;
const stratosphereLapseRate = 0;  // temperature is constant in stratosphere

// Variables for inputs
let seaLevelPressureInput = document.getElementById('sea-level-pressure');
let altitudeInput = document.getElementById('altitude');
let standardTemperatureInput = document.getElementById('standard-temperature');

// Variables for displaying input values
let seaLevelPressureValue = document.getElementById('sea-level-pressure-number');
let altitudeValue = document.getElementById('altitude-number');
let standardTemperatureValue = document.getElementById('standard-temperature-number');

// Variable for displaying calculated pressure
let calculatedPressureOutput = document.getElementById('calculated-pressure');

// Constants for pressure calculation
const g = 9.80665; // gravitational acceleration
const M = 0.0289644; // molar mass of dry air
const R = 8.31432; // gas constant for dry air

// Function to calculate pressure
function calculatePressure(seaLevelPressure, altitude, standardTemperature) {
  const T0_K = standardTemperature + 273.15; // convert to Kelvin
  let T;

  // If we're in the troposphere
  if (altitude <= tropopauseBoundary) {
    T = T0_K + troposphereLapseRate * altitude;
    const pressure = seaLevelPressure * Math.pow((T / T0_K), (g * M) / (R * Math.abs(troposphereLapseRate)));
    console.log(`Troposphere - Altitude: ${altitude}, Temp: ${T}, Pressure: ${pressure}`);
    return pressure;
  } 
  else {
    // Temperature at the tropopause boundary
    const Tb = T0_K + troposphereLapseRate * tropopauseBoundary;
    const pressureAtTropopause = seaLevelPressure * Math.pow((Tb / T0_K), (g * M) / (R * Math.abs(troposphereLapseRate)));

    // For altitude above the tropopause, we calculate pressure assuming the temperature remains constant.
    // This formula corresponds to the barometric formula in isothermal layer.
    const pressure = pressureAtTropopause * Math.exp(-g * M * (altitude - tropopauseBoundary) / (R * Tb));
    console.log(`Above Troposphere - Altitude: ${altitude}, Temp: ${Tb}, Pressure: ${pressure}`);
    return pressure;
  }
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
    console.log(`Generated Data - Altitude: ${i}, Pressure: ${pressureAtAltitude}`);
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

  console.log(`Inputs - Sea level pressure: ${seaLevelPressure}, Altitude: ${altitude}, Standard temperature: ${standardTemperature}`);

  // Basic input validation
  if (isNaN(seaLevelPressure) || isNaN(altitude) || isNaN(standardTemperature)) {
    calculatedPressureOutput.textContent = "Invalid input";
    return;
  }

  // Update displayed input values
  seaLevelPressureValue.value = seaLevelPressure.toFixed(2);
  altitudeValue.value = altitude.toFixed(2);
  standardTemperatureValue.value = standardTemperature.toFixed(2);

  // Calculate the pressure using the user's altitude input
  const calculatedPressure = calculatePressure(seaLevelPressure, altitude, standardTemperature);
  calculatedPressureOutput.textContent = calculatedPressure.toFixed(2);

  // Generate the pressure chart
  generatePressureChart(seaLevelPressure, standardTemperature);
}

// Add event listeners to input fields
seaLevelPressureInput.addEventListener('input', function() {
  seaLevelPressureValue.value = seaLevelPressureInput.value;
  update();
});
altitudeInput.addEventListener('input', function() {
  altitudeValue.value = altitudeInput.value;
  update();
});
standardTemperatureInput.addEventListener('input', function() {
  standardTemperatureValue.value = standardTemperatureInput.value;
  update();
});

// Add event listeners to input number fields
seaLevelPressureValue.addEventListener('input', function() {
  seaLevelPressureInput.value = seaLevelPressureValue.value;
  update();
});
altitudeValue.addEventListener('input', function() {
  altitudeInput.value = altitudeValue.value;
  update();
});
standardTemperatureValue.addEventListener('input', function() {
  standardTemperatureInput.value = standardTemperatureValue.value;
  update();
});

// Initial call to update function
document.addEventListener('DOMContentLoaded', function() {
  update();
});
