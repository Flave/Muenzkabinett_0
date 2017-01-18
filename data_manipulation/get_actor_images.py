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

num_images = 0

def fetch_image(actor, actor_index):
  wikipedia_id = actor[9][:-3]
  wikipedia_id = urllib.quote(wikipedia_id.encode('utf8'), ':/')
  page_images_url = "https://de.wikipedia.org/w/api.php?action=query&titles=" + wikipedia_id + "&prop=pageimages&format=json&pithumbsize=600"
  response = urllib.urlopen(page_images_url)
  data = json.loads(response.read())
  for page_id in data["query"]["pages"]:
    page = data["query"]["pages"][page_id]
    if 'thumbnail' in page:
      urllib.urlretrieve(page['thumbnail']['source'], os.path.dirname(__file__) + "../data/images/actors/actor_" + actor[0] + ".jpg")
      print "Found image for: " + actor_id + " " + str(actor_index)
      return True
    else:
      print "===> No image for: " + actor_id + " " + str(actor_index)
      return False


with open('../data/json/actors_wikipedia_merged.json') as actors_file:
  actors_data = json.load(actors_file)

for i, actor in enumerate(actors_data):
  actor_id = actor[0]
  image_found = fetch_image(actor, i)
  if image_found:
    num_images += 1

print "Number of actors: "  + str(len(actors_data))
print "Number of image: "  + str(num_images)
print "Percentage of actors with image: " + str(float(num_images) / len(actors_data) * 100)