import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
src = open("src/lib/data/combinations.ts", encoding="utf-8").read()
# Extraer bloques: slug, pgn y fen de cada demo
slugs = re.findall(r"slug:\s*'([^']+)'", src)
fens = re.findall(r"fen:\s*'([^']+)'", src)
pgns = re.findall(r"pgn:\s*`([^`]+)`", src)
print("combos:", len(slugs), "fens:", len(fens), "pgns:", len(pgns))
for s, f in zip(slugs, fens):
    print(s, "->", f[:60])
open("scripts/_pgns.txt", "w", encoding="utf-8").write("\n====\n".join(pgns))
