'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { loadProgress, getAccuracyRate, getActivityGrid, resetProgress, type UserProgress } from '@/lib/progress';
import { cn } from '@/lib/utils';
import { Trophy, Flame, Target, Brain, TrendingUp, RotateCcw, ChevronRight, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DIFFICULTY_ORDER = ['Beginner','Easy','Intermediate','Advanced','Expert','Master'];
const DIFFICULTY_ES: Record<string, string> = { Beginner:'Principiante',Easy:'Facil',Intermediate:'Intermedio',Advanced:'Avanzado',Expert:'Experto',Master:'Maestro' };
const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner:'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Easy:'text-green-400 bg-green-500/10 border-green-500/30',
  Intermediate:'text-blue-400 bg-blue-500/10 border-blue-500/30',
  Advanced:'text-purple-400 bg-purple-500/10 border-purple-500/30',
  Expert:'text-orange-400 bg-orange-500/10 border-orange-500/30',
  Master:'text-red-400 bg-red-500/10 border-red-500/30',
};
const LEVEL_COLORS = ['bg-slate-800','bg-emerald-900','bg-emerald-700','bg-emerald-500','bg-emerald-400'];

function eloToTitle(elo: number) {
  if (elo < 800) return 'Aficionado';
  if (elo < 1000) return 'Principiante';
  if (elo < 1200) return 'Club';
  if (elo < 1400) return 'Avanzado';
  if (elo < 1600) return 'Candidato a Maestro';
  if (elo < 1800) return 'Maestro de Tactica';
  return 'Gran Maestro Tactico';
}

export function ProfileClient() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [grid, setGrid] = useState<Array<{ date: string; count: number; level: 0|1|2|3|4 }>>([]);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    setGrid(getActivityGrid(p));
  }, []);

  if (!progress) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-slate-400 animate-pulse">Cargando progreso...</div>
    </div>
  );

  const accuracy = getAccuracyRate(progress);
  const title = eloToTitle(progress.tacticElo);
  const recentAttempts = progress.attempts.slice(0, 10);

  const handleReset = () => {
    resetProgress();
    const fresh = loadProgress();
    setProgress(fresh);
    setGrid(getActivityGrid(fresh));
    setShowReset(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight">CHESS ART</Link>
          <div className="flex items-center gap-6">
            <Link href="/combinaciones" className="text-sm text-slate-400 hover:text-white transition-colors">Top 100</Link>
            <Link href="/entrenar" className="text-sm text-slate-400 hover:text-white transition-colors">Entrenar</Link>
            <Link href="/galeria" className="text-sm text-slate-400 hover:text-white transition-colors">Galeria</Link>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/60 via-slate-900 to-purple-900/60 border border-slate-700 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl flex-shrink-0">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-300 font-medium uppercase tracking-widest mb-1">{title}</p>
              <h1 className="text-4xl font-black text-white mb-1">ELO Tactico: <span className="text-blue-400">{progress.tacticElo}</span></h1>
              <p className="text-slate-400 text-sm">Precision global: <strong className="text-white">{accuracy}%</strong> &middot; {progress.totalSolved} puzzles resueltos de {progress.totalAttempted}</p>
            </div>
            <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 px-4 py-2 rounded-2xl">
              <Flame className="h-6 w-6 text-orange-400" />
              <div>
                <div className="text-2xl font-black text-orange-300">{progress.currentStreak}</div>
                <div className="text-[10px] text-orange-400 uppercase tracking-wide">Racha diaria</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Resueltos', value: progress.totalSolved, icon: Trophy, color: 'text-amber-400' },
            { label: 'Intentados', value: progress.totalAttempted, icon: Target, color: 'text-blue-400' },
            { label: 'Racha maxima', value: `${progress.longestStreak}d`, icon: Flame, color: 'text-orange-400' },
            { label: 'Precision', value: `${accuracy}%`, icon: TrendingUp, color: 'text-emerald-400' },
          ].map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
              <s.icon className={cn('h-6 w-6 mx-auto mb-2', s.color)} />
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-400" /> Actividad (ultimos 90 dias)
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {grid.map((cell) => (
                <div key={cell.date} title={`${cell.date}: ${cell.count} resueltos`}
                  className={cn('w-3 h-3 rounded-sm transition-all hover:ring-1 hover:ring-white/30', LEVEL_COLORS[cell.level])} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Menos</span>
            {LEVEL_COLORS.map((c, i) => <div key={i} className={cn('w-3 h-3 rounded-sm', c)} />)}
            <span>Mas</span>
          </div>
        </section>

        {Object.keys(progress.byDifficulty).length > 0 && (
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-400" /> Progreso por Dificultad
            </h2>
            <div className="space-y-3">
              {DIFFICULTY_ORDER.filter(d => progress.byDifficulty[d]).map(diff => {
                const s = progress.byDifficulty[diff];
                const rate = s.attempted > 0 ? Math.round((s.solved / s.attempted) * 100) : 0;
                return (
                  <div key={diff}>
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className={cn('text-xs', DIFFICULTY_COLOR[diff])}>{DIFFICULTY_ES[diff] || diff}</Badge>
                      <span className="text-xs text-slate-400">{s.solved}/{s.attempted} &middot; {rate}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all" style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {recentAttempts.length > 0 && (
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-emerald-400" /> Ultimas Partidas
            </h2>
            <div className="space-y-2">
              {recentAttempts.map((a, i) => (
                <Link key={i} href={`/combinaciones/${a.combinationSlug}`}
                  className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-colors group">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', a.solved ? 'bg-emerald-400' : 'bg-red-400')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate group-hover:text-blue-300 transition-colors">{a.combinationTitle}</p>
                    <p className="text-xs text-slate-500">{a.date} &middot; {a.difficulty} &middot; {a.usedHints} pista(s)</p>
                  </div>
                  <span className={cn('text-xs font-bold', a.solved ? 'text-emerald-400' : 'text-red-400')}>
                    {a.solved ? 'Resuelto' : 'Fallido'}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {progress.totalAttempted === 0 && (
          <section className="text-center py-16 space-y-4">
            <Brain className="h-16 w-16 text-slate-700 mx-auto" />
            <h2 className="text-xl font-semibold text-slate-300">Empieza a resolver puzzles!</h2>
            <p className="text-slate-500">Tu progreso, racha y ELO tactico apareceran aqui.</p>
            <Link href="/combinaciones"><Button className="bg-blue-600 hover:bg-blue-700">Ver combinaciones</Button></Link>
          </section>
        )}

        <div className="text-center pt-4">
          {!showReset ? (
            <button onClick={() => setShowReset(true)} className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 mx-auto">
              <RotateCcw className="h-3 w-3" /> Resetear progreso
            </button>
          ) : (
            <div className="flex items-center gap-3 justify-center">
              <span className="text-sm text-red-400">Seguro? Esto borrara todo tu progreso.</span>
              <Button size="sm" variant="destructive" onClick={handleReset}>Si, borrar</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowReset(false)}>Cancelar</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}