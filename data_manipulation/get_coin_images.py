import urllib
import os
from lxml import etree
import re
from PIL import Image
import cStringIO
import sys
import csv

ns = {'lido': 'http://www.lido-schema.org', 'xml': 'someuri'}

coins = csv.reader(open(os.path.dirname(__file__) + '../data/csv/coins_extended.csv'), delimiter=",")
keys = coins.next()
coins = list(coins)

output_height = 300

start_index = int(sys.argv[1])
if len(sys.argv) > 2:
  end_index = int(sys.argv[2])
else:
  end_index = None


def make_white_transparent(img):
  datas = img.getdata()
  threshold = 245
  new_data = []
  for item in datas:
      if item[0] >= threshold and item[1] >= threshold and item[2] >= threshold:
          new_data.append((255, 255, 255, 0))
      else:
          new_data.append(item)
  new_image = Image.new(img.mode, img.size)
  new_image.putdata(new_data)
  return new_image

def calculate_image_width(img, height):
  original_width, original_height = img.size
  return original_width * height / original_height

for i, coin in enumerate(coins[start_index:end_index]):
  thumb_url_front = coin[4]
  image_id = re.search(r'\/(\w\d+\/\d+)\/', thumb_url_front)


  if image_id:
    print i
    print coin[0]
    print thumb_url_front
    
    if image_id.group(1) == "1629":
      continue
      #sys.exit()

    image_id = image_id.group(1)
    large_url_front = "http://ww2.smb.museum/mk_edit/images/" + image_id + "/vs_org.jpg"

    image_file = cStringIO.StringIO(urllib.urlopen(large_url_front).read())
    img = Image.open(image_file)
    img = img.convert("RGBA")
    img_transparent = make_white_transparent(img)
    img_resized = img_transparent.resize((calculate_image_width(img_transparent, output_height), output_height))

    img_resized.save('../data/images/thumbs_front_m/' + coin[0] + '.png', "PNG")

    # urllib.urlretrieve(large_url_front, os.path.dirname(__file__) + "../data/images/large_front/large_front_" + fn[0:-4] + ".jpg")
    # print i, fn
    # urllib.urlretrieve(thumb_url_front, os.path.dirname(__file__) + "../data/images/thumbs_front/thumb_front_" + fn[0:-4] + ".jpg")

  else:
    continue