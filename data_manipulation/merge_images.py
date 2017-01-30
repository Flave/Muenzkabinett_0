import os, sys
from PIL import Image
from PIL import ImageFilter
from random import randint
import csv
import tinify

coin_ids = csv.reader(open(os.path.dirname(__file__) + '../data/csv/coins_raw.csv'), delimiter=",")
keys = coin_ids.next()
tinify.key = "LtNfjPbJz6Cxj_kN8EdQT4SjHN1wCRBj"

merged_image = Image.new('RGBA', (1, 1))
sprite_sheet_specs = [["x", "y", "width", "height"]]
num_rows = 0
x_pos = 0
coins_per_sheet = 5000
sheet_index = 0
threshold = 240
blur = 1.7
shadow_size = 3
thumb_height = 31
coin_height = thumb_height - shadow_size * 2
coin_ids = list(coin_ids)

keys.append("x")
keys.append("y")
keys.append("width")
keys.append("height")

def make_white_transparent(img):
  datas = img.getdata()
  new_data = []
  for item in datas:
      brightness = (item[0] + item[1] + item[2])/3
      if brightness >= threshold:
          new_data.append((255, 255, 255, 255 - brightness))
      else:
          new_data.append(item)
  new_image = Image.new(img.mode, img.size)
  new_image.putdata(new_data)
  return new_image

def calculate_image_width(img, height):
  original_width, original_height = img.size
  return original_width * height / original_height

def create_shadow(img):
  datas = img.getdata()
  new_data = []
  for item in datas:
      if item[3] > 255 - threshold:
          new_data.append((0, 0, 0, 180))
      else:
          new_data.append((255, 255, 255, 0))
  mask = Image.new(img.mode, img.size)
  mask.putdata(new_data)
  new_width, new_height = img.size
  new_image = Image.new(img.mode, (new_width + shadow_size * 2, new_height + shadow_size * 2))
  new_image.paste(mask, (3, 3))
  new_image = new_image.filter(ImageFilter.GaussianBlur(blur))
  return new_image


for i, coin_data in enumerate(coin_ids):
  coin_id = coin_data[0]
  img = Image.open('../data/images/thumbs_front/thumb_front_182' + str(coin_id) + ".jpg")
  img = img.convert("RGBA")
  img = img.resize((calculate_image_width(img, coin_height), coin_height))
  new_thumb = make_white_transparent(img)
  shadow_thumb = create_shadow(new_thumb)
  shadow_thumb.paste(new_thumb, (3, 3), new_thumb)

  # create new image and paste current coin into it
  if i % 50 == 0:
    num_rows += 1
    x_pos = 0

  # calculate new image size
  new_thumb_width, new_thumb_height = shadow_thumb.size
  merged_width, merged_height = merged_image.size

  new_height = num_rows * thumb_height
  new_width = x_pos + new_thumb_width if (x_pos + new_thumb_width) > merged_width else merged_width
  y_pos = (num_rows - 1) * thumb_height

  if i == 0:
    new_width -= 1

  # create new image from old merged image and paste thumb into it
  new_image_size = (new_width, new_height)
  new_merged_image = Image.new("RGBA", new_image_size)
  new_merged_image.paste(merged_image, (0,0))

  new_merged_image.paste(shadow_thumb, (x_pos, y_pos))
  coin_data.append(x_pos)
  coin_data.append(y_pos)
  coin_data.append(new_thumb_width)
  coin_data.append(new_thumb_height)

  x_pos += new_thumb_width
  merged_image = new_merged_image
  print coin_id

  # if coins_per_sheet or end of coins is reached save image and compress
  if (i + 1) % coins_per_sheet == 0 or (i == (len(coin_ids) - 1)):
    # end_index = i if i == (len(coin_ids) - 1) else (sheet_index + 1) * coins_per_sheet
    # image_file_name = 'coins_sprites_' + str(thumb_height) + '_' + str(sheet_index * coins_per_sheet) + '_' + str(end_index) + '_unoptimised'
    # image_file_path = '../data/images/sprites/' + image_file_name + '.png'
    # merged_image.save(image_file_path, "PNG")
    # # compress the image just created and save it again
    # print "Optimising image " + str(sheet_index)
    # source = tinify.from_file(image_file_path)
    # source.to_file(image_file_path[:-16] + ".png")
    # reset all the variables
    merged_image = Image.new('RGBA', (1, 1))
    sheet_index += 1
    num_rows = 0
    x_pos = 0

coins_file = open(os.path.dirname(__file__) + '../data/csv/coins.csv', 'w')

# re-insert keys
coin_ids.insert(0, keys)
writer = csv.writer(coins_file)
writer.writerows(coin_ids)
coins_file.close()