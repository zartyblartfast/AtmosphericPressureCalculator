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
}

// Function to generate the visual representation of the atmosphere
function generateAtmosphereVisualization() {
  // Generate the visualization of the atmosphere as a column/line
  // You can implement this visualization using CSS or JavaScript
}

// Function to generate the chart visualization
function generateChartVisualization() {
  // Generate the chart visualization showcasing the relationship between altitude and pressure
  // You can use a library like Chart.js or implement a custom chart using HTML and JavaScript
}

// Call the visualization functions
generateAtmosphereVisualization();
generateChartVisualization();
