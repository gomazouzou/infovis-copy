from flask import Flask, request, jsonify
import subprocess
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
import re
import csv
import asyncio
import concurrent.futures

from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/run_python_code": {"origins": "http://localhost:8000"}})

def trans_to_japanese(dic):
    name_eng = ['Recorded matches','Current rank','Current rk points','Win rate','Deal-in rate','Tsumo rate','Dama rate','Exhaustive draw rate','Draw tenpai rate','Call rate','Riichi rate','Avg turns to win','Average win score','Average deal-in score','Average rank','Busting rate','Stable rank','Expected score','Riichi win rate','Deal-in after riichi A','Deal-in after riichi B','Riichi payment','Avg riichi hand value','Avg riichi deal-in','First riichi','Chasing riichi','Chased rate','Avg riichi turns','Riichi draw rate','Ippatsu rate','Furiten rate','Multi-sided riichi','Good-hand riichi','Best rank','Best rank points','Max repeats','Uradora rate','Tsumo hit as dealer','Tsumo hit as dler pt','Deal-in while riichi','Deal-in while open','Deal-in after open','Win rate after open','Draw rate after open','Win efficiency','Deal-in loss','Net win efficiency','G/L per round','Total rounds']
    name_jap = ['記録対戦数','記録段位','記録点数','和了率','放銃率','ツモ率','ダマ率','流局率','流局聴牌率','副露率','立直率','和了巡数','平均和了','平均放銃','平均順位','飛び率','安定段位','点数期待','立直和了','立直放銃A','立直放銃B','立直収支','立直収入','立直支出','先制率','追っかけ率','追っかけられ率','立直巡目','立直流局','一発率','振聴率','立直多面','立直良形','最高段位','最高点数','最大連荘','裏ドラ率','痛い親かぶり率','痛い親かぶり平均','放銃時立直率','放銃時副露率','副露後放銃率','副露後和了率','副露後流局率','打点効率','銃点損失','調整打点効率','局収支','総計局数']
    for i in range(len(name_eng)):
        if '総計局数' in dic: #すでに日本語なら何もしない
            break
        if name_eng[i] in dic:
            dic[name_jap[i]] = dic.pop(name_eng[i])
        else:
            dic[name_jap[i]] = ''
    
    dic_currentrank = {"Ex1": "傑1","Ex2": "傑2","Ex3": "傑3", "Ms1":"豪1","Ms2":"豪2","Ms3":"豪3", "St1":"聖1","St2":"聖2","St3":"聖3", "Cl1":"魂1","Cl2":"魂2","Cl3":"魂3","Cl4":"魂4","Cl5":"魂5","Cl6":"魂6","Cl7":"魂7"}
    if dic['記録段位'] in dic_currentrank:
        dic['記録段位'] = dic_currentrank[dic['記録段位']]
    
    
# "40.96%"といった文字列を受け取り、"0.4096"のような小数表示(float型)を返す関数
def percent_to_float(percent_string):
    no_percent = percent_string.replace('%', '')
    decimal_number = float(no_percent) / 100
    return decimal_number

# 文字列を受け取って、'%'で終わるならTrue、そうでないならFalseを返す関数
def ends_with_percent(s):
    return s.endswith('%')

# 辞書型のデータを受け取り、値が%表示なら小数表示に変更したデータ(辞書型)を返す関数
def convert_percent_to_floats(data):
    dic = {}
    for key in data:
        if ends_with_percent(data[key]):
            dic[key] = percent_to_float(data[key])
        else:
            dic[key] = data[key]
    return dic

def scaraping_data(name): 

    if name == '':
        return {}
    
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(options=chrome_options)
    # time.sleep(2)
    wait = WebDriverWait(driver, 10)
    driver.get("https://amae-koromo.sapk.ch/")
    # driver.minimize_window()
    search_box_xpath = "/html/body/div/div/div[2]/div[1]/div/div/div/input"
    search_box = driver.find_element(By.XPATH, search_box_xpath)
    search_box.send_keys(name)
    time.sleep(2)
    search_box.send_keys(Keys.DOWN)
    search_box.send_keys(Keys.ENTER)
    
    time.sleep(2.5)
    url_main = driver.current_url
    print(url_main)
    dic = {}
    dic['名前'] = name
    options = ["", "/riichi", "/extended"] # 怪しい
    for op in options:
        url = url_main + op
        driver.get(url)
        time.sleep(2) # 読み込み待ちのための十分な時間
        elements_name = driver.find_elements(By.CSS_SELECTOR, "h6")
        elements_value = driver.find_elements(By.CSS_SELECTOR, "#root > div > div> div > div > div > div > div > div > p")
        # selector = "#root > div > div:nth-child(3) > div.MuiBox-root.css-guflfy > div.MuiBox-root.css-0 > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8.css-efwuvd > div.MuiBox-root.css-1u3q4k3 > div:nth-child(16) > p"
        # wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
        # elements_name = driver.find_elements(By.CSS_SELECTOR, "h6")
        # elements_value = driver.find_elements(By.CSS_SELECTOR, "#root > div > div> div > div > div > div > div > div > p")
        # time.sleep(2)
        for (name, value) in zip(elements_name, elements_value):
            dic[name.text] = value.text
    driver.quit()
    dic = convert_percent_to_floats(dic)
    trans_to_japanese(dic)
    
    if dic['総計局数'] == '' or dic['和了率'] == '' or dic['ダマ率'] == '' or dic['副露率'] == '' or dic['副露後和了率'] == '' or dic['立直率'] == '' or dic['立直和了'] == '':
        return dic
    dic['総計局数'] = float(dic['総計局数'])
    win_num = float(int(dic['総計局数'])*float(dic['和了率']))
    num_dama = float(win_num*float(dic['ダマ率']))
    num_huro = float(int(dic['総計局数'])*float(dic['副露率'])*float(dic['副露後和了率']))
    num_riichi = float(int(dic['総計局数'])*float(dic['立直率'])*float(dic['立直和了']))
    dic['和了時立直率'] = num_riichi/win_num
    dic['和了時副露率'] = num_huro/win_num
    dic['和了時ダマ率'] = num_dama/win_num
    
    return dic
        
async def main_scraping(inputs, result):
    loop = asyncio.get_running_loop()
    with concurrent.futures.ProcessPoolExecutor() as pool:
        tasks = [loop.run_in_executor(pool, scaraping_data, name) for name in inputs]
        results = await asyncio.gather(*tasks)
        for i in range(4):    
            result.append(results[i])



# @app.route('/')
# def home():
#     return 'Welcome to Flask App'

@app.route('/run_python_code', methods=['POST'])
def run_python_code():
    data = request.get_json()

    if 'inputs' in data:
        inputs = data['inputs']
        
        # フロントエンドから受け取った各テキストボックスの値をリストで取得
        print(inputs)

        # ここでPythonコードを実行する（例: 入力を単純に出力するだけ）
        
        result = []
        asyncio.run(main_scraping(inputs,result))
        # await main_scraping(inputs, result)
        # print(result)
        
        output_filename = '../page/data/playerdata_tmp.csv'
        # dictが辞書型リスト,file_nameで出力先ファイルを指定
        keys = result[0].keys()

        # with open(output_filename, 'w', newline='', encoding='utf-8') as csvfile:
        #     writer = csv.DictWriter(csvfile, fieldnames=keys)
        #     writer.writeheader()
        #     writer.writerows(result)
        return json.dumps(result)
    else:
        return jsonify({'error': 'Invalid input format'}), 400

if __name__ == '__main__':
    # app.run(debug=True)
    app.run()


