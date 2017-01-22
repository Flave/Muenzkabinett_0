import sys
import os

in_file = sys.argv[1]
out_file = sys.argv[2]
base_64_file = open(os.path.dirname(__file__) + out_file, 'w')
with open(os.path.dirname(__file__) + in_file, "rb") as f:
  data = f.read()
  data_encoded = data.encode("base64")
  base_64_file.write(data_encoded)
  base_64_file.close()