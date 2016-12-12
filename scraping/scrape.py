#!/usr/bin/python
# -*- coding: utf-8 -*-

from lxml import html
import requests
import json

data = {}
data['keys'] = ['front','back','class','date','denomination','material','weight','diameter','stamp','place','region','country','tag','epoch','accession','previous_owner','id']
data['items'] = []
for id in range(4000, 6000):
  coinId = "182" + str(id).zfill(5)
  page = requests.get('http://ww2.smb.museum/ikmk/object.php?id=' + coinId)
  tree = html.fromstring(page.content)
  object_info = tree.xpath('//div[@id="objektInfo"]')
  fields = []

  if(len(object_info) == 0): continue

  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "zstand")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Datierung")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Nominal")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Material")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Gewicht")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Durchmesser")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Stempelstg.")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "tte")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Region")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Land")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Sachbegriff")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Abteilung")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Accession")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Vorbesitzer")]/following-sibling::div/text()'))
  fields.append(tree.xpath('//div[@id="objektInfo"]/div[@class="absatz"]/div[@class="parameter" and contains(text(), "Objektnummer")]/following-sibling::div/text()'))

  for (i, value) in enumerate(fields):
    if value is not None:
      if (len(value) > 0):
        fields[i] = value[0].rstrip().lstrip()
      else:
        fields[i] = None
    else:
      fields[i] = None

  if value is not None:
    data['items'].append(fields)
    if(len(fields[14]) > 0):
      print 'id: ' + fields[14]
    else:
      print('===> No ID')
  else:
    print('===> No ID')


with open('data.json', 'w') as outfile:
    json.dump(data, outfile)