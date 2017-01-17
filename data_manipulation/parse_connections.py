#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import re
import csv
import sys
from lxml import etree
import json
import urllib
import pprint
from time import sleep

reload(sys)  
sys.setdefaultencoding('utf-8')

pp = pprint.PrettyPrinter(indent=4)
ns = {'lido': 'http://www.lido-schema.org', 'xml': 'someuri'}
production_event_set = '//lido:eventSet[./lido:event/lido:eventType/lido:term[contains(text(), "Herstellung")]]'
finding_event_set = '//lido:eventSet[./lido:event/lido:eventType/lido:term[contains(text(), "Fund")]]'
provenance_event_set = '//lido:eventSet[./lido:event/lido:eventType/lido:term[contains(text(), "Provenienz")]]'
coinsFile = open(os.path.dirname(__file__) + '../data/json/coins.json', 'w')
coinsCSVFile = open(os.path.dirname(__file__) + '../data/csv/coins.csv', 'w')
actorsFile = open(os.path.dirname(__file__) + '../data/json/actors.json', 'w')
linksFile = open(os.path.dirname(__file__) + '../data/json/links.json', 'w')

coins = []
actors = []
links = []
coin_specs = [
  {
    'key': 'id',
  },
  {
    'key': 'title',
    'path': '//lido:objectIdentificationWrap/lido:titleWrap//lido:appellationValue/text()'
  },
  {
    'key': 'date_earliest',
    'path': production_event_set + '//lido:earliestDate/text()'
  },
  {
    'key': 'date_latest',
    'path': production_event_set + '//lido:latestDate/text()'
  },
  {
    'key': 'production_period_name',
    'path': production_event_set + '//lido:periodName/lido:term/text()'
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
    'key': 'nominal',
    'path': '//lido:classificationWrap//lido:term[@lido:label="nominal"]/text()'
  }
]

actor_specs = [
  {
    'key': 'id'
  },
  {
    'key': 'last_name'
  },
  {
    'key': 'first_name'
  },
  {
    'key': 'date_earliest'
  },
  {
    'key': 'date_latest'
  },
  {
    'key': 'uri_1'
  },
  {
    'key': 'uri_2'
  },
  {
    'key': 'uri_3'
  },
  {
    'key': 'uri_4'
  },
  {
    'key': 'wikipedia_id'
  }
]

