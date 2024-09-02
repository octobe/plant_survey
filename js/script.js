const container = document.querySelector('.chartblock');
let chartCount = 0;
let data;
let lineColors = {
  '葉子分數': document.getElementById('leafColor').value,
  '花的分數': document.getElementById('flowerColor').value,
  '果實分數': document.getElementById('fruitColor').value,
};

const JSON_URL = 'https://script.google.com/macros/s/AKfycbxBn52Yp7zXOpR90bFEUWbG7hFdxgG13VqihU1GLPdbJji8t4YGjM7oB_LZB9-tSMaDuQ/exec';

// 確保僅呼叫 fetchData 一次
async function fetchData() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator.style.display = 'block'; // 顯示加載指示器

  try {
    const response = await fetch(JSON_URL);
    data = await response.json();
    console.log(data);
    addNewChart();
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loadingIndicator.style.display = 'none'; // 隱藏加載指示器
  }
}


// 儲存已計算的唯一年份以避免重複計算
let uniqueYearsCache;

function getUniqueYears() {
  if (uniqueYearsCache) return uniqueYearsCache;

  const uniqueYears = new Set();
  data.forEach(item => {
    const date = new Date(item['日期']);
    if (!isNaN(date.getFullYear())) {
      uniqueYears.add(date.getFullYear());
    }
  });
  
  uniqueYearsCache = Array.from(uniqueYears);
  return uniqueYearsCache;
}

// 儲存已創建的下拉選單以避免重複生成
let dropdownCache = {};

function populateDropdown(selector) {
  if (dropdownCache[selector.id]) {
    const options = dropdownCache[selector.id];
    options.forEach(option => selector.appendChild(option.cloneNode(true)));
    return;
  }

  const uniquePlantNumbers = new Set();
  const options = [];
  
  data.forEach(item => {
    const plantNumber = item['植物編號'];
    const plantName = item['植物名稱'];

    if (plantNumber && plantName && !uniquePlantNumbers.has(plantNumber)) {
      uniquePlantNumbers.add(plantNumber);

      const option = document.createElement('option');
      option.value = plantNumber;
      option.text = `${plantNumber} - ${plantName}`;
      options.push(option);
    }
  });
  
  dropdownCache[selector.id] = options;
  options.forEach(option => selector.appendChild(option));
}

function addNewChart() {
  const newChartCount = chartCount + 1;

  // 建立所有 DOM 元素並一次性加入到容器中
  const newChartContainer = document.createElement('div');
  newChartContainer.classList.add('chart-container');

  const newPlantSelector = document.createElement('select');
  newPlantSelector.id = `plantSelector${newChartCount}`;
  newPlantSelector.addEventListener('change', () => loadData(newChartCount));
  populateDropdown(newPlantSelector);

  const newYearSelector = document.createElement('select');
  newYearSelector.id = `yearSelector${newChartCount}`;
  newYearSelector.addEventListener('change', () => loadData(newChartCount));
  populateYearDropdown(newYearSelector, getUniqueYears());

  const newResultDiv = document.createElement('div');
  newResultDiv.id = `result${newChartCount}`;

  const newChartDiv = document.createElement('div');
  newChartDiv.id = `chartContainer${newChartCount}`;
  newChartDiv.classList.add('chart', 'resizable');

  // 批量加入 DOM 元素
  newChartContainer.append(createLabel('選擇植物：', newPlantSelector));
  newChartContainer.append(createLabel('選擇年份：', newYearSelector));
  newChartContainer.append(newResultDiv);
  newChartContainer.append(newChartDiv);

  container.insertBefore(newChartContainer, container.lastElementChild);

  chartCount++;
  loadData(newChartCount);
}

function createLabel(text, target) {
  const label = document.createElement('label');
  label.textContent = text;
  label.appendChild(target);
  return label;
}

function populateYearDropdown(selector, years) {
  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.text = year.toString();
    selector.appendChild(option);
  });
}

