const container = document.querySelector('.container');
let chartCount = 1; // Initial chart count
let data;

async function fetchData() {
  try {
    const response = await fetch('大肚山植調.csv');
    const csvData = await response.text();
    data = csvToObjects(csvData);

    // Populate the initial dropdown with data
    const initialPlantSelector = document.getElementById('plantSelector');
    initialPlantSelector.id = 'plantSelector1';  // Add ID to the initial dropdown
    initialPlantSelector.addEventListener('change', () => loadData('chart1'));  // Ensure initial dropdown triggers loadData
    populateDropdown(initialPlantSelector);

    // Initialize the chart for the first dropdown
    loadData('chart1');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function addNewChart() {
  const newChartCount = chartCount + 1;
  const newChartContainer = document.createElement('div');
  newChartContainer.classList.add('chart-container');

  const newPlantSelector = document.createElement('select');
  newPlantSelector.id = `plantSelector${newChartCount}`;
  newPlantSelector.addEventListener('change', () => loadData(`chart${newChartCount}`));

  const newResultDiv = document.createElement('div');
  newResultDiv.id = `result${newChartCount}`;

  const newChartDiv = document.createElement('div');
  newChartDiv.id = `chartContainer${newChartCount}`;
  newChartDiv.classList.add('chart');

  newChartContainer.appendChild(createLabel(`選擇植物：`, newPlantSelector));
  newChartContainer.appendChild(newResultDiv);
  newChartContainer.appendChild(newChartDiv);

  container.insertBefore(newChartContainer, container.lastElementChild);

  // Update chart count for the next iteration
  chartCount++;

  // Populate the new dropdown with data
  populateDropdown(newPlantSelector);

  // Initialize the chart for the new dropdown
  loadData(`chart${newChartCount}`);
}

function createLabel(text, target) {
  const label = document.createElement('label');
  label.textContent = text;
  label.appendChild(target);
  return label;
}

function populateDropdown(selector) {
  const uniquePlantNumbers = new Set();

  data.forEach(item => {
    const plantNumber = item['植物編號'];
    const plantName = item['植物名稱'];

    if (plantNumber !== undefined && plantName !== undefined) {
      if (!uniquePlantNumbers.has(plantNumber)) {
        uniquePlantNumbers.add(plantNumber);

        const option = document.createElement('option');
        option.value = plantNumber;
        option.text = `${plantNumber} - ${plantName}`;
        selector.appendChild(option);
      }
    }
  });
}

function loadData(chartId) {
  const selectedPlantNumber = getSelectedPlantNumber(chartId);
  const selectedPlantData = data.filter(item => item['植物編號'] === selectedPlantNumber);

  const chartContainer = document.getElementById(`chartContainer${chartId.charAt(chartId.length - 1)}`);
  chartContainer.innerHTML = '';

  const labels = selectedPlantData.map(item => {
    const date = new Date(item['日期']);
    const formattedDate = formatDate(date);
    const solarTerm = item['節氣'];
    return `${formattedDate} - ${solarTerm}`;
  });
  const leafScores = selectedPlantData.map(item => parseFloat(item['葉子分數']));
  const flowerScores = selectedPlantData.map(item => parseFloat(item['花的分數']));
  const fruitScores = selectedPlantData.map(item => parseFloat(item['果實分數']));

  const canvas = document.createElement('canvas');
  canvas.id = `chart${chartId.charAt(chartId.length - 1)}`;
  chartContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '葉子分數',
          borderColor: 'rgba(75, 192, 192, 1)',
          data: leafScores,
          fill: false,
        },
        {
          label: '花的分數',
          borderColor: 'rgba(255, 99, 132, 1)',
          data: flowerScores,
          fill: false,
        },
        {
          label: '果實分數',
          borderColor: 'rgba(255, 205, 86, 1)',
          data: fruitScores,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          type: 'time',
          position: 'bottom',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'YYYY/MM/DD',
            },
          },
        }],
      },
    },
  });
}

function getSelectedPlantNumber(chartId) {
  const selector = document.getElementById(`plantSelector${chartId.charAt(chartId.length - 1)}`);
  return selector.value;
}

function csvToObjects(csv) {
  csv = csv.replace(/\r\n/g, '\n');

  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j];
    }

    result.push(obj);
  }

  return result;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

// Call fetchData to initialize the existing chart
fetchData();
