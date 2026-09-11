import { Chess } from 'chess.js';
import type { ParsedPGN, PGNMove } from '@/types/combination';

export function parsePGN(pgn: string): ParsedPGN {
  const chess = new Chess();
  const lines = pgn.trim().split('\n');
  const headers: Record<string, string> = {};
  let movesSection = '';
  let inHeaders = true;

  for (const line of lines) {
    const trimmed = line.trim();
    if (inHeaders) {
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        const match = trimmed.match(/\[(\w+)\s+"([^"]*)"\]/);
        if (match) {
          headers[match[1]] = match[2];
        }
      } else if (trimmed === '') {
        inHeaders = false;
      }
    } else {
      movesSection += ' ' + trimmed;
    }
  }

  chess.load(headers.FEN || 'start');
  const initialFen = chess.fen();
  
  const moves: PGNMove[] = [];
  const moveTokens = movesSection.trim().split(/\s+/).filter(Boolean);
  
  let moveNumber = 1;
  let isWhite = true;
  
  for (const token of moveTokens) {
    if (token.endsWith('.')) continue;
    if (['1-0', '0-1', '1/2-1/2', '*'].includes(token)) break;

    try {
      const move = chess.move(token);
      if (move) {
        moves.push({
          san: move.san,
          fen: chess.fen(),
          moveNumber,
          isWhite,
          comment: undefined,
        });
        isWhite = !isWhite;
        if (!isWhite) moveNumber++;
      }
    } catch {
      // Skip invalid moves
    }
  }

  return { headers, moves, initialFen };
}

export function getFENAtMove(parsedPGN: ParsedPGN, moveIndex: number): string {
  if (moveIndex < 0) return parsedPGN.initialFen;
  if (moveIndex >= parsedPGN.moves.length) return parsedPGN.moves[parsedPGN.moves.length - 1].fen;
  return parsedPGN.moves[moveIndex].fen;
}

export function generatePGNFromMoves(moves: PGNMove[], headers: Record<string, string>): string {
  let pgn = '';
  for (const [key, value] of Object.entries(headers)) {
    pgn += `[${key} "${value}"]\n`;
  }
  pgn += '\n';
  
  let currentMoveNumber = 1;
  let moveString = '';
  
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (move.moveNumber !== currentMoveNumber) {
      moveString += `${currentMoveNumber}. `;
      currentMoveNumber = move.moveNumber;
    }
    if (move.isWhite) {
      moveString += `${move.san} `;
    } else {
      moveString += `${move.san} `;
    }
  }
  
  pgn += moveString.trim() + ' ' + (headers.Result || '*');
  return pgn;
}

export const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Expert: 'bg-red-500/20 text-red-400 border-red-500/30',
  Master: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export const DIFFICULTY_LABELS_ES: Record<string, string> = {
  Beginner: 'Principiante',
  Easy: 'Fácil',
  Intermediate: 'Intermedio',
  Advanced: 'Avanzado',
  Expert: 'Experto',
  Master: 'Maestro',
};

export const DIFFICULTY_LABELS_EN: Record<string, string> = {
  Beginner: 'Beginner',
  Easy: 'Easy',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
  Expert: 'Expert',
  Master: 'Master',
};