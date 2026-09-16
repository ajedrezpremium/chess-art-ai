// Catálogo curatorial de 200 obras y expresiones artísticas donde el ajedrez
// es protagonista. Fuente: selección del director (2 volúmenes, deduplicados).
// Cada ficha alimenta las galerías (arte/libros/cine/música) y el RAG ligero
// del agente (ver src/lib/ai/art-knowledge.ts).
// `image`: ruta local en public/artworks. Mientras no exista la imagen real,
// las galerías usan el placeholder de la disciplina + fallback automático.

export interface ArtSource {
  name: string;
  type: 'official_museum' | 'digital_library' | 'imdb' | 'academic' | 'wikipedia' | 'youtube';
  url: string;
}

export type ChessRole = 'central_theme' | 'metaphor' | 'prop_object' | 'historical_record';

/** Categorías del esquema curatorial (v. propuesta tech /obras). */
export type SchemaCategory =
  | 'pintura_clasica'
  | 'arte_moderno_vanguardias'
  | 'escultura_instalaciones'
  | 'manuscritos_libros'
  | 'carteleria_grafismo'
  | 'cine_audiovisual'
  | 'fotografia'
  | 'musica_ballet'
  | 'arte_urbano_diseno';

export interface ArtWork {
  id: string;
  discipline: 'art' | 'books' | 'cinema' | 'music';
  category: string;
  title: string;
  artist: string;
  year: string;
  note: string;
  tags: string[];
  image: string;
  // --- Campos del esquema curatorial (opcionales; se rellenan de forma gradual y verificada) ---
  titleEn?: string;
  titleOriginal?: string;
  nationality?: string;
  birthYear?: number | null;
  deathYear?: number | null;
  period?: string;
  institution?: string;
  city?: string;
  country?: string;
  license?: string;
  chessRole?: ChessRole;
  chessNote?: string;
  sources?: ArtSource[];
  schemaCategory?: SchemaCategory;
}

