// 將植物編號和植物名稱的下拉選單元素
const plantSelector = document.getElementById('plantSelector');
let data; // 將 data 宣告在更高的範圍

// 使用 async/await 進行非同步載入
async function fetchData() {
  try {
    const response = await fetch('大肚山植調.csv');
    const csvData = await response.text();
    data = csvToObjects(csvData);

    const uniquePlantNumbers = new Set();

    // 將植物編號和植物名稱的選項動態生成到下拉選單
    data.forEach(item => {
      const plantNumber = item['植物編號'];
      const plantName = item['植物名稱'];

      // 如果植物編號和植物名稱都存在，才將其添加到選單
      if (plantNumber !== undefined && plantName !== undefined) {
        if (!uniquePlantNumbers.has(plantNumber)) {
          uniquePlantNumbers.add(plantNumber);

          const option = document.createElement('option');
          option.value = plantNumber;
          option.text = `${plantNumber} - ${plantName}`;
          plantSelector.appendChild(option);
        }
      }
    });

    // 在此處添加代碼以初始化折線圖
    initChart();

    // 選單內容預設不選擇任何項目
    plantSelector.selectedIndex = -1;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// 加載選中植物的資料並顯示折線圖
function loadData() {
  const selectedPlantNumber = plantSelector.value;
  const selectedPlantData = data.filter(item => item['植物編號'] === selectedPlantNumber);

  // 清空先前的折線圖
  const chartContainer = document.getElementById('chartContainer');
  chartContainer.innerHTML = '';

  // 準備折線圖的資料
  const labels = selectedPlantData.map(item => new Date(item['日期'])); // 將日期轉換為 JavaScript Date 對象
  const leafScores = selectedPlantData.map(item => parseFloat(item['葉子分數']));
  const flowerScores = selectedPlantData.map(item => parseFloat(item['花的分數']));
  const fruitScores = selectedPlantData.map(item => parseFloat(item['果實分數']));

  // 檢查 leafScores、flowerScores 和 fruitScores 的值
  console.log('Leaf Scores:', leafScores);
  console.log('Flower Scores:', flowerScores);
  console.log('Fruit Scores:', fruitScores);

  // 創建折線圖的 canvas 元素
  const canvas = document.createElement('canvas');
  canvas.id = 'chart'; // 為 canvas 添加 ID
  chartContainer.appendChild(canvas);

  // 使用 Chart.js 創建折線圖
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
          },
        }],
      },
    },
  });
}

// 將 CSV 轉換為物件陣列的函式
function csvToObjects(csv) {
  // 替換所有的 CR LF（回車符 + 換行符）為 LF（換行符）
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

// 初始化折線圖
function initChart() {
  // 這裡可以添加代碼以初始化折線圖，例如顯示默認的植物資料
  // 這裡的代碼可以呼叫 loadData() 以顯示默認植物的折線圖
}

// 執行非同步載入
fetchData();
