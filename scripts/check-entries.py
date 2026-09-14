import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
src = open("src/lib/data/art-catalogue.ts", encoding="utf-8").read()
ids = ["art-040","art-042","art-047","art-050","art-051","art-053","art-054","art-055",
"art-059","art-060","art-065","art-076","art-079","art-082","art-085","art-088",
"art-113","art-118","art-121","art-124","art-132","art-135","art-137","art-145",
"art-148","art-151","art-157","art-158","art-165","art-185","art-186","art-187",
"art-189","art-200"]
for i in ids:
    m = re.search(re.escape("w('" + i + "'") + r"[^\n]*", src)
    print(i, (m.group(0)[:160] if m else "NO ENCONTRADA"))
