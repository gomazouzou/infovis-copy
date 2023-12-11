import csv

def write_dict_to_csv(dict, file_name):
    # dictが辞書型リスト,file_nameで出力先ファイルを指定
    if len(dict) == 0:
        return

    keys = dict[0].keys()

    with open(file_name, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=keys)
        writer.writeheader()
        writer.writerows(dict)

# # サンプルの辞書のリスト
# my_data = [
#     {"Name": "Alice", "Age": 25, "Country": "USA"},
#     {"Name": "Bob", "Age": 30, "Country": "Canada"},
#     {"Name": "Charlie", "Age": 28, "Country": "UK"}
# ]

# # CSVファイルに書き出し
# write_dict_to_csv(my_data, 'output.csv')
