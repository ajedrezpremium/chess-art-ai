// Mapeador único catálogo → ficha de galería.
// Garantiza que TODA obra muestre: imagen real (o placeholder con fallback),
// nombre, lugar/país, fecha, texto breve, fuente y enlace oficial/público.
import type { ArtWork, ArtSource } from './art-catalogue';
import { ART_IMAGE_OVERRIDES } from './art-image-overrides';
import type { GalleryItem, GallerySource } from '@/components/gallery/GalleryPage';

export type { GalleryItem };

// Inferencia de país desde etiquetas/nota cuando la ficha no lo trae.
// Solo topónimos explícitos ya presentes en los datos curados.
const COUNTRY_HINTS: Array<[RegExp, string]> = [
  [/italia|italian[oa]|venecia|bolonia|florencia|roma\b|n[aá]poles|mil[aá]n|tur[ií]n|g[eé]nova|siena|padua|verona|lombard[íi]a|toscana/gi, 'Italia'],
  [/francia|franc[ée]s|par[íi]s|borgo[ñn]a|provenza|lyon|marsella/gi, 'Francia'],
  [/espa[ñn]a|espa[ñn]ol|madrid|barcelona|valencia|sevilla|toledo|c[óo]rdoba|granada|al-andalus|andalus[íi]|castilla|arag[óo]n|extreme[ñn]o/gi, 'España'],
  [/holanda|holand[ée]s|pa[ií]ses bajos|amsterdam|[aá]msterdam|la haya|delft|utrecht/gi, 'Países Bajos'],
  [/b[eé]lgica|flandes|flamenco|amberes|brujas|bruselas|gante/gi, 'Bélgica'],
  [/alemania|alem[áa]n|berl[íi]n|m[úu]nich|dresde|leipzig|weimar|baviera|prusiano|nuremberg|frankfurt|hamburgo/gi, 'Alemania'],
  [/austria|austr[íi]aco|viena|salzburgo|innsbruck/gi, 'Austria'],
  [/suiza|zurich|z[úu]rich|ginebra|basilea|berna/gi, 'Suiza'],
  [/reino unido|inglaterra|ingl[ée]s|londres|york|oxford|cambridge|escocia|escoc[ée]s|edimburgo|irlanda|dubl[íi]n|gales/gi, 'Reino Unido'],
  [/ee\.? ?uu\.?|estados unidos|americano|nueva york|filadelfia|boston|chicago|hollywood|california|texas|harlem/gi, 'EE. UU.'],
  [/rusia|ruso|sovi[ée]tico|urss|mosc[úu]|leningrado|san petersburgo|kiev/gi, 'Rusia / URSS'],
  [/suecia|sueco|estocolmo|täby|taby|gotemburgo/gi, 'Suecia'],
  [/noruega|oslo|bergen/gi, 'Noruega'],
  [/dinamarca|dan[ée]s|copenhague/gi, 'Dinamarca'],
  [/finlandia|helsinki/gi, 'Finlandia'],
  [/polonia|polaco|varsovia|cracovia|poznan|pozna[ńn]/gi, 'Polonia'],
  [/hungr[íi]a|budapest/gi, 'Hungría'],
  [/chequia|checo|praga|bohemia/gi, 'Chequia'],
  [/ruman[íi]a|bucarest/gi, 'Rumanía'],
  [/grecia|griego|atenas/gi, 'Grecia'],
  [/portugal|portugu[ée]s|lisboa|oporto/gi, 'Portugal'],
  [/venezuela|venezolano|caracas/gi, 'Venezuela'],
  [/argentina|argentino|buenos aires/gi, 'Argentina'],
  [/m[ée]xico|mexicano|ciudad de m[ée]xico/gi, 'México'],
  [/cuba|cubano|la habana/gi, 'Cuba'],
  [/brasil|brasile[ñn]o|sao paulo|r[íi]o de janeiro/gi, 'Brasil'],
  [/egipto|egipcio|el cairo|alejandr[íi]a|luxor/gi, 'Egipto'],
  [/marruecos|marroqu[íi]|fez|marrakech|rabat/gi, 'Marruecos'],
  [/iran|persa|teher[áa]n/gi, 'Irán'],
  [/india|indio|delhi|bombay|calcuta/gi, 'India'],
  [/china|chino|pek[íi]n|shangh[áa]i|cant[óo]n/gi, 'China'],
  [/jap[óo]n|japon[ée]s|tokio|kioto|osaka/gi, 'Japón'],
  [/islandia|reikiavik|reykjavik/gi, 'Islandia'],
];

function inferCountry(w: ArtWork): string | undefined {
  const hay = `${w.tags.join(' ')} ${w.note} ${w.chessNote || ''} ${w.artist} ${w.institution || ''}`;
  for (const [re, country] of COUNTRY_HINTS) {
    if (re.test(hay)) return country;
  }
  return undefined;
}

function commonsSearchUrl(w: ArtWork): string {
  const q = encodeURIComponent(`${w.artist} ${w.title} ajedrez`);
  return `https://commons.wikimedia.org/w/index.php?search=${q}&title=Special:MediaSearch&type=image`;
}

export function mapArtWorkToItem(w: ArtWork): GalleryItem {
  const ov = ART_IMAGE_OVERRIDES[w.id];
  const image = ov?.image || w.image;

  const sources: GallerySource[] =
    (w.sources || []).map((s: ArtSource) => ({ name: s.name, type: s.type, url: s.url }));
  if (ov) {
    sources.unshift({
      name: 'Wikimedia Commons - imagen (verificada)',
      type: 'digital_library',
      url: ov.filePage,
    });
  }
  if (sources.length === 0) {
    sources.push({
      name: 'Wikimedia Commons - búsqueda pública',
      type: 'digital_library',
      url: commonsSearchUrl(w),
    });
  }

  const place = [w.institution, w.city, w.country].filter(Boolean).join(', ');
  const location = place || inferCountry(w);

  return {
    id: w.id,
    title: w.title,
    image,
    category: w.category,
    year: w.year,
    author: w.artist,
    description: w.chessNote ? `${w.note} ${w.chessNote}` : w.note,
    tags: w.tags,
    type: w.category,
    period: w.period,
    location: location || undefined,
    license: w.license || (ov ? 'Ver licencia en Wikimedia Commons' : undefined),
    chessRole: w.chessRole,
    sources,
  };
}
