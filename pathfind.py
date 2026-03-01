import re

with open('script.js', 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'const MAP_DATA = \[([\s\S]*?)\];', text)
map_data_str = "[" + match.group(1) + "]"
map_data = eval(map_data_str)

ROWS = 18
COLUMNS = 48

def print_map(m):
    for r in range(ROWS):
        s = ""
        for c in range(COLUMNS):
            if m[r][c] == 1: s += "█"
            elif m[r][c] == 2: s += "S"
            elif m[r][c] == 3: s += "E"
            elif m[r][c] == 4: s += "T"
            elif m[r][c] == 9: s += "."
            else: s += " "
        print(s)

# Punch some holes first based on visual inspection
# R15 E is blocked by C36. Let's make R15 C36 = 0
map_data[15][36] = 0

# Let's break down the middle wall at R8
for c in range(1, COLUMNS-1):
    if c % 4 == 0:
        map_data[8][c] = 0
        map_data[9][c] = 0

# R11 has a huge block of 0s, but maybe blocked laterally
# Let's just do a Flood Fill
visited = set()
q = [(1,1)]
while q:
    r, c = q.pop(0)
    if (r,c) in visited: continue
    visited.add((r,c))
    for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
        nr, nc = r+dr, c+dc
        if 0 <= nr < ROWS and 0 <= nc < COLUMNS:
            if map_data[nr][nc] != 1 and (nr, nc) not in visited:
                q.append((nr, nc))

for r in range(ROWS):
    for c in range(COLUMNS):
        if map_data[r][c] == 0 and (r,c) in visited:
            map_data[r][c] = 9 # reachable

print("Reachable tiles marked as .")
print_map(map_data)

# See what's missing
if (15,46) in visited:
    print("END IS REACHABLE!")
else:
    print("END IS NOT REACHABLE!")
    
    # We can connect unreachable components
    # Find all 0s not in visited and break a wall next to them? Easier to just create a path.

# Output the modified array
out_str = "[\n"
for r in range(ROWS):
    clean_row = [1 if x==1 else (3 if x==3 else (2 if x==2 else (4 if x==4 else 0))) for x in map_data]
    out_str += "    " + str(clean_row) + ",\n"
out_str += "]"
with open('new_map.txt', 'w') as f:
    f.write(out_str)

