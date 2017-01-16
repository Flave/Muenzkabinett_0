#!/usr/bin/python
# -*- coding: utf-8 -*-
import time
import re

start = time.clock()
print start
the_id = "18013086"
viaf_file = open('../data/viaf/viaf-20170101-links.txt')
viaf_data = viaf_file.readlines()

for line in viaf_data:
  if the_id in line:
    print line
  # regex = "http\:\/\/viaf\.org\/viaf\/" + the_id + "$"
  # if re.match(re.compile(regex), line):
  #   print line  

# with open('../data/viaf/viaf-20170101-links.txt') as infile:
#     for line in infile:
#       regex = "http\:\/\/viaf\.org\/viaf\/" + the_id + "$"
#       if re.match(re.compile(regex), line):
#         print line
print time.clock() - start