from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# プレイヤー名を受け取って、スタッツ(辞書型)を返す関数
def get_personal_data(name):
    dic = {}
    driver = webdriver.Chrome()
    time.sleep(2)
    driver.get("https://amae-koromo.sapk.ch/")
    driver.maximize_window()
    search_box_xpath = "/html/body/div/div/div[2]/div[1]/div/div/div/input"
    search_box = driver.find_element(By.XPATH, search_box_xpath)
    search_box.send_keys(name)
    time.sleep(2)
    search_box.send_keys(Keys.DOWN)
    search_box.send_keys(Keys.ENTER)
    time.sleep(5) # 読み込み待ちのための十分な時間
    elements_name = driver.find_elements(By.CSS_SELECTOR, "h6")
    elements_value = driver.find_elements(By.CSS_SELECTOR, "#root > div > div> div > div > div > div > div > div > p")
    time.sleep(2)
    for (name, value) in zip(elements_name, elements_value):
        dic[name.text] = value.text
    driver.quit()
    return dic


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

if __name__ == "__main__":
    print(convert_percent_to_floats(get_personal_data("ayanary")))
