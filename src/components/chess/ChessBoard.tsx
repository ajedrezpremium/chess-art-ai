'use client';

import { useState, useEffect, useCallback, useId, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import type { SquareHandlerArgs, PieceDropHandlerArgs } from 'react-chessboard';
import { cn } from '@/lib/utils';
import { normalizeFen, DEFAULT_FEN } from '@/lib/chess/pgn-utils';
import { playChessSound } from '@/lib/chess/sound';

const BLUE_DARK_SQUARE = '#2B4C7E';
const CREAM_LIGHT_SQUARE = '#E2E8F0';
const LAST_MOVE_COLOR = '#1D4ED8';
const SELECTED_COLOR = '#F59E0B';

interface ChessBoardProps {
  fen?: string;
  orientation?: 'white' | 'black';
  coordinates?: boolean;
  highlights?: Record<string, string>;
  arrows?: Array<{ from: string; to: string; color?: string }>;
  lastMove?: { from: string; to: string } | null;
  selectedSquare?: string | null;
  interactive?: boolean;
  onMove?: (from: string, to: string, promotion?: string) => void;
  onSquareClick?: (square: string, piece: string | null) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ChessBoard({
  fen = DEFAULT_FEN,
  orientation = 'white',
  coordinates = true,
  highlights = {},
  arrows = [],
  lastMove = null,
  selectedSquare: externalSelected = null,
  interactive = false,
  onMove,
  onSquareClick,
  className,
  style,
}: ChessBoardProps) {
  const boardId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const safeFen = normalizeFen(fen);
  const [internalFen, setInternalFen] = useState(safeFen);
  const [selected, setSelected] = useState<string | null>(null);
  const [legalTargets, setLegalTargets] = useState<Record<string, boolean>>({});
  const [game] = useState(() => new Chess());

  // Sincronizar cuando el FEN externo cambia (navegación de jugadas).
  useEffect(() => {
    const validFen = normalizeFen(fen);
    try {
      game.load(validFen);
    } catch {
      game.reset();
    }
    setInternalFen(game.fen());
    setSelected(null);
    setLegalTargets({});
  }, [fen, game]);

  const attemptMove = useCallback((from: string, to: string) => {
    try {
      const target = game.get(to as never);
      const move = game.move({ from, to, promotion: 'q' });
      if (!move) return false;
      setInternalFen(game.fen());
      setSelected(null);
      setLegalTargets({});
      if (game.inCheck()) {
        playChessSound('check');
      } else if (target || move.captured) {
        playChessSound('capture');
      } else {
        playChessSound('move');
      }
      onMove?.(from, to, move.promotion);
      return true;
    } catch {
      return false;
    }
  }, [game, onMove]);

  const handleSquareClick = useCallback(({ piece, square }: SquareHandlerArgs) => {
    const pieceCode = piece ? piece.pieceType : null;
    if (!interactive) {
      onSquareClick?.(square, pieceCode);
      return;
    }
    // Si hay selección previa e hicimos clic en destino legal → mover.
    if (selected) {
      if (selected === square) {
        setSelected(null);
        setLegalTargets({});
        onSquareClick?.(square, pieceCode);
        return;
      }
      if (legalTargets[square]) {
        attemptMove(selected, square);
        return;
      }
    }
    // Seleccionar pieza del bando al que le toca mover.
    if (pieceCode && pieceCode[0].toLowerCase() === game.turn()) {
      setSelected(square);
      const moves = game.moves({ square: square as never, verbose: true }) as Array<{ to: string }>;
      const targets: Record<string, boolean> = {};
      moves.forEach((m) => { targets[m.to] = true; });
      setLegalTargets(targets);
    } else {
      setSelected(null);
      setLegalTargets({});
    }
    onSquareClick?.(square, pieceCode);
  }, [interactive, selected, legalTargets, game, attemptMove, onSquareClick]);

  const handlePieceDrop = useCallback(({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
    if (!interactive || !targetSquare) return false;
    return attemptMove(sourceSquare, targetSquare);
  }, [interactive, attemptMove]);

  const canDragPiece = useCallback(({ piece }: { piece: { pieceType: string } }) => {
    if (!interactive) return false;
    return piece.pieceType[0].toLowerCase() === game.turn();
  }, [interactive, game]);

  const activeSelected = externalSelected || selected;

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    for (const [sq, color] of Object.entries(highlights)) {
      styles[sq] = { backgroundColor: color };
    }
    if (lastMove) {
      styles[lastMove.from] = { backgroundColor: LAST_MOVE_COLOR };
      styles[lastMove.to] = { backgroundColor: LAST_MOVE_COLOR };
    }
    if (activeSelected) {
      styles[activeSelected] = { backgroundColor: SELECTED_COLOR };
    }
    for (const sq of Object.keys(legalTargets)) {
      const occupied = game.get(sq as never);
      styles[sq] = occupied
        ? { boxShadow: 'inset 0 0 0 4px rgba(239,68,68,0.9)' }
        : {
            backgroundImage:
              'radial-gradient(circle at center, rgba(16,185,129,0.9) 20%, transparent 21%)',
          };
    }
    return styles;
  }, [highlights, lastMove, activeSelected, legalTargets, game, internalFen]);

  const boardArrows = useMemo(
    () => arrows.map((a) => ({
      startSquare: a.from,
      endSquare: a.to,
      color: a.color || '#3B82F6',
    })),
    [arrows]
  );

  return (
    <div
      className={cn(
        'chessboard-a11y-guard relative w-full overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900 shadow-2xl select-none',
        className
      )}
      style={{ aspectRatio: '1 / 1', maxWidth: '640px', ...style }}
    >
      <Chessboard
        options={{
          id: `chessboard-${boardId}`,
          position: internalFen,
          boardOrientation: orientation,
          darkSquareStyle: { backgroundColor: BLUE_DARK_SQUARE },
          lightSquareStyle: { backgroundColor: CREAM_LIGHT_SQUARE },
          squareStyles,
          arrows: boardArrows,
          allowDrawingArrows: false,
          allowDragging: interactive,
          allowDragOffBoard: false,
          canDragPiece,
          onPieceDrop: handlePieceDrop,
          onSquareClick: handleSquareClick,
          showNotation: coordinates,
          animationDurationInMs: 200,
          boardStyle: { width: '100%', height: '100%' },
        }}
      />
    </div>
  );
}

/** Variante no interactiva (visor de partidas, tarjetas, galerías). */
export function ChessBoardSvg(props: ChessBoardProps) {
  return <ChessBoard {...props} interactive={false} />;
}
