let chart;
const seaLevelPressureInput = document.getElementById('sea-level-pressure');
const temperatureLapseRateInput = document.getElementById('temperature-lapse-rate');
const altitudeInput = document.getElementById('altitude');
const standardTemperatureInput = document.getElementById('standard-temperature');

function generatePressureChart() {
  const ctx = document.getElementById('pressure-chart').getContext('2d');
  const data = calculatePressureData();
  if (chart) {
    chart.destroy(); // If chart exists, destroy it before creating a new one
  }
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Air Pressure (hPa)',
        data: data.values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  });
}

function calculatePressureData() {
  const seaLevelPressure = parseFloat(seaLevelPressureInput.value);
  const temperatureLapseRate = parseFloat(temperatureLapseRateInput.value);
  const altitude = parseFloat(altitudeInput.value);
  const standardTemperatureCelsius = parseFloat(standardTemperatureInput.value);

  const standardTemperatureKelvin = standardTemperatureCelsius + 273.15;

  let labels = [];
  let values = [];

  for (let i = 0; i <= altitude; i++) {
    labels.push(i);
    const pressure = seaLevelPressure * Math.exp((-1 * i) / (temperatureLapseRate * standardTemperatureKelvin));
    values.push(pressure.toFixed(2));
  }

  return { labels, values };
}

function updateInputValueDisplay(inputElement, displayElement) {
  displayElement.textContent = `${inputElement.value}`;
}

window.onload = function() {
  generatePressureChart();
  updateInputValueDisplay(seaLevelPressureInput, document.getElementById('sea-level-pressure-value'));
  updateInputValueDisplay(temperatureLapseRateInput, document.getElementById('temperature-lapse-rate-value'));
  updateInputValueDisplay(altitudeInput, document.getElementById('altitude-value'));
  updateInputValueDisplay(standardTemperatureInput, document.getElementById('standard-temperature-value'));
}

seaLevelPressureInput.oninput = function() {
  generatePressureChart();
  updateInputValueDisplay(seaLevelPressureInput, document.getElementById('sea-level-pressure-value'));
};

temperatureLapseRateInput.oninput = function() {
  generatePressureChart();
  updateInputValueDisplay(temperatureLapseRateInput, document.getElementById('temperature-lapse-rate-value'));
};

altitudeInput.oninput = function() {
  generatePressureChart();
  updateInputValueDisplay(altitudeInput, document.getElementById('altitude-value'));
};

standardTemperatureInput.oninput = function() {
  generatePressureChart();
  updateInputValueDisplay(standardTemperatureInput, document.getElementById('standard-temperature-value'));
};
