// Accessing DOM elements
const seaLevelPressureInput = document.getElementById('sea-level-pressure');
const temperatureLapseRateInput = document.getElementById('temperature-lapse-rate');
const altitudeInput = document.getElementById('altitude');
const standardTemperatureInput = document.getElementById('standard-temperature');
const calculatedPressureOutput = document.getElementById('calculated-pressure');

// Set default values for input fields
seaLevelPressureInput.value = '1013.25';
temperatureLapseRateInput.value = '6.5';
altitudeInput.value = '0';
standardTemperatureInput.value = (288.15 - 273.15).toFixed(2); // Convert Kelvin to Celsius and round to 2 decimal places

let sliders = [seaLevelPressureInput, temperatureLapseRateInput, altitudeInput, standardTemperatureInput];

let chartData = {
  labels: [...Array(101).keys()],
  datasets: [{
    label: 'Atmospheric Pressure',
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

let chartConfig = {
  type: 'line',
  data: chartData,
  options: {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Altitude (km)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Pressure (hPa)'
        }
      }
    }
  }
};

// create the chart
let chart = new Chart(document.getElementById('atmosphere-visualization'), chartConfig);

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
  generateAtmosphereVisualization(seaLevelPressure, temperatureLapseRate, standardTemperatureKelvin);
}

// Function to generate the visual representation of the atmosphere
function generateAtmosphereVisualization(seaLevelPressure, temperatureLapseRate, standardTemperatureKelvin) {
  let data = chartData.labels.map(altitude => {
    return seaLevelPressure * Math.exp((-1 * altitude) / (temperatureLapseRate * standardTemperatureKelvin));
  });

  chart.data.datasets[0].data = data;
  chart.update();
}

// Add event listener to the sliders
sliders.forEach(slider => {
  slider.addEventListener('input', calculatePressure);
});

// Generate the atmosphere visualization with default values
calculatePressure();
