// Portada rotativa: pool de 10 obras emblemáticas (una por disciplina).
// `featured: true` marca las 5 en rotación este ciclo (se rota cada mes/trimestre
// cambiando los flags). Imágenes reales solo con licencia verificada
// (dominio público o CC); el resto usa placeholder de disciplina.

export interface HeroFeature {
  id: string;
  disciplineEs: string;
  disciplineEn: string;
  title: string;
  author: string;
  year: string;
  introEs: string;
  introEn: string;
  image: string;
  galleryHref: string;
  sourceName: string;
  sourceUrl: string;
  featured: boolean;
}

const PD = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`;

export const HERO_FEATURES: HeroFeature[] = [
  {
    id: 'anguissola',
    disciplineEs: 'Pintura',
    disciplineEn: 'Painting',
    title: 'La partida de ajedrez',
    author: 'Sofonisba Anguissola',
    year: '1555',
    introEs:
      'Obra cumbre del Renacimiento: sus hermanas juegan en un ambiente doméstico. Hito del papel de la mujer en el arte clásico.',
    introEn:
      'Renaissance masterpiece: her sisters play at home. A milestone for women in classical art.',
    image: PD('The_Chess_Game_-_Sofonisba_Anguissola.jpg'),
    galleryHref: '/arte',
    sourceName: 'Wikimedia Commons (dominio público)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_Chess_Game_-_Sofonisba_Anguissola.jpg',
    featured: true,
  },
  {
    id: 'lewis',
    disciplineEs: 'Escultura',
    disciplineEn: 'Sculpture',
    title: 'Piezas de ajedrez de Lewis',
    author: 'Anónimo (s. XII)',
    year: 's. XII',
    introEs:
      'Marfil de morsa hallado en la isla de Lewis (Escocia). Sus guardianes mordiendo escudos las hacen las piezas históricas más famosas; inspiraron el ajedrez de Harry Potter.',
    introEn:
      'Walrus-ivory pieces found on the Isle of Lewis (Scotland). The most famous historic set; it inspired Harry Potter’s wizard chess.',
    image: PD('Lewis_Chessmen%2C_British_Museum.jpg'),
    galleryHref: '/arte',
    sourceName: 'Wikimedia Commons (CC BY 4.0)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lewis_Chessmen,_British_Museum.jpg',
    featured: true,
  },
  {
    id: 'alicia',
    disciplineEs: 'Ilustración',
    disciplineEn: 'Illustration',
    title: 'Alicia a través del espejo',
    author: 'Lewis Carroll · John Tenniel',
    year: '1871',
    introEs:
      'Toda la narración es una partida real: Alicia empieza como peón e intenta coronar como reina. Ilustraciones de Tenniel.',
    introEn:
      'The whole narrative is a real chess game: Alice starts as a pawn and tries to queen. Illustrations by Tenniel.',
    image: PD('Alice_with_White_Queen_(Illustration_by_John_Tenniel).png'),
    galleryHref: '/libros',
    sourceName: 'Wikimedia Commons (dominio público)',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Alice_with_White_Queen_(Illustration_by_John_Tenniel).png',
    featured: true,
  },
  {
    id: 'septimo-sello',
    disciplineEs: 'Cine',
    disciplineEn: 'Cinema',
    title: 'El séptimo sello',
    author: 'Ingmar Bergman',
    year: '1957',
    introEs:
      'El caballero Antonius Block juega contra la Muerte en una playa para ganar tiempo y reflexionar sobre la existencia.',
    introEn:
      'Knight Antonius Block plays Death on a beach to gain time and reflect on existence.',
    image: '/artworks/cinema.svg',
    galleryHref: '/cine',
    sourceName: 'Ficha en galería de cine',
    sourceUrl: '/cine',
    featured: true,
  },
  {
    id: 'gambito',
    disciplineEs: 'Televisión',
    disciplineEn: 'Television',
    title: 'Gambito de dama',
    author: 'Netflix · Scott Frank',
    year: '2020',
    introEs:
      'Fenómeno global que provocó un boom sin precedentes en tableros y búsquedas de ajedrez en todo el mundo.',
    introEn:
      'Global phenomenon that caused an unprecedented boom in chess sets and searches worldwide.',
    image: '/artworks/cinema.svg',
    galleryHref: '/cine',
    sourceName: 'Ficha en galería de cine',
    sourceUrl: '/cine',
    featured: true,
  },
  {
    id: 'zweig',
    disciplineEs: 'Literatura',
    disciplineEn: 'Literature',
    title: 'Novela de ajedrez',
    author: 'Stefan Zweig',
    year: '1942',
    introEs:
      'La obsesión por el ajedrez como crítica al encierro y la barbarie nazi. Última obra maestra de Zweig.',
    introEn:
      'Chess obsession as a critique of confinement and Nazi barbarism. Zweig’s last masterpiece.',
    image: '/artworks/books.svg',
    galleryHref: '/libros',
    sourceName: 'Ficha en galería de libros',
    sourceUrl: '/libros',
    featured: false,
  },
  {
    id: 'chess-musical',
    disciplineEs: 'Teatro musical',
    disciplineEn: 'Musical theatre',
    title: 'Chess, el musical',
    author: 'Tim Rice · Ulvaeus & Andersson',
    year: '1986',
    introEs:
      'Un mundial EEUU-URSS como alegoría de la Guerra Fría, con música de los componentes de ABBA.',
    introEn:
      'A USA–USSR championship as Cold War allegory, with music by ABBA’s songwriters.',
    image: '/artworks/music.svg',
    galleryHref: '/musica',
    sourceName: 'Ficha en galería de música',
    sourceUrl: '/musica',
    featured: false,
  },
  {
    id: 'borges',
    disciplineEs: 'Poesía',
    disciplineEn: 'Poetry',
    title: 'Ajedrez (soneto)',
    author: 'Jorge Luis Borges',
    year: '1960',
    introEs:
      'Doble soneto de El Hacedor sobre el libre albedrío: «Dios mueve al jugador, y este, la pieza…».',
    introEn:
      'Double sonnet from El Hacedor on free will: “God moves the player, and he, the piece…”.',
    image: '/artworks/books.svg',
    galleryHref: '/libros',
    sourceName: 'Ficha en galería de libros',
    sourceUrl: '/libros',
    featured: false,
  },
  {
    id: 'duchamp',
    disciplineEs: 'Arte conceptual',
    disciplineEn: 'Conceptual art',
    title: 'El jugador de ajedrez',
    author: 'Marcel Duchamp',
    year: '1923',
    introEs:
      'Abandonó el arte tradicional para jugar profesionalmente: «el ajedrez tiene toda la belleza del arte y mucho más».',
    introEn:
      'He quit traditional art to play professionally: “chess has all the beauty of art, and much more”.',
    image: '/artworks/art.svg',
    galleryHref: '/arte',
    sourceName: 'Ficha en galería de arte',
    sourceUrl: '/arte',
    featured: false,
  },
  {
    id: 'manray',
    disciplineEs: 'Fotografía',
    disciplineEn: 'Photography',
    title: 'Ajedrez de vanguardia',
    author: 'Man Ray',
    year: '1924',
    introEs:
      'El dadaísta diseñó sus propios tableros y retrató la fascinación de su círculo por el juego.',
    introEn:
      'The Dadaist designed his own sets and portrayed his circle’s fascination with the game.',
    image: '/artworks/art.svg',
    galleryHref: '/arte',
    sourceName: 'Ficha en galería de arte',
    sourceUrl: '/arte',
    featured: false,
  },
];

/** Las 5 en rotación este ciclo. */
export const FEATURED_WORKS = HERO_FEATURES.filter((f) => f.featured);
