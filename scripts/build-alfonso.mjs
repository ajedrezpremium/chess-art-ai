import { Chess } from 'chess.js';
import { writeFileSync } from 'node:fs';

const game = new Chess('3n3k/2R5/2n1P3/3N2N1/8/1p6/2r3r1/K7 w - - 0 1');
const line = [['c7', 'h7'], ['h8', 'g8'], ['d5', 'f6'], ['g8', 'f8'], ['e6', 'e7'], ['c6', 'e7'], ['h7', 'f7'], ['d8', 'f7'], ['g5', 'e6']];
for (const [from, to] of line) {
  const mv = game.move({ from, to, promotion: 'q' });
  console.log(mv.san);
}
console.log('mate:', game.isCheckmate());
game.header('Event', 'Libro de los juegos');
game.header('Site', 'Sevilla, ESP');
game.header('Date', '1283.??.??');
game.header('Round', '?');
game.header('White', 'Alfonso X el Sabio');
game.header('Black', 'Anónimo');
game.header('Result', '1-0');
game.header('SetUp', '1');
game.header('FEN', '3n3k/2R5/2n1P3/3N2N1/8/1p6/2r3r1/K7 w - - 0 1');
game.header('PlyCount', '9');
const pgn = game.pgn();
console.log('---');
console.log(pgn);
writeFileSync('scripts/_alfonso.pgn', pgn);
