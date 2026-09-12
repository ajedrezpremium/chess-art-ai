'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { cn } from '@/lib/utils';
import { normalizeFen, DEFAULT_FEN } from '@/lib/chess/pgn-utils';
import { ChessPiece } from './pieces';
import { playChessSound } from '@/lib/chess/sound';

const BLUE_DARK_SQUARE = '#2B4C7E';
const CREAM_LIGHT_SQUARE = '#E2E8F0';
const HIGHLIGHT_COLOR = '#3B82F6';
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
  const safeFen = normalizeFen(fen);
  const [chess] = useState(() => {
    const c = new Chess();
    try {
      c.load(safeFen);
    } catch {
      c.reset();
    }
    return c;
  });
  const [position, setPosition] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const chessRef = useRef(chess);
  chessRef.current = chess;

  const updatePosition = useCallback(() => {
    const game = chessRef.current;
    setPosition(game.board().reduce((acc, row) => {
      row.forEach(piece => {
        if (piece) {
          const square = piece.square;
          acc[square] = `${piece.color}${piece.type.toUpperCase()}`;
        }
      });
      return acc;
    }, {} as Record<string, string>));
  }, []);

  useEffect(() => {
    const validFen = normalizeFen(fen);
    try {
      chessRef.current.load(validFen);
    } catch (e) {
      console.warn('[ChessBoard] Error loading FEN:', e);
      chessRef.current.reset();
    }
    updatePosition();
    setSelected(null);
    setLegalMoves([]);
  }, [fen, updatePosition]);

  const handleSquarePress = useCallback((square: string) => {
    const piece = position[square] || null;

    if (!interactive) {
      onSquareClick?.(square, piece);
      return;
    }

    const game = chessRef.current;

    // If already selected a square and clicking a target
    if (selected) {
      if (selected === square) {
        setSelected(null);
        setLegalMoves([]);
        return;
      }

      try {
        const isCapture = !!position[square];
        const move = game.move({
          from: selected,
          to: square,
          promotion: 'q',
        });

        if (move) {
          updatePosition();
          setSelected(null);
          setLegalMoves([]);
          
          if (game.inCheck()) {
            playChessSound('check');
          } else if (isCapture || move.captured) {
            playChessSound('capture');
          } else {
            playChessSound('move');
          }

          onMove?.(selected, square, move.promotion);
          return;
        }
      } catch {
        // Invalid move, try selecting new piece
      }
    }

    // Select piece if it belongs to current turn
    if (piece) {
      const turn = game.turn();
      const pieceColor = piece[0];
      if (pieceColor === turn) {
        setSelected(square);
        const moves = game.moves({ square: square as any, verbose: true });
        setLegalMoves(moves.map(m => m.to));
        onSquareClick?.(square, piece);
        return;
      }
    }

    setSelected(null);
    setLegalMoves([]);
    onSquareClick?.(square, piece);
  }, [interactive, selected, position, onMove, onSquareClick, updatePosition]);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = orientation === 'white' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8];
  const displayFiles = orientation === 'white' ? files : [...files].reverse();

  const getSquareColor = (fileIdx: number, rankIdx: number) => {
    const isDark = (fileIdx + rankIdx) % 2 === 0;
    return isDark ? BLUE_DARK_SQUARE : CREAM_LIGHT_SQUARE;
  };

  const activeSelected = externalSelected || selected;
  const mergedHighlights: Record<string, string> = { ...highlights };
  
  if (lastMove) {
    mergedHighlights[lastMove.from] = LAST_MOVE_COLOR;
    mergedHighlights[lastMove.to] = LAST_MOVE_COLOR;
  }
  
  if (activeSelected) {
    mergedHighlights[activeSelected] = SELECTED_COLOR;
  }

  return (
    <div
      className={cn('relative inline-block rounded-xl shadow-2xl border border-slate-700/80 bg-slate-900 select-none overflow-hidden', className)}
      style={{ maxWidth: '640px', width: '100%', aspectRatio: '1 / 1', ...style }}
    >
      <svg viewBox="0 0 512 512" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <filter id="boardPieceShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.45"/>
          </filter>
        </defs>
        
        {ranks.map((rank, rankIdx) => 
          files.map((file, fileIdx) => {
            const square = `${file}${rank}`;
            const displayFileIdx = orientation === 'white' ? fileIdx : 7 - fileIdx;
            const displayRankIdx = orientation === 'white' ? rankIdx : 7 - rankIdx;
            const x = displayFileIdx * 64;
            const y = displayRankIdx * 64;
            const color = getSquareColor(fileIdx, 7 - rankIdx);
            const highlight = mergedHighlights[square];
            const isLegal = legalMoves.includes(square);
            const hasPiece = !!position[square];
            
            return (
              <g 
                key={square} 
                onClick={() => handleSquarePress(square)}
                className={cn('transition-opacity duration-150', interactive ? 'cursor-pointer' : '')}
              >
                {/* Square Background */}
                <rect
                  x={x}
                  y={y}
                  width={64}
                  height={64}
                  fill={highlight || color}
                  opacity={highlight ? 0.9 : 1}
                />

                {/* Legal move indicator */}
                {isLegal && !hasPiece && (
                  <circle
                    cx={x + 32}
                    cy={y + 32}
                    r={8}
                    fill="#10B981"
                    opacity={0.8}
                    className="animate-pulse"
                  />
                )}

                {/* Legal capture indicator */}
                {isLegal && hasPiece && (
                  <circle
                    cx={x + 32}
                    cy={y + 32}
                    r={26}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth={4}
                    opacity={0.85}
                  />
                )}

                {/* Piece */}
                {position[square] && (
                  <g filter="url(#boardPieceShadow)">
                    <ChessPiece piece={position[square]} x={x} y={y} size={64} />
                  </g>
                )}
              </g>
            );
          })
        )}
        
        {/* Arrows */}
        {arrows.map((arrow, idx) => {
          const fromFile = files.indexOf(arrow.from[0]);
          const fromRank = parseInt(arrow.from[1]) - 1;
          const toFile = files.indexOf(arrow.to[0]);
          const toRank = parseInt(arrow.to[1]) - 1;
          
          const displayFromFile = orientation === 'white' ? fromFile : 7 - fromFile;
          const displayFromRank = orientation === 'white' ? 7 - fromRank : fromRank;
          const displayToFile = orientation === 'white' ? toFile : 7 - toFile;
          const displayToRank = orientation === 'white' ? 7 - toRank : toRank;
          
          const x1 = displayFromFile * 64 + 32;
          const y1 = displayFromRank * 64 + 32;
          const x2 = displayToFile * 64 + 32;
          const y2 = displayToRank * 64 + 32;
          
          return (
            <path
              key={idx}
              d={`M${x1},${y1} L${x2},${y2}`}
              stroke={arrow.color || '#3B82F6'}
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
              markerEnd="url(#boardArrowhead)"
              opacity={0.85}
            />
          );
        })}
        
        <defs>
          <marker id="boardArrowhead" markerWidth={10} markerHeight={7} refX={8} refY={3.5} orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
          </marker>
        </defs>
      </svg>

      {coordinates && (
        <>
          <div className="absolute bottom-0 left-0 flex w-full justify-between text-[11px] font-semibold text-slate-400/80 px-1 pointer-events-none select-none">
            {displayFiles.map(f => <span key={f} className="w-1/8 text-center">{f}</span>)}
          </div>
          <div className="absolute right-0.5 top-0 flex h-full flex-col justify-between text-[11px] font-semibold text-slate-400/80 py-1 pointer-events-none select-none">
            {ranks.map(r => <span key={r} className="h-1/8 flex items-center justify-center">{r}</span>)}
          </div>
        </>
      )}
    </div>
  );
}

