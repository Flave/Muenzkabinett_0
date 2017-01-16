#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import csv
import sys
from lxml import etree
import pprint

reload(sys)  
sys.setdefaultencoding('utf-8')

pp = pprint.PrettyPrinter(indent=4)
ns = {'lido': 'http://www.lido-schema.org', 'xml': 'someuri'}
production_event_set = '//lido:eventSet[./lido:event/lido:eventType/lido:term[contains(text(), "Herstellung")]]'
finding_event_set = '//lido:eventSet[./lido:event/lido:eventType/lido:term[contains(text(), "Fund")]]'
provenance_event_set = '//lido:eventSet[./lido:event/lido:eventType/lido:term[contains(text(), "Provenienz")]]'

specs = [
  {
    'key': 'production_events',
    'path': production_event_set
  },
  {
    'key': 'finding_events',
    'path': finding_event_set
  },
  {
    'key': 'provenance_events',
    'path': provenance_event_set
  },
  {
    'key': 'production_actors',
    'path': production_event_set + '//lido:eventActor'
  },
  {
    'key': 'finding_actors',
    'path': finding_event_set + '//lido:eventActor'
  },
  {
    'key': 'provenance_actors',
    'path': provenance_event_set + '//lido:eventActor'
  },
  {
    'key': 'production_roles',
    'path': production_event_set + '//lido:eventActor//lido:roleActor/lido:term[@xml:lang="de"]/text()'
  },
  {
    'key': 'finding_roles',
    'path': finding_event_set + '//lido:eventActor//lido:roleActor/lido:term[@xml:lang="de"]/text()'
  },
  {
    'key': 'provenance_roles',
    'path': provenance_event_set + '//lido:eventActor//lido:roleActor/lido:term[@xml:lang="de"]/text()'
  }
]

data = []

def parseFile(data, fileName):

  tree = etree.parse((os.path.dirname(__file__) + '../data/xml/' + fileName))
  # data.append(fileName.replace('.xml', ''))
  parseValues(data, tree, specs, fileName)
  return data

def parseValues(data, tree, specs, id):
  # data.append(parseValue(tree, specs[1]['path'], specs[1]['key']))
  for i, spec in enumerate(specs):
    data.append(parseValue(tree, spec['path'], spec['key'], id))


def parseValue(tree, path, key, id):
  value = tree.xpath(path, namespaces=ns)
  if "roles" not in key:
    return len(value)
  else:
    return value

  if(len(value) > 0):
    return value[0]
  else:
    return None


def getKeys():
  keys = []
  for spec in specs:
    keys.append(spec['key'])
  keys.insert(0, 'id')
  return keys


# data.append(getKeys())


for fn in os.listdir(os.path.dirname(__file__) + '../data/xml'):
  fileData = parseFile([], fn)
  data.append(fileData)

# ANALYSIS

# Event / Actor counts
count = [0,0,0,0,0,0]
maxCount = [0,0,0,0,0,0]

for d in data:
  for i in range(6):
    if d[i] > 0:
      count[i] += 1
    if d[i] > maxCount[i]:
      maxCount[i] = d[i]

print "Production events  " + str(count[0]) + " / " + str(len(data)) + " -> " + str((count[0] / float(len(data))) * 100) + "%"
print "Finding events     " + str(count[1]) + " / " + str(len(data)) + " -> " + str((count[1] / float(len(data))) * 100) + "%"
print "Provenance events  " + str(count[2]) + " / " + str(len(data)) + " -> " + str((count[2] / float(len(data))) * 100) + "%"

print "-----------------"
print "Max production events per item   " + str(maxCount[0])
print "Max finding events per item     " + str(maxCount[1])
print "Max provenance events per item  " + str(maxCount[2])

print "-----------------"
print "Production actors found in  " + str(count[3]) + " / " + str(len(data)) + " -> " + str((count[3] / float(len(data))) * 100) + "%"
print "Finding actors found in     " + str(count[4]) + " / " + str(len(data)) + " -> " + str((count[4] / float(len(data))) * 100) + "%"
print "Provenance actors found in  " + str(count[5]) + " / " + str(len(data)) + " -> " + str((count[5] / float(len(data))) * 100) + "%"

print "-----------------"
print "Max actors found in production  " + str(maxCount[3])
print "Max actors found in finding     " + str(maxCount[4])
print "Max actors found in provenance  " + str(maxCount[5])


# Different Roles
rolesUniq = [[],[],[]]
rolesCount = [[],[],[]]

for d in data:
  for i in range(3):
    index = i + 6
    roles = d[index]
    for role in roles:
      if role not in rolesUniq[i]:
        rolesCount[i].append(1)
        rolesUniq[i].append(role)
      else:
        rolesCount[i][rolesUniq[i].index(role)] += 1

print "-----------------"
print "Roles found in production: "
for i, role in enumerate(rolesUniq[0]):
  print role + " " + str(rolesCount[0][i])
print "Max occurence: " + str(max(rolesCount[0]))
print "Roles found in finding: " + ", ".join(rolesUniq[1])
print "Roles found in provenance: " + ", ".join(rolesUniq[2])
for i, role in enumerate(rolesUniq[2]):
  print role + " " + str(rolesCount[2][i])