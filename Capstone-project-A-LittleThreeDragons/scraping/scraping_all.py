from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time
import sys

from selenium.webdriver.chrome.options import Options

# プレイヤー名を受け取って、スタッツ(辞書型)を返す関数
def get_personal_data(name,a): # a:間の識別子( 金の間:a = 'g'、玉の間: a = 'b'、王座の間: 'k')
    # Chromeのヘッドレスモードを有効にする
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    
    driver = webdriver.Chrome()
    # time.sleep(2)
    driver.get("https://amae-koromo.sapk.ch/")
    # driver.minimize_window()
    search_box_xpath = "/html/body/div/div/div[2]/div[1]/div/div/div/input"
    search_box = driver.find_element(By.XPATH, search_box_xpath)
    search_box.send_keys(name)
    time.sleep(2)
    search_box.send_keys(Keys.DOWN)
    search_box.send_keys(Keys.ENTER)

    url_main = driver.current_url
    if a == 'g':   
        url_main = url_main + '/9'
    elif a == 'b':
        url_main = url_main + '/12'
    elif a == 'k':
        url_main = url_main + '/16'
    dic = {}
    options = ["", "/riichi", "/extended"] # 怪しい
    for op in options:
        url = url_main + op
        driver.get(url)
        time.sleep(2) # 読み込み待ちのための十分な時間
        elements_name = driver.find_elements(By.CSS_SELECTOR, "h6")
        elements_value = driver.find_elements(By.CSS_SELECTOR, "#root > div > div> div > div > div > div > div > div > p")
        # time.sleep(2)
        for (name, value) in zip(elements_name, elements_value):
            # print(name.text)
            # print(value.text)
            dic[name.text] = value.text
    driver.quit()
    return dic

# get_personal_dataの高速バージョン
# 使い方はget_personal_dataと同じです。
# ただし、玉の間以降にしかない事項(安定段位など)は省いて、
# すべての間で同じ形式のデータが得られるようになっています。
# また、名前検索で見つからない人が出た場合、とばして次にいきます。
def get_personal_data2(name,a): # a:間の識別子( 金の間:a = 'g'、玉の間: a = 'b'、王座の間: 'k')
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 10)
    driver.get("https://amae-koromo.sapk.ch/")
    # driver.minimize_window()
    search_box_xpath = "/html/body/div/div/div[2]/div[1]/div/div/div/input"
    search_box = driver.find_element(By.XPATH, search_box_xpath)
    search_box.send_keys(name)
    time.sleep(2)
    search_box.send_keys(Keys.DOWN)
    search_box.send_keys(Keys.ENTER)
    selector = "#root > div > div:nth-child(3) > div.MuiBox-root.css-guflfy > div.MuiBox-root.css-0 > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8.css-efwuvd > h5"
    try:
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
    except TimeoutException:
        raise
        
    url_main = generate_url_main(driver.current_url, a)
    dic = {}
    for op in ["", "/riichi", "/extended"]:
        driver.get(url_main + op)
        selector = "#root > div > div:nth-child(3) > div.MuiBox-root.css-guflfy > div.MuiBox-root.css-0 > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-8.css-efwuvd > div.MuiBox-root.css-1u3q4k3 > div:nth-child(16) > p"
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
        elements_name = driver.find_elements(By.CSS_SELECTOR, "h6")
        elements_value = driver.find_elements(By.CSS_SELECTOR, "#root > div > div> div > div > div > div > div > div > p")
        for i in range(0,16):
            name = elements_name[i]
            value = elements_value[i]
            dic[name.text] = value.text
    
    driver.quit()
    return dic

def generate_url_main(current_url, a):
    url_tmp = "https://amae-koromo.sapk.ch/player/" + current_url.split("/")[4]
    if a == 'g':   
        return url_tmp + '/9'
    elif a == 'b':
        return url_tmp + '/12'
    elif a == 'k':
        return url_tmp + '/16'

if __name__ == "__main__":
    print(get_personal_data2("おかぴん1113",'b'))