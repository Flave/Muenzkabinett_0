#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import re
import csv
import sys
from lxml import etree
import json
import pprint
import requests

reload(sys)  
sys.setdefaultencoding('utf-8')

pp = pprint.PrettyPrinter(indent=4)
ns = {'lido': 'http://www.lido-schema.org', 'xml': 'someuri'}
coinsFile = open(os.path.dirname(__file__) + '../data/json/coins.json', 'w')
coinsCSVFile = open(os.path.dirname(__file__) + '../data/csv/coins_places.csv', 'w')
production_event_set = '//lido:eventSet[./lido:event/lido:eventType/lido:term[contains(text(), "Herstellung")]]'

coins = []
coin_specs = [
  {
    'key': 'id',
  },
  {
    'key': 'production_country',
    'path': production_event_set + '//lido:place[@lido:politicalEntity="country"]//lido:appellationValue/text()'
  },
  {
    'key': 'production_region',
    'path': production_event_set + '//lido:place[@lido:politicalEntity="region"]//lido:appellationValue/text()'
  },
  {
    'key': 'production_minting_place',
    'path': production_event_set + '//lido:place[@lido:politicalEntity="minting_place"]//lido:appellationValue/text()'
  },
  {
    'key': 'production_country_lng',
  },
    {
    'key': 'production_country_lat',
  }
]


# UTILITY FUNCTION

def getKeys(specs):
  keys = []
  for spec in specs:
    keys.append(spec['key'])
  return keys


def parseValue(tree, path, index=0):
  value = tree.xpath(path, namespaces=ns)
  if(len(value) > index):
    if re.match("^\-?\d+$", value[index]) is not None:
      return int(value[index])
    else:
      return value[index]
  else:
    return None


# PARSE FUNCTIONS

def parseFile(fileName):
  tree = etree.parse(os.path.dirname(__file__)  + '../data/xml/' + fileName)
  coin_id = fileName[:8]
  parseCoinData(tree, coin_id)


def parseCoinData(tree, coin_id):
  data = []
  
  for spec in coin_specs:
    if(spec['key'] == 'production_country_lat' or spec['key'] == 'production_country_lng'):
      continue
    if(spec['key'] == 'id'):
      data.append(coin_id)
    else:
      value = parseValue(tree, spec['path'])
      data.append(value)

  # Fetch Country coordinates
  print coin_id, data[1], data[2]
  if data[1] is not None:
    locationData = requests.get("https://geocoder.cit.api.here.com/6.2/geocode.json?searchtext="+data[1]+"&app_id=bVQHRXUn6uNHP3B24bdt&app_code=mwkokcyyoCIfExsmQq0qIg&gen=8")
    locationJson = json.loads(locationData.text)
    if len(locationJson["Response"]["View"]) > 0:
      location = locationJson["Response"]["View"][0]["Result"][0]["Location"]["DisplayPosition"]
      data.append(location["Latitude"])
      data.append(location["Longitude"])
    else:
      data.append(None)
      data.append(None)
  else:
    data.append(None)
    data.append(None)

  coins.append(data)

coins.append(getKeys(coin_specs))

for fn in os.listdir(os.path.dirname(__file__)  + './../data/xml')[:10000]:
  parseFile(fn)

writer = csv.writer(coinsCSVFile)
writer.writerows(coins)
coinsCSVFile.close()
  # with coinsFile as outfile:
  #   json.dump(coins, outfile)
