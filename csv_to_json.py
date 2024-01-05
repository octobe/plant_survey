import pandas as pd

csv_file_path = 'D:/octoberw/OneDrive/桌面/webpages/plant_survey/大肚山植調.csv'
json_file_path = 'D:/octoberw/OneDrive/桌面/webpages/plant_survey/plant_data.json'

# 讀取 CSV 檔案
df = pd.read_csv(csv_file_path)

# 將 DataFrame 轉換為 JSON
json_data = df.to_json(orient='records', indent=2)

# 寫入 JSON 檔案
with open(json_file_path, 'w') as json_file:
    json_file.write(json_data)

print('Conversion complete. JSON file saved at', json_file_path)
