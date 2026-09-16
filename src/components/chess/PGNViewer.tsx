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
  Download,
  Check,
  Zap
} from 'lucide-react';
import { ChessBoardSvg } from './ChessBoard';
import { parsePGN, normalizeFen } from '@/lib/chess/pgn-utils';
import { playChessSound } from '@/lib/chess/sound';
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
  /** Ancho máximo del tablero (p. ej. '480px'). Por defecto 560px. */
  boardMaxWidth?: string;
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
  boardMaxWidth = '560px',
  onMoveChange,
}: PGNViewerProps) {
  const [parsedPGN, setParsedPGN] = useState<ParsedPGN | null>(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showMoveListPanel, setShowMoveListPanel] = useState(showMoveList);
  const [copied, setCopied] = useState<string | null>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chessRef = useRef(new Chess());
  const activeMoveRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (pgn) {
      const parsed = parsePGN(pgn);
      setParsedPGN(parsed);
      try {
        chessRef.current.load(normalizeFen(parsed.initialFen));
      } catch {
        chessRef.current.reset();
      }
      setCurrentMoveIndex(-1);
    } else if (fen || initialFen) {
      const startFen = normalizeFen(fen || initialFen);
      try {
        chessRef.current.load(startFen);
      } catch {
        chessRef.current.reset();
      }
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
      try {
        chessRef.current.load(normalizeFen(targetFen));
      } catch {
        chessRef.current.reset();
      }
      onMoveChange?.(currentMoveIndex, currentMoveIndex === -1 ? null : parsedPGN.moves[currentMoveIndex]);
    }
  }, [currentMoveIndex, parsedPGN, onMoveChange]);

  // Auto-scroll SOLO dentro de la lista de jugadas (nunca la página: el tablero queda fijo).
  useEffect(() => {
    const btn = activeMoveRef.current;
    if (!btn) return;
    const viewport = btn.closest('[data-radix-scroll-area-viewport]') as HTMLElement | null;
    if (!viewport) return;
    const btnTop = btn.offsetTop;
    const viewTop = viewport.scrollTop;
    const viewBottom = viewTop + viewport.clientHeight;
    if (btnTop < viewTop || btnTop + btn.offsetHeight > viewBottom) {
      viewport.scrollTo({
        top: btnTop - viewport.clientHeight / 2 + btn.offsetHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [currentMoveIndex]);

  const goToStart = useCallback(() => {
    setCurrentMoveIndex(-1);
    setIsPlaying(false);
    playChessSound('start');
  }, []);

  const goToEnd = useCallback(() => {
    if (parsedPGN && parsedPGN.moves.length > 0) {
      setCurrentMoveIndex(parsedPGN.moves.length - 1);
      setIsPlaying(false);
      playChessSound('move');
    }
  }, [parsedPGN]);

  const goToPrev = useCallback(() => {
    setCurrentMoveIndex(prev => {
      const next = Math.max(-1, prev - 1);
      playChessSound('move');
      return next;
    });
    setIsPlaying(false);
  }, []);

  const goToNext = useCallback(() => {
    if (parsedPGN && currentMoveIndex < parsedPGN.moves.length - 1) {
      const next = currentMoveIndex + 1;
      const move = parsedPGN.moves[next];
      if (move?.san?.includes('x')) {
        playChessSound('capture');
      } else if (move?.san?.includes('+') || move?.san?.includes('#')) {
        playChessSound('check');
      } else {
        playChessSound('move');
      }
      setCurrentMoveIndex(next);
    }
    setIsPlaying(false);
  }, [parsedPGN, currentMoveIndex]);

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
          const nextIdx = prev + 1;
          const move = parsedPGN.moves[nextIdx];
          if (move?.san?.includes('x')) {
            playChessSound('capture');
          } else {
            playChessSound('move');
          }
          return nextIdx;
        });
      }, autoPlaySpeed);
    }
  }, [isPlaying, currentMoveIndex, parsedPGN, autoPlaySpeed]);

  const flipBoard = useCallback(() => {
    setOrientation(prev => prev === 'white' ? 'black' : 'white');
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        flipBoard();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToStart();
      } else if (e.key === 'End') {
        e.preventDefault();
        goToEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext, togglePlay, flipBoard, goToStart, goToEnd]);

  const copyPGN = useCallback(() => {
    if (parsedPGN) {
      const fullPGN = generateFullPGN(parsedPGN, currentMoveIndex);
      navigator.clipboard.writeText(fullPGN);
      setCopied('pgn');
      setTimeout(() => setCopied(null), 2000);
    } else if (fen) {
      navigator.clipboard.writeText(fen);
      setCopied('pgn');
      setTimeout(() => setCopied(null), 2000);
    }
  }, [parsedPGN, currentMoveIndex, fen]);

  const copyFEN = useCallback(() => {
    const currentFen = chessRef.current.fen();
    navigator.clipboard.writeText(currentFen);
    setCopied('fen');
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const downloadPGN = useCallback(() => {
    if (!parsedPGN) return;
    const fullPGN = generateFullPGN(parsedPGN, parsedPGN.moves.length - 1);
    const blob = new Blob([fullPGN], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${parsedPGN.headers.White || 'game'}_vs_${parsedPGN.headers.Black || 'game'}.pgn`;
    link.click();
    URL.revokeObjectURL(url);
  }, [parsedPGN]);

  const handleMoveClick = useCallback((index: number) => {
    setCurrentMoveIndex(index);
    setIsPlaying(false);
    playChessSound('move');
  }, []);

  const lastMove = parsedPGN && currentMoveIndex >= 0 && currentMoveIndex < parsedPGN.moves.length
    ? parsedPGN.moves[currentMoveIndex]
    : null;

  const highlights: Record<string, string> = {};
  if (lastMove) {
    const history = chessRef.current.history({ verbose: true });
    const move = history[history.length - 1];
    if (move) {
      highlights[move.from] = '#1D4ED8';
      highlights[move.to] = '#1D4ED8';
    }
  }

  // Calculate dynamic eval ratio
  const progressRatio = parsedPGN && parsedPGN.moves.length > 0 
    ? Math.min(100, Math.max(0, ((currentMoveIndex + 1) / parsedPGN.moves.length) * 100))
    : 50;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="relative flex items-stretch justify-center gap-3">
        {/* Dynamic Eval balance bar */}
        <div className="hidden sm:flex flex-col self-stretch w-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 shadow-inner">
          <div 
            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-300"
            style={{ height: `${progressRatio}%` }}
          />
        </div>

        <div className="w-full shrink-0" style={{ maxWidth: boardMaxWidth }}>
          <ChessBoardSvg
            fen={chessRef.current.fen()}
            orientation={orientation}
            coordinates={showCoordinates}
            highlights={highlights}
            className="mx-auto"
          />
        </div>
      </div>

      {showControls && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-2 bg-slate-900/60 border border-slate-800 rounded-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToStart}
            disabled={currentMoveIndex === -1}
            title="Inicio (Home)"
            className="text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 h-8 w-8"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            disabled={currentMoveIndex === -1}
            title="Anterior (←)"
            className="text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            disabled={!parsedPGN || parsedPGN.moves.length === 0}
            title={isPlaying ? 'Pausar (Space)' : 'Reproducir (Space)'}
            className="text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 h-8 w-8"
          >
            {isPlaying ? <Pause className="h-4 w-4 text-amber-400" /> : <Play className="h-4 w-4 text-blue-400" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={!parsedPGN || currentMoveIndex >= parsedPGN.moves.length - 1}
            title="Siguiente (→)"
            className="text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToEnd}
            disabled={!parsedPGN || currentMoveIndex >= parsedPGN.moves.length - 1}
            title="Final (End)"
            className="text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 h-8 w-8"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>

          <div className="h-4 w-[1px] bg-slate-700 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={flipBoard}
            title="Girar tablero (F)"
            className="text-slate-300 hover:text-white hover:bg-slate-800/80 h-8 w-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyPGN}
            title="Copiar PGN"
            className="text-slate-300 hover:text-white hover:bg-slate-800/80 h-8 w-8"
          >
            {copied === 'pgn' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={downloadPGN}
            disabled={!parsedPGN}
            title="Descargar archivo PGN"
            className="text-slate-300 hover:text-white hover:bg-slate-800/80 h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMoveListPanel(!showMoveListPanel)}
            title="Alternar lista de jugadas"
            className={cn('h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800/80', showMoveListPanel && 'text-blue-400 bg-slate-800/50')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      )}

      {showMoveListPanel && parsedPGN && parsedPGN.moves.length > 0 && (
        <div className="border border-slate-800 bg-slate-900/50 rounded-xl p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-blue-400" /> Notación de la partida</span>
            <span>{parsedPGN.moves.length} jugadas</span>
          </div>

          <ScrollArea className="h-44 max-h-[220px]">
            <div className="grid grid-cols-2 gap-1 font-mono text-xs">
              {parsedPGN.moves.map((move, index) => {
                const moveNumber = Math.floor(index / 2) + 1;
                const isWhiteMove = index % 2 === 0;
                const isCurrent = index === currentMoveIndex;
                
                return (
                  <button
                    key={index}
                    ref={isCurrent ? activeMoveRef : null}
                    onClick={() => handleMoveClick(index)}
                    className={cn(
                      'px-2.5 py-1.5 rounded-lg text-left transition-all duration-150 flex items-center justify-between',
                      'hover:bg-slate-800/80',
                      isCurrent 
                        ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40 shadow-sm' 
                        : 'text-slate-300 hover:text-white'
                    )}
                  >
                    <span>
                      {isWhiteMove ? <span className="text-slate-500 mr-1.5">{moveNumber}.</span> : ''}
                      <span className={cn(move.san.includes('+') || move.san.includes('#') ? 'text-amber-300 font-semibold' : '')}>
                        {move.san}
                      </span>
                    </span>
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />}
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

function generateFullPGN(parsed: ParsedPGN, upToIndex: number = parsed.moves.length): string {
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

export function FreePGNViewer({ boardMaxWidth = '560px' }: { boardMaxWidth?: string } = {}) {
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
          boardMaxWidth={boardMaxWidth}
        />
      )}
    </div>
  );
}