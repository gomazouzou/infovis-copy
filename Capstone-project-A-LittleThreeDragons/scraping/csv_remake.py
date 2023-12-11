import csv

# CSVファイルのパス
csv_file_path = '../page/data/playerdata_3.csv'
output_file_path = '../page/data/playerdata_3_remake.csv' 

def write_dict_to_csv(dict, file_name):
    # dictが辞書型リスト,file_nameで出力先ファイルを指定
    if len(dict) == 0:
        return

    keys = dict[0].keys()

    with open(file_name, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=keys)
        writer.writeheader()
        writer.writerows(dict) 

# あがり時リーチ率、あがり時副露率、あがり時ダマ率を追加
def remake(csv_file_path,output_file_path):
    dict = []

    with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
        csv_dict_reader = csv.DictReader(csv_file)
        
        # 行ごとに辞書を処理する
        for row in csv_dict_reader:
            if row['総計局数'] == '' or row['和了率'] == '' or row['ダマ率'] == '' or row['副露率'] == '' or row['副露後和了率'] == '' or row['立直率'] == '' or row['立直和了'] == '':
                continue
            row['総計局数'] = float(row['総計局数'])
            win_num = float(int(row['総計局数'])*float(row['和了率']))
            num_dama = float(win_num*float(row['ダマ率']))
            num_huro = float(int(row['総計局数'])*float(row['副露率'])*float(row['副露後和了率']))
            num_riichi = float(int(row['総計局数'])*float(row['立直率'])*float(row['立直和了']))
            row['和了時立直率'] = num_riichi/win_num
            row['和了時副露率'] = num_huro/win_num
            row['和了時ダマ率'] = num_dama/win_num
            dict.append(row)
    write_dict_to_csv(dict, output_file_path)

            
if __name__ == "__main__":
    remake(csv_file_path,output_file_path)
    
