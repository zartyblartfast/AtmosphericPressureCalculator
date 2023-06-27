// Constants for temperature lapse rates
const TROPOSPHERE_LAPSE_RATE = -6.5; // in °C/km
const STRATOSPHERE_LAPSE_RATE = 1; // in °C/km
const MESOSPHERE_LAPSE_RATE = -2; // in °C/km
const xMax = 100;

const TLAPSE_BOUNDARY_1 = 11;
const TLAPSE_BOUNDARY_2 = 20;
const TLAPSE_BOUNDARY_3 = 32;
const TLAPSE_BOUNDARY_4 = 47;
const TLAPSE_BOUNDARY_5 = 85;
const TLAPSE_BOUNDARY_6 = xMax;

// Variables for inputs
let seaLevelPressureInput = document.getElementById('sea-level-pressure');
let altitudeInput = document.getElementById('altitude');
let standardTemperatureInput = document.getElementById('standard-temperature');
//let standardTemperatureInput = 15.0 // input element hidden via .css 

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

  // Constants for atmospheric layer boundaries
  const TROPOSPHERE = 11; // in km
  const STRATOSPHERE = 50; // in km
  const MESOSPHERE = 80; // in km
  const THERMOSPHERE = xMax; // in km

  // Data for chart
  let data = {
    labels: [], // This array will be populated with altitude values
    datasets: [{
      label: 'Air Pressure (hPa)',
      data: [], // This array will be populated with pressure values
      fill: false,
      //borderColor: 'rgb(75, 192, 192)',
      borderColor: 'rgb(0, 0, 0)', // Black color
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

    function darkenColor(color, factor) {
      let rgba = color.slice(5, -1).split(', '); // Get the r, g, b, a values
      let r = Math.floor(parseInt(rgba[0]) * factor);
      let g = Math.floor(parseInt(rgba[1]) * factor);
      let b = Math.floor(parseInt(rgba[2]) * factor);
      let a = rgba[3]; // Keep the same alpha value
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    }
    
    function drawRectangle(start, end, color, text) {
      const xStart = x.getPixelForValue(start);
      const xEnd = x.getPixelForValue(end);
      //const yTop = y.getPixelForValue(y.max);
      //const yBottom = y.getPixelForValue(y.min);
      const yTop = y.getPixelForValue(1200);  // your y-axis max value
      const yBottom = y.getPixelForValue(0);  // your y-axis min value

    
      ctx.fillStyle = color;
      ctx.fillRect(xStart, yTop, xEnd - xStart, yBottom - yTop);
    
      // Draw text in the middle of the rectangle
      ctx.save(); // Save the current state
      ctx.fillStyle = darkenColor(color, 0.1); // Darker shade of the rectangle color
      ctx.font = '14px Arial';
      const textWidth = ctx.measureText(text).width;
      const textX = (xStart + xEnd) / 2; // Center the text
      const textY = yTop + (yBottom - yTop) * 0.1 + textWidth / 2; // Shift the text upwards
      ctx.translate(textX, textY);
      ctx.rotate(-Math.PI / 2); // Rotate the canvas
      ctx.fillText(text, -textWidth / 2, 0);
      ctx.restore(); // Restore the state
    }

    // Draw rectangles for the atmospheric layers
    drawRectangle(0, TROPOSPHERE, 'rgba(135, 206, 235, 0.3)', 'Troposphere'); // Troposphere
    drawRectangle(TROPOSPHERE, STRATOSPHERE, 'rgba(75, 0, 130, 0.3)', 'Stratosphere'); // Stratosphere
    drawRectangle(STRATOSPHERE, MESOSPHERE, 'rgba(255, 0, 0, 0.3)', 'Mesosphere'); // Mesosphere
    drawRectangle(MESOSPHERE, THERMOSPHERE, 'rgba(255, 165, 0, 0.3)', 'Thermosphere'); // Thermosphere
  }
};

  
  const drawBoundariesPlugin = {
    id: 'drawBoundaries',
    beforeDraw(chart, args, options) {
      const {ctx, scales} = chart;
      const {x, y} = scales;
  
      // Function to draw a boundary line
      function drawBoundaryLine(start, lapseRate) {
        const xStart = x.getPixelForValue(start);
        //const yTop = y.getPixelForValue(y.max);
        //const yBottom = y.getPixelForValue(y.min);
        const yTop = y.getPixelForValue(1200);  // your y-axis max value
        const yBottom = y.getPixelForValue(0);  // your y-axis min value

      
        if(start !== 0) {
          // Draw the line
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(xStart, yTop);
          ctx.lineTo(xStart, yBottom);
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)'; // Grey color
          ctx.setLineDash([5, 15]); // Set the line to be dashed
          ctx.stroke();
          ctx.restore();
        }
      
        // Draw the label
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Darker grey color
        ctx.font = '8px Arial'; // Smaller font size
        const text = 'T-Lapse-Rate: ' + lapseRate + ' C';
        const textWidth = ctx.measureText(text).width;
        const textX = xStart + 10; // Shift the text rightwards
        const textY = yBottom - 50; // Shift the text closer to the x-axis
        ctx.translate(textX, textY);
        ctx.rotate(-Math.PI / 2); // Rotate the canvas
        ctx.fillText(text, -textWidth / 2, 0);
        ctx.restore();
      }

  
      // Draw boundary lines
      drawBoundaryLine(0, TROPOSPHERE_LAPSE_RATE);
      drawBoundaryLine(11, 0);
      drawBoundaryLine(20, STRATOSPHERE_LAPSE_RATE);
      drawBoundaryLine(32, 0);
      drawBoundaryLine(47, MESOSPHERE_LAPSE_RATE);
      drawBoundaryLine(85, 0);
    }
  };

  const markerPlugin = {
  id: 'marker',
  afterDraw(chart, args, options) {
    const { ctx, scales } = chart;
    const { x, y } = scales;
    
    const altitude = parseFloat(altitudeInput.value);
    const xPosition = x.getPixelForValue(altitude);
    const yPosition = y.getPixelForValue(y.min);  // y-axis min value

    // Draw a marker
    ctx.save();
    ctx.beginPath();
    ctx.arc(xPosition, yPosition + 5, 5, 0, 2 * Math.PI);  // Draw a circle
    ctx.fillStyle = 'black';
    ctx.fill();

    // Draw a line from the marker to the x-axis
    ctx.beginPath();
    ctx.moveTo(xPosition, yPosition + 5);
    ctx.lineTo(xPosition, yPosition);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.restore();
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
            max: xMax,
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
          min: 0,  // minimum y-axis value
          max: 1200,  // maximum y-axis value
          title: {
            display: true,
            text: 'Air Pressure (hPa)'
          },
          beginAtZero: true
        }
      },
    },
     plugins: [drawRectanglesPlugin, drawBoundariesPlugin, markerPlugin]
  });
}