/** Slug estable para futuras rutas dinámicas (/obras/[slug] con generateStaticParams). */
export function workSlug(w: Pick<ArtWork, 'artist' | 'title' | 'year'>): string {
  const base = `${w.artist} ${w.title} ${w.year}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base.slice(0, 90) || 'obra';
}

/** Deriva la categoría del esquema curatorial desde (disciplina, categoría local, año). */
export function toSchemaCategory(w: Pick<ArtWork, 'discipline' | 'category' | 'year' | 'schemaCategory'>): SchemaCategory {
  if (w.schemaCategory) return w.schemaCategory as SchemaCategory;
  const y = parseInt((w.year.match(/\d{3,4}/) || ['0'])[0], 10);
  switch (w.discipline) {
    case 'books':
      return 'manuscritos_libros';
    case 'cinema':
      return 'cine_audiovisual';
    case 'music':
      return 'musica_ballet';
    default:
      break;
  }
  switch (w.category) {
    case 'sculpture':
      return 'escultura_instalaciones';
    case 'photography':
      return 'fotografia';
    case 'print':
      return 'carteleria_grafismo';
    case 'urban':
    case 'digital':
      return 'arte_urbano_diseno';
    default:
      break;
  }
  return y !== 0 && y < 1800 ? 'pintura_clasica' : 'arte_moderno_vanguardias';
}

const img = (d: ArtWork['discipline']) =>
  d === 'art' ? '/artworks/art.svg'
  : d === 'books' ? '/artworks/books.svg'
  : d === 'cinema' ? '/artworks/cinema.svg'
  : '/artworks/music.svg';

function w(
  id: string, discipline: ArtWork['discipline'], category: string,
  title: string, artist: string, year: string, note: string, tags: string[],
): ArtWork {
  return { id, discipline, category, title, artist, year, note, tags, image: img(discipline) };
}

export const ART_CATALOGUE: ArtWork[] = [
// ---- Pintura clásica y Renacimiento (1-10) ----
{
    ...w('art-001','art','painting',"El juego de ajedrez","Sofonisba Anguissola","1555","Retrato de tres hermanas jugando al ajedrez; una de las primeras representaciones femeninas del juego.",["Renacimiento","Italia","Mujeres en el ajedrez"]),
    titleEn: 'The Chess Game',
    titleOriginal: 'Il gioco degli scacchi',
    nationality: 'Italiana',
    birthYear: 1532,
    deathYear: 1625,
    period: 'Renacimiento',
    institution: 'Muzeum Narodowe w Poznaniu',
    city: 'Poznań',
    country: 'Polonia',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Pintura renacentista que retrata a las hermanas de la artista jugando una partida, destacando la dimensión intelectual de la mujer en el Renacimiento.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_Chess_Game_-_Sofonisba_Anguissola.jpg',
    sources: [
      { name: 'Muzeum Narodowe w Poznaniu', type: 'official_museum', url: 'https://mnp.art.pl/' },
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:The_Chess_Game_-_Sofonisba_Anguissola.jpg' },
      { name: 'Wikipedia - El juego de ajedrez', type: 'wikipedia', url: 'https://es.wikipedia.org/wiki/El_juego_de_ajedrez_(Sofonisba_Anguissola)' },
    ],
  },
w('art-002','art','painting',"Los jugadores de ajedrez","Lucas van Leyden","c. 1508","Partida en interior flamenco, testimonio temprano del ajedrez en la pintura del norte.",["Renacimiento","Flandes"]),
w('art-003','art','painting',"Los jugadores de ajedrez","Giulio Campi","c. 1530","Escena cortesana lombarda en torno al tablero.",["Renacimiento","Italia"]),
w('art-004','art','painting',"El juego de ajedrez","Liberale da Verona","c. 1475","Una de las representaciones pictóricas más antiguas del ajedrez europeo.",["Quattrocento","Italia"]),
{
    ...w('art-005','art','painting',"Los jugadores de ajedrez","Paris Bordone","c. 1545","Elegante escena veneciana de juego entre caballeros.",["Renacimiento","Venecia"]),
    titleEn: 'Two Chess Players',
    nationality: 'Italiana',
    birthYear: 1500,
    deathYear: 1571,
    period: 'Renacimiento',
    country: 'Italia',
    license: 'Public Domain',
    chessRole: 'central_theme',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Paris_Bordone_(1500_-_1571)_-_Two_Chess_Players_-_169_-_Gemäldegalerie.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Paris_Bordone_(1500_-_1571)_-_Two_Chess_Players_-_169_-_Gem%C3%A4ldegalerie.jpg' },
    ],
  },
w('art-006','art','painting',"Los jugadores de ajedrez","Karel van Mander","c. 1600","El teórico del arte flamenco también pintó el juego.",["Barroco temprano","Flandes"]),
w('art-007','art','painting',"Jugadores de ajedrez","Ludovico Carracci","c. 1590","Naturalismo boloñés aplicado a una partida doméstica.",["Barroco","Bolonia"]),
w('art-008','books','history',"El juego de ajedrez (ilustración de manuscrito)","Francesco di Giorgio Martini","s. XV","Ilustración de manuscrito renacentista sobre el juego.",["Manuscrito","Renacimiento","Italia"]),
w('art-009','art','painting',"Apolo y Marte jugando al ajedrez","Alessandro Varotari (Il Padovanino)","c. 1630","Alegoría mitológica: dioses enfrentados sobre el tablero.",["Barroco","Mitología"]),
w('art-010','art','painting',"Los jugadores de ajedrez","Cornelis de Man","c. 1670","Interior holandés del Siglo de Oro con partida en curso.",["Siglo de Oro","Holanda"]),
// ---- Arte moderno y vanguardias (11-25) ----
w('art-011','art','painting',"Jugadores de ajedrez","Marcel Duchamp","1911","Duchamp, ajedrecista apasionado, pinta el juego antes del cubismo pleno.",["Cubismo","Vanguardia"]),
w('art-012','art','painting',"Retrato de jugadores de ajedrez","Marcel Duchamp","1911","Estudio cubista de figuras concentradas ante el tablero.",["Cubismo","Vanguardia"]),
w('art-013','art','photography',"Juego de ajedrez surrealista","Man Ray","1920","Fotografía de vanguardia con el tablero como objeto poético.",["Surrealismo","Fotografía"]),
w('art-014','art','painting',"La familia del artista (Jugando al ajedrez)","Henri Matisse","1911","Escena doméstica fauvista con el ajedrez como ritual familiar.",["Fauvismo","Francia"]),
w('art-015','art','painting',"Superficie de ajedrez / Gran cuadro de ajedrez","Paul Klee","1937","Abstracción construida sobre la retícula del damero.",["Bauhaus","Abstracción"]),
w('art-016','art','sculpture',"Juego de ajedrez surrealista con rostros","Salvador Dalí","1964","Diseño de piezas daliniano donde cada figura es un rostro.",["Surrealismo","Diseño"]),
w('art-017','art','sculpture',"El rey jugando con la reina","Max Ernst","1944","Pieza-escultura surrealista nacida en el exilio americano.",["Surrealismo","Escultura"]),
w('art-018','art','painting',"El tablero de ajedrez","Juan Gris","1917","Naturaleza muerta cubista articulada en torno al tablero.",["Cubismo","España/Francia"]),
w('art-019','art','painting',"El juego de ajedrez","Jean Metzinger","1911","Composición cubista de jugadores fragmentados por el análisis.",["Cubismo","Francia"]),
w('art-020','art','painting',"Jugadores de ajedrez","John Singer Sargent","1907","Retrato mundano de la élite jugando, de pincelada virtuosa.",["Impresionismo","EEUU"]),
w('art-021','art','painting',"Los jugadores de ajedrez","Honoré Daumier","c. 1863","Sátira social parisina con dos burgueses absortos.",["Realismo","Francia"]),
w('art-022','art','painting',"Arnautes jugando al ajedrez","Jean-Léon Gérôme","1859","Orientalismo académico: soldados albaneses ante el tablero.",["Academicismo","Orientalismo"]),
w('art-023','art','painting',"Composición con damero","Vasily Kandinsky","años 1920","Estudios de retícula donde el tablero se vuelve música visual.",["Abstracción","Bauhaus"]),
w('art-024','art','painting',"Jugadores de ajedrez","Kuzma Petrov-Vodkin","1926","Mirada rusa postrevolucionaria sobre el juego silencioso.",["Rusia","Siglo XX"]),
w('art-025','art','painting',"El juego de ajedrez","Théo van Rysselberghe","1903","Puntillismo belga: la partida disuelta en puntos de luz.",["Neoimpresionismo","Bélgica"]),
// ---- Escultura e instalaciones (26-35) ----
w('art-026','art','sculpture',"Piezas del ajedrez de Lewis","Anónimo (Isla de Lewis)","s. XII","Legendarias figuras en marfil de morsa; Museo Británico.",["Medieval","Marfil","Escocia"]),
w('art-027','art','sculpture',"Juego de ajedrez de la Bauhaus","Man Ray","1920","Diseño geométrico en madera, pura forma moderna.",["Bauhaus","Diseño"]),
w('art-028','art','sculpture',"Ajedrez Bauhaus","Josef Hartwig","1923","Piezas que representan su movimiento: el icono del diseño moderno.",["Bauhaus","Diseño"]),
w('art-029','art','sculpture',"Good vs. Evil Chess Set","Maurizio Cattelan","contemporáneo","Set conceptual donde el bien y el mal se enfrentan.",["Contemporáneo","Conceptual"]),
w('art-030','art','sculpture',"White Chess Set (Play It By Trust)","Yoko Ono","1966","Tablero totalmente blanco: jugar sin ver al adversario.",["Fluxus","Instalación"]),
w('art-031','art','sculpture',"Ajedrez con botes de medicina y joyas","Damien Hirst","2003","Lujo y farmacia: el ajedrez como vanitas contemporánea.",["Contemporáneo","Reino Unido"]),
w('art-032','art','sculpture',"Ajedrez con muñecas y edificios en miniatura","Rachel Whiteread","2005","Memoria doméstica fundida en un juego imposible.",["Contemporáneo","Reino Unido"]),
w('art-033','art','sculpture',"Estudio para piezas de ajedrez","Barbara Hepworth","s. XX","Abstracción orgánica aplicada al juego.",["Abstracción","Reino Unido"]),
w('art-034','art','sculpture',"Rey gigante de St. Louis","World Chess Hall of Fame","contemporáneo","La pieza de rey más grande del mundo, récord urbano.",["Arte público","EEUU"]),
w('art-035','art','sculpture',"Ajedrez de la Alhambra","Anónimo hispanomusulmán","s. X-XI","Piezas en cristal de roca y marfil del esplendor andalusí.",["Al-Ándalus","Marfil"]),
// ---- Manuscritos y códices (36-45) → books/history ----
w('art-036','books','history',"Libro de los juegos: moros y cristianos","Alfonso X el Sabio","1283","Miniatura del scriptorium alfonsí: el ajedrez como encuentro de culturas.",["Miniatura","Edad Media","España"]),
w('art-037','books','history',"Libro de los juegos: damas jugando","Alfonso X el Sabio","1283","Las damas de la corte también juegan: imagen insólita del s. XIII.",["Miniatura","Edad Media","España"]),
w('art-038','books','history',"Ilustraciones de De ludo scachorum","Jacobus de Cessolis","s. XV","El sermón moral que convirtió al ajedrez en espejo de la sociedad.",["Incunable","Moralidad"]),
w('art-039','books','history',"Repetición de Amores y Arte de Axedres","Lucena","1497","Primer libro de ajedrez impreso con jugadas modernas.",["Incunable","España"]),
w('art-040','books','history',"Questo libro e da imparare giocare a scachi","Damiano Pedro","1512","Manual renacentista portugués-italiano del juego.",["Renacimiento","Manual"]),
w('art-041','books','history',"Libro de la invención liberal","Ruy López de Segura","1561","El sacerdote extremeño que dio nombre a la apertura española.",["Aperturas","España"]),
w('art-042','books','history',"Das Schach- oder König-Spiel","Gustavus Selenus","1616","Monumental tratado barroco alemán con grabados.",["Barroco","Alemania"]),
w('art-043','books','history',"Analyse du jeu des Échecs","François-André Danican Philidor","1749","El libro que enseñó que los peones son el alma del ajedrez.",["Ilustración","Francia"]),
w('art-044','books','history',"Códice de Gotinga","Anónimo","c. 1500","Manuscrito medieval ilustrado dedicado al juego.",["Manuscrito","Edad Media"]),
w('art-045','books','history',"Manuscrito de Buoncompagno","Anónimo italiano","s. XIII","Ilustraciones medievales italianas del ajedrez.",["Manuscrito","Italia"]),
// ---- Prensa y carteles (46-55) → art/print ----
w('art-046','art','print',"Chess Review: Fischer vs. Reshevsky","Revista Chess Review","1958","Portada del duelo generacional del ajedrez americano.",["Prensa","EEUU"]),
w('art-047','art','print',"American Chess Bulletin: Nueva York 1924","Revista American Chess Bulletin","1924","Portada del supertorneo que ganó Lasker a los 55 años.",["Prensa","EEUU"]),
w('art-048','art','print',"Revista 64: Karpov vs. Kaspárov","Revista 64 (URSS)","1985","Gráfica soviética del duelo del siglo.",["Prensa","URSS"]),
w('art-049','art','print',"Cartel Buenos Aires 1927","Organización del Mundial","1927","Capablanca vs. Alekhine: cartel del match porteño.",["Cartel","Argentina"]),
w('art-050','art','print',"Cartel Olimpiada Dubrovnik 1950","Organización FIDE","1950","Modernismo yugoslavo para la olimpiada de ajedrez.",["Cartel","FIDE"]),
w('art-051','art','print',"Cartel Olimpiada La Habana 1966","Organización FIDE","1966","Arte gráfico cubano para la olimpiada del malecón.",["Cartel","Cuba"]),
w('art-052','art','print',"The New Yorker: ajedrez en el parque","Revista The New Yorker","vintage","Portada vintage del ajedrez gigante urbano.",["Prensa","EEUU"]),
w('art-053','art','print',"Life: Fischer en Reikiavik","Revista Life","1972","La foto-portada del Match del Siglo.",["Prensa","Fotoperiodismo"]),
w('art-054','art','print',"Time: Kaspárov vs. Deep Blue","Revista Time","1997","Portada del primer duelo hombre-máquina por el título oficioso.",["Prensa","IA"]),
w('art-055','art','print',"Cartel San Sebastián 1911","Organización del torneo","1911","Art Nouveau para uno de los torneos legendarios.",["Cartel","España"]),
// ---- Cine vol. 1 (56-70) ----
w('art-056','cinema','movie',"El séptimo sello","Ingmar Bergman","1957","El caballero juega al ajedrez con la Muerte en la playa: la imagen definitiva.",["Cine de autor","Suecia"]),
w('art-057','cinema','short',"Geri's Game","Pixar","1997","Un anciano juega contra sí mismo en el parque. Óscar al mejor corto.",["Animación","Pixar"]),
w('art-058','cinema','movie',"Harry Potter y la piedra filosofal","Chris Columbus","2001","El ajedrez mágico gigante a tamaño real.",["Fantasía","Reino Unido/EEUU"]),
w('art-059','cinema','series',"Gambito de Dama","Scott Frank (Netflix)","2020","Beth Harmon mira el tablero en el techo: el ajedrez conquista la TV.",["Serie","Netflix"]),
w('art-060','cinema','movie',"2001: Odisea del espacio","Stanley Kubrick","1968","Poole juega contra HAL 9000: el preludio del hombre-máquina.",["Ciencia ficción","Kubrick"]),
w('art-061','cinema','movie',"Blade Runner","Ridley Scott","1982","Tyrell y Sebastian juegan una posición de la Inmortal.",["Ciencia ficción","Neo-noir"]),
w('art-062','cinema','movie',"En busca de Bobby Fischer","Steven Zaillian","1993","Josh Waitzkin y las rápidas de Washington Square Park.",["Drama","EEUU"]),
w('art-063','cinema','movie',"La defensa Luzhin","Marleen Gorris","2000","Turturro encarna al genio devorado por el tablero, según Nabokov.",["Drama","Nabokov"]),
w('art-064','cinema','movie',"Casablanca","Michael Curtiz","1942","Rick analiza una posición solo en su bar: ajedrez y exilio.",["Clásico","Hollywood"]),
w('art-065','cinema','movie',"X-Men","Bryan Singer","2000","Magneto y el Profesor X juegan en prisión con piezas de plástico.",["Superhéroes","Marvel"]),
w('art-066','cinema','movie',"Chess of the Wind","Mohammad Reza Aslani","1976","El tablero como centro del drama en el cine de arte iraní.",["Cine iraní","Drama"]),
w('art-067','cinema','movie',"El jugador de ajedrez","Luis Oliveros","2017","Tablero y Segunda Guerra Mundial en el cine español.",["Bélica","España"]),
w('art-068','cinema','movie',"Pawn Sacrifice","Edward Zwick","2014","Maguire es Fischer frente a Spassky en Reikiavik 72.",["Biopic","Guerra Fría"]),
w('art-069','cinema','movie',"Sherlock Holmes: Juego de Sombras","Guy Ritchie","2011","Holmes y Moriarty cierran su duelo sobre el tablero.",["Aventuras","Holmes"]),
w('art-070','cinema','movie',"Star Wars: Episodio IV","George Lucas","1977","Chewbacca y R2-D2 juegan al Dejarik holográfico.",["Ciencia ficción","Dejarik"]),
// ---- Fotografía (71-85) ----
w('art-071','art','photography',"Sombras de piezas","Man Ray","1920","Fotografía abstracta con sombras de piezas.",["Surrealismo","Fotografía"]),
w('art-072','art','photography',"Ajedrez en La Habana","Henri Cartier-Bresson","1963","Ancianos jugando en un café habanero: el instante decisivo.",["Fotoperiodismo","Cuba"]),
w('art-073','art','photography',"Ajedrez callejero en Nueva York","Vivian Maier","c. 1950","La niñera-fotógrafa caza jugadores en la calle.",["Street photography","EEUU"]),
w('art-074','art','photography',"Niños ajedrecistas en Moscú","Alfred Eisenstaedt","1963","Escuela soviética: el ajedrez como asignatura.",["Fotoperiodismo","URSS"]),
w('art-075','art','photography',"Retratos de grandes maestros","David Llada","contemporáneo","Maestros en penumbra y máxima concentración.",["Retrato","Contemporáneo"]),
w('art-076','art','photography',"Partida humana de Marostica","Plaza de Marostica","tradición viva","Recreación histórica con piezas humanas en Italia.",["Tradición","Italia"]),
w('art-077','art','photography',"Ajedrez viviente en la Plaza Roja","Moscú","1924","Exhibición militar-artística con piezas humanas.",["Historia","URSS"]),
w('art-078','art','photography',"Duchamp y Eve Babitz","Julian Wasser","1963","Foto icónica en el Pasadena Art Museum.",["Contracultura","EEUU"]),
w('art-079','art','photography',"Fischer: 50 simultáneas","Prensa","1964","Bobby Fischer contra cincuenta tableros a la vez.",["Historia","EEUU"]),
w('art-080','art','photography',"Tierra vs. Soyuz 9","Programa espacial","1970","Partida entre la Tierra y la tripulación en órbita.",["Espacio","URSS"]),
w('art-081','art','photography',"Retratos con ajedrez","Sante D'Orazio","contemporáneo","Moda y tablero: estética de alto voltaje.",["Moda","Contemporáneo"]),
w('art-082','art','photography',"Washington Square Park cenital","Nueva York","contemporáneo","Vista aérea de las mesas de hormigón legendarias.",["Urbano","EEUU"]),
w('art-083','art','photography',"Ajedrez en los baños Széchenyi","Budapest","contemporáneo","Partidas dentro del agua termal.",["Costumbrismo","Hungría"]),
w('art-084','art','photography',"Ajedrez en retaguardia","Robert Capa","s. XX","Soldados jugando en tregua.",["Fotoperiodismo","Guerra"]),
w('art-085','art','photography',"Kaspárov vs. la Humanidad","Internet","1999","El campeón contra miles de votantes online.",["Internet","Historia"]),
// ---- Música (86-95) ----
w('art-086','music','soundtrack',"Chess, el musical","Benny Andersson / Björn Ulvaeus / Tim Rice","1986","Cartel y álbum original: la Guerra Fría cantada.",["Musical","ABBA"]),
w('art-087','music','classical',"Checkmate (ballet)","Arthur Bliss","1937","Ballet donde el Amor vence a la Muerte sobre el tablero.",["Ballet","Reino Unido"]),
w('art-088','music','contemporary',"Da Mystery of Chessboxin'","Wu-Tang Clan","1993","El ajedrez como filosofía callejera del hip-hop.",["Hip-hop","EEUU"]),
w('art-089','music','contemporary',"Liquid Swords","GZA","1995","Ajedrez y artes marciales en un clásico del rap.",["Hip-hop","EEUU"]),
w('art-090','music','contemporary',"Lost! (videoclip)","Coldplay","2008","Tablero estilizado y levitación en blanco y negro.",["Pop","Videoclip"]),
w('art-091','music','contemporary',"Estética de damero","Fugazi","contemporáneo","Patrones de ajedrez en la cartelería punk.",["Punk","Diseño"]),
w('art-092','music','classical',"La Edad de Oro (escena del ajedrez)","Dmitri Shostakóvich","1930","Ballet soviético con escena de ajedrez.",["Ballet","URSS"]),
w('art-093','music','soundtrack',"Bandas sonoras con ajedrez","Ennio Morricone","varias","El maestro, aficionado al ajedrez, lo llevó a sus portadas.",["Cine","Italia"]),
w('art-094','music','contemporary',"You & Me (videoclip)","Unkle","contemporáneo","Tableros artísticos e iluminación nocturna.",["Electrónica","Videoclip"]),
w('art-095','music','contemporary',"Estética surrealista","Cocorosie","contemporáneo","Portadas oníricas con símbolos del tablero.",["Indie","Portadas"]),
// ---- Urbano y contemporáneo (96-100) ----
w('art-096','art','urban',"Murales de ajedrez","Eduardo Kobra","contemporáneo","Murales monumentales de diversidad con damero.",["Street art","Brasil"]),
w('art-097','art','photography',"Tablero gigante de Ginebra","Parc des Bastions","contemporáneo","Fotografía urbana del tablero público legendario.",["Urbano","Suiza"]),
w('art-098','art','sculpture',"Ajedrez de cristal de Baccarat","Baccarat","contemporáneo","Piezas de cristal tallado a mano, estudio fotográfico.",["Lujo","Francia"]),
w('art-099','art','digital',"The Art of Chess (Saatchi)","Galería Saatchi","2000s","Exposición conceptual que reunió juegos de autor.",["Exposición","Reino Unido"]),
w('art-100','art','digital',"Ajedrez LED interactivo","Varios artistas","contemporáneo","Instalaciones de luz que convierten plazas en tableros.",["Instalación","Luz"]),
// ---- Barroco y s. XIX (101-115) ----
w('art-101','art','painting',"Los jugadores de ajedrez","Adriaen van der Werff","c. 1696","Refinamiento holandés tardío ante el tablero.",["Barroco","Holanda"]),
w('art-102','art','painting',"Escena de taberna","Jan Steen","s. XVII","Taberna holandesa con partida y moraleja.",["Costumbrismo","Holanda"]),
w('art-103','art','painting',"Autorretrato jugando","Christian Seybold","c. 1750","El artista se pinta a sí mismo en plena partida.",["Autorretrato","Austria"]),
w('art-104','art','print',"El juego de ajedrez (grabado)","Matthäus Merian el Viejo","c. 1620","Grabado centroeuropeo de amplia difusión.",["Grabado","Alemania"]),
{
    ...w('art-105','art','painting',"Partida de ajedrez","James Northcote","1807","Escuela inglesa: concentración y claroscuro.",["Romanticismo","Reino Unido"]),
    titleEn: 'Chess Players',
    nationality: 'Inglés',
    birthYear: 1746,
    deathYear: 1831,
    period: 'Romanticismo inglés',
    country: 'Reino Unido',
    license: 'Public Domain',
    chessRole: 'central_theme',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chess_Players_by_James_Northcote_(1746-1831)_-_IMG_7288.JPG',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Chess_Players_by_James_Northcote_(1746-1831)_-_IMG_7288.JPG' },
    ],
  },
{
    ...w('art-106','art','painting',"Los jugadores de ajedrez","Thomas Eakins","1876","Escena realista de una partida entre amigos en Filadelfia; primera obra de un artista vivo aceptada por el MET.",["Realismo","EEUU","Filadelfia"]),
    titleEn: 'The Chess Players',
    nationality: 'Estadounidense',
    birthYear: 1844,
    deathYear: 1916,
    period: 'Realismo americano',
    institution: 'The Metropolitan Museum of Art',
    city: 'Nueva York',
    country: 'EEUU',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Partida entre el padre del artista y un amigo; el tablero ocupa el centro moral de la escena doméstica.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_Chess_Players_MET_DT1506.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:The_Chess_Players_MET_DT1506.jpg' },
      { name: 'The Metropolitan Museum of Art - colección', type: 'official_museum', url: 'https://www.metmuseum.org/art/collection' },
    ],
  },
w('art-107','art','painting',"Jugadores en interior","Ernest Meissonier","1853","Miniaturismo francés de máxima exactitud.",["Academicismo","Francia"]),
w('art-108','art','painting',"Los jugadores de ajedrez","Arturo Michelena","1888","Mirada venezolana al juego europeo.",["Academicismo","Venezuela"]),
w('art-109','art','painting',"Lady Howe en jaque","Edward Harrison May","1867","Dama victoriana acorralando al rey.",["Victoriano","Reino Unido"]),
w('art-110','art','painting',"Los jugadores de ajedrez","Samuel van Hoogstraten","c. 1670","Trompe-l'oeil holandés con partida incluida.",["Barroco","Holanda"]),
w('art-111','art','painting',"Pausa en la partida","Frederic Leighton","c. 1880","Esteticismo inglés: belleza suspendida.",["Esteticismo","Reino Unido"]),
w('art-112','art','painting',"Escena familiar con tablero","Mihály Munkácsy","1882","Intimismo húngaro alrededor del juego.",["Realismo","Hungría"]),
w('art-113','art','print',"La partida de la vida","Charles Dana Gibson","1903","El hombre juega contra la Muerte: alegoría ilustrada.",["Ilustración","EEUU"]),
w('art-114','art','painting',"Interior con motivos de ajedrez","Paul Gauguin","s. XIX","Estudio postimpresionista con ecos del tablero.",["Postimpresionismo","Francia"]),
w('art-115','art','painting',"El jugador en el jardín","Carl Spitzweg","c. 1870","Biedermeier entrañable: soledad y estrategia.",["Biedermeier","Alemania"]),
// ---- Vanguardias II (116-130) ----
w('art-116','art','painting',"Echecs","Victor Vasarely","1960","Op-Art: el damero vibra hasta marear.",["Op-Art","Hungría/Francia"]),
w('art-117','art','print',"Diseño textil en damero","Sonia Delaunay","1925","El ajedrez se vuelve moda y simultaneísmo.",["Diseño","Francia"]),
w('art-118','art','sculpture',"La caballera / Cheval de damier","Man Ray","1946","Objeto surrealista a lomos del caballo.",["Surrealismo","Objeto"]),
w('art-119','art','painting',"End Game","Dorothea Tanning","1944","Surrealismo femenino: el final como umbral.",["Surrealismo","EEUU"]),
w('art-120','art','sculpture',"Tablero surrealista","Isamu Noguchi","1944","Madera esculpida para el mítico torneo de artistas.",["Surrealismo","EEUU/Japón"]),
w('art-121','art','painting',"Near the Moving Waters","Kay Sage","1940","Arquitecturas-pieza en un paisaje mental.",["Surrealismo","EEUU"]),
w('art-122','art','sculpture',"Piezas en bronce","Alexander Calder","1944","Móviles y materia para el tablero de Julien Levy.",["Surrealismo","EEUU"]),
w('art-123','art','sculpture',"Juego surrealista en madera","Yves Tanguy","1944","Formas biomórficas que juegan solas.",["Surrealismo","Francia/EEUU"]),
w('art-124','art','painting',"Echiquier","Max Ernst","1920","El tablero como campo de batalla onírico.",["Dadaísmo","Alemania"]),
w('art-125','art','sculpture',"Tablero Art Brut","Jean Dubuffet","años 1960","Materia bruta contra la geometría perfecta.",["Art Brut","Francia"]),
w('art-126','art','painting',"La comprobación del jaque","René Magritte","1960","Enigma cotidiano con objetos imposibles.",["Surrealismo","Bélgica"]),
w('art-127','art','painting',"Retícula negra y blanca","Wassily Kandinsky","1923","Geometría espiritual del damero.",["Abstracción","Bauhaus"]),
w('art-128','art','painting',"Estudio mecánico con tablero","Fernand Léger","1918","Tubos y damero: la máquina juega.",["Cubismo","Francia"]),
w('art-129','art','print',"Metamorfosis II","M.C. Escher","1940","El tablero se transforma en figuras vivas.",["Grabado","Holanda"]),
w('art-130','art','print',"Cubos y geometría imposible","M.C. Escher","1950","El damero desafía a la perspectiva.",["Grabado","Holanda"]),
// ---- Juegos de autor (131-145) ----
w('art-131','art','sculpture',"Ajedrez de Fabergé","Casa Fabergé","c. 1905","Jaspe, plata y jade para zares.",["Lujo","Rusia"]),
w('art-132','art','sculpture',"Ajedrez de Meissen","Manufactura de Meissen","s. XVIII","Porcelana rococó pintada a mano.",["Porcelana","Alemania"]),
w('art-133','art','sculpture',"Ajedrez Carlomagno","Anónimo normando","s. XI","Marfil medieval en la Biblioteca Nacional de Francia.",["Medieval","Marfil"]),
w('art-134','art','sculpture',"Ajedrez de la colección Selenus","Anónimo","s. XVII","Torres caladas como árboles, en hueso.",["Barroco","Alemania"]),
w('art-135','art','sculpture',"Ajedrez en bronce","Tracey Emin","2000s","Confesión autobiográfica fundida en bronce.",["Contemporáneo","Reino Unido"]),
w('art-136','art','sculpture',"Ajedrez hiperrealista","Jake y Dinos Chapman","2003","Cabezas que juegan una partida macabra.",["Contemporáneo","Reino Unido"]),
w('art-137','art','sculpture',"Ajedrez reciclado","Gavin Turk","2005","Botes de spray vacíos como ejército.",["Contemporáneo","Reciclaje"]),
w('art-138','art','sculpture',"Ajedrez mínimo","Tom Friedman","2005","Objetos cotidianos minúsculos como piezas.",["Conceptual","EEUU"]),
w('art-139','art','sculpture',"Ajedrez psicodélico","Matthew Ronay","2005","Madera tallada de colores alucinados.",["Contemporáneo","EEUU"]),
w('art-140','art','sculpture',"Ajedrez de Vizagapatam","Artesanos indios","s. XVIII","Marfil y carey de la India colonial.",["India","Marfil"]),
w('art-141','art','sculpture',"Shatar mongol","Artesanos mongoles","tradicional","Caballos y guerreros de la estepa.",["Mongolia","Tradición"]),
w('art-142','art','sculpture',"Ajedrez de la Guerra Civil","Anónimo americano","s. XIX","Unión contra Confederación, pieza a pieza.",["Historia","EEUU"]),
w('art-143','art','print',"Diseño Staunton (1849)","Nathaniel Cook","1849","El grabado que estandarizó el ajedrez mundial.",["Diseño","Reino Unido"]),
w('art-144','art','sculpture',"The Chess Players","George Segal","s. XX","Figuras de yeso a tamaño real, detenidas.",["Escultura","EEUU"]),
w('art-145','art','sculpture',"Ajedrez tridimensional","Star Trek (prop)","1966","El ajedrez del futuro en tres niveles.",["Ciencia ficción","TV"]),
// ---- Grabados y clásicos ilustrados (146-155) ----
w('art-146','art','print',"Patrones geométricos","Albrecht Dürer","s. XVI","El maestro del grabado y la geometría del tablero.",["Grabado","Alemania"]),
w('art-147','books','history',"Cantigas: caballeros jugando","Alfonso X / Cantigas","s. XIII","Miniatura militar con partida en la tienda.",["Miniatura","Edad Media"]),
w('art-148','books','fiction',"Alicia a través del espejo","John Tenniel / Lewis Carroll","1871","Ilustraciones originales del país del espejo-ajedrez.",["Ilustración","Reino Unido"]),
w('art-149','books','fiction',"Cuentos con piezas","Arthur Rackham","c. 1910","Hadas y piezas en la época dorada de la ilustración.",["Ilustración","Reino Unido"]),
w('art-150','art','print',"Autómatas victorianos","M. U. Sears","s. XIX","Grabados de máquinas que pretendían jugar.",["Grabado","Autómatas"]),
w('art-151','art','print',"El Turco de Kempelen","Wolfgang von Kempelen","1789","Planos del famoso autómata fraudulento.",["Grabado","Ilustración"]),
w('art-152','books','history',"Shahnameh: invención del ajedrez","Miniaturistas persas","s. XV-XVI","La leyenda india del juego en miniatura persa.",["Miniatura","Persia"]),
w('art-153','books','history',"Damas jugando (Bodleiana)","Biblioteca Bodleiana","s. XIV","Iluminación inglesa de damas ante el tablero.",["Miniatura","Inglaterra"]),
w('art-154','books','history',"Simbología del ajedrez","Códice de San Millán","medieval","Referencias ibéricas al simbolismo del juego.",["Manuscrito","España"]),
w('art-155','art','print',"Alegorías de batalla","Paul Gustave Doré","s. XIX","Grabados donde la guerra es un tablero.",["Grabado","Francia"]),
// ---- Cartelería II (156-165) ----
w('art-156','art','print',"Cartel Casablanca 1966","Match mundial","1966","Grafismo modernista del match africano.",["Cartel","Marruecos"]),
w('art-157','art','print',"Cartel Varna 1962","Olimpiada FIDE","1962","Constructivismo búlgaro para la olimpiada.",["Cartel","Bulgaria"]),
w('art-158','art','print',"Cartel Leipzig 1960","Olimpiada FIDE","1960","Gráfica de la RDA para el ajedrez.",["Cartel","Alemania"]),
w('art-159','art','print',"El ajedrez, fuerza cultural","Propaganda soviética","años 1930","El juego al servicio del pueblo.",["Propaganda","URSS"]),
w('art-160','art','print',"Gráfica del torneo AVRO 1938","Organización AVRO","1938","Bauhaus tipográfica para el torneo de trenes.",["Cartel","Holanda"]),
w('art-161','art','print',"Fischer vs. Spassky 1972","Conmemorativo","1972","Minimalismo de Guerra Fría para Reikiavik.",["Cartel","Islandia"]),
w('art-162','art','print',"British Chess Magazine (1881)","Revista BCM","1881","Primera edición ilustrada de la decana.",["Prensa","Reino Unido"]),
w('art-163','art','print',"Deutsche Schachzeitung","Revista alemana","s. XIX","Grabado romántico de la prensa ajedrecística.",["Prensa","Alemania"]),
w('art-164','art','print',"Gráfica Saatchi & Saatchi","Agencia Saatchi","contemporáneo","Publicidad mundial con el tablero.",["Publicidad","Reino Unido"]),
w('art-165','art','print',"Cartel Tel Aviv 1964","Olimpiada FIDE","1964","Diseño israelí para la olimpiada.",["Cartel","Israel"]),
// ---- Cine vol. 2 (166-180) ----
w('art-166','cinema','movie',"La fiebre del ajedrez","Vsevolod Pudovkin","1925","Cine mudo con cameo real de Capablanca.",["Mudo","URSS"]),
w('art-167','cinema','series',"Twin Peaks","David Lynch","1991","Tablero mortal entre Cooper y Windom Earle.",["Serie","EEUU"]),
w('art-168','cinema','movie',"El séptimo sello (plano cenital)","Ingmar Bergman","1957","El tablero sobre la roca marina, desde arriba.",["Cine de autor","Suecia"]),
w('art-169','cinema','series',"Sherlock","BBC","2010","Deducción visualizada con piezas de ajedrez.",["Serie","Reino Unido"]),
w('art-170','cinema','series',"Westworld","HBO","2016","Laberintos y piezas en los decorados.",["Serie","EEUU"]),
w('art-171','cinema','movie',"Dangerous Moves","Richard Dembo","1984","El match Fromm-Liebskind por el título.",["Drama","Francia"]),
w('art-172','cinema','movie',"Fahim","Pierre-François Martin-Laval","2019","Refugiado bangladesí camino de los torneos franceses.",["Drama","Francia"]),
w('art-173','cinema','movie',"The Coldest Game","Łukasz Kośmicki","2019","Ajedrez en la crisis de los misiles.",["Thriller","Polonia"]),
w('art-174','cinema','movie',"Revolver","Guy Ritchie","2005","Engaño y psicología con tablero de fondo.",["Thriller","Reino Unido"]),
w('art-175','cinema','movie',"Knight Moves","Carl Schenkel","1992","Un Gran Maestro en un thriller noventero.",["Thriller","EEUU/Alemania"]),
w('art-176','cinema','movie',"Fresh","Boaz Yakin","1994","El niño juega con su padre en el parque.",["Drama","EEUU"]),
w('art-177','cinema','movie',"Alicia a través del espejo","James Bobin","2016","El reino vivo del ajedrez y los Reyes de Cristal.",["Fantasía","EEUU"]),
w('art-178','cinema','series',"Doctor Who: Nightmare in Silver","BBC","2013","Ajedrez cibernético contra los Cybermen.",["Ciencia ficción","Reino Unido"]),
w('art-179','cinema','movie',"El caso Thomas Crown","Norman Jewison","1968","Seducción sobre el tablero: McQueen y Dunaway.",["Romance","EEUU"]),
w('art-180','cinema','series',"Peaky Blinders","BBC","2013-2022","Shelby mueve piezas políticas.",["Serie","Reino Unido"]),
// ---- Fotografía II (181-190) ----
w('art-181','art','photography',"Café de la Régence","Brassaï","años 1930","El templo parisino del ajedrez, de noche.",["Fotografía","París"]),
w('art-182','art','photography',"Duchamp y su ajedrez","Irving Penn","1948","Retrato del artista junto a su juego.",["Retrato","EEUU"]),
w('art-183','art','photography',"Perros y niños mirones","Elliott Erwitt","s. XX","Humor humanista ante el tablero.",["Fotografía","EEUU"]),
w('art-184','art','photography',"Parques de Nueva York","Ruth Orkin","años 1950","Concentración neoyorquina en blanco y negro.",["Street","EEUU"]),
w('art-185','art','photography',"Match por radio EE.UU.-URSS","Prensa","1945","La guerra terminó jugando por radio.",["Historia","Guerra Fría"]),
w('art-186','art','photography',"Alekhine vs. Capablanca","Prensa","1927","El encuentro histórico de Buenos Aires.",["Historia","Argentina"]),
w('art-187','art','photography',"Tal en el hospital","Prensa","años 1960","El Mago juega simultáneas desde la cama.",["Historia","URSS"]),
w('art-188','art','photography',"Karlsplatz desde el aire","Viena","contemporáneo","Tableros al aire libre vistos desde el cielo.",["Urbano","Austria"]),
w('art-189','art','photography',"Trotsky y Lenin en Capri","Prensa","1908","La revolución también jugaba.",["Historia","Italia/Rusia"]),
w('art-190','art','photography',"Gemini y control de tierra","NASA","1970","Ajedrez entre el espacio y Houston.",["Espacio","EEUU"]),
// ---- Literatura, pop y urbano (191-200) ----
w('art-191','books','fiction',"Schachnovelle (portadas)","Stefan Zweig","varias","Un siglo de portadas para la novela definitiva.",["Novela","Austria"]),
w('art-192','books','fiction',"El juego de la luna","Fran Jaraba","contemporáneo","Novela gráfica ambientada en el ajedrez.",["Cómic","España"]),
w('art-193','books','fiction',"Shion no Ō (manga)","J. Hattori / N. Katayama","2000s","Manga de shogi/ajedrez y drama adolescente.",["Manga","Japón"]),
w('art-194','art','urban',"Mosaicos Invader","Invader","2000s","Píxeles y damero en fachadas europeas.",["Street art","Francia"]),
w('art-195','art','urban',"Alegorías del peón","Banksy","2000s","El peón y el rey en la calle.",["Street art","Reino Unido"]),
w('art-196','art','digital',"Patrones Warhol","Andy Warhol","s. XX","Repetición pop con damero.",["Pop Art","EEUU"]),
w('art-197','books','fiction',"La ciudad de los ajedrecistas","Cuentos orientales","tradicional","Relatos clásicos del mundo del tablero.",["Cuento","Oriente"]),
w('art-198','art','urban',"East Side Gallery","Muro de Berlín","post-1989","Graffitis de ajedrez sobre el Muro.",["Street art","Berlín"]),
w('art-199','books','history',"Ajedrez circular y triple","Grabados históricos","varios","Variantes del juego en grabado antiguo.",["Variantes","Historia"]),
w('art-200','art','print',"Identidad FIDE","FIDE","contemporáneo","Posters oficiales del Mundial.",["Diseño","FIDE"]),
// ---- Obras verificadas vía agente IA (201-204): imágenes de dominio público + fuentes oficiales ----
{
    ...w('art-201','art','painting',"Jugadores de ajedrez egipcios","Lawrence Alma-Tadema","1879","Recreación victoriana de una partida en el antiguo Egipto, gusto por la antigüedad.",["Orientalismo","Victoriano","Reino Unido"]),
    titleEn: 'Egyptian Chess Players',
    nationality: 'Neerlandés-británico',
    birthYear: 1836,
    deathYear: 1912,
    period: 'Pintura victoriana',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Partida egipcia idealizada; el ajedrez como ritual de la élite antigua.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lawrence_Alma-Tadema_Egyptian_Chess_Players.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Lawrence_Alma-Tadema_Egyptian_Chess_Players.jpg' },
    ],
  },
{
    ...w('art-202','art','painting',"La muerte juega al ajedrez","Albertus Pictor","c. 1480-1490","Mural medieval en la iglesia de Täby (Suecia): un caballero juega contra la Muerte; inspiró a Bergman.",["Medieval","Fresco","Suecia"]),
    titleEn: 'Death Playing Chess',
    titleOriginal: 'Döden spelar schack',
    nationality: 'Sueco (origen alemán)',
    period: 'Gótico tardío',
    institution: 'Iglesia de Täby / Museo de Historia de Suecia',
    city: 'Täby / Estocolmo',
    country: 'Suecia',
    license: 'Public Domain',
    chessRole: 'metaphor',
    chessNote: 'La partida como alegoría moral: cada jugada decide el destino tras la muerte.',
    schemaCategory: 'pintura_clasica',
    sources: [
      { name: 'Wikipedia - La muerte juega al ajedrez', type: 'wikipedia', url: 'https://es.wikipedia.org/wiki/La_muerte_juega_al_ajedrez' },
    ],
  },
{
    ...w('art-203','art','painting',"Árabes jugando al ajedrez","Eugène Delacroix","1847-1848","Escena orientalista tras su viaje al norte de África; poesía de lo exótico.",["Orientalismo","Romanticismo","Francia"]),
    titleEn: 'Arabs Playing Chess',
    nationality: 'Francés',
    birthYear: 1798,
    deathYear: 1863,
    period: 'Romanticismo',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'El tablero como encuentro entre culturas en el imaginario romántico.',
    schemaCategory: 'pintura_clasica',
    sources: [
      { name: 'National Galleries of Scotland - colección', type: 'official_museum', url: 'https://www.nationalgalleries.org' },
    ],
  },
{
    ...w('art-204','art','painting',"La partida de ajedrez","Charles Bargue","s. XIX","Escena de género de pequeño formato en un interior; obra en colección privada.",["Realismo","Francia"]),
    titleEn: 'The Chess Game',
    nationality: 'Francés',
    birthYear: 1826,
    deathYear: 1883,
    period: 'Realismo francés',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Intimismo burgués: la partida como retrato de la vida interior.',
    schemaCategory: 'pintura_clasica',
    sources: [
      { name: 'The Metropolitan Museum of Art - colección', type: 'official_museum', url: 'https://www.metmuseum.org/art/collection' },
    ],
  },
// ---- Segunda oleada PD: dominio público verificado en Wikimedia (205-224) ----
{
    ...w('art-205','art','painting',"Jaque mate","Thomas Rowlandson","s. XVIII","Caricatura inglesa: el mate como sátira social.",["Caricatura","Reino Unido"]),
    titleEn: 'Checkmate',
    nationality: 'Inglés',
    birthYear: 1756,
    deathYear: 1827,
    period: 'Caricatura georgiana',
    country: 'Reino Unido',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'El jaque mate dibujado con humor cruel: el perdedor paga la cuenta.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Thomas_Rowlandson_-_Checkmate_-_Google_Art_Project.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Thomas_Rowlandson_-_Checkmate_-_Google_Art_Project.jpg' },
    ],
  },
{
    ...w('art-206','art','painting',"Bodegón con tablero (Los cinco sentidos)","Lubin Baugin","c. 1630","El tablero como alegoría de la vista y el ingenio.",["Barroco","Francia"]),
    titleEn: 'Still-life with Chessboard (The Five Senses)',
    nationality: 'Francés',
    birthYear: 1612,
    deathYear: 1663,
    period: 'Barroco francés',
    country: 'Francia',
    license: 'Public Domain',
    chessRole: 'prop_object',
    chessNote: 'El ajedrez entre copas e instrumentos: emblema de la vida ordenada.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lubin_Baugin_-_Still-life_with_Chessboard_(The_Five_Senses)_-_WGA01515.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Lubin_Baugin_-_Still-life_with_Chessboard_(The_Five_Senses)_-_WGA01515.jpg' },
    ],
  },
{
    ...w('art-207','art','painting',"Juego de ajedrez indio","Henri-Pierre Picou","1876","Orientalismo francés: la partida como ritual exótico.",["Orientalismo","Francia"]),
    titleEn: "Jeu d'Échecs Indien",
    nationality: 'Francés',
    birthYear: 1824,
    deathYear: 1895,
    period: 'Academicismo',
    country: 'Francia',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'El chaturanga soñado desde París: alfombras, turbantes y concentración.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Picou,_Henri_Pierre_-_Jeu_dEchecs_Indien_-_1876.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Picou,_Henri_Pierre_-_Jeu_d%27Echecs_Indien_-_1876.jpg' },
    ],
  },
{
    ...w('art-208','art','painting',"Jugadores de ajedrez","Gustav Wentzel","1886","Realismo noruego de interior burgués ante el tablero.",["Realismo","Noruega"]),
    titleEn: 'Sjakkspillere (Chess Players)',
    nationality: 'Noruego',
    birthYear: 1859,
    deathYear: 1927,
    period: 'Realismo escandinavo',
    institution: 'Nasjonalmuseet',
    city: 'Oslo',
    country: 'Noruega',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Luz del norte sobre la madera: la partida como rito doméstico.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gustav_Wentzel_-_Sjakkspillere_-_Nasjonalmuseet_-_NG.M.04330.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Gustav_Wentzel_-_Sjakkspillere_-_Nasjonalmuseet_-_NG.M.04330.jpg' },
      { name: 'Nasjonalmuseet - colección', type: 'official_museum', url: 'https://www.nasjonalmuseet.no' },
    ],
  },
{
    ...w('art-209','art','painting',"Partida en el Palais Voss, Berlín","Johann Erdmann Hummel","1845","Salón berlinés: la élite ilustrada mide sus fuerzas.",["Biedermeier","Alemania"]),
    titleEn: 'Schachpartie im Palais Voss',
    nationality: 'Alemán',
    birthYear: 1769,
    deathYear: 1852,
    period: 'Biedermeier',
    city: 'Berlín',
    country: 'Alemania',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'El ajedrez como conversación silenciosa de la burguesía culta.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Johann_Erdmann_Hummel_-_Schachpartie_im_Palais_Voss,_Berlin_(zweite_Fassung,_1845).jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Johann_Erdmann_Hummel_-_Schachpartie_im_Palais_Voss,_Berlin_(zweite_Fassung,_1845).jpg' },
    ],
  },
{
    ...w('art-210','art','painting',"Jaque mate al rey","Alfonso Savini","1893","El instante del mate en un interior decimonónico.",["Realismo","Italia"]),
    titleEn: 'Check Mate the King',
    nationality: 'Italiano',
    birthYear: 1836,
    deathYear: 1925,
    period: 'Realismo italiano',
    country: 'Italia',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'La mano suspendida: un segundo antes de la rendición.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Check_Mate_the_King_by_Alfonso_Savini,_1893.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Check_Mate_the_King_by_Alfonso_Savini,_1893.jpg' },
    ],
  },
{
    ...w('art-211','art','painting',"Jugadores de ajedrez","Carl Maria Seyppel","1888","Costumbrismo alemán: dos generaciones ante el tablero.",["Costumbrismo","Alemania"]),
    titleEn: 'Playing Chess (Schachspieler)',
    nationality: 'Alemán',
    birthYear: 1847,
    deathYear: 1913,
    period: 'Realismo alemán',
    country: 'Alemania',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Maestro y aprendiz: el ajedrez como transmisión familiar.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Carl_Maria_Seyppel_(auch_Karl_Maria_Seyppel,_1847_-_1913_)_,_gemalt_1888,_Titel_-_Playing_Chess_(Schachspieler).jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Carl_Maria_Seyppel_(auch_Karl_Maria_Seyppel,_1847_-_1913)_%2C_gemalt_1888%2C_Titel_-_Playing_Chess_(Schachspieler).jpg' },
    ],
  },
{
    ...w('art-212','art','painting',"Una partida emocionante","Hans August Lassen","1898","Tensión danesa de fin de siglo en torno al tablero.",["Realismo","Dinamarca"]),
    titleEn: 'Eine spannende Partie',
    nationality: 'Danés',
    birthYear: 1857,
    deathYear: 1938,
    period: 'Realismo danés',
    country: 'Dinamarca',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Mirones contenidos: toda la sala juega sin tocar pieza.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hans_August_Lassen_Eine_spannende_Partie_1898.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Hans_August_Lassen_Eine_spannende_Partie_1898.jpg' },
    ],
  },
{
    ...w('art-213','art','painting',"Interior rococó con jugadores","Eugène Fichel","1884","Evocación galante del siglo XVIII con partida incluida.",["Historicismo","Francia"]),
    titleEn: 'Rokokointerieur mit schachspielenden Herren',
    nationality: 'Francés',
    birthYear: 1826,
    deathYear: 1895,
    period: 'Pintura de género',
    country: 'Francia',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Pelucas y damasco: el ajedrez como pasatiempo aristocrático.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Eugène_Fichel_Rokokointerieur_mit_schachspielenden_Herren_1884.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Eug%C3%A8ne_Fichel_Rokokointerieur_mit_schachspielenden_Herren_1884.jpg' },
    ],
  },
{
    ...w('art-214','art','print',"Staunton vs Saint-Amant, París","Jean-Henri Marlet","1843","Crónica gráfica del primer duelo por el campeonato oficioso.",["Documento","Francia"]),
    titleEn: 'The celebrated game between Staunton and Saint-Amant',
    nationality: 'Francés',
    birthYear: 1771,
    deathYear: 1847,
    period: 'Romanticismo',
    city: 'París',
    country: 'Francia',
    license: 'Public Domain',
    chessRole: 'historical_record',
    chessNote: '1843: nace el ajedrez espectáculo con público y prensa.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jean_Henri_Marlet_Das_berühmte_Schachspiel_zwischen_Howard_Staunton_und_Pierre_Charles_Fourrier_Saint-Amant_1843.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Jean_Henri_Marlet_Das_ber%C3%BChmte_Schachspiel_zwischen_Howard_Staunton_und_Pierre_Charles_Fourrier_Saint-Amant_1843.jpg' },
    ],
  },
{
    ...w('art-215','art','painting',"Almeas jugando al ajedrez","Jean-Léon Gérôme","1870","Orientalismo de salón: música, danza y tablero.",["Orientalismo","Francia"]),
    titleEn: 'Almées jouant aux échecs',
    nationality: 'Francés',
    birthYear: 1824,
    deathYear: 1904,
    period: 'Academicismo',
    country: 'Francia',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'El harén imaginado donde hasta la espera juega.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Almées_jouant_aux_échecs,_Gérôme_Jean-Léon,_1870.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Alm%C3%A9es_jouant_aux_%C3%A9checs%2C_G%C3%A9r%C3%B4me_Jean-L%C3%A9on%2C_1870.jpg' },
    ],
  },
{
    ...w('art-216','art','painting',"Cardenal y clérigo ante el tablero","Eduard von Grützner","s. XIX","El poder eclesiástico también mueve piezas.",["Costumbrismo","Alemania"]),
    titleEn: 'Kardinal und Geistlicher beim Schachspiel',
    nationality: 'Alemán',
    birthYear: 1846,
    deathYear: 1925,
    period: 'Realismo alemán',
    country: 'Alemania',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Sotanas y estrategia: el ajedrez entra en la sacristía.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Eduard_Grützner_(1846-1925)_-_Kardinal_und_Geistlicher_beim_Schachspiel.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Eduard_Gr%C3%BCtzner_(1846-1925)_-_Kardinal_und_Geistlicher_beim_Schachspiel_-_0898_-_F%C3%BChrermuseum.jpg' },
    ],
  },
{
    ...w('art-217','art','painting',"Partida de ajedrez","Henricus Reijntjens","1859","Interior holandés del XIX con luz de ventana.",["Realismo","Holanda"]),
    titleEn: 'Schachspiel',
    nationality: 'Neerlandés',
    period: 'Siglo XIX',
    country: 'Países Bajos',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Silencio doméstico: solo se oyen las piezas.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Henricus_E_Reyntjens_Schachspiel_1859.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Henricus_E_Reyntjens_Schachspiel_1859.jpg' },
    ],
  },
{
    ...w('art-218','art','painting',"La partida","Pieter Alardus Haaxman","1871","Escuela de La Haya: sobriedad y concentración.",["Realismo","Holanda"]),
    titleEn: 'Die Schachpartie',
    nationality: 'Neerlandés',
    period: 'Siglo XIX',
    country: 'Países Bajos',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Grises holandeses para una batalla sin sangre.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pieter_Alardus_Haaxman_Die_Schachpartie_1871.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Pieter_Alardus_Haaxman_Die_Schachpartie_1871.jpg' },
    ],
  },
{
    ...w('art-219','art','painting',"Dama jugando al weiqi","Anónimo (China)","s. XVIII","El primo oriental del ajedrez en manos femeninas.",["China","Miniatura"]),
    titleEn: 'A Lady Playing Chess (Weiqi)',
    nationality: 'China',
    period: 'Dinastía Qing',
    country: 'China',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Weiqi, el juego de rodear: ajedrez de otra geometría.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/A_Lady_Playing_Chess_(Weiqi)_-_Google_Art_Project.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:A_Lady_Playing_Chess_(Weiqi)_-_Google_Art_Project.jpg' },
    ],
  },
{
    ...w('art-220','art','painting',"El visir muestra el ajedrez al rey","Anónimo (Persia)","s. XVI","Shahnama: el mito fundacional del juego en miniatura.",["Miniatura","Persia"]),
    titleEn: 'Buzurghmihr Showing Chess to King Khusraw',
    nationality: 'Persa',
    period: 'Miniatura islámica',
    institution: 'LACMA',
    city: 'Los Ángeles',
    country: 'EE. UU.',
    license: 'Public Domain',
    chessRole: 'historical_record',
    chessNote: 'El legendario origen indio del ajedrez, contado en imágenes.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_Vizier_Buzurghmihr_Showing_the_Game_of_Chess_to_King_Khusraw_Anushirwan,_Page_from_a_Manuscript_of_the_Shahnama_(Book_of_Kings)_LACMA_M.73.5.586.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:The_Vizier_Buzurghmihr_Showing_the_Game_of_Chess_to_King_Khusraw_Anushirwan%2C_Page_from_a_Manuscript_of_the_Shahnama_(Book_of_Kings)_LACMA_M.73.5.586.jpg' },
      { name: 'LACMA - colección', type: 'official_museum', url: 'https://www.lacma.org' },
    ],
  },
{
    ...w('art-221','art','print',"Partida de ajedrez chino","John Ingram (según Boucher)","1741","Chinoiserie europea: el xiangqi imaginado desde París.",["Grabado","Francia"]),
    titleEn: 'The Game of Chinese Chess',
    nationality: 'Francés/Inglés',
    period: 'Rococó',
    institution: 'The Metropolitan Museum of Art',
    city: 'Nueva York',
    country: 'EE. UU.',
    license: 'CC0 (MET Open Access)',
    chessRole: 'central_theme',
    chessNote: 'Oriente de fantasía para salones rococó.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_Game_of_Chinese_Chess_MET_DP826298.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (CC0)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:The_Game_of_Chinese_Chess_MET_DP826298.jpg' },
      { name: 'The Metropolitan Museum of Art - colección', type: 'official_museum', url: 'https://www.metmuseum.org/art/collection' },
    ],
  },
{
    ...w('art-222','art','painting',"Compañía jugando al ajedrez","Jean Humbert (atribuido)","c. 1790","Tertulia holandesa de fin de siglo en torno al tablero.",["Siglo XVIII","Holanda"]),
    titleEn: 'Chess-playing company',
    nationality: 'Neerlandés',
    birthYear: 1734,
    deathYear: 1794,
    period: 'Ilustración tardía',
    country: 'Países Bajos',
    license: 'CC BY-SA 4.0 (foto) / PD (obra)',
    chessRole: 'central_theme',
    chessNote: 'La sociabilidad ilustrada también se juega.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Schilderij_van_olieverf_op_paneel,_schaak_spelend_gezelschap,_circa_1790_-_1794,_door_Jean_Humbert,_1734_tot_1794_-_Bilthoven_-_20429522_-_RCE.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (CC BY-SA)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Schilderij_van_olieverf_op_paneel%2C_schaak_spelend_gezelschap%2C_circa_1790_-_1794%2C_door_Jean_Humbert%2C_1734_tot_1794_-_Bilthoven_-_20429522_-_RCE.jpg' },
    ],
  },
{
    ...w('art-223','art','painting',"Joven jugando al ajedrez","James Tissot","s. XIX","Elegancia francesa: retrato femenino con tablero.",["Retrato","Francia"]),
    titleEn: 'Jeune femme jouant aux échecs',
    nationality: 'Francés',
    birthYear: 1836,
    deathYear: 1902,
    period: 'Realismo francés',
    country: 'Francia',
    license: 'Public Domain',
    chessRole: 'central_theme',
    chessNote: 'Tissot pinta la inteligencia con la misma atención que la seda.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jeune_femme_jouant_aux_échecs_-_James_Tissot_-_MM_1938F911.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Jeune_femme_jouant_aux_%C3%A9checs_-_James_Tissot_-_MM_1938F911.jpg' },
    ],
  },
{
    ...w('art-224','art','painting',"Carlos de Angulema y Luisa de Saboya","Robinet Testard","c. 1500","Miniatura renacentista francesa de amor cortés y tablero.",["Miniatura","Francia"]),
    titleEn: "Charles d'Angoulême et Louise de Savoie jouant aux échecs",
    nationality: 'Francés',
    period: 'Renacimiento francés',
    country: 'Francia',
    license: 'Public Domain',
    chessRole: 'metaphor',
    chessNote: 'El ajedrez como juego de seducción en la corte.',
    schemaCategory: 'pintura_clasica',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Charles_dAngoulême_et_Louise_de_Savoie_jouant_aux_échecs.jpg',
    sources: [
      { name: 'Wikimedia Commons - imagen (dominio público)', type: 'digital_library', url: 'https://commons.wikimedia.org/wiki/File:Charles_d%27Angoul%C3%AAme_et_Louise_de_Savoie_jouant_aux_%C3%A9checs.jpg' },
    ],
  },
];
