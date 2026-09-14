import re, io, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
src = open("src/lib/data/art-catalogue.ts", encoding="utf-8").read()
r = json.load(open("scripts/commons-report.json", encoding="utf-8"))
seen = set()
for m in r["matched"]:
    i = m["id"]
    if i in seen:
        continue
    seen.add(i)
    g = re.search(re.escape("w('" + i + "'") + r"[^\n]*", src)
    print(i, "|", (g.group(0)[:130] if g else "NO ENCONTRADA"), "|", m["file"][:80])
