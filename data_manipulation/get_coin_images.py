import urllib
import os
from lxml import etree

ns = {'lido': 'http://www.lido-schema.org', 'xml': 'someuri'}

for fn in os.listdir(os.path.dirname(__file__)  + './../data/xml'):
  tree = etree.parse(os.path.dirname(__file__)  + '../data/xml/' + fn)
  image = tree.xpath('//lido:resourceSet/lido:resourceRepresentation[@lido:type="image_thumb"]/lido:linkResource/text()', namespaces=ns)[0]
  urllib.urlretrieve(image, os.path.dirname(__file__) + "../data/images/thumbs_front/thumb_front_" + fn[0:-4] + ".jpg")
  print fn