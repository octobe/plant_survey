// 新的 script.js 檔案內容
// 將植物編號和植物名稱的下拉選單元素
const plantSelector = document.getElementById('plantSelector');

// 使用 fetch() 函式獲取 CSV 檔案的資料
fetch('大肚山植調.csv')
  .then(response => response.text())
  .then(csvData => {
    // 將 CSV 轉換為物件陣列
    const data = csvToObjects(csvData);

    // 將植物編號和植物名稱的選項動態生成到下拉選單
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item['植物編號'];
      option.text = `${item['植物編號']} - ${item['植物名稱']}`;
      plantSelector.appendChild(option);
    });
  });

// 加載選中植物的資料
function loadData() {
  const selectedPlantNumber = plantSelector.value;
  const selectedPlantData = data.filter(item => item['植物編號'] === selectedPlantNumber);

  // 這裡可以進行進一步的資料處理或顯示
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = JSON.stringify(selectedPlantData, null, 2);
}

// 將 CSV 轉換為物件陣列的函式
function csvToObjects(csv) {
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
