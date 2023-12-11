from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re

def get_name(n,a,year,month): #n:データ数、a:間の識別子( 金の間:a = 'g'、玉の間: a = 'b'、王座の間: 'k')
    #例:year=2023、month=9 → 2023年9月の28日間分、上からn件のデータを保存、合計約1000件の名前データ
    
    # Chromeのドライバーを起動（このパスはChromeDriverの実際のパスに置き換えてください）
    driver = webdriver.Chrome()

    name_list = []
    
    if month<10: 
        date = str(year) + '-0' + str(month)
    else:
        date = str(year) + '-' + str(month)
    
    for i in range(1,29):
        if i<10:
            date_tmp = date + '-0' + str(i)
        else:
            date_tmp = date + '-' + str(i)
    
        url_tmp = "https://amae-koromo.sapk.ch/" + date_tmp
        # print(url_tmp)

        # Webページを開く
        driver.get(url_tmp)
        time.sleep(2)
        
        # ボタンをクリック
        if a == 'g':   
            button = driver.find_element(By.XPATH, "/html/body/div/div/div[2]/div[2]/div[2]/fieldset/div/label[3]/span[1]/input") # ボタンのXPathを指定
        elif a == 'b':
            button = driver.find_element(By.XPATH, "/html/body/div/div/div[2]/div[2]/div[2]/fieldset/div/label[2]/span[1]/input") # ボタンのXPathを指定
        elif a == 'k':
            button = driver.find_element(By.XPATH, "/html/body/div/div/div[2]/div[2]/div[2]/fieldset/div/label[1]/span[1]/input") # ボタンのXPathを指定
        button.click()
        time.sleep(2)

        for i in range(1,n):
            for j in range(1,5):
                if i%10 == 0:
                    time.sleep(1)
                xpath_tmp = f'/html/body/div/div/div[2]/div[3]/div[1]/div/div[2]/div/div[{i}]/div[2]/div/span[{j}]/a[1]'
                element_tmp = driver.find_element(By.XPATH, xpath_tmp)  # ボタンのXPathを指定
                # print(xpath_tmp)
                txt_tmp = re.split(r"\]|\[", element_tmp.text)
                name_list.append(txt_tmp[2])
                # print(txt_tmp[2])
        name_list = list(set(name_list))
        
    # with open('../data/namedata_'+a+'_'+date+'.txt', 'w') as file:
    with open('../data/namedata_'+a+'_'+date+'.txt', 'w', encoding='utf-8') as file:
        for item in name_list:
            item_tmp = item.strip()
            file.write(f"{item_tmp}\n")

    return name_list

            
if __name__ == "__main__":
    name_list = get_name(20,'k',2023,4) # 曺が試した結果、一度にn=20くらい、つまり80人分が限界(多分読み込み時間の問題？)
    print(len(name_list))
    # for name in name_list:
    #     print(name)


            