link_specs = [
  {
    'key': 'source_id'
  },
  {
    'key': 'target_id'
  },
  {
    'key': 'role'
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
  print coin_id
  #parseCoinData(tree, coin_id)
  parseActorsData(tree, coin_id)


def parseCoinData(tree, coin_id):
  data = []
  
  for spec in coin_specs:
    if(spec['key'] == 'id'):
      data.append(coin_id)
    else:
      value = parseValue(tree, spec['path'])
      data.append(value)
  coins.append(data)


def parseActorsData(tree, coin_id):
  actor_elements = tree.xpath('//lido:eventActor', namespaces=ns)
  for actor_element in actor_elements:
    actor_data = parseActor(actor_element, coin_id)
    if actor_data == None: continue
    already_in_data = False
    # check if already in data
    for actor in actors:
      if actor_data[0] == actor[0]:
        already_in_data = True
        break
    if not already_in_data:
      actors.append(actor_data)


def parseActor(actor, coin_id):
  actor_data = []
  first_name = parseValue(actor, './/lido:appellationValue[@lido:label="firstname"]/text()') or ""
  last_name = parseValue(actor, './/lido:appellationValue[@lido:label="lastname"]/text()') or ""
  role = parseValue(actor, './/lido:roleActor/lido:term[@xml:lang="de"]/text()') or ""
  date_eatliest = parseValue(actor, './/lido:vitalDatesActor/lido:earliestDate/text()')
  date_latest = parseValue(actor, './/lido:vitalDatesActor/lido:latestDate/text()')
  actor_uri = parseValue(actor, './/lido:actorID[@lido:type="URI"]/text()') or ""
  actor_uri_alt = parseValue(actor, './/lido:actorID[@lido:type="URI"]/text()', 1) or ""
  actor_uri_alt_1 = parseValue(actor, './/lido:actorID[@lido:type="URI"]/text()', 2) or ""
  actor_uri_alt_2 = parseValue(actor, './/lido:actorID[@lido:type="URI"]/text()', 3) or ""
  name = first_name + " " +  last_name
  actor_id = re.sub(r'\W', "", name)


  if role != "Vorbesitzer":
    # wikipedia_id = getWikipediaId([actor_uri, actor_uri_alt, actor_uri_alt_1, actor_uri_alt_2])
    actor_data.append(actor_id)
    actor_data.append(first_name)
    actor_data.append(last_name)
    actor_data.append(date_eatliest)
    actor_data.append(date_latest)
    actor_data.append(actor_uri)
    actor_data.append(actor_uri_alt)
    actor_data.append(actor_uri_alt_1)
    actor_data.append(actor_uri_alt_2)
    #actor_data.append(wikipedia_id)
    # links.append([coin_id, actor_data[0], role.replace("ü", "ue")])
    return actor_data
  else:
    return None

#18201312
def getWikipediaId(actor_uris):
  for uri in actor_uris:
    if "viaf.org" in uri:
      viaf_id = re.search(r'\d+', uri).group()
      viaf_response = urllib.urlopen("http://viaf.org/viaf/" + viaf_id + "/justlinks.json")
      response = viaf_response.read()
      try:
        viaf_links = json.loads(response)
        return parseViafLinks(viaf_links)
      except Exception:
        print "No valid JSON"
        return None
  return None


def parseViafLinks(links):
  if type(links) is dict and 'Wikipedia' in links:
    for link in links['Wikipedia']:
      if 'en.wikipedia.org' in link:
        path_segments = link.split('/') 
        wikipedia_id = path_segments[len(path_segments) - 1]
        return wikipedia_id
  return None


coins.append(getKeys(coin_specs))
actors.append(getKeys(actor_specs))
links.append(getKeys(link_specs))


for fn in os.listdir(os.path.dirname(__file__)  + './../data/xml'):
  parseFile(fn)

# Fetch wikipedia_id
# for i, actor in enumerate(actors[1:len(actors)]):
#   print "Fetching wikipedia id of actor: " + str(i) + " " + actor[0]
#   wikipedia_id = getWikipediaId(actor[5:9])
#   actor.append(wikipedia_id)
#   sleep(1)

# ANALYSIS
actors_with_both_dates = 0
actors_with_birth = 0
actors_with_death = 0

coins_with_both_dates = 0
coins_with_birth = 0
coins_with_death = 0

print "Creating stats"

for i, actor in enumerate(actors):
  if i==0: 
    continue
  if actor[3] is not None and actor[4] is not None:
    if actor[4] - actor[3] < 0:
      print "Imposible birth/death dates", actor[0], actor[4] - actor[3]
    actors_with_both_dates += 1
  if actor[3] is not None:
    actors_with_birth += 1
  if actor[4] is not None:
    actors_with_death += 1

print "Removing tail"

print len(coins)
print len(actors)
print len(links)
print "==="

# Remove actors with very few coins
# for i, actor in enumerate(actors):
#   threshold = 2
#   num_connections = 0
#   if i==0:
#     continue
#   for j, link in enumerate(links):
#     if actor[0] == link[1]:
#       num_connections += 1
#     if num_connections > threshold:
#       break
#   if num_connections <= threshold:
#     actors.remove(actor)
#   for j, link in enumerate(links):
#     if (actor[0] == link[1]) and num_connections <= threshold:
#       links.remove(link)
#       for coin in coins:
#         if coin[0] == link[0]:
#           coins.remove(coin)

print len(coins)
print len(actors)
print len(links)    


print "Number of coins", len(coins)
print "Number of actors", len(actors)
print "Number of links", len(links)
print "Actors with both dates", actors_with_both_dates
print "Actors with birth dates", actors_with_birth
print "Actors with death dates", actors_with_death

print "Writing files"

# writer = csv.writer(coinsCSVFile)
# writer.writerows(coins)
# coinsCSVFile.close()
  # with coinsFile as outfile:
  #   json.dump(coins, outfile)


with actorsFile as outfile:
  json.dump(actors, outfile)

# with linksFile as outfile:
#   json.dump(links, outfile)