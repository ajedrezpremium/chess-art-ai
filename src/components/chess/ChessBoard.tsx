'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { cn } from '@/lib/utils';

const BLUE_DARK_SQUARE = '#2B4C7E';
const CREAM_LIGHT_SQUARE = '#E2E8F0';
const HIGHLIGHT_COLOR = '#3B82F6';
const LAST_MOVE_COLOR = '#2563EB';

const pieceSet: Record<string, string> = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

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
  fen = 'start',
  orientation = 'white',
  coordinates = true,
  highlights = {},
  arrows = [],
  lastMove = null,
  selectedSquare = null,
  interactive = false,
  onMove,
  onSquareClick,
  className,
  style,
}: ChessBoardProps) {
  const [chess] = useState(() => new Chess(fen));
  const [position, setPosition] = useState<Record<string, string>>({});
  const [animationKey, setAnimationKey] = useState(0);
  const chessRef = useRef(chess);
  chessRef.current = chess;

  useEffect(() => {
    chessRef.current.load(fen);
    setPosition(chessRef.current.board().reduce((acc, row) => {
      row.forEach(piece => {
        if (piece) {
          const square = piece.square;
          acc[square] = piece.type === 'p' ? (piece.color === 'w' ? 'wP' : 'bP') :
                       piece.type === 'n' ? (piece.color === 'w' ? 'wN' : 'bN') :
                       piece.type === 'b' ? (piece.color === 'w' ? 'wB' : 'bB') :
                       piece.type === 'r' ? (piece.color === 'w' ? 'wR' : 'bR') :
                       piece.type === 'q' ? (piece.color === 'w' ? 'wQ' : 'bQ') :
                       piece.type === 'k' ? (piece.color === 'w' ? 'wK' : 'bK') : '';
        }
      });
      return acc;
    }, {} as Record<string, string>));
    setAnimationKey(k => k + 1);
  }, [fen]);

  const handlePieceDrop = useCallback((sourceSquare: string, targetSquare: string, piece: string) => {
    if (!interactive || !onMove) return false;

    const game = chessRef.current;
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move) {
      setPosition(game.board().reduce((acc, row) => {
        row.forEach(p => {
          if (p) {
            const sq = p.square;
            acc[sq] = p.type === 'p' ? (p.color === 'w' ? 'wP' : 'bP') :
                     p.type === 'n' ? (p.color === 'w' ? 'wN' : 'bN') :
                     p.type === 'b' ? (p.color === 'w' ? 'wB' : 'bB') :
                     p.type === 'r' ? (p.color === 'w' ? 'wR' : 'bR') :
                     p.type === 'q' ? (p.color === 'w' ? 'wQ' : 'bQ') :
                     p.type === 'k' ? (p.color === 'w' ? 'wK' : 'bK') : '';
          }
        });
        return acc;
      }, {} as Record<string, string>));
      setAnimationKey(k => k + 1);
      onMove(sourceSquare, targetSquare, move.promotion);
      return true;
    }
    return false;
  }, [interactive, onMove]);

  const handleSquareClick = useCallback((square: string, piece: string | null) => {
    if (!interactive && onSquareClick) {
      onSquareClick(square, piece);
    }
  }, [interactive, onSquareClick]);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = orientation === 'white' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8];
  const displayFiles = orientation === 'white' ? files : [...files].reverse();

  const getSquareColor = (fileIdx: number, rankIdx: number) => {
    const isDark = (fileIdx + rankIdx) % 2 === 0;
    return isDark ? BLUE_DARK_SQUARE : CREAM_LIGHT_SQUARE;
  };

  const mergedHighlights: Record<string, string> = { ...highlights };
  
  if (lastMove) {
    mergedHighlights[lastMove.from] = LAST_MOVE_COLOR;
    mergedHighlights[lastMove.to] = LAST_MOVE_COLOR;
  }
  
  if (selectedSquare) {
    mergedHighlights[selectedSquare] = HIGHLIGHT_COLOR;
  }

  return (
    <div
      key={animationKey}
      className={cn('relative inline-block rounded-lg shadow-2xl border border-slate-700', className)}
      style={{ maxWidth: '640px', width: '100%', aspectRatio: '1 / 1', ...style }}
    >
      <svg viewBox="0 0 512 512" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <filter id="pieceShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.3"/>
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
            
            return (
              <g key={square}>
                <rect
                  x={x}
                  y={y}
                  width={64}
                  height={64}
                  fill={highlight || color}
                  rx={highlight ? 4 : 0}
                />
                {position[square] && (
                  <text
                    x={x + 32}
                    y={y + 42}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={44}
                    fontWeight={400}
                    fill={position[square][0] === 'w' ? '#F8FAFC' : '#0F172A'}
                    filter="url(#pieceShadow)"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {pieceSet[position[square] as keyof typeof pieceSet]}
                  </text>
                )}
              </g>
            );
          })
        )}
        
        {arrows.map((arrow, idx) => {
          const fromFile = files.indexOf(arrow.from[0]);
          const fromRank = parseInt(arrow.from[1]) - 1;
          const toFile = files.indexOf(arrow.to[0]);
          const toRank = parseInt(arrow.to[1]) - 1;
          
          const displayFromFile = orientation === 'white' ? fromFile : 7 - fromFile;
          const displayFromRank = orientation === 'white' ? fromRank : 7 - fromRank;
          const displayToFile = orientation === 'white' ? toFile : 7 - toFile;
          const displayToRank = orientation === 'white' ? toRank : 7 - toRank;
          
          const x1 = displayFromFile * 64 + 32;
          const y1 = displayFromRank * 64 + 32;
          const x2 = displayToFile * 64 + 32;
          const y2 = displayToRank * 64 + 32;
          
          return (
            <path
              key={idx}
              d={`M${x1},${y1} L${x2},${y2}`}
              stroke={arrow.color || '#3B82F6'}
              strokeWidth={4}
              fill="none"
              markerEnd="url(#arrowhead)"
              opacity={0.8}
            />
          );
        })}
        
        <defs>
          <marker id="arrowhead" markerWidth={10} markerHeight={7} refX={9} refY={3.5} orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
          </marker>
        </defs>
      </svg>

      {coordinates && (
        <>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex w-full px-2 -mb-2 justify-between text-xs font-medium text-slate-400 select-none pointer-events-none">
            {displayFiles.map(f => <span key={f} style={{ width: '64px', textAlign: 'center' }}>{f}</span>)}
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex h-full py-2 flex-col justify-between -mr-2 text-xs font-medium text-slate-400 select-none pointer-events-none">
            {ranks.map(r => <span key={r} style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r}</span>)}
          </div>
        </>
      )}
    </div>
  );
}

export function ChessBoardSvg({
  fen = 'start',
  orientation = 'white',
  coordinates = true,
  highlights = {},
  arrows = [],
  lastMove = null,
  selectedSquare = null,
  className,
  style,
}: ChessBoardProps) {
  const [chess] = useState(() => new Chess(fen));
  const [position, setPosition] = useState<Record<string, string>>({});

  useEffect(() => {
    chess.load(fen);
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
      className={cn('relative inline-block rounded-lg shadow-2xl border border-slate-700', className)}
      style={{ maxWidth: '640px', width: '100%', aspectRatio: '1 / 1', ...style }}
    >
      <svg viewBox="0 0 512 512" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <filter id="pieceShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {ranks.map((rank, rankIdx) => 
          files.map((file, fileIdx) => {
            const square = `${file}${rank}`;
            const displayFileIdx = orientation === 'white' ? fileIdx : 7 - fileIdx;
            const displayRankIdx = orientation === 'white' ? rankIdx : 7 - rankIdx;
            const x = displayFileIdx * 64;
            const y = displayRankIdx * 64;
            const color = getSquareColor(fileIdx, rank === 8 ? 0 : rank === 1 ? 7 : fileIdx);
            const highlight = getHighlight(square);
            
            return (
              <g key={square}>
                <rect
                  x={x}
                  y={y}
                  width={64}
                  height={64}
                  fill={highlight || color}
                  rx={highlight ? 4 : 0}
                />
                {position[square] && (
                  <text
                    x={x + 32}
                    y={y + 42}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={44}
                    fontWeight={400}
                    fill={position[square][0] === 'w' ? '#F8FAFC' : '#0F172A'}
                    filter="url(#pieceShadow)"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {pieceSet[position[square] as keyof typeof pieceSet]}
                  </text>
                )}
              </g>
            );
          })
        )}
        
        {arrows.map((arrow, idx) => {
          const fromFile = files.indexOf(arrow.from[0]);
          const fromRank = parseInt(arrow.from[1]) - 1;
          const toFile = files.indexOf(arrow.to[0]);
          const toRank = parseInt(arrow.to[1]) - 1;
          
          const displayFromFile = orientation === 'white' ? fromFile : 7 - fromFile;
          const displayFromRank = orientation === 'white' ? fromRank : 7 - fromRank;
          const displayToFile = orientation === 'white' ? toFile : 7 - toFile;
          const displayToRank = orientation === 'white' ? toRank : 7 - toRank;
          
          const x1 = displayFromFile * 64 + 32;
          const y1 = displayFromRank * 64 + 32;
          const x2 = displayToFile * 64 + 32;
          const y2 = displayToRank * 64 + 32;
          
          return (
            <path
              key={idx}
              d={`M${x1},${y1} L${x2},${y2}`}
              stroke={arrow.color || '#3B82F6'}
              strokeWidth={4}
              fill="none"
              markerEnd="url(#arrowhead)"
              opacity={0.8}
            />
          );
        })}
        
        <defs>
          <marker id="arrowhead" markerWidth={10} markerHeight={7} refX={9} refY={3.5} orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
          </marker>
        </defs>
      </svg>

      {coordinates && (
        <>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex w-full px-2 -mb-2 justify-between text-xs font-medium text-slate-400 select-none pointer-events-none">
            {displayFiles.map(f => <span key={f} style={{ width: '64px', textAlign: 'center' }}>{f}</span>)}
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex h-full py-2 flex-col justify-between -mr-2 text-xs font-medium text-slate-400 select-none pointer-events-none">
            {ranks.map(r => <span key={r} style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r}</span>)}
          </div>
        </>
      )}
    </div>
  );
}