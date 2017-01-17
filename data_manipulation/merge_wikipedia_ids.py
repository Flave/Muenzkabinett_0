#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
Uses the actors.json data to fetch the thumbnail image from wikipedia
'''

import os
import sys
import json

actorsFile = open(os.path.dirname(__file__) + '../data/json/actors_wikipedia_merged.json', 'w')

reload(sys)  
sys.setdefaultencoding('utf-8')

with open('../data/json/actors_wikipedia_de.json') as actors_file:
  actors_data_de = json.load(actors_file)

with open('../data/json/actors_wikipedia_en.json') as actors_file:
  actors_data_en = json.load(actors_file)

actors_with_wiki_de = []
actors_with_wiki_en = []

for actor in actors_data_de[1:]:
  if actor[9]:
    actors_with_wiki_de.append(actor)

for actor in actors_data_en[1:]:
  if actor[9]:
    actors_with_wiki_en.append(actor)

merged_actors = []

for actor_de in actors_data_de[1:]:
  # if actor has german wiki, append it to merged
  if actor_de[9]:
    actor_de[9] = actor_de[9] + "_de"
    merged_actors.append(actor_de)
  # ...else see if the actor has an english wiki
  else:
    for actor_en in actors_data_en[1:]:
      if (actor_en[0] == actor_de[0]) and actor_en[9]:
        actor_en[9] = actor_en[9] + "_en"
        merged_actors.append(actor)

print "Analysed actors: " + str(len(actors_data_de))
print "Actors with German wiki: " + str(len(actors_with_wiki_de))
print "Actors with English wiki: " + str(len(actors_with_wiki_en))
print "Actors with either English or German wiki: " + str(len(merged_actors))
print "Percentage of actors with wiki: " + str(len(merged_actors) / float(len(actors_data_de)) * 100)

with actorsFile as outfile:
  json.dump(merged_actors, outfile)