export function ChessBoardSvg({
  fen = DEFAULT_FEN,
  orientation = 'white',
  coordinates = true,
  highlights = {},
  arrows = [],
  lastMove = null,
  selectedSquare = null,
  className,
  style,
}: ChessBoardProps) {
  const safeFen = normalizeFen(fen);
  const [chess] = useState(() => {
    const c = new Chess();
    try {
      c.load(safeFen);
    } catch {
      c.reset();
    }
    return c;
  });
  const [position, setPosition] = useState<Record<string, string>>({});

  useEffect(() => {
    const validFen = normalizeFen(fen);
    try {
      chess.load(validFen);
    } catch (e) {
      console.warn('[ChessBoardSvg] Error loading FEN:', e);
      chess.reset();
    }
    setPosition(chess.board().reduce((acc, row) => {
      row.forEach(piece => {
        if (piece) {
          const square = piece.square;
          acc[square] = `${piece.color}${piece.type.toUpperCase()}`;
        }
      });
      return acc;
    }, {} as Record<string, string>));
  }, [fen, chess]);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = orientation === 'white' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8];
  const displayFiles = orientation === 'white' ? files : [...files].reverse();

  const getSquareColor = (file: number, rank: number) => {
    const isDark = (file + rank) % 2 === 0;
    return isDark ? BLUE_DARK_SQUARE : CREAM_LIGHT_SQUARE;
  };

  const getHighlight = (square: string) => {
    if (highlights[square]) return highlights[square];
    if (lastMove && (lastMove.from === square || lastMove.to === square)) return LAST_MOVE_COLOR;
    if (selectedSquare === square) return HIGHLIGHT_COLOR;
    return null;
  };

  return (
    <div 
      className={cn('relative inline-block rounded-xl shadow-2xl border border-slate-700/80 bg-slate-900 select-none overflow-hidden', className)}
      style={{ maxWidth: '640px', width: '100%', aspectRatio: '1 / 1', ...style }}
    >
      <svg viewBox="0 0 512 512" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <filter id="svgPieceShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.4"/>
          </filter>
        </defs>
        
        {ranks.map((rank, rankIdx) => 
          files.map((file, fileIdx) => {
            const square = `${file}${rank}`;
            const displayFileIdx = orientation === 'white' ? fileIdx : 7 - fileIdx;
            const displayRankIdx = orientation === 'white' ? rankIdx : 7 - rankIdx;
            const x = displayFileIdx * 64;
            const y = displayRankIdx * 64;
            const color = getSquareColor(fileIdx, 7 - rankIdx);
            const highlight = getHighlight(square);
            
            return (
              <g key={square}>
                <rect
                  x={x}
                  y={y}
                  width={64}
                  height={64}
                  fill={highlight || color}
                  opacity={highlight ? 0.9 : 1}
                />
                {position[square] && (
                  <g filter="url(#svgPieceShadow)">
                    <ChessPiece piece={position[square]} x={x} y={y} size={64} />
                  </g>
                )}
              </g>
            );
          })
        )}
      </svg>

      {coordinates && (
        <>
          <div className="absolute bottom-0 left-0 flex w-full justify-between text-[11px] font-semibold text-slate-400/80 px-1 pointer-events-none select-none">
            {displayFiles.map(f => <span key={f} className="w-1/8 text-center">{f}</span>)}
          </div>
          <div className="absolute right-0.5 top-0 flex h-full flex-col justify-between text-[11px] font-semibold text-slate-400/80 py-1 pointer-events-none select-none">
            {ranks.map(r => <span key={r} className="h-1/8 flex items-center justify-center">{r}</span>)}
          </div>
        </>
      )}
    </div>
  );
}