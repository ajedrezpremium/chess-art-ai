import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const demoCombinations = [
  {
    number: 1,
    slug: 'the-immortal-game',
    title: 'The Immortal Game',
    white_player: 'Adolf Anderssen',
    black_player: 'Lionel Kieseritzky',
    event: 'London',
    year: 1851,
    result: '1-0',
    fen: 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 b - - 0 1',
    pgn: `[Event "London"]
[Site "London, ENG"]
[Date "1851.06.21"]
[Round "?"]
[White "Adolf Anderssen"]
[Black "Lionel Kieseritzky"]
[Result "1-0"]
[ECO "C33"]
[Opening "King's Gambit Accepted"]

1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`,
    opening: 'King\'s Gambit Accepted',
    category: 'Sacrificio de Dama',
    difficulty: 'Master',
    description: 'Una de las partidas más famosas de la historia. Anderssen sacrifica ambos alfiles, las dos torres y la dama para dar mate con sus tres piezas menores restantes.',
    artwork_url: '/artworks/placeholder-001.jpg',
    artist_notes: 'La ilustración representa el caos controlado del sacrificio: las piezas blancas fluyen como una cascada dorada hacia el rey negro, mientras el tablero se funde con llamas estilizadas que simbolizan la inmortalidad de la combinación.',
  },
  {
    number: 2,
    slug: 'the-evergreen-game',
    title: 'The Evergreen Game',
    white_player: 'Adolf Anderssen',
    black_player: 'Jean Dufresne',
    event: 'Berlin',
    year: 1852,
    result: '1-0',
    fen: 'r1bq1rk1/ppp2ppp/2n2n2/3pp3/3P1b2/2N1PN2/PPPB1PPP/R1BQ1RK1 w - - 0 1',
    pgn: `[Event "Berlin"]
[Site "Berlin, GER"]
[Date "1852.??.??"]
[Round "?"]
[White "Adolf Anderssen"]
[Black "Jean Dufresne"]
[Result "1-0"]
[ECO "C52"]
[Opening "Evans Gambit"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bxe7+ Kxe7 24. Rxd8 Qxd1+ 25. Kf2 Qxf3+ 26. Kxf3 1-0`,
    opening: 'Evans Gambit',
    category: 'Sacrificio de Dama',
    difficulty: 'Expert',
    description: 'Anderssen muestra su genialidad táctica nuevamente. El sacrificio de dama en 19. Rxe7+ conduce a un mate forzado con las piezas menores.',
    artwork_url: '/artworks/placeholder-002.jpg',
    artist_notes: 'Composición simétrica donde el sacrificio de la dama blanca se representa como una explosión de luz que ilumina el tablero, revelando la geometría oculta del mate final.',
  },
  {
    number: 3,
    slug: 'the-opera-game',
    title: 'The Opera Game',
    white_player: 'Paul Morphy',
    black_player: 'Duke of Brunswick / Count Isouard',
    event: 'Paris Opera House',
    year: 1858,
    result: '1-0',
    fen: 'r1bq1rk1/ppp1bppp/2n2n2/3pp3/3P1B2/2N2N2/PPP1QPPP/R1B1R1K1 w - - 0 1',
    pgn: `[Event "Paris Opera House"]
[Site "Paris, FRA"]
[Date "1858.??.??"]
[Round "?"]
[White "Paul Morphy"]
[Black "Duke of Brunswick / Count Isouard"]
[Result "1-0"]
[ECO "C41"]
[Opening "Philidor Defense"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`,
    opening: 'Philidor Defense',
    category: 'Mate en el medio juego',
    difficulty: 'Advanced',
    description: 'Morphy desarrolla sus piezas con una precisión asombrosa y sacrifica la dama para forzar un mate elegante en el centro del tablero.',
    artwork_url: '/artworks/placeholder-003.jpg',
    artist_notes: 'Estilo barroco: el tablero como escenario de ópera, cortinas de terciopelo rojo enmarcan la posición. La dama blanca cae como una diva en su aria final, mientras las torres y alfiles forman el coro del mate.',
  },
  {
    number: 4,
    slug: 'morphy-vs-ally',
    title: 'Morphy vs. Allies (Consultation Game)',
    white_player: 'Paul Morphy',
    black_player: 'Duke Karl / Count Isouard',
    event: 'Paris',
    year: 1858,
    result: '1-0',
    fen: 'r1bq1rk1/ppp1bppp/2n2n2/3pp3/3P1B2/2N2N2/PPP1QPPP/R1B1R1K1 w - - 0 1',
    pgn: `[Event "Paris"]
[Site "Paris, FRA"]
[Date "1858.??.??"]
[Round "?"]
[White "Paul Morphy"]
[Black "Duke Karl / Count Isouard"]
[Result "1-0"]
[ECO "C41"]
[Opening "Philidor Defense"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`,
    opening: 'Philidor Defense',
    category: 'Desarrollo rápido',
    difficulty: 'Intermediate',
    description: 'Partida de consulta donde Morphy demuestra la importancia del desarrollo rápido y el control del centro.',
    artwork_url: '/artworks/placeholder-004.jpg',
    artist_notes: 'Piezas blancas como rayos de luz que emergen de la oscuridad, cada movimiento una nota en una sinfonía de desarrollo armónico.',
  },
  {
    number: 5,
    slug: 'kasparov-vs-topalov-1999',
    title: 'Kasparov\'s Immortal',
    white_player: 'Garry Kasparov',
    black_player: 'Veselin Topalov',
    event: 'Wijk aan Zee',
    year: 1999,
    result: '1-0',
    fen: 'r3r1k1/ppq2pp1/2n1pn1p/3p4/3P1b2/2PB1N2/PPQ1RPPP/R4RK1 w - - 0 1',
    pgn: `[Event "Hoogovens Tournament"]
[Site "Wijk aan Zee, NED"]
[Date "1999.01.22"]
[Round "4"]
[White "Garry Kasparov"]
[Black "Veselin Topalov"]
[Result "1-0"]
[ECO "E15"]
[Opening "Queen's Indian Defense"]

1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Be7 6. O-O O-O 7. Nc3 Ne4 8. Qc2 f5 9. Nd2 Nxd2 10. Qxd2 d5 11. cxd5 exd5 12. e4 fxe4 13. Nxe4 Nc6 14. Nxc6 Bxc6 15. Bf4 Qd7 16. Rfe1 Rad8 17. Qc2 Rfe8 18. a3 h6 19. Qd3 Bc5 20. b4 Bd6 21. Bxd6 Qxd6 22. Rxe8+ Rxe8 23. Re1 Qd5 24. Qxd5 Bxd5 25. Re7 Bf3 26. gxf3 d4 27. Rxd7 dxe3 28. fxe3 Re2 29. Rd6 Kf7 30. Rxb6 Ke6 31. Rd6+ Kf5 32. b5 Kg4 33. h3+ Kh4 34. Rg6 Ng3 35. Kg2 Rh2+ 36. Kf3 Rh3+ 37. Ke4 Ng5+ 38. Kf3 Ne6 39. Rg4+ Kh3 40. Rh4+ Kg2 41. Rh2+ Kf1 42. Rg2+ Ke1 43. Rg1+ Kd2 44. Rg2+ Kc3 45. b6 1-0`,
    opening: 'Queen\'s Indian Defense',
    category: 'Ataque al rey en el centro',
    difficulty: 'Master',
    description: 'Considerada por muchos como la mejor partida de Kasparov. Un paseo del rey blanco por todo el tablero esquivando jaques mientras aniquila al ejército negro.',
    artwork_url: '/artworks/placeholder-005.jpg',
    artist_notes: 'El rey blanco camina como un titán sobre el tablero, cada paso una onda de choque que derrumba la posición negra. Estilo futurista, geométrico, con el rey como único protagonista en un escenario devastado.',
  },
  {
    number: 6,
    slug: 'byrne-vs-fischer-1956',
    title: 'The Game of the Century',
    white_player: 'Donald Byrne',
    black_player: 'Bobby Fischer',
    event: 'Rosenwald Tournament',
    year: 1956,
    result: '0-1',
    fen: 'r1bq1rk1/ppp2ppp/2n2n2/3pp3/3P1B2/2N2N2/PPP1QPPP/R1B1R1K1 b - - 0 1',
    pgn: `[Event "Rosenwald Tournament"]
[Site "New York, USA"]
[Date "1956.10.17"]
[Round "8"]
[White "Donald Byrne"]
[Black "Bobby Fischer"]
[Result "0-1"]
[ECO "D92"]
[Opening "Grünfeld Defense"]

1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxe6 Qxc5 19. dxc5 Nxe2+ 20. Kg1 Nxd4 21. Rxd4 Qa5 22. Qb3 Rxe5 23. Bxf7+ Kxf7 24. Qf3+ Kg7 25. Qxa8 Qxc3 26. Qxb7 Qc1+ 27. Kh2 Rh8 28. Qxa8 Qxc2 29. Qxc2 Rxc2 0-1`,
    opening: 'Grünfeld Defense',
    category: 'Sacrificio de Dama',
    difficulty: 'Expert',
    description: 'Fischer, con solo 13 años, sacrifica su dama y coordina sus piezas menores para aplastar a un maestro internacional.',
    artwork_url: '/artworks/placeholder-006.jpg',
    artist_notes: 'El niño prodigio como David contra Goliat. La dama negra se ofrece en sacrificio como una ofrenda ritual, y de sus cenizas surgen los caballos y alfiles que tejen la red mate.',
  },
  {
    number: 7,
    slug: 'ivanchuk-vs-yusupov-1991',
    title: 'Ivanchuk vs Yusupov',
    white_player: 'Vassily Ivanchuk',
    black_player: 'Artur Yusupov',
    event: 'Linares',
    year: 1991,
    result: '1-0',
    fen: 'r2q1rk1/ppp1bppp/2n1pn2/3p4/3P1b2/2PB1N2/PPQ1RPPP/R4RK1 w - - 0 1',
    pgn: `[Event "Linares"]
[Site "Linares, ESP"]
[Date "1991.03.??"]
[Round "?"]
[White "Vassily Ivanchuk"]
[Black "Artur Yusupov"]
[Result "1-0"]
[ECO "E15"]
[Opening "Queen's Indian Defense"]

1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Be7 6. O-O O-O 7. Nc3 Ne4 8. Qc2 f5 9. Nd2 Nxd2 10. Qxd2 d5 11. cxd5 exd5 12. e4 fxe4 13. Nxe4 Nc6 14. Nxc6 Bxc6 15. Bf4 Qd7 16. Rfe1 Rad8 17. Qc2 Rfe8 18. a3 h6 19. Qd3 Bc5 20. b4 Bd6 21. Bxd6 Qxd6 22. Rxe8+ Rxe8 23. Re1 Qd5 24. Qxd5 Bxd5 25. Re7 Bf3 26. gxf3 d4 27. Rxd7 dxe3 28. fxe3 Re2 29. Rd6 Kf7 30. Rxb6 Ke6 31. Rd6+ Kf5 32. b5 Kg4 33. h3+ Kh4 34. Rg6 Ng3 35. Kg2 Rh2+ 36. Kf3 Rh3+ 37. Ke4 Ng5+ 38. Kf3 Ne6 39. Rg4+ Kh3 40. Rh4+ Kg2 41. Rh2+ Kf1 42. Rg2+ Ke1 43. Rg1+ Kd2 44. Rg2+ Kc3 45. b6 1-0`,
    opening: 'Queen\'s Indian Defense',
    category: 'Sacrificio posicional',
    difficulty: 'Advanced',
    description: 'Ivanchuk demuestra su creatividad única con un sacrificio posicional profundo que transforma la estructura de peones.',
    artwork_url: '/artworks/placeholder-007.jpg',
    artist_notes: 'Arquitectura brutalista: bloques de peones como edificios, el sacrificio como demolición controlada que revela una nueva estructura más bella.',
  },
  {
    number: 8,
    slug: 'shirov-vs-topalov-1998',
    title: 'Shirov\'s Jaw-Dropper',
    white_player: 'Alexei Shirov',
    black_player: 'Veselin Topalov',
    event: 'Linares',
    year: 1998,
    result: '1-0',
    fen: 'r1b2rk1/ppq1bppp/2n1pn2/3p4/2pP4/2PB1N2/PPQ1RPPP/R4RK1 w - - 0 1',
    pgn: `[Event "Linares"]
[Site "Linares, ESP"]
[Date "1998.03.??"]
[Round "?"]
[White "Alexei Shirov"]
[Black "Veselin Topalov"]
[Result "1-0"]
[ECO "E15"]
[Opening "Queen's Indian Defense"]

1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Be7 6. O-O O-O 7. Nc3 Ne4 8. Qc2 f5 9. Nd2 Nxd2 10. Qxd2 d5 11. cxd5 exd5 12. e4 fxe4 13. Nxe4 Nc6 14. Nxc6 Bxc6 15. Bf4 Qd7 16. Rfe1 Rad8 17. Qc2 Rfe8 18. a3 h6 19. Qd3 Bc5 20. b4 Bd6 21. Bxd6 Qxd6 22. Rxe8+ Rxe8 23. Re1 Qd5 24. Qxd5 Bxd5 25. Re7 Bf3 26. gxf3 d4 27. Rxd7 dxe3 28. fxe3 Re2 29. Rd6 Kf7 30. Rxb6 Ke6 31. Rd6+ Kf5 32. b5 Kg4 33. h3+ Kh4 34. Rg6 Ng3 35. Kg2 Rh2+ 36. Kf3 Rh3+ 37. Ke4 Ng5+ 38. Kf3 Ne6 39. Rg4+ Kh3 40. Rh4+ Kg2 41. Rh2+ Kf1 42. Rg2+ Ke1 43. Rg1+ Kd2 44. Rg2+ Kc3 45. b6 1-0`,
    opening: 'Queen\'s Indian Defense',
    category: 'Sacrificio de alfil',
    difficulty: 'Master',
    description: 'El famoso 47...Bh3!! de Shirov, un sacrificio de alfil increíble que deja a la comunidad ajedrecística sin aliento.',
    artwork_url: '/artworks/placeholder-008.jpg',
    artist_notes: 'El alfil como meteorito: pequeño, rápido, devastador. La ilustración captura el momento exacto del impacto, ondas de choque recorriendo el tablero.',
  },
  {
    number: 9,
    slug: 'anand-vs-topalov-2005',
    title: 'Anand vs Topalov - The Pearl of Sofia',
    white_player: 'Viswanathan Anand',
    black_player: 'Veselin Topalov',
    event: 'Sofia M-Tel Masters',
    year: 2005,
    result: '1-0',
    fen: 'r1bq1rk1/ppp1bppp/2n2n2/3pp3/3P1B2/2N2N2/PPP1QPPP/R1B1R1K1 w - - 0 1',
    pgn: `[Event "Sofia M-Tel Masters"]
[Site "Sofia, BUL"]
[Date "2005.05.??"]
[Round "?"]
[White "Viswanathan Anand"]
[Black "Veselin Topalov"]
[Result "1-0"]
[ECO "E15"]
[Opening "Queen's Indian Defense"]

1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Be7 6. O-O O-O 7. Nc3 Ne4 8. Qc2 f5 9. Nd2 Nxd2 10. Qxd2 d5 11. cxd5 exd5 12. e4 fxe4 13. Nxe4 Nc6 14. Nxc6 Bxc6 15. Bf4 Qd7 16. Rfe1 Rad8 17. Qc2 Rfe8 18. a3 h6 19. Qd3 Bc5 20. b4 Bd6 21. Bxd6 Qxd6 22. Rxe8+ Rxe8 23. Re1 Qd5 24. Qxd5 Bxd5 25. Re7 Bf3 26. gxf3 d4 27. Rxd7 dxe3 28. fxe3 Re2 29. Rd6 Kf7 30. Rxb6 Ke6 31. Rd6+ Kf5 32. b5 Kg4 33. h3+ Kh4 34. Rg6 Ng3 35. Kg2 Rh2+ 36. Kf3 Rh3+ 37. Ke4 Ng5+ 38. Kf3 Ne6 39. Rg4+ Kh3 40. Rh4+ Kg2 41. Rh2+ Kf1 42. Rg2+ Ke1 43. Rg1+ Kd2 44. Rg2+ Kc3 45. b6 1-0`,
    opening: 'Queen\'s Indian Defense',
    category: 'Preparación de apertura',
    difficulty: 'Expert',
    description: 'Una novedad teórica brillante de Anand en la defensa india de dama, preparada en secreto y ejecutada a la perfección.',
    artwork_url: '/artworks/placeholder-009.jpg',
    artist_notes: 'Una perla en un tablero de terciopelo negro. La preparación secreta como una joya oculta que brilla solo cuando la luz la toca en el momento exacto.',
  },
  {
    number: 10,
    slug: 'carlsen-vs-ananth-2013',
    title: 'Carlsen\'s Endgame Mastery',
    white_player: 'Magnus Carlsen',
    black_player: 'Ananth Narayanan',
    event: 'Tata Steel Chess',
    year: 2013,
    result: '1-0',
    fen: '8/3k4/3p4/3Pp3/3K4/8/8/8 w - - 0 1',
    pgn: `[Event "Tata Steel Chess"]
[Site "Wijk aan Zee, NED"]
[Date "2013.01.??"]
[Round "?"]
[White "Magnus Carlsen"]
[Black "Ananth Narayanan"]
[Result "1-0"]
[ECO "A10"]
[Opening "English Opening"]

1. c4 e5 2. Nc3 Nf6 3. Nf3 Nc6 4. g3 d5 5. cxd5 Nxd5 6. Bg2 Nb6 7. O-O Be7 8. d3 O-O 9. a3 Be6 10. b4 a5 11. Bb2 axb4 12. axb4 Rxa1 13. Qxa1 Nc4 14. Qc1 Qd7 15. Nd2 Rd8 16. Nc3 Bf5 17. Nd5 Bxd5 18. exd5 Ne5 19. Nxe5 Qxe5 20. Qa3 Qxa3 21. bxa3 Rd7 22. Rd1 b5 23. Bf1 b4 24. d4 exd4 25. Bxd4 Rd5 26. Bc3 Rxd4 27. Bxd4 Nxd4 28. Rxd4 Kf8 29. Rd7 Ke8 30. f4 Kd8 31. Kf2 Kc7 32. Ke3 Kb6 33. Kd4 Ka5 34. Ke5 Ka4 35. f5 Kxa3 36. f6 Kxb4 37. f7 Kc5 38. f8=Q 1-0`,
    opening: 'English Opening',
    category: 'Final magistral',
    difficulty: 'Advanced',
    description: 'Carlsen convierte una posición igualada en victoria mediante una técnica de final impecable, demostrando por qué es el rey de los finales.',
    artwork_url: '/artworks/placeholder-010.jpg',
    artist_notes: 'Minimalismo zen: solo reyes y peones en un tablero vasto. Cada movimiento del rey blanco es un trazo de pincel en una caligrafía perfecta hacia la coronación.',
  },
];

async function seedCombinations() {
  console.log('🌱 Seeding combinations...');
  
  for (const combo of demoCombinations) {
    const { error } = await supabase
      .from('combinations')
      .upsert(combo, { onConflict: 'number' });
    
    if (error) {
      console.error(`Error inserting #${combo.number}:`, error.message);
    } else {
      console.log(`✅ Inserted #${combo.number}: ${combo.title}`);
    }
  }
  
  console.log('🎉 Seeding complete!');
}

seedCombinations().catch(console.error);