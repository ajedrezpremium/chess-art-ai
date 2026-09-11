'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  RotateCcw, 
  Copy, 
  Play, 
  Pause,
  List,
  X 
} from 'lucide-react';
import { ChessBoardSvg } from './ChessBoard';
import { parsePGN } from '@/lib/chess/pgn-utils';
import type { ParsedPGN, PGNMove } from '@/types/combination';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PGNViewerProps {
  pgn?: string;
  fen?: string;
  initialFen?: string;
  className?: string;
  showControls?: boolean;
  showMoveList?: boolean;
  autoPlaySpeed?: number;
  onMoveChange?: (moveIndex: number, move: PGNMove | null) => void;
}

export function PGNViewer({
  pgn,
  fen,
  initialFen,
  className,
  showControls = true,
  showMoveList = true,
  autoPlaySpeed = 1000,
  onMoveChange,
}: PGNViewerProps) {
  const [parsedPGN, setParsedPGN] = useState<ParsedPGN | null>(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showMoveListPanel, setShowMoveListPanel] = useState(showMoveList);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chessRef = useRef(new Chess());

  useEffect(() => {
    if (pgn) {
      const parsed = parsePGN(pgn);
      setParsedPGN(parsed);
      chessRef.current.load(parsed.initialFen);
      setCurrentMoveIndex(-1);
    } else if (fen || initialFen) {
      const startFen = fen || initialFen || 'start';
      chessRef.current.load(startFen);
      setParsedPGN({
        headers: {},
        moves: [],
        initialFen: startFen,
      });
      setCurrentMoveIndex(-1);
    }
  }, [pgn, fen, initialFen]);

  useEffect(() => {
    if (parsedPGN && currentMoveIndex >= -1 && currentMoveIndex < parsedPGN.moves.length) {
      const targetFen = currentMoveIndex === -1 
        ? parsedPGN.initialFen 
        : parsedPGN.moves[currentMoveIndex].fen;
      chessRef.current.load(targetFen);
      onMoveChange?.(currentMoveIndex, currentMoveIndex === -1 ? null : parsedPGN.moves[currentMoveIndex]);
    }
  }, [currentMoveIndex, parsedPGN, onMoveChange]);

  const goToStart = useCallback(() => {
    setCurrentMoveIndex(-1);
    setIsPlaying(false);
  }, []);

  const goToEnd = useCallback(() => {
    if (parsedPGN) {
      setCurrentMoveIndex(parsedPGN.moves.length - 1);
      setIsPlaying(false);
    }
  }, [parsedPGN]);

  const goToPrev = useCallback(() => {
    setCurrentMoveIndex(prev => Math.max(-1, prev - 1));
    setIsPlaying(false);
  }, []);

  const goToNext = useCallback(() => {
    if (parsedPGN) {
      setCurrentMoveIndex(prev => Math.min(parsedPGN.moves.length - 1, prev + 1));
    }
    setIsPlaying(false);
  }, [parsedPGN]);

  const togglePlay = useCallback(() => {
    if (!parsedPGN) return;
    
    if (isPlaying) {
      setIsPlaying(false);
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    } else {
      if (currentMoveIndex >= parsedPGN.moves.length - 1) {
        setCurrentMoveIndex(-1);
      }
      setIsPlaying(true);
      playIntervalRef.current = setInterval(() => {
        setCurrentMoveIndex(prev => {
          if (prev >= parsedPGN.moves.length - 1) {
            if (playIntervalRef.current) {
              clearInterval(playIntervalRef.current);
              playIntervalRef.current = null;
            }
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, autoPlaySpeed);
    }
  }, [isPlaying, currentMoveIndex, parsedPGN, autoPlaySpeed]);

  const flipBoard = useCallback(() => {
    setOrientation(prev => prev === 'white' ? 'black' : 'white');
  }, []);

  const copyPGN = useCallback(() => {
    if (parsedPGN) {
      const fullPGN = generateFullPGN(parsedPGN, currentMoveIndex);
      navigator.clipboard.writeText(fullPGN);
    } else if (fen) {
      navigator.clipboard.writeText(fen);
    }
  }, [parsedPGN, currentMoveIndex, fen]);

  const copyFEN = useCallback(() => {
    const currentFen = chessRef.current.fen();
    navigator.clipboard.writeText(currentFen);
  }, []);

  const handleMoveClick = useCallback((index: number) => {
    setCurrentMoveIndex(index);
    setIsPlaying(false);
  }, []);

  const lastMove = parsedPGN && currentMoveIndex >= 0 && currentMoveIndex < parsedPGN.moves.length
    ? parsedPGN.moves[currentMoveIndex]
    : null;

  const highlights: Record<string, string> = {};
  if (lastMove) {
    const move = chessRef.current.history({ verbose: true })[currentMoveIndex];
    if (move) {
      highlights[move.from] = '#2563EB';
      highlights[move.to] = '#2563EB';
    }
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="relative">
        <ChessBoardSvg
          fen={chessRef.current.fen()}
          orientation={orientation}
          coordinates={showCoordinates}
          highlights={highlights}
          lastMove={lastMove ? { from: '', to: '' } : null}
          className="mx-auto"
        />
      </div>

      {showControls && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToStart}
            disabled={currentMoveIndex === -1}
            aria-label="Ir al inicio"
            className="text-slate-300 hover:text-white disabled:opacity-30"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            disabled={currentMoveIndex === -1}
            aria-label="Jugada anterior"
            className="text-slate-300 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            disabled={!parsedPGN || parsedPGN.moves.length === 0}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            className="text-slate-300 hover:text-white disabled:opacity-30"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={!parsedPGN || currentMoveIndex >= parsedPGN.moves.length - 1}
            aria-label="Siguiente jugada"
            className="text-slate-300 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToEnd}
            disabled={!parsedPGN || currentMoveIndex >= parsedPGN.moves.length - 1}
            aria-label="Ir al final"
            className="text-slate-300 hover:text-white disabled:opacity-30"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={flipBoard}
            aria-label="Voltear tablero"
            className="text-slate-300 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyPGN}
            aria-label="Copiar PGN"
            className="text-slate-300 hover:text-white"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyFEN}
            aria-label="Copiar FEN"
            className="text-slate-300 hover:text-white"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMoveListPanel(!showMoveListPanel)}
            aria-label={showMoveListPanel ? 'Ocultar lista de jugadas' : 'Mostrar lista de jugadas'}
            className="text-slate-300 hover:text-white"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      )}

      {showMoveListPanel && parsedPGN && parsedPGN.moves.length > 0 && (
        <div className="border-t border-slate-800 pt-4">
          <ScrollArea className="h-48 max-h-[300px]">
            <div className="grid grid-cols-2 gap-1 font-mono text-sm">
              {parsedPGN.moves.map((move, index) => {
                const moveNumber = Math.floor(index / 2) + 1;
                const isWhiteMove = index % 2 === 0;
                const isCurrent = index === currentMoveIndex;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleMoveClick(index)}
                    className={cn(
                      'px-2 py-1 rounded text-left transition-colors',
                      'hover:bg-slate-800/50',
                      isCurrent 
                        ? 'bg-blue-500/20 text-blue-300 font-medium' 
                        : 'text-slate-300 hover:text-white'
                    )}
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                  >
                    {isWhiteMove ? `${moveNumber}. ` : ''}
                    {move.san}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

function generateFullPGN(parsed: ParsedPGN, upToIndex: number): string {
  let pgn = '';
  for (const [key, value] of Object.entries(parsed.headers)) {
    pgn += `[${key} "${value}"]\n`;
  }
  pgn += '\n';
  
  let moveString = '';
  for (let i = 0; i <= upToIndex && i < parsed.moves.length; i++) {
    const move = parsed.moves[i];
    if (i % 2 === 0) {
      moveString += `${Math.floor(i / 2) + 1}. `;
    }
    moveString += `${move.san} `;
  }
  
  pgn += moveString.trim();
  if (parsed.headers.Result) {
    pgn += ` ${parsed.headers.Result}`;
  }
  return pgn;
}

export function FreePGNViewer() {
  const [pgnInput, setPgnInput] = useState('');
  const [parsedPGN, setParsedPGN] = useState<ParsedPGN | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLoadPGN = () => {
    try {
      setError(null);
      const parsed = parsePGN(pgnInput);
      setParsedPGN(parsed);
    } catch (e) {
      setError('Error al analizar el PGN. Verifica el formato.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Visor PGN Libre</h2>
        <p className="text-slate-400">Pega un PGN para analizarlo en el tablero interactivo</p>
        
        <div className="space-y-2">
          <textarea
            value={pgnInput}
            onChange={(e) => setPgnInput(e.target.value)}
            placeholder='[Event "Partida de ejemplo"]
[White "Jugador 1"]
[Black "Jugador 2"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 8. c3 d5 9. exd5 Nxd5 10. Nxd5 exd5 11. Rxe5 c6 1-0'
            className="w-full h-48 p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck={false}
          />
          <div className="flex gap-2">
            <Button onClick={handleLoadPGN} disabled={!pgnInput.trim()}>
              Cargar PGN
            </Button>
            <Button variant="outline" onClick={() => { setPgnInput(''); setParsedPGN(null); setError(null); }}>
              Limpiar
            </Button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>

      {parsedPGN && (
        <PGNViewer 
          pgn={generateFullPGN(parsedPGN, parsedPGN.moves.length - 1)}
          showControls={true}
          showMoveList={true}
        />
      )}
    </div>
  );
}