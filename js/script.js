// const container = document.querySelector('.chartblock');
// let chartCount = 0;
// let data;
// let lineColors = {
//   '葉子分數': document.getElementById('leafColor').value,
//   '花的分數': document.getElementById('flowerColor').value,
//   '果實分數': document.getElementById('fruitColor').value,
// };

// const JSON_URL = 'https://script.google.com/macros/s/AKfycbxBn52Yp7zXOpR90bFEUWbG7hFdxgG13VqihU1GLPdbJji8t4YGjM7oB_LZB9-tSMaDuQ/exec';
// // const JSON_URL ='https://script.google.com/macros/s/AKfycbwEo_uKmt_F7b3fgRIgBxWcS8sAe-Z3xV3YFT1wOX2190okGDw75cQ5gtQ9nqc6YaQ/exec';
// // const JSON_URL ='https://script.google.com/macros/s/AKfycbwhahiVqelC01jjKXEueu3JvbNBZUaF7VlBxsDWi1ekzCciYwbAtLwJkq-ny_aWJV85Zw/exec';

// // 確保僅呼叫 fetchData 一次
// async function fetchData() {
//   const loadingIndicator = document.getElementById('loadingIndicator');
//   loadingIndicator.style.display = 'block'; // 顯示加載指示器

//   try {
//     const response = await fetch(JSON_URL);
//     data = await response.json();
//     console.log(data);
//     addNewChart();
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   } finally {
//     loadingIndicator.style.display = 'none'; // 隱藏加載指示器
//   }
// }


// // 儲存已計算的唯一年份以避免重複計算
// let uniqueYearsCache;

// function getUniqueYears() {
//   if (uniqueYearsCache) return uniqueYearsCache;

//   const uniqueYears = new Set();
//   data.forEach(item => {
//     const date = new Date(item['日期']);
//     if (!isNaN(date.getFullYear())) {
//       uniqueYears.add(date.getFullYear());
//     }
//   });
  
//   uniqueYearsCache = Array.from(uniqueYears);
//   return uniqueYearsCache;
// }

// // 儲存已創建的下拉選單以避免重複生成
// let dropdownCache = {};

// function populateDropdown(selector) {
//   if (dropdownCache[selector.id]) {
//     const options = dropdownCache[selector.id];
//     options.forEach(option => selector.appendChild(option.cloneNode(true)));
//     return;
//   }

//   const uniquePlantNumbers = new Set();
//   const options = [];
  
//   data.forEach(item => {
//     const plantNumber = item['植物編號'];
//     const plantName = item['植物名稱'];

//     if (plantNumber && plantName && !uniquePlantNumbers.has(plantNumber)) {
//       uniquePlantNumbers.add(plantNumber);

//       const option = document.createElement('option');
//       option.value = plantNumber;
//       option.text = `${plantNumber} - ${plantName}`;
//       options.push(option);
//     }
//   });
  
//   dropdownCache[selector.id] = options;
//   options.forEach(option => selector.appendChild(option));
// }

// function addNewChart() {
//   const newChartCount = chartCount + 1;

//   // 建立所有 DOM 元素並一次性加入到容器中
//   const newChartContainer = document.createElement('div');
//   newChartContainer.classList.add('chart-container');

//   const newPlantSelector = document.createElement('select');
//   newPlantSelector.id = `plantSelector${newChartCount}`;
//   newPlantSelector.addEventListener('change', () => loadData(newChartCount));
//   populateDropdown(newPlantSelector);

//   const newYearSelector = document.createElement('select');
//   newYearSelector.id = `yearSelector${newChartCount}`;
//   newYearSelector.addEventListener('change', () => loadData(newChartCount));
//   populateYearDropdown(newYearSelector, getUniqueYears());

//   const newResultDiv = document.createElement('div');
//   newResultDiv.id = `result${newChartCount}`;

//   const newChartDiv = document.createElement('div');
//   newChartDiv.id = `chartContainer${newChartCount}`;
//   newChartDiv.classList.add('chart', 'resizable');

//   // 批量加入 DOM 元素
//   newChartContainer.append(createLabel('選擇植物：', newPlantSelector));
//   newChartContainer.append(createLabel('選擇年份：', newYearSelector));
//   newChartContainer.append(newResultDiv);
//   newChartContainer.append(newChartDiv);

//   container.insertBefore(newChartContainer, container.lastElementChild);

//   chartCount++;
//   loadData(newChartCount);
// }

// function createLabel(text, target) {
//   const label = document.createElement('label');
//   label.textContent = text;
//   label.appendChild(target);
//   return label;
// }

// function populateYearDropdown(selector, years) {
//   years.forEach(year => {
//     const option = document.createElement('option');
//     option.value = year;
//     option.text = year.toString();
//     selector.appendChild(option);
//   });
// }

// function loadData(chartNumber) {
//   const selectedPlantNumber = getSelectedPlantNumber(chartNumber);
//   const selectedYear = getSelectedYear(chartNumber);
//   const selectedPlantData = data.filter(item => item['植物編號'] === selectedPlantNumber);

//   const startDate = new Date(selectedYear, 0, 1);
//   const endDate = new Date(selectedYear, 11, 31);
//   const allDates = getDates(startDate, endDate);

//   const chartContainer = document.getElementById(`chartContainer${chartNumber}`);
//   chartContainer.innerHTML = '';

//   // 使用映射表提高數據查找速度
//   const dateMap = new Map(allDates.map(date => [date.toDateString(), date]));
//   const labels = allDates.map(date => {
//     const formattedDate = formatDate(date);
//     const correspondingData = findCorrespondingData(date);
//     const xAxisLabel = `${formattedDate}\n${correspondingData.節氣}\n${correspondingData.候別}`;
//     return (xAxisLabel.length === 12) ? null : xAxisLabel;
//   });

//   const leafScores = new Array(allDates.length).fill(null);
//   const flowerScores = new Array(allDates.length).fill(null);
//   const fruitScores = new Array(allDates.length).fill(null);

//   selectedPlantData.forEach(item => {
//     const date = new Date(item['日期']).toDateString();
//     if (dateMap.has(date)) {
//       const index = allDates.findIndex(d => d.toDateString() === date);
//       leafScores[index] = parseFloat(item['葉子分數']);
//       flowerScores[index] = parseFloat(item['花的分數']);
//       fruitScores[index] = parseFloat(item['果實分數']);
//     }
//   });

//   const canvas = document.createElement('canvas');
//   canvas.id = `chart${chartNumber}`;
//   chartContainer.appendChild(canvas);

//   const ctx = canvas.getContext('2d');
//   new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           label: '葉子分數',
//           borderColor: lineColors['葉子分數'],
//           data: leafScores,
//           fill: false,
//           spanGaps: true,
//         },
//         {
//           label: '花的分數',
//           borderColor: lineColors['花的分數'],
//           data: flowerScores,
//           fill: false,
//           spanGaps: true,
//         },
//         {
//           label: '果實分數',
//           borderColor: lineColors['果實分數'],
//           data: fruitScores,
//           fill: false,
//           spanGaps: true,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       scales: { 
//         x: {
//           ticks: {
//             font: {
//               weight: 'bold',
//               size: 14
//             }
//           }
//         },           
//         y: {
//           max: 3,
//           min: 0,
//           ticks: {
//             stepSize: 0.5,
//             autoSkip: false,
//             font: {
//               weight: 'bold',
//               size: 14
//             }
//           },
//         },
//       },
//       plugins: {
//         legend: {
//             labels: {
//                 font: {
//                     size: 16,
//                     weight: 'bold'
//                 }
//             }
//         }
//       }
//     },
//   });

//   // 優化 resizable 初始化
//   if ($('.resizable').length) {
//     $('.resizable').resizable({
//       handles: "se", 
//       minWidth: 200, 
//       minHeight: 200
//     });
//   }
// }

// function changeLineColor(datasetLabel, color) {
//   lineColors[datasetLabel] = color;
//   // 僅重新加載受影響的圖表
//   for (let i = 1; i <= chartCount; i++) {
//     if (document.getElementById(`chartContainer${i}`)) {
//       loadData(i);
//     }
//   }
// }

// function findCorrespondingData(date) {
//   const dateString = date.toDateString();
//   const correspondingData = data.find(item => new Date(item['日期']).toDateString() === dateString) || { 節氣: '', 候別: '' };
//   return {
//     節氣: correspondingData['節氣'],
//     候別: correspondingData['候別'],
//   };
// }

// function getDates(startDate, endDate) {
//   const dates = [];
//   let currentDate = new Date(startDate);

//   while (currentDate <= endDate) {
//     dates.push(new Date(currentDate));
//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   return dates;
// }

// function getSelectedPlantNumber(chartNumber) {
//   const selector = document.getElementById(`plantSelector${chartNumber}`);
//   return selector.value;
// }

// function getSelectedYear(chartNumber) {
//   const selector = document.getElementById(`yearSelector${chartNumber}`);
//   return parseInt(selector.value);
// }

// function formatDate(date) {
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   return `${year}/${month}/${day}`;
// }

// function toggleChartDisplay() {
//   const chartBlock = document.querySelector('.chartblock');
//   const button = document.querySelector('.config.display button');
  
//   chartBlock.classList.toggle('dual-display');
  
//   button.textContent = chartBlock.classList.contains('dual-display') ? '單排顯示' : '併排顯示';
// }

// fetchData();

const container = document.querySelector('.chartblock');
let chartCount = 0;
let data;
let lineColors = {
  '葉子分數': document.getElementById('leafColor').value,
  '花的分數': document.getElementById('flowerColor').value,
  '果實分數': document.getElementById('fruitColor').value,
};

const URLs = {
  '大肚山': 'https://script.google.com/macros/s/AKfycbxBn52Yp7zXOpR90bFEUWbG7hFdxgG13VqihU1GLPdbJji8t4YGjM7oB_LZB9-tSMaDuQ/exec',
  '大坑': 'https://script.google.com/macros/s/AKfycbwEo_uKmt_F7b3fgRIgBxWcS8sAe-Z3xV3YFT1wOX2190okGDw75cQ5gtQ9nqc6YaQ/exec',
  '石牌親水步道': 'https://script.google.com/macros/s/AKfycbwhahiVqelC01jjKXEueu3JvbNBZUaF7VlBxsDWi1ekzCciYwbAtLwJkq-ny_aWJV85Zw/exec',
  '北坑溪步道':'https://script.google.com/macros/s/AKfycbzMU3qALcjJ5frfVv2M--aXkFOTP2sgROxjciESIoZaF7YI18N_UclRBeaYYJCCfyqh/exec',
  '臺中都會公園':'https://script.google.com/macros/s/AKfycby_7K5bHYYzYMlF8FOC_NVIsFIx84EfAwYFX6ls4Habdy0LDoHYx67E6EIi6UyDej8lzA/exec'
};

async function fetchAndCombineData() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator.style.display = 'block'; // 顯示加載指示器

  try {
    const fetchPromises = Object.entries(URLs).map(async ([region, url]) => {
      const response = await fetch(url);
      const data = await response.json();
      return data.map(item => ({ ...item, 地區: region }));
    });

    const results = await Promise.all(fetchPromises);
    const combinedData = results.flat();

    console.log(combinedData);
    data = combinedData; // 更新全局 data 變數

    // 如果需要初始化圖表，可以在這裡呼叫 addNewChart()
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

function populateRegionDropdown(selector) {
  Object.keys(URLs).forEach(region => {
    const option = document.createElement('option');
    option.value = region;
    option.text = region;
    selector.appendChild(option);
  });
}

function addNewChart() {
  const newChartCount = chartCount + 1;

  // 建立所有 DOM 元素並一次性加入到容器中
  const newChartContainer = document.createElement('div');
  newChartContainer.classList.add('chart-container');

  const newRegionSelector = document.createElement('select');
  newRegionSelector.id = `regionSelector${newChartCount}`;
  newRegionSelector.addEventListener('change', () => loadData(newChartCount));
  populateRegionDropdown(newRegionSelector);
  
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
  newChartContainer.append(createLabel('選擇地區：', newRegionSelector));
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

function updatePlantDropdown(chartNumber, filteredData) {
  const plantSelector = document.getElementById(`plantSelector${chartNumber}`);
  const selectedPlantNumber = plantSelector.value; // 保留當前選擇的植物編號
  plantSelector.innerHTML = ''; // 清空現有選項

  const uniquePlantNumbers = new Set();
  const options = [];

  filteredData.forEach(item => {
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

  options.forEach(option => plantSelector.appendChild(option));
  plantSelector.value = selectedPlantNumber; // 恢復選擇的植物編號
}

function updateYearDropdown(chartNumber, filteredData) {
  const yearSelector = document.getElementById(`yearSelector${chartNumber}`);
  const selectedYear = yearSelector.value; // 保留當前選擇的年份
  yearSelector.innerHTML = ''; // 清空現有選項

  const uniqueYears = new Set();
  filteredData.forEach(item => {
    const date = new Date(item['日期']);
    if (!isNaN(date.getFullYear())) {
      uniqueYears.add(date.getFullYear());
    }
  });

  uniqueYears.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.text = year.toString();
    yearSelector.appendChild(option);
  });
  yearSelector.value = selectedYear; // 恢復選擇的年份
}



function loadData(chartNumber) {
  const selectedPlantNumber = getSelectedPlantNumber(chartNumber);
  const selectedYear = getSelectedYear(chartNumber);
  const selectedRegion = getSelectedRegion(chartNumber);

  // 过滤出所选地区的数据
  const filteredByRegion = data.filter(item => item['地區'] === selectedRegion);

  // 更新“选择植物”选项
  updatePlantDropdown(chartNumber, filteredByRegion);

  // 更新“选择年份”选项
  updateYearDropdown(chartNumber, filteredByRegion);

  // 重新获取更新后的选择
  const updatedSelectedPlantNumber = getSelectedPlantNumber(chartNumber);
  const updatedSelectedYear = getSelectedYear(chartNumber);

  // 过滤出所选植物的数据
  const filteredByPlant = filteredByRegion.filter(item => item['植物編號'] === updatedSelectedPlantNumber);

  // 根据所选年份进一步过滤数据
  const startDate = new Date(updatedSelectedYear, 0, 1);
  const endDate = new Date(updatedSelectedYear, 11, 31);
  const allDates = getDates(startDate, endDate);

  // 清空图表容器
  const chartContainer = document.getElementById(`chartContainer${chartNumber}`);
  chartContainer.innerHTML = '';

  // 使用映射表提高数据查找速度
  const dateMap = new Map(allDates.map(date => [date.toDateString(), date]));

  // 更新 `findCorrespondingData` 函数以接受 `filteredByPlant` 数据作为参数
  const labels = allDates.map(date => {
    const formattedDate = formatDate(date);
    const correspondingData = findCorrespondingData(date, filteredByPlant); // 修改这里
    const xAxisLabel = `${formattedDate}\n${correspondingData.節氣}\n${correspondingData.候別}`;
    return (xAxisLabel.length === 7) ? null : xAxisLabel;
  });

  const leafScores = new Array(allDates.length).fill(null);
  const flowerScores = new Array(allDates.length).fill(null);
  const fruitScores = new Array(allDates.length).fill(null);

  filteredByPlant.forEach(item => {
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
            },            
            // 設定標籤的旋轉角度
            autoSkip: true,
            maxRotation: 90, // 標籤最大旋轉角度
            minRotation: 45, // 標籤最小旋轉角度
            // 設定標籤對齊方式
            align: 'center' // 可選值: 'start', 'center', 'end'
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

  // 优化 resizable 初始化
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

// 更新 findCorrespondingData 函數，使候別僅顯示數字
function findCorrespondingData(date, filteredData) {
  const dateString = date.toDateString();
  const correspondingData = filteredData.find(item => new Date(item['日期']).toDateString() === dateString) || { 節氣: '', 候別: '' };
  
  // 將候別中的「第一候」「第二候」「第三候」縮短為「1」「2」「3」
  const 候別數字 = correspondingData['候別'].replace('第1候', '1').replace('第2候', '2').replace('第3候', '3');
  
  return {
    節氣: correspondingData['節氣'],
    候別: 候別數字,
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

function getSelectedRegion(chartNumber) {
  const selector = document.getElementById(`regionSelector${chartNumber}`);
  return selector.value;
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
  // return `${year}/${month}/${day}`;
  return `${month}/${day}`;
}


function toggleChartDisplay() {
  const chartBlock = document.querySelector('.chartblock');
  const button = document.querySelector('.config.display button');
  
  chartBlock.classList.toggle('dual-display');
  
  button.textContent = chartBlock.classList.contains('dual-display') ? '單排顯示' : '併排顯示';
}

fetchAndCombineData();
