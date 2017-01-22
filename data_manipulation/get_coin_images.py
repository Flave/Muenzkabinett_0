import urllib
import os
from lxml import etree
import re
from PIL import Image
import cStringIO
import sys

ns = {'lido': 'http://www.lido-schema.org', 'xml': 'someuri'}

def make_white_transparent(img):
  datas = img.getdata()
  threshold = 251 #int(sys.argv[1])
  new_data = []
  for item in datas:
      if item[0] >= threshold and item[1] >= threshold and item[2] >= threshold:
          new_data.append((255, 255, 255, 0))
      else:
          new_data.append(item)
  new_image = Image.new(img.mode, img.size)
  new_image.putdata(new_data)
  return new_image

for i, fn in enumerate(os.listdir(os.path.dirname(__file__)  + './../data/xml')):
  tree = etree.parse(os.path.dirname(__file__)  + '../data/xml/' + fn)
  thumb_url_front = tree.xpath('//lido:resourceSet/lido:resourceRepresentation[@lido:type="image_thumb"]/lido:linkResource/text()', namespaces=ns)[0]
  image_id = re.search(r'\/(\w\d+\/\d+)\/', thumb_url_front)

  if image_id:
    print fn
    if image_id.group(1) == "1629":
      sys.exit()

  #   image_id = image_id.group(1)
  #   thumb_url_back = "http://ww2.smb.museum/mk_edit/images/" + image_id + "/rs_thumb.jpg"
  #   # large_url_front = "http://ww2.smb.museum/mk_edit/images/" + image_id + "/vs_org.jpg"

  #   # image_file = cStringIO.StringIO(urllib.urlopen(large_url_front).read())
  #   # img = Image.open(image_file)
  #   # img = img.convert("RGBA")
  #   # img_transparent = make_white_transparent(img)
  #   # print img_transparent is img
  #   # img_s = img_transparent.resize((400, 400))
  #   # print img_s.size
  #   # img_s.save('../data/images/thumbs_edited/' + fn[0:-4] + '_3.png', "PNG")

  #   #urllib.urlretrieve(large_url_front, os.path.dirname(__file__) + "../data/images/large_front/large_front_" + fn[0:-4] + ".jpg")
  #   print i, fn
  #   urllib.urlretrieve(thumb_url_front, os.path.dirname(__file__) + "../data/images/thumbs_front/thumb_front_" + fn[0:-4] + ".jpg")
  # else:
  #   continue