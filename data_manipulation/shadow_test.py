from PIL import ImageFilter
from PIL import Image

threshold = 240

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
          new_data.append((0, 0, 0, 150))
      else:
          new_data.append((255, 255, 255, 0))
  mask = Image.new(img.mode, img.size)
  mask.putdata(new_data)
  new_width, new_height = img.size
  new_image = Image.new(img.mode, (new_width + 6, new_height + 6))
  new_image.paste(mask, (2,2))
  new_image = new_image.filter(ImageFilter.GaussianBlur(1.5))
  return new_image


img = Image.open('../data/images/thumbs_front/thumb_front_18200002.jpg')
img = img.convert("RGBA")
img = img.resize((calculate_image_width(img, 30), 30))
new_thumb = make_white_transparent(img)
black_thumb = create_shadow(new_thumb)
black_thumb.paste(new_thumb, (2,2), new_thumb)

black_thumb.save("../data/images/shadow_test.png", "PNG")