// Verifica líneas de mate: juega la solución, confirma mate final y lista
// las defensas alternativas del negro en cada jugada (para detectar cocinados).
import { Chess } from 'chess.js';

const tests = [
  {
    name: 'Abu Naim s.IX',
    fen: '6K1/3r3r/5kn1/5p2/5P2/6N1/8/4R1R1 w - - 0 1',
    line: [['g3', 'h5'], ['h7', 'h5'], ['g1', 'g6'], ['f6', 'g6'], ['e1', 'e6']],
  },
  {
    name: 'Alfonso X 1283',
    fen: '3n3k/2R5/2n1P3/3N2N1/8/1p6/2r3r1/K7 w - - 0 1',
    line: [['c7', 'h7'], ['h8', 'g8'], ['d5', 'f6'], ['g8', 'f8'], ['e6', 'e7'], ['c6', 'e7'], ['h7', 'f7'], ['d8', 'f7'], ['g5', 'e6']],
  },
  {
    name: 'Lucena 1500',
    fen: 'rr4k1/6pp/2Q5/3KN3/q7/8/8/8 w - - 0 1',
    line: [['c6', 'e6'], ['g8', 'h8'], ['e5', 'f7'], ['h8', 'g8'], ['f7', 'h6'], ['g8', 'h8'], ['e6', 'g8'], ['b8', 'g8'], ['h6', 'f7']],
  },
  {
    name: 'Leonardo Roma 1560',
    fen: 'rn1qkbnr/pp3ppp/2p5/4p3/2B1P1b1/5N2/PPPP2PP/RNBQK2R w KQkq - 0 1',
    line: [['c4', 'f7'], ['e8', 'f7'], ['f3', 'e5'], ['f7', 'e8'], ['d1', 'g4'], ['g8', 'f6'], ['g4', 'e6'], ['d8', 'e7'], ['e6', 'c8'], ['e7', 'd8'], ['c8', 'd8'], ['e8', 'd8'], ['e5', 'f7']],
  },
  {
    name: 'Damiano 1512',
    fen: '4qrk1/6p1/5pP1/3K4/8/8/4P3/3Q1R1R w - - 0 1',
    line: [['h1', 'h8'], ['g8', 'h8'], ['f1', 'h1'], ['h8', 'g8'], ['h1', 'h8'], ['g8', 'h8'], ['d1', 'h1'], ['h8', 'g8'], ['h1', 'h7']],
  },
];

for (const t of tests) {
  console.log(`\n=== ${t.name} ===`);
  const game = new Chess(t.fen);
  let ok = true;
  for (let i = 0; i < t.line.length; i++) {
    const [from, to] = t.line[i];
    // Defensas alternativas ANTES de jugar la respuesta negra
    if (game.turn() === 'b' && i > 0) {
      const legal = game.moves({ verbose: true }).map((m) => `${m.from}${m.to}`);
      const expected = `${from}${to}`;
      const alt = legal.filter((m) => m !== expected);
      if (alt.length > 0) console.log(`  jugada ${Math.ceil((i + 1) / 2)} negras: esperada ${expected}, ALTERNATIVAS: ${alt.join(', ')}`);
    }
    try {
      const mv = game.move({ from, to, promotion: 'q' });
      console.log(`  ${Math.ceil((i + 1) / 2)}${game.turn() === 'b' ? '.' : '...'} ${mv.san}`);
    } catch (e) {
      console.log(`  ERROR jugando ${from}${to}: ${e.message}`);
      ok = false;
      break;
    }
  }
  if (ok) {
    console.log(`  final: mate=${game.isCheckmate()} tablas=${game.isDraw()} turno=${game.turn()}`);
    console.log(`  FEN final: ${game.fen()}`);
  }
}
