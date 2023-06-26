// Atmospheric Pressure Calculator
// Constants for temperature lapse rates
const TROPOSPHERE_LAPSE_RATE = -6.5; // in °C/km
const STRATOSPHERE_LAPSE_RATE = 1; // in °C/km
const MESOSPHERE_LAPSE_RATE = -2; // in °C/km

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

// Function to calculate pressure
function calculatePressure(seaLevelPressure, altitude, standardTemperature) {
  const g = 9.80665; // gravitational acceleration
  const m = 0.0289644; // molar mass of dry air
  const R = 8.3144598; // universal gas constant

  let temperatureLapseRate;
  if (altitude <= 11) {
    temperatureLapseRate = TROPOSPHERE_LAPSE_RATE;
  } else if (altitude <= 20) {
    temperatureLapseRate = 0;
  } else if (altitude <= 32) {
    temperatureLapseRate = STRATOSPHERE_LAPSE_RATE;
  } else if (altitude <= 47) {
    temperatureLapseRate = 0;
  } else if (altitude <= 85) {
    temperatureLapseRate = MESOSPHERE_LAPSE_RATE;
  } else {
    temperatureLapseRate = 0;
  }

  // Calculate the temperature at the given altitude
  let temperatureAtAltitude = standardTemperature - (temperatureLapseRate * altitude);

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

function generatePressureChart(seaLevelPressure, standardTemperature) {
  const ctx = document.getElementById('pressure-chart').getContext('2d');

  // Constants for the atmospheric layers in km
  const TROPOSPHERE = 11;
  const STRATOSPHERE = 32;
  const MESOSPHERE = 47;
  const THERMOSPHERE = 85;

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
    let pressureAtAltitude = calculatePressure(seaLevelPressure, i, standardTemperature);

    data.datasets[0].data.push(pressureAtAltitude);

    // Log the altitude and corresponding pressure
    console.log(`Altitude: ${i.toFixed(1)}, Pressure: ${pressureAtAltitude}`);
  }

  // If chart exists, destroy it before creating a new one
  if (chart) {
    chart.destroy();
  }

  console.log(data)

// Chart.js plugin for drawing rectangles
const drawRectanglesPlugin = {
  id: 'drawRectangles',
  beforeDraw(chart, args, options) {
    const {ctx, scales} = chart;
    const {x, y} = scales;
    const xMax = x.max;

    function drawRectangle(start, end, color, text) {
      const xStart = x.getPixelForValue(start);
      const xEnd = x.getPixelForValue(end);
      const yTop = y.getPixelForValue(y.max);
      const yBottom = y.getPixelForValue(y.min);
    
      ctx.fillStyle = color;
      ctx.fillRect(xStart, yTop, xEnd - xStart, yBottom - yTop);
    
      // Draw text in the middle of the rectangle
      ctx.save(); // Save the current state
      ctx.fillStyle = 'rgba(128, 128, 128, 0.7)'; // Grey color
      ctx.font = '14px Arial';
      const textWidth = ctx.measureText(text).width;
      const textX = (xStart + xEnd) / 2; // Center the text
      const textY = (yTop + yBottom) / 2 + textWidth / 2; // Center the text
      ctx.translate(textX, textY);
      ctx.rotate(-Math.PI / 2); // Rotate the canvas
      ctx.fillText(text, -textWidth / 2, 0);
      ctx.restore(); // Restore the state
    }

    // Draw rectangles for the atmospheric layers
    drawRectangle(0, TROPOSPHERE, 'rgba(0, 0, 255, 0.1)', 'troposphere'); // Troposphere
    drawRectangle(TROPOSPHERE, STRATOSPHERE, 'rgba(0, 255, 0, 0.1)', 'stratosphere'); // Stratosphere
    drawRectangle(STRATOSPHERE, MESOSPHERE, 'rgba(255, 255, 0, 0.1)', 'mesosphere'); // Mesosphere
    drawRectangle(MESOSPHERE, THERMOSPHERE, 'rgba(255, 0, 0, 0.1)', 'thermosphere'); // Thermosphere
  }
};

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
      },
      plugins: {
        drawRectangles: {} // Enable the drawRectangles plugin
      }
    },
    plugins: [drawRectanglesPlugin]
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

  console.log("Sea Level Pressure: " + seaLevelPressure);
  console.log("Altitude: " + altitude);
  console.log("Standard Temperature: " + standardTemperature);

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
seaLevelPressureInput.addEventListener('input', update);
altitudeInput.addEventListener('input', update);
standardTemperatureInput.addEventListener('input', update);

// Add event listeners to input number fields
seaLevelPressureValue.addEventListener('input', function() {
  seaLevelPressureInput.value = this.value;
  update();
});
altitudeValue.addEventListener('input', function() {
  altitudeInput.value = this.value;
  update();
});
standardTemperatureValue.addEventListener('input', function() {
  standardTemperatureInput.value = this.value;
  update();
});

// Initial call to update function
document.addEventListener('DOMContentLoaded', function() {
  update();
});
