'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { parsePGN, normalizeFen } from '@/lib/chess/pgn-utils';
import { playChessSound } from '@/lib/chess/sound';
import type { Combination } from '@/types/combination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Lightbulb, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PuzzleSolverProps {
  combination: Combination;
  locale?: 'es' | 'en';
  onSolved?: () => void;
  className?: string;
}

export function PuzzleSolver({
  combination,
  locale = 'es',
  onSolved,
  className,
}: PuzzleSolverProps) {
  const [parsedMoves, setParsedMoves] = useState<Array<{ san: string; from?: string; to?: string; fen: string }>>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong' | 'solved' | 'revealed'>('playing');
  const [hintLevel, setHintLevel] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [boardFen, setBoardFen] = useState<string>(combination.fen);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const gameRef = useRef<Chess>(new Chess());

  // Initialize puzzle
  const initPuzzle = useCallback(() => {
    const parsed = parsePGN(combination.pgn);
    const startFen = normalizeFen(combination.fen || parsed.initialFen);
    
    const game = new Chess();
    try {
      game.load(startFen);
    } catch {
      game.reset();
    }

    gameRef.current = game;
    setBoardFen(game.fen());
    setCurrentStep(0);
    setStatus('playing');
    setHintLevel(0);
    setLastMove(null);

    const moves = parsed.moves.map(m => ({
      san: m.san,
      fen: m.fen,
    }));
    setParsedMoves(moves);

    const turn = game.turn() === 'w' ? (locale === 'es' ? 'Juegan Blancas' : 'White to Move') : (locale === 'es' ? 'Juegan Negras' : 'Black to Move');
    setMessage(turn + ': ' + (locale === 'es' ? 'Encuentra la mejor jugada' : 'Find the best move'));
  }, [combination, locale]);

  useEffect(() => {
    initPuzzle();
  }, [initPuzzle]);

  const handleUserMove = useCallback((from: string, to: string, promotion?: string) => {
    if (status === 'solved' || status === 'revealed') return;

    const game = gameRef.current;
    const expectedMove = parsedMoves[currentStep];

    if (!expectedMove) return;

    // Check if the move matches the expected solution SAN
    const historyBefore = game.history();
    const lastPlayed = historyBefore[historyBefore.length - 1];

    if (lastPlayed === expectedMove.san) {
      // User made the correct move!
      setLastMove({ from, to });
      const nextStep = currentStep + 1;

      if (nextStep >= parsedMoves.length) {
        // Entire puzzle solved!
        setStatus('solved');
        playChessSound('victory');
        setMessage(locale === 'es' ? '¡Brillante! Has completado la combinación histórica 🎉' : 'Brilliant! You completed the historic combination 🎉');
        onSolved?.();
        return;
      }

      // Rival responds automatically
      setStatus('correct');
      setMessage(locale === 'es' ? '¡Correcto! El rival responde...' : 'Correct! Opponent responds...');
      setCurrentStep(nextStep);

      setTimeout(() => {
        const rivalMove = parsedMoves[nextStep];
        if (rivalMove) {
          try {
            const executed = game.move(rivalMove.san);
            if (executed) {
              setBoardFen(game.fen());
              setLastMove({ from: executed.from, to: executed.to });
              
              if (game.inCheck()) {
                playChessSound('check');
              } else if (executed.captured) {
                playChessSound('capture');
              } else {
                playChessSound('move');
              }

              const afterRivalStep = nextStep + 1;
              if (afterRivalStep >= parsedMoves.length) {
                setStatus('solved');
                playChessSound('victory');
                setMessage(locale === 'es' ? '¡Combinación completada con éxito!' : 'Combination solved successfully!');
                onSolved?.();
              } else {
                setCurrentStep(afterRivalStep);
                setStatus('playing');
                setMessage(locale === 'es' ? 'Tu turno: Encuentra el siguiente movimiento' : 'Your turn: Find the next move');
              }
            }
          } catch {
            // Fallback
          }
        }
      }, 500);
    } else {
      // Wrong move!
      playChessSound('error');
      setStatus('wrong');
      setMessage(locale === 'es' ? 'Movimiento incorrecto. Inténtalo de nuevo.' : 'Incorrect move. Try again.');

      // Undo user move
      setTimeout(() => {
        game.undo();
        setBoardFen(game.fen());
        setStatus('playing');
      }, 700);
    }
  }, [currentStep, parsedMoves, status, locale, onSolved]);

  const requestHint = () => {
    const expected = parsedMoves[currentStep];
    if (!expected) return;

    const nextLevel = Math.min(hintLevel + 1, 3);
    setHintLevel(nextLevel);

    if (nextLevel === 1) {
      // Piece hint
      const piece = expected.san[0].toUpperCase();
      const pieceName = piece === 'N' ? (locale === 'es' ? 'el Caballo' : 'the Knight') :
                        piece === 'B' ? (locale === 'es' ? 'el Alfil' : 'the Bishop') :
                        piece === 'R' ? (locale === 'es' ? 'la Torre' : 'the Rook') :
                        piece === 'Q' ? (locale === 'es' ? 'la Dama' : 'the Queen') :
                        piece === 'K' ? (locale === 'es' ? 'el Rey' : 'the King') :
                        (locale === 'es' ? 'un Peón' : 'a Pawn');
      setMessage(locale === 'es' ? `💡 Pista 1: Debes mover ${pieceName}.` : `💡 Hint 1: Move ${pieceName}.`);
    } else if (nextLevel === 2) {
      // Destination square hint
      const match = expected.san.match(/([a-h][1-8])/);
      if (match) {
        setMessage(locale === 'es' ? `🎯 Pista 2: La casilla objetivo es ${match[1]}.` : `🎯 Hint 2: Target square is ${match[1]}.`);
      }
    } else if (nextLevel === 3) {
      // Full move
      setMessage(locale === 'es' ? `🧠 Pista 3: La jugada es ${expected.san}.` : `🧠 Hint 3: The move is ${expected.san}.`);
    }
  };

  const revealSolution = () => {
    setStatus('revealed');
    setMessage(locale === 'es' ? 'Solución revelada' : 'Solution revealed');
    
    // Play full sequence from start to end
    const parsed = parsePGN(combination.pgn);
    const startFen = normalizeFen(combination.fen || parsed.initialFen);
    const game = new Chess();
    try {
      game.load(startFen);
    } catch {
      game.reset();
    }
    gameRef.current = game;

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= parsed.moves.length) {
        clearInterval(interval);
        return;
      }
      try {
        const m = game.move(parsed.moves[idx].san);
        if (m) {
          setBoardFen(game.fen());
          setLastMove({ from: m.from, to: m.to });
          playChessSound(m.captured ? 'capture' : 'move');
        }
      } catch {}
      idx++;
    }, 700);
  };

  const isWhiteTurn = gameRef.current.turn() === 'w';

  return (
    <div className={cn('flex flex-col lg:flex-row gap-6 items-start', className)}>
      {/* Board */}
      <div className="w-full lg:w-auto flex flex-col items-center">
        <div className="relative">
          <ChessBoard
            fen={boardFen}
            orientation={isWhiteTurn ? 'white' : 'black'}
            interactive={status === 'playing' || status === 'wrong'}
            onMove={handleUserMove}
            lastMove={lastMove}
            className="mx-auto"
          />
        </div>

        {/* Turn & Status Bar */}
        <div className="w-full max-w-[512px] mt-3 flex items-center justify-between px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-lg">
          <div className="flex items-center gap-2">
            <span className={cn('w-3 h-3 rounded-full border', isWhiteTurn ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-600')} />
            <span className="text-xs font-medium text-slate-300">
              {isWhiteTurn ? (locale === 'es' ? 'Turno Blancas' : 'White to move') : (locale === 'es' ? 'Turno Negras' : 'Black to move')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Jugada {currentStep + 1} de {parsedMoves.length || 1}</span>
          </div>
        </div>
      </div>

      {/* Control & Feedback Panel */}
      <div className="flex-1 w-full space-y-4">
        {/* Header */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs border-blue-500/40 text-blue-400">
              {combination.category || 'Táctica Magistral'}
            </Badge>
            <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-400">
              {combination.difficulty}
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">{combination.title}</h3>
          <p className="text-xs text-slate-400">
            {combination.white_player} vs {combination.black_player} · {combination.event} ({combination.year})
          </p>
        </div>

        {/* Message Alert */}
        <div className={cn(
          'p-4 rounded-xl border flex items-center gap-3 transition-all duration-300',
          status === 'solved' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' :
          status === 'wrong' ? 'bg-rose-950/40 border-rose-500/50 text-rose-300' :
          status === 'correct' ? 'bg-blue-950/40 border-blue-500/50 text-blue-300' :
          'bg-slate-900/40 border-slate-800 text-slate-300'
        )}>
          {status === 'solved' ? <Trophy className="h-5 w-5 text-emerald-400 flex-shrink-0" /> :
           status === 'wrong' ? <XCircle className="h-5 w-5 text-rose-400 flex-shrink-0" /> :
           status === 'correct' ? <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" /> :
           <Sparkles className="h-5 w-5 text-amber-400 flex-shrink-0" />}
          <p className="text-sm font-medium">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={requestHint}
            disabled={status === 'solved' || status === 'revealed' || hintLevel >= 3}
            className="flex items-center justify-center gap-1.5 border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
          >
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <span>{locale === 'es' ? 'Pista' : 'Hint'} ({hintLevel}/3)</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={revealSolution}
            disabled={status === 'solved' || status === 'revealed'}
            className="flex items-center justify-center gap-1.5 border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
          >
            <Eye className="h-4 w-4 text-blue-400" />
            <span>{locale === 'es' ? 'Solución' : 'Solution'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={initPuzzle}
            className="flex items-center justify-center gap-1.5 border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
          >
            <RotateCcw className="h-4 w-4 text-slate-400" />
            <span>{locale === 'es' ? 'Reiniciar' : 'Reset'}</span>
          </Button>
        </div>

        {/* Tactical Story / Description */}
        <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {locale === 'es' ? 'Contexto Histórico' : 'Historical Context'}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {combination.description}
          </p>
        </div>
      </div>
    </div>
  );
}
