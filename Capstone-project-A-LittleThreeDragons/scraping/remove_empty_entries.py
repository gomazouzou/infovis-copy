import pandas as pd
import sys

input_file = sys.argv[1]
output_file = sys.argv[2]

# CSV ファイルを読み込みます
df = pd.read_csv(input_file)

# 欠損値(null/NaN)を持つ行を削除します
df_cleaned = df.dropna()

# 結果を新しい CSV ファイルに出力します
df_cleaned.to_csv(output_file, index=False)
