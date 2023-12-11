import csv
import numpy as np


def flip_bit_at_position(number, position_from_right):
    mask = 1 << position_from_right
    result = number & mask
    return result

def calc_dict(dict,keys,ignore_column,name):
    tmp_dict = {key:[] for key in keys}
    for row in dict:
        for key in keys:
            flag = False
            for _ in ignore_column:
                if _ == key:
                    flag = True
            if flag:
                continue
            
            tmp_dict[key].append(float(row[key]))
            
    dict_ave = {key:"null" for key in keys}
    dict_std = {key:"null" for key in keys}
    dict_ave = {}
    dict_std = {}
    dict_ave["名前"] = name + "_ave"
    dict_std["名前"] = name + "_std"
    
    for key in keys:
        flag = False
        for _ in ignore_column:
            if _ == key:
                dict_ave[key] = "null"
                dict_std[key] = "null"
                flag = True
        if flag:
            continue
        
        dict_ave[key] = np.mean(tmp_dict[key])
        dict_std[key] = np.std(tmp_dict[key])
    
    return dict_ave, dict_std

def write_dict_to_csv(dict, file_name):
    if len(dict) == 0:
        return
    
    keys = dict[0].keys()

    with open(file_name, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=keys)
        writer.writeheader()
        writer.writerows(dict)
    


def calc():
    file_names = ['../page/data/playerdata_1.csv', '../page/data/playerdata_2.csv', '../page/data/playerdata_3.csv']
    output_file = ['../page/data/playerdata_ave.csv', '../page/data/playerdata_dev.csv',]
    
    rating_idx = { "士": 0, "傑": 1, "豪": 2, "聖": 4, "魂": 8 }
    
    array_rank = [[] for i in range(8)]
    array_rating = [[] for i in range(16)]
    
    for i in range(3):
        with open(file_names[i], 'r', encoding='utf-8') as csvfile:
            csv_dict_reader = csv.DictReader(csvfile)
            
            for row in csv_dict_reader:
                if "記録段位" not in row:
                    continue
                if row["記録段位"] == "":
                    continue            
                if row["記録段位"][0] == "士":
                    continue
                
                for t in range(8):
                    if flip_bit_at_position(t, i) != 0:
                        array_rank[t].append(row)
                
                idx = rating_idx[row["記録段位"][0]]
                for t in range(16):
                    if t&idx != 0:
                        array_rating[t].append(row)
                    
    ignore_column = ['記録段位','記録点数', '安定段位', '点数期待', '最高段位', '最高点数']
    keys = array_rank[4][0].keys()
    
    ans_ave = []
    ans_std = []
    
    for i in range(1,8):
        ave_tmp, std_tmp = calc_dict(array_rank[i],keys,ignore_column,"rank_" + str(i))
        ans_ave.append(ave_tmp)
        ans_std.append(std_tmp)

    for i in range(1,16):
        ave_tmp, std_tmp = calc_dict(array_rating[i],keys,ignore_column,"rating_" + str(i))
        ans_ave.append(ave_tmp)
        ans_std.append(std_tmp)
        
    write_dict_to_csv(ans_ave, "../page/data/playerdata_ave.csv")
    write_dict_to_csv(ans_std, "../page/data/playerdata_std.csv")
    
    
if __name__ == "__main__":
    calc()
    
    