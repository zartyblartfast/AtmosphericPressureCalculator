// Accessing DOM elements
const seaLevelPressureInput = document.getElementById('sea-level-pressure');
const temperatureLapseRateInput = document.getElementById('temperature-lapse-rate');
const altitudeInput = document.getElementById('altitude');
const standardTemperatureInput = document.getElementById('standard-temperature');
const calculatedPressureOutput = document.getElementById('calculated-pressure');

// Slider value display elements
const seaLevelPressureValue = document.getElementById('sea-level-pressure-value');
const temperatureLapseRateValue = document.getElementById('temperature-lapse-rate-value');
const altitudeValue = document.getElementById('altitude-value');
const standardTemperatureValue = document.getElementById('standard-temperature-value');

// Set default values for input fields
seaLevelPressureInput.value = '1013.25';
temperatureLapseRateInput.value =
