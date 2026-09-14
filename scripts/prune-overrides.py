import re, io, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
BLOCK = ["art-017","art-040","art-050","art-051","art-053","art-054","art-055",
"art-059","art-060","art-065","art-070","art-079","art-082","art-085","art-088",
"art-113","art-118","art-121","art-124","art-135","art-137","art-148","art-157",
"art-158","art-165","art-185","art-186","art-187","art-189","art-200"]
p = "src/lib/data/art-image-overrides.ts"
src = open(p, encoding="utf-8").read()
m = re.search(r"= (\{[\s\S]*\});\s*$", src)
d = json.loads(m.group(1))
removed = [b for b in BLOCK if b in d]
for b in removed:
    del d[b]
header = ("// Generado por scripts/enrich-commons.mjs — NO editar a mano.\n"
"// Imágenes reales verificadas en Wikimedia Commons (apellido+título/ajedrez).\n"
"// Revisión manual: eliminados falsos positivos (fotos genéricas repetidas).\n"
"// Ver scripts/commons-report.json para el detalle.\n"
"export interface ArtImageOverride { image: string; filePage: string; width?: number }\n\n"
"export const ART_IMAGE_OVERRIDES: Record<string, ArtImageOverride> = ")
open(p, "w", encoding="utf-8").write(header + json.dumps(d, indent=2, ensure_ascii=False) + ";\n")
print("eliminadas:", len(removed), "quedan:", len(d))
