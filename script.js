// Variables for inputs
let seaLevelPressureInput = document.getElementById('sea-level-pressure');
let temperatureLapseRateInput = document.getElementById('temperature-lapse-rate');
let altitudeInput = document.getElementById('altitude');
let standardTemperatureInput = document.getElementById('standard-temperature');

// Variables for numerical inputs
let seaLevelPressureNumInput = document.getElementById('sea-level-pressure-number');
let temperatureLapseRateNumInput = document.getElementById('temperature-lapse-rate-number');
let altitudeNumInput = document.getElementById('altitude-number');
let standardTemperatureNumInput = document.getElementById('standard-temperature-number');

// Variable for displaying calculated pressure
let calculatedPressureOutput = document.getElementById('calculated-pressure');

// Function to calculate pressure
function calculatePressure(seaLevelPressure, temperatureLapseRate, altitude, standardTemperature) {
  console.log(`Calculating pressure with: seaLevelPressure=${seaLevelPressure}, temperatureLapseRate=${temperatureLapseRate}, altitude=${altitude}, standardTemperature=${standardTemperature}`);
  
  const g = 9.80665; // gravitational acceleration
  const m = 0.0289644; // molar mass of dry air
  const R = 8.3144598; // universal gas constant
  const adjustedTemperatureLapseRate = temperatureLapseRate * 1000;
  let temperatureAtAltitude = standardTemperature - (adjustedTemperatureLapseRate * altitude);

  console.log(`Temperature at altitude (C): ${temperatureAtAltitude}`);
  
  if (temperatureAtAltitude < -273.15) {
    temperatureAtAltitude = -273.15;
  }
  const temperatureAtAltitudeK = temperatureAtAltitude + 273.15;
  
  console.log(`Temperature at altitude (K): ${temperatureAtAltitudeK}`);

  // New logging for the pressure formula
  const pressureFormula = -(g * m * altitude * 1000) / (R * temperatureAtAltitudeK);
  console.log(`Pressure formula: ${pressureFormula}`);
  
  const pressure = seaLevelPressure * Math.exp(pressureFormula);
  console.log(`Calculated raw pressure: ${pressure}`);
  console.log(`Calculated fixed pressure: ${pressure.toFixed(2)}`);
  
  return pressure;
}

// Chart.js instance
let chart;

// Function to generate chart
function generatePressureChart(seaLevelPressure, temperatureLapseRate, standardTemperature) {
  console.log(`Generating chart with: seaLevelPressure=${seaLevelPressure}, temperatureLapseRate=${temperatureLapseRate}, standardTemperature=${standardTemperature}`);
  
  const ctx = document.getElementById('pressure-chart').getContext('2d');
  let data = {
    labels: [],
    datasets: [{
      label: 'Air Pressure (hPa)',
      data: [],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
  // Change i += 0.1 to i += 1
  for (let i = 0; i <= 100; i += 1) {
    data.labels.push(i.toFixed(1));
    
    console.log(`Chart generation: raw altitude=${i}, fixed altitude=${i.toFixed(2)}`);
    let pressureAtAltitude = calculatePressure(seaLevelPressure, temperatureLapseRate, i, standardTemperature);
    console.log(`Chart generation: pressureAtAltitude=${pressureAtAltitude}`);

    data.datasets[0].data.push(pressureAtAltitude)
  }

  console.log("Chart data: ", data);

  if (chart) {
    chart.destroy();
  }
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
              return Number(value).toFixed(0);
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
  
  console.log("Chart generated.");
}

function update() {
  // Parse input values
  let seaLevelPressure = parseFloat(seaLevelPressureInput.value);
  let temperatureLapseRate = parseFloat(temperatureLapseRateInput.value);
  let altitude = parseFloat(altitudeInput.value);
  let standardTemperature = parseFloat(standardTemperatureInput.value);

  console.log(`Update function called with: seaLevelPressure=${seaLevelPressure}, temperatureLapseRate=${temperatureLapseRate}, altitude=${altitude}, standardTemperature=${standardTemperature}`);

  // Update numerical inputs
  seaLevelPressureNumInput.value = seaLevelPressure.toFixed(2);
  temperatureLapseRateNumInput.value = (temperatureLapseRate * 1000).toFixed(4); // Display as K/km
  altitudeNumInput.value = altitude.toFixed(2);
  standardTemperatureNumInput.value = standardTemperature.toFixed(2);

  console.log(`Update function: raw altitude=${altitude}, fixed altitude=${altitude.toFixed(2)}`);
  
  // Calculate and display pressure
  let calculatedPressure = calculatePressure(seaLevelPressure, temperatureLapseRate, altitude, standardTemperature);
  console.log(`Update function: raw pressure=${calculatedPressure}, fixed pressure=${calculatedPressure.toFixed(2)}`);
  calculatedPressureOutput.innerText = calculatedPressure.toFixed(2);

  console.log(`Update - Parsed input values: seaLevelPressure=${seaLevelPressure}, temperatureLapseRate=${temperatureLapseRate}, altitude=${altitude}, standardTemperature=${standardTemperature}`);
  console.log(`Update - Calculated pressure: ${calculatedPressure}`);
  console.log(`Update - calculatedPressureOutput: ${calculatedPressureOutput.innerText}`);
  
  // Generate chart
  generatePressureChart(seaLevelPressure, temperatureLapseRate, standardTemperature);
}

function updateFromNumInput() {
  // Parse input values
  let seaLevelPressure = parseFloat(seaLevelPressureNumInput.value);
  let temperatureLapseRate = parseFloat(temperatureLapseRateNumInput.value) / 1000; // Convert from K/km to K/m
  let altitude = parseFloat(altitudeNumInput.value);
  let standardTemperature = parseFloat(standardTemperatureNumInput.value);

  console.log(`updateFromNumInput function called with: seaLevelPressure=${seaLevelPressure}, temperatureLapseRate=${temperatureLapseRate}, altitude=${altitude}, standardTemperature=${standardTemperature}`);

  // Update range inputs
  seaLevelPressureInput.value = seaLevelPressure;
  temperatureLapseRateInput.value = temperatureLapseRate;
  altitudeInput.value = altitude;
  standardTemperatureInput.value = standardTemperature;

  // Calculate and display pressure
  let calculatedPressure = calculatePressure(seaLevelPressure, temperatureLapseRate, altitude, standardTemperature);
  calculatedPressureOutput.innerText = calculatedPressure.toFixed(2);

  console.log(`updateFromNumInput - Parsed input values: seaLevelPressure=${seaLevelPressure}, temperatureLapseRate=${temperatureLapseRate}, altitude=${altitude}, standardTemperature=${standardTemperature}`);
  console.log(`updateFromNumInput - Calculated pressure: ${calculatedPressure}`);
  console.log(`updateFromNumInput - calculatedPressureOutput: ${calculatedPressureOutput.innerText}`);
  // Generate chart
  generatePressureChart(seaLevelPressure, temperatureLapseRate, standardTemperature);
}

// Event listeners for input changes
seaLevelPressureInput.addEventListener('input', update);
temperatureLapseRateInput.addEventListener('input', update);
altitudeInput.addEventListener('input', update);
standardTemperatureInput.addEventListener('input', update);

seaLevelPressureNumInput.addEventListener('input', updateFromNumInput);
temperatureLapseRateNumInput.addEventListener('input', updateFromNumInput);
altitudeNumInput.addEventListener('input', updateFromNumInput);
standardTemperatureNumInput.addEventListener('input', updateFromNumInput);

console.log("Event listeners added.");

// Initial update
console.log("Initial update call.");
update();
