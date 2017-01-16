import os, sys
from PIL import Image

image = Image.open('../data/images/thumb_front_18236834.jpg')

# box = (20, 20, 50, 50)
# image = image.resize((15, 15))
# r, g, b = image.split()
# print r.size
# print g.size
# print b.size
# # im = Image.merge("RGB", (b, g, r))
# image.save('../data/images/test_converted.png', "PNG")

img = Image.open('../data/images/thumb_front_18236844.jpg')
img = img.convert("RGBA")
img = img.resize((15, 15))

datas = img.getdata()

threshold = int(sys.argv[1])
newData = []
for item in datas:
    if item[0] > threshold and item[1] > threshold and item[2] > threshold:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

img.putdata(newData)
img.save('../data/images/test_converted.png', "PNG")