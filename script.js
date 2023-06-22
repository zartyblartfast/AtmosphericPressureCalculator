// Accessing DOM elements
const seaLevelPressureInput = document.getElementById('sea-level-pressure');
const temperatureLapseRateInput = document.getElementById('temperature-lapse-rate');
const altitudeInput = document.getElementById('altitude');
const standardTemperatureInput = document.getElementById('standard-temperature');
const calculateBtn = document.getElementById('calculate-btn');
const calculatedPressureOutput = document.getElementById('calculated-pressure');

// Set default values for input fields
seaLevelPressureInput.value = '1013.25';
temperatureLapseRateInput.value = '6.5';
altitudeInput.value = '0';
standardTemperatureInput.value = (288.15 - 273.15).toFixed(2); // Convert Kelvin to Celsius and round to 2 decimal places


// Event listener for calculate button
calculateBtn.addEventListener('click', calculatePressure);

// Function to calculate atmospheric pressure
function calculatePressure() {
  // Retrieve user inputs or use default values
  const seaLevelPressure = parseFloat(seaLevelPressureInput.value) || 1013.25;
  const temperatureLapseRate = parseFloat(temperatureLapseRateInput.value) || 6.5;
  const altitude = parseFloat(altitudeInput.value) || 0;
  const standardTemperatureCelsius = parseFloat(standardTemperatureInput.value) || (288.15 - 273.15).toFixed(2);

  // Convert Celsius temperature to Kelvin
  const standardTemperatureKelvin = standardTemperatureCelsius + 273.15;

  // Calculate pressure using the provided formula
  const calculatedPressure = seaLevelPressure * Math.exp((-1 * altitude) / (temperatureLapseRate * standardTemperatureKelvin));

  // Update the calculated pressure output
  calculatedPressureOutput.textContent = calculatedPressure.toFixed(2) + ' hPa';

  // Generate the atmosphere visualization
  generateAtmosphereVisualization(calculatedPressure);
}


// Function to generate the visual representation of the atmosphere
function generateAtmosphereVisualization(calculatedPressure) {
  const ctx = document.getElementById('atmosphere-visualization').getContext('2d');

  // Create the bar chart
  const atmosphereChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Sea Level', 'Altitude'],
      datasets: [{
        label: 'Atmospheric Pressure',
        data: [seaLevelPressureInput.value, calculatedPressure],
        backgroundColor: [
          'rgba(0, 123, 255, 0.8)', // Blue color for sea level
          'rgba(255, 0, 0, 0.8)'     // Red color for altitude
        ],
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 100,
            callback: function (value) {
              return value + ' hPa';
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Function to calculate atmospheric pressure
function calculatePressure() {
  // Retrieve user inputs
  const seaLevelPressure = parseFloat(seaLevelPressureInput.value);
  const temperatureLapseRate = parseFloat(temperatureLapseRateInput.value);
  const altitude = parseFloat(altitudeInput.value);
  const standardTemperatureCelsius = parseFloat(standardTemperatureInput.value);

  // Convert Celsius temperature to Kelvin
  const standardTemperatureKelvin = standardTemperatureCelsius + 273.15;

  // Calculate pressure using the provided formula
  const calculatedPressure = seaLevelPressure * Math.exp((-1 * altitude) / (temperatureLapseRate * standardTemperatureKelvin));

  // Update the calculated pressure output
  calculatedPressureOutput.textContent = calculatedPressure.toFixed(2) + ' hPa';

  // Generate the atmosphere visualization
  generateAtmosphereVisualization(calculatedPressure);


// Call the visualization functions
generateAtmosphereVisualization();
generateChartVisualization();