function loadData(chartNumber) {
  const selectedPlantNumber = getSelectedPlantNumber(chartNumber);
  const selectedYear = getSelectedYear(chartNumber);
  const selectedPlantData = data.filter(item => item['植物編號'] === selectedPlantNumber);

  const startDate = new Date(selectedYear, 0, 1);
  const endDate = new Date(selectedYear, 11, 31);
  const allDates = getDates(startDate, endDate);

  const chartContainer = document.getElementById(`chartContainer${chartNumber}`);
  chartContainer.innerHTML = '';

  // 使用映射表提高數據查找速度
  const dateMap = new Map(allDates.map(date => [date.toDateString(), date]));
  const labels = allDates.map(date => {
    const formattedDate = formatDate(date);
    const correspondingData = findCorrespondingData(date);
    const xAxisLabel = `${formattedDate}\n${correspondingData.節氣}\n${correspondingData.候別}`;
    return (xAxisLabel.length === 12) ? null : xAxisLabel;
  });

  const leafScores = new Array(allDates.length).fill(null);
  const flowerScores = new Array(allDates.length).fill(null);
  const fruitScores = new Array(allDates.length).fill(null);

  selectedPlantData.forEach(item => {
    const date = new Date(item['日期']).toDateString();
    if (dateMap.has(date)) {
      const index = allDates.findIndex(d => d.toDateString() === date);
      leafScores[index] = parseFloat(item['葉子分數']);
      flowerScores[index] = parseFloat(item['花的分數']);
      fruitScores[index] = parseFloat(item['果實分數']);
    }
  });

  const canvas = document.createElement('canvas');
  canvas.id = `chart${chartNumber}`;
  chartContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '葉子分數',
          borderColor: lineColors['葉子分數'],
          data: leafScores,
          fill: false,
          spanGaps: true,
        },
        {
          label: '花的分數',
          borderColor: lineColors['花的分數'],
          data: flowerScores,
          fill: false,
          spanGaps: true,
        },
        {
          label: '果實分數',
          borderColor: lineColors['果實分數'],
          data: fruitScores,
          fill: false,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { 
        x: {
          ticks: {
            font: {
              weight: 'bold',
              size: 14
            }
          }
        },           
        y: {
          max: 3,
          min: 0,
          ticks: {
            stepSize: 0.5,
            autoSkip: false,
            font: {
              weight: 'bold',
              size: 14
            }
          },
        },
      },
      plugins: {
        legend: {
            labels: {
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        }
      }
    },
  });

  // 優化 resizable 初始化
  if ($('.resizable').length) {
    $('.resizable').resizable({
      handles: "se", 
      minWidth: 200, 
      minHeight: 200
    });
  }
}

function changeLineColor(datasetLabel, color) {
  lineColors[datasetLabel] = color;
  // 僅重新加載受影響的圖表
  for (let i = 1; i <= chartCount; i++) {
    if (document.getElementById(`chartContainer${i}`)) {
      loadData(i);
    }
  }
}

function findCorrespondingData(date) {
  const dateString = date.toDateString();
  const correspondingData = data.find(item => new Date(item['日期']).toDateString() === dateString) || { 節氣: '', 候別: '' };
  return {
    節氣: correspondingData['節氣'],
    候別: correspondingData['候別'],
  };
}

function getDates(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function getSelectedPlantNumber(chartNumber) {
  const selector = document.getElementById(`plantSelector${chartNumber}`);
  return selector.value;
}

function getSelectedYear(chartNumber) {
  const selector = document.getElementById(`yearSelector${chartNumber}`);
  return parseInt(selector.value);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function toggleChartDisplay() {
  const chartBlock = document.querySelector('.chartblock');
  const button = document.querySelector('.config.display button');
  
  chartBlock.classList.toggle('dual-display');
  
  button.textContent = chartBlock.classList.contains('dual-display') ? '單排顯示' : '併排顯示';
}

fetchData();
