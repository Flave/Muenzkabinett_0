#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import csv
from parse_xml import parseFile
from parse_xml import getKeys

import sys  
reload(sys)  
sys.setdefaultencoding('utf-8')

data = []
keys = getKeys()
file = open('parsed/coins_raw.csv', 'w')
writer = csv.writer(file)

data.append(keys)

for fn in os.listdir('../data/xml'):
  fileData = parseFile([], fn)
  data.append(fileData)


writer.writerows(data)
file.close()