// Function to update pressure output
function updatePressureOutput() {
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
}

// Function to update chart
function updateChart() {
  // Parse input values
  let seaLevelPressure = parseFloat(seaLevelPressureInput.value);
  let standardTemperature = parseFloat(standardTemperatureInput.value);

  // Basic input validation
  if (isNaN(seaLevelPressure) || isNaN(standardTemperature)) {
    return;
  }

  console.log("Sea Level Pressure: " + seaLevelPressure);
  console.log("Standard Temperature: " + standardTemperature);

  // Generate the pressure chart
  generatePressureChart(seaLevelPressure, standardTemperature);
}

// Add event listeners to input fields
seaLevelPressureInput.addEventListener('input', function() {
  updatePressureOutput();
  updateChart();
});
altitudeInput.addEventListener('input', updatePressureOutput);
standardTemperatureInput.addEventListener('input', function() {
  updatePressureOutput();
  updateChart();
});

// Add event listeners to input number fields
seaLevelPressureValue.addEventListener('input', function() {
  seaLevelPressureInput.value = this.value;
  updatePressureOutput();
  updateChart();
});
altitudeValue.addEventListener('input', function() {
  altitudeInput.value = this.value;
  updatePressureOutput();
  updateChart();  // necessary to update the x axis marker on the chart
});
standardTemperatureValue.addEventListener('input', function() {
  standardTemperatureInput.value = this.value;
  updatePressureOutput();
  updateChart();
});

// Initial call to update function
document.addEventListener('DOMContentLoaded', function() {
  updatePressureOutput();
  updateChart();
});
