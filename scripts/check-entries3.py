import re, io, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
src = open("src/lib/data/art-catalogue.ts", encoding="utf-8").read()
ovsrc = open("src/lib/data/art-image-overrides.ts", encoding="utf-8").read()
m = re.search(r"= (\{[\s\S]*\});\s*$", ovsrc)
d = json.loads(m.group(1))
for i in sorted(d.keys()):
    g = re.search(re.escape('w(\'' + i + "'") + r"[^\n]*", src)
    print(i, "|", (g.group(0)[:110] if g else "EXPANDIDA"), "|", d[i]["filePage"][-70:])
