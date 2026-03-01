import re

with open('script.js', 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'const MAP_DATA = \[([\s\S]*?)\];', text)
if not match:
    print("Not found")
    exit()

map_data_str = "[" + match.group(1) + "]"
map_data = eval(map_data_str)

ROWS = 18
COLUMNS = 48

for r in range(ROWS):
    row_str = ""
    for c in range(COLUMNS):
        val = map_data[r][c]
        if val == 1: row_str += "1"
        elif val == 2: row_str += "S"
        elif val == 3: row_str += "E"
        elif val == 4: row_str += "T"
        else: row_str += "."
    print(f"{r:2d}: {row_str}")
