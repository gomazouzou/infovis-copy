from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import sys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import re

import scraping
import scraping_all
import output_csv

## ここを読んでね
# 実行の仕方　
# カレントディレクトリはscraping
# $python scraping_to_csv.py [間の識別子] [year] [month]
# 間の識別子( 金の間:'g'、玉の間:'b'、王座の間:'k')

# 例:$python scraping_to_csv.py b 2023 4 → playerdata_b_2023_4.csvに2023年4月の玉座の間のプレイヤーデータ(1000~2000件)を保存
# 注意: ../dataディレクトリに namedata_b_2023-4.txt という名前のデータファイルが必要、なければgetname.pyの
# if __name__ == "__main__":
# name_list = get_name(20,'b',2023,4)
# を書き換えてdataを作ってもろてください

def scraping_to_csv(): 
    month = int(sys.argv[3])
    if month < 10:
        input_file = '../data/namedata_'  + sys.argv[1] + '_' + sys.argv[2] + '-0' + str(month) + '.txt'
    else:
        input_file = '../data/namedata_'  + sys.argv[1] + '_' + sys.argv[2] + '-' + str(month) + '.txt'
        
    # print('a')
    
    # ファイルを開く
    with open(input_file, 'r', encoding='utf-8') as file:
        # ファイルの内容を行ごとに読み込み、それぞれの行をリストの要素とする
        name_list = file.read().splitlines()
        
    result = []
    cnt = 0
    
    for name in name_list:
        """
        # get_personal_data2を使うときは、ここのコメントアウトを解除して、
        #  dic_tmp = scraping_all.get_personal_data(name,sys.argv[1])
        # の行をコメントアウトしてください。
        try:
            dic_tmp = scraping_all.get_personal_data2(name,sys.argv[1])
        except TimeoutException:
            continue
        """
        dic_tmp = scraping_all.get_personal_data(name,sys.argv[1])
        dic = scraping.convert_percent_to_floats(dic_tmp)
        if cnt%20 == 0:
            print(f"cnt: {cnt}")
            print(name)
            print(dic)
        if check_values(dic):
            print('正常に読み込めませんでした')
            continue
        result.append(dic)
        print(f"resultのデータ数: {len(result)}")
        cnt += 1
        
    output_filename = '../data/playerdata_' + sys.argv[1] + '_' + sys.argv[2] + '_' + sys.argv[3] + '.csv'
    output_csv.write_dict_to_csv(result, output_filename)
    
def check_values(my_dict):
    if len(my_dict) == 0:
        return True
    if '記録対戦数' not in my_dict:
        return True
    if int(my_dict['記録対戦数']) < 100 :
        return True
    for key, value in my_dict.items():
        if not value:
            return True
    return False
    
if __name__ == "__main__":
    scraping_to_csv()
    
    