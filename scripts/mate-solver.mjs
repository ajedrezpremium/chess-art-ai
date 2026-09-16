// Mini-buscador de mate forzado (para verificar defensas alternativas).
// Uso: node scripts/mate-solver.mjs "<FEN>" <plies> [timeMs]
import { Chess } from 'chess.js';

const fen = process.argv[2];
const maxPlies = parseInt(process.argv[3] || '7', 10);
const budget = parseInt(process.argv[4] || '90000', 10);
const t0 = Date.now();
let nodes = 0;

function ordered(game) {
  const ms = game.moves({ verbose: true });
  const score = (m) =>
    (m.san.includes('#') ? 100 : 0) +
    (m.san.includes('+') ? 10 : 0) +
    (m.captured ? 5 : 0) +
    (m.promotion ? 4 : 0);
  return ms.sort((a, b) => score(b) - score(a));
}

// Mate forzado del BLANCO en <= depth plies. Devuelve PV o null.
function solve(game, depth) {
  if (Date.now() - t0 > budget) throw new Error('timeout');
  nodes++;
  if (game.isCheckmate()) return game.turn() === 'b' ? [] : null;
  if (game.isDraw() || game.isStalemate()) return null;
  if (depth <= 0) return null;
  const ms = ordered(game);
  if (game.turn() === 'w') {
    for (const m of ms) {
      game.move(m.san);
      const sub = solve(game, depth - 1);
      game.undo();
      if (sub) return [m.san, ...sub];
    }
    return null;
  }
  // negras: TODAS las réplicas deben llevar a mate
  let pv = null;
  for (const m of ms) {
    game.move(m.san);
    const sub = solve(game, depth - 1);
    game.undo();
    if (!sub) return null;
    if (!pv) pv = [m.san, ...sub];
  }
  return pv;
}

const game = new Chess(fen);
try {
  const pv = solve(game, maxPlies);
  console.log(`nodos=${nodes} tiempo=${Date.now() - t0}ms`);
  console.log(pv ? `MATE FORZADO: ${pv.join(' ')}` : 'sin mate forzado en la profundidad dada');
} catch (e) {
  console.log(`nodos=${nodes} ${e.message}`);
}
