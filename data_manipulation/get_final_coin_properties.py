import csv
import os

coins_data = csv.reader(open(os.path.dirname(__file__) + '../data/csv/coins_40.csv'), delimiter=",")
keys = coins_data.next()
coins_data = list(coins_data)

del keys[4];

for i, coin_data in enumerate(coins_data):
  del coin_data[4]

coins_file = open(os.path.dirname(__file__) + '../data/csv/coins.csv', 'w')
coins_data.insert(0, keys)
writer = csv.writer(coins_file)
writer.writerows(coins_data)
coins_file.close()