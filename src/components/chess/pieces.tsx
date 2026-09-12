import React from 'react';

interface PieceProps {
  x?: number;
  y?: number;
  size?: number;
  className?: string;
}

export const ChessPiece = ({ piece, x = 0, y = 0, size = 64 }: { piece: string; x?: number; y?: number; size?: number }) => {
  if (!piece) return null;

  const isWhite = piece.startsWith('w');
  const type = piece.slice(1).toUpperCase();

  const whiteFill = '#FFFFFF';
  const whiteStroke = '#1E293B';
  const blackFill = '#1E293B';
  const blackStroke = '#0F172A';
  const highlightStroke = '#94A3B8';

  const renderPiece = () => {
    switch (type) {
      case 'P': // PAWN
        return isWhite ? (
          <g transform={`translate(${x + size * 0.18}, ${y + size * 0.14}) scale(${size / 100 * 0.65})`}>
            <path
              d="M 22 9 A 8 8 0 1 1 38 9 A 8 8 0 1 1 22 9 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 22 20 L 38 20 L 37 32 L 23 32 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 16 48 L 44 48 L 41 32 L 19 32 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 12 56 L 48 56 C 48 50 44 48 44 48 L 16 48 C 16 48 12 50 12 56 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
          </g>
        ) : (
          <g transform={`translate(${x + size * 0.18}, ${y + size * 0.14}) scale(${size / 100 * 0.65})`}>
            <path
              d="M 22 9 A 8 8 0 1 1 38 9 A 8 8 0 1 1 22 9 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 22 20 L 38 20 L 37 32 L 23 32 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 16 48 L 44 48 L 41 32 L 19 32 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 12 56 L 48 56 C 48 50 44 48 44 48 L 16 48 C 16 48 12 50 12 56 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
            <path d="M 24 10 A 3 3 0 0 1 29 7" stroke={highlightStroke} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'N': // KNIGHT
        return isWhite ? (
          <g transform={`translate(${x + size * 0.15}, ${y + size * 0.12}) scale(${size / 100 * 0.7})`}>
            <path
              d="M 22 10 C 32.5 11 38.5 18 38 39 L 15 39 C 15 30 17 23 21 21 C 21 21 16 23 13 29 C 12 28 10 25 12 21 C 14 18 19 14 22 10 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 24 18 A 2.5 2.5 0 1 1 24 13 A 2.5 2.5 0 1 1 24 18 Z"
              fill={whiteStroke}
            />
            <path
              d="M 12 56 L 48 56 C 48 48 42 42 38 39 L 15 39 C 15 45 12 48 12 56 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
          </g>
        ) : (
          <g transform={`translate(${x + size * 0.15}, ${y + size * 0.12}) scale(${size / 100 * 0.7})`}>
            <path
              d="M 22 10 C 32.5 11 38.5 18 38 39 L 15 39 C 15 30 17 23 21 21 C 21 21 16 23 13 29 C 12 28 10 25 12 21 C 14 18 19 14 22 10 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 24 18 A 2.5 2.5 0 1 1 24 13 A 2.5 2.5 0 1 1 24 18 Z"
              fill="#FFFFFF"
            />
            <path
              d="M 12 56 L 48 56 C 48 48 42 42 38 39 L 15 39 C 15 45 12 48 12 56 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
            <path d="M 26 12 C 32 14 36 19 36 30" stroke={highlightStroke} strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'B': // BISHOP
        return isWhite ? (
          <g transform={`translate(${x + size * 0.16}, ${y + size * 0.12}) scale(${size / 100 * 0.68})`}>
            <circle cx="30" cy="8" r="3" fill={whiteFill} stroke={whiteStroke} strokeWidth="2.5" />
            <path
              d="M 16 38 C 14 28 20 14 30 14 C 40 14 46 28 44 38 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
            <path d="M 22 22 L 38 32 M 38 22 L 22 32" stroke={whiteStroke} strokeWidth="2.5" strokeLinecap="round" />
            <path
              d="M 14 56 L 46 56 C 46 48 42 40 38 38 L 22 38 C 18 40 14 48 14 56 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
          </g>
        ) : (
          <g transform={`translate(${x + size * 0.16}, ${y + size * 0.12}) scale(${size / 100 * 0.68})`}>
            <circle cx="30" cy="8" r="3" fill={blackFill} stroke={blackStroke} strokeWidth="2.5" />
            <path
              d="M 16 38 C 14 28 20 14 30 14 C 40 14 46 28 44 38 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
            <path d="M 22 22 L 38 32 M 38 22 L 22 32" stroke={highlightStroke} strokeWidth="2" strokeLinecap="round" />
            <path
              d="M 14 56 L 46 56 C 46 48 42 40 38 38 L 22 38 C 18 40 14 48 14 56 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
          </g>
        );

      case 'R': // ROOK
        return isWhite ? (
          <g transform={`translate(${x + size * 0.16}, ${y + size * 0.14}) scale(${size / 100 * 0.68})`}>
            <path
              d="M 15 14 L 15 22 L 19 22 L 19 18 L 26 18 L 26 22 L 34 22 L 34 18 L 41 18 L 41 22 L 45 22 L 45 14 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 19 22 L 41 22 L 39 42 L 21 42 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 12 56 L 48 56 C 48 48 44 42 39 42 L 21 42 C 16 42 12 48 12 56 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
          </g>
        ) : (
          <g transform={`translate(${x + size * 0.16}, ${y + size * 0.14}) scale(${size / 100 * 0.68})`}>
            <path
              d="M 15 14 L 15 22 L 19 22 L 19 18 L 26 18 L 26 22 L 34 22 L 34 18 L 41 18 L 41 22 L 45 22 L 45 14 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 19 22 L 41 22 L 39 42 L 21 42 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
            <path
              d="M 12 56 L 48 56 C 48 48 44 42 39 42 L 21 42 C 16 42 12 48 12 56 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
            <path d="M 22 25 L 38 25" stroke={highlightStroke} strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'Q': // QUEEN
        return isWhite ? (
          <g transform={`translate(${x + size * 0.13}, ${y + size * 0.1}) scale(${size / 100 * 0.74})`}>
            <circle cx="10" cy="14" r="2.5" fill={whiteFill} stroke={whiteStroke} strokeWidth="2" />
            <circle cx="21" cy="9" r="2.5" fill={whiteFill} stroke={whiteStroke} strokeWidth="2" />
            <circle cx="32" cy="7" r="2.5" fill={whiteFill} stroke={whiteStroke} strokeWidth="2" />
            <circle cx="43" cy="9" r="2.5" fill={whiteFill} stroke={whiteStroke} strokeWidth="2" />
            <circle cx="54" cy="14" r="2.5" fill={whiteFill} stroke={whiteStroke} strokeWidth="2" />
            <path
              d="M 10 17 L 17 38 L 47 38 L 54 17 L 43 27 L 32 12 L 21 27 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3"
            />
            <path
              d="M 14 56 L 50 56 C 50 48 47 40 43 38 L 21 38 C 17 40 14 48 14 56 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3"
            />
          </g>
        ) : (
          <g transform={`translate(${x + size * 0.13}, ${y + size * 0.1}) scale(${size / 100 * 0.74})`}>
            <circle cx="10" cy="14" r="2.5" fill={blackFill} stroke={blackStroke} strokeWidth="2" />
            <circle cx="21" cy="9" r="2.5" fill={blackFill} stroke={blackStroke} strokeWidth="2" />
            <circle cx="32" cy="7" r="2.5" fill={blackFill} stroke={blackStroke} strokeWidth="2" />
            <circle cx="43" cy="9" r="2.5" fill={blackFill} stroke={blackStroke} strokeWidth="2" />
            <circle cx="54" cy="14" r="2.5" fill={blackFill} stroke={blackStroke} strokeWidth="2" />
            <path
              d="M 10 17 L 17 38 L 47 38 L 54 17 L 43 27 L 32 12 L 21 27 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3"
            />
            <path
              d="M 14 56 L 50 56 C 50 48 47 40 43 38 L 21 38 C 17 40 14 48 14 56 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3"
            />
            <path d="M 24 35 L 40 35" stroke={highlightStroke} strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'K': // KING
        return isWhite ? (
          <g transform={`translate(${x + size * 0.14}, ${y + size * 0.08}) scale(${size / 100 * 0.72})`}>
            {/* Cross */}
            <path d="M 30 4 L 30 14 M 25 8 L 35 8" stroke={whiteStroke} strokeWidth="3" strokeLinecap="square" />
            {/* Crown */}
            <path
              d="M 16 38 C 13 26 21 16 30 16 C 39 16 47 26 44 38 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
            <circle cx="30" cy="26" r="4" fill="none" stroke={whiteStroke} strokeWidth="2.5" />
            {/* Base */}
            <path
              d="M 12 56 L 48 56 C 48 48 44 40 40 38 L 20 38 C 16 40 12 48 12 56 Z"
              fill={whiteFill}
              stroke={whiteStroke}
              strokeWidth="3.5"
            />
          </g>
        ) : (
          <g transform={`translate(${x + size * 0.14}, ${y + size * 0.08}) scale(${size / 100 * 0.72})`}>
            {/* Cross */}
            <path d="M 30 4 L 30 14 M 25 8 L 35 8" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="square" />
            {/* Crown */}
            <path
              d="M 16 38 C 13 26 21 16 30 16 C 39 16 47 26 44 38 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
            <circle cx="30" cy="26" r="4" fill="none" stroke={highlightStroke} strokeWidth="2" />
            {/* Base */}
            <path
              d="M 12 56 L 48 56 C 48 48 44 40 40 38 L 20 38 C 16 40 12 48 12 56 Z"
              fill={blackFill}
              stroke={blackStroke}
              strokeWidth="3.5"
            />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <g className="transition-all duration-200 select-none pointer-events-none">
      {renderPiece()}
    </g>
  );
};
