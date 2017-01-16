#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
Uses the actors.json data to fetch the thumbnail image from wikipedia
'''

import os
import re
import sys
from lxml import etree
from pprint import pprint
import urllib
import json


reload(sys)  
sys.setdefaultencoding('utf-8')

def fetch_image(actor):
  if actor[9]:
    wikipedia_id = urllib.quote(actor[9].encode('utf8'), ':/')
    page_images_url = "https://en.wikipedia.org/w/api.php?action=query&titles=" + wikipedia_id + "&prop=pageimages&format=json&pithumbsize=600"
    response = urllib.urlopen(page_images_url)
    data = json.loads(response.read())
    for page_id in data["query"]["pages"]:
      page = data["query"]["pages"][page_id]
      if 'thumbnail' in page:
        urllib.urlretrieve(page['thumbnail']['source'], os.path.dirname(__file__) + "../data/images/actors_de/actor_" + actor[0] + ".jpg")


with open('../data/json/actors_wikipedia_de.json') as actors_file:
  actors_data = json.load(actors_file)[:959]

print len(actors_data)

for actor in actors_data:
  actor_id = actor[0]
  print actor_id
  fetch_image(actor)