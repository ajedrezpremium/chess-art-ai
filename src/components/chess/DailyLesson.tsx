'use client';

import { useMemo } from 'react';
import { Lightbulb } from 'lucide-react';
import { defaultPieces } from 'react-chessboard';

interface LessonPiece {
  square: string;
  piece: string;
}

interface LessonArrow {
  from: string;
  to: string;
}

interface Lesson {
  id: string;
  themeEs: string;
  themeEn: string;
  titleEs: string;
  titleEn: string;
  textEs: string;
  textEn: string;
  pieces: LessonPiece[];
  circles: string[];
  arrows: LessonArrow[];
}

const LESSONS: Lesson[] = [
  {
    id: 'fork',
    themeEs: 'Ataque doble',
    themeEn: 'Double attack',
    titleEs: 'La horquilla del caballo',
    titleEn: 'The knight fork',
    textEs: 'El caballo en b2 ataca a la vez al rey (d1) y a la torre (d3). El rey debe moverse y la torre cae.',
    textEn: 'The knight on b2 attacks king (d1) and rook (d3) at once. The king must move and the rook falls.',
    pieces: [
      { square: 'a1', piece: 'wK' },
      { square: 'b2', piece: 'wN' },
      { square: 'd1', piece: 'bK' },
      { square: 'd3', piece: 'bR' },
    ],
    circles: ['d1', 'd3'],
    arrows: [{ from: 'b2', to: 'd1' }],
  },
  {
    id: 'pin',
    themeEs: 'Clavada',
    themeEn: 'Pin',
    titleEs: 'Clavada absoluta',
    titleEn: 'Absolute pin',
    textEs: 'El alfil de a1 clava al caballo de b2 contra su rey en c3: si se mueve, cae el rey.',
    textEn: 'The bishop on a1 pins the knight on b2 against its king on c3: moving it loses the king.',
    pieces: [
      { square: 'a1', piece: 'wB' },
      { square: 'c1', piece: 'wK' },
      { square: 'b2', piece: 'bN' },
      { square: 'c3', piece: 'bK' },
    ],
    circles: ['b2'],
    arrows: [{ from: 'a1', to: 'c3' }],
  },
  {
    id: 'skewer',
    themeEs: 'Rayos X',
    themeEn: 'Skewer',
    titleEs: 'Ataque a la descubierta lineal',
    titleEn: 'Line skewer',
    textEs: '1.Ta4+ aparta al rey y la torre recoge el caballo de b3 en la siguiente.',
    textEn: '1.Ra4+ chases the king away and the rook collects the knight on b3 next.',
    pieces: [
      { square: 'a1', piece: 'wR' },
      { square: 'c1', piece: 'wK' },
      { square: 'b3', piece: 'bN' },
      { square: 'b4', piece: 'bK' },
    ],
    circles: ['b4', 'b3'],
    arrows: [{ from: 'a1', to: 'a4' }],
  },
  {
    id: 'mate1',
    themeEs: 'Mate en 1',
    themeEn: 'Mate in 1',
    titleEs: 'El rincón mortal',
    titleEn: 'The deadly corner',
    textEs: '1.Db1# El rey está encerrado por sus peones: la dama entra por la puerta de atrás.',
    textEn: '1.Qb1# The king is boxed by its own pawns: the queen walks in the back door.',
    pieces: [
      { square: 'b2', piece: 'wQ' },
      { square: 'c3', piece: 'wK' },
      { square: 'a1', piece: 'bK' },
      { square: 'a2', piece: 'bP' },
    ],
    circles: ['a1', 'b1'],
    arrows: [{ from: 'b2', to: 'b1' }],
  },
  {
    id: 'opposition',
    themeEs: 'Finales',
    themeEn: 'Endgames',
    titleEs: 'La oposición',
    titleEn: 'The opposition',
    textEs: 'Reyes frente a frente con una casilla libre: quien NO mueve gana la oposición y el paso.',
    textEn: 'Kings face to face with one square between: whoever does NOT move wins the opposition.',
    pieces: [
      { square: 'b2', piece: 'wK' },
      { square: 'b4', piece: 'bK' },
      { square: 'd1', piece: 'wP' },
    ],
    circles: ['b2', 'b4'],
    arrows: [],
  },
];

const FILES = ['a', 'b', 'c', 'd'];
const DARK = '#2B4C7E';
const LIGHT = '#E2E8F0';

function sqXY(sq: string): [number, number] {
  const f = FILES.indexOf(sq[0]);
  const r = parseInt(sq[1], 10) - 1;
  return [f * 64, (3 - r) * 64];
}

/** Mini tablero 4x4 con la lección táctica del día (rota según la fecha). */
export function DailyLesson({ locale = 'es' }: { locale?: 'es' | 'en' }) {
  const lesson = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return LESSONS[day % LESSONS.length];
  }, []);

  const es = locale === 'es';

  return (
    <div className="relative">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-chess-surface border border-chess-border/50">
        <svg viewBox="0 0 256 256" className="w-full h-full block" role="img" aria-label={es ? lesson.titleEs : lesson.titleEn}>
          <defs>
            <marker id="lessonArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#C9A227" />
            </marker>
          </defs>
          {FILES.map((f, fi) =>
            [4, 3, 2, 1].map((r, ri) => (
              <rect
                key={`${f}${r}`}
                x={fi * 64}
                y={ri * 64}
                width={64}
                height={64}
                fill={(fi + ri) % 2 === 0 ? DARK : LIGHT}
              />
            ))
          )}
          {lesson.pieces.map((p, i) => {
            const [x, y] = sqXY(p.square);
            const ProPiece = defaultPieces[p.piece] || defaultPieces.wP;
            return (
              <svg key={`${p.square}-${i}`} x={x} y={y} width={64} height={64}>
                <ProPiece />
              </svg>
            );
          })}
          {lesson.circles.map((sq) => {
            const [x, y] = sqXY(sq);
            return (
              <circle
                key={sq}
                cx={x + 32}
                cy={y + 32}
                r={26}
                fill="none"
                stroke="#C9A227"
                strokeWidth={4}
                opacity={0.95}
              />
            );
          })}
          {lesson.arrows.map((a, i) => {
            const [x1, y1] = sqXY(a.from);
            const [x2, y2] = sqXY(a.to);
            return (
              <line
                key={i}
                x1={x1 + 32}
                y1={y1 + 32}
                x2={x2 + 32}
                y2={y2 + 32}
                stroke="#C9A227"
                strokeWidth={6}
                strokeLinecap="round"
                opacity={0.9}
                markerEnd="url(#lessonArrow)"
              />
            );
          })}
        </svg>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-chess-gold bg-chess-bg/85 px-2.5 py-1 rounded-lg border border-chess-gold/30">
          <Lightbulb className="h-3.5 w-3.5" />
          {es ? lesson.themeEs : lesson.themeEn}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-display text-lg font-semibold text-chess-text-primary">
          {es ? lesson.titleEs : lesson.titleEn}
        </h3>
        <p className="mt-1 text-sm text-chess-text-secondary leading-relaxed">
          {es ? lesson.textEs : lesson.textEn}
        </p>
        <p className="mt-2 text-xs text-chess-text-muted">
          {es ? 'Nueva lección cada día · Tema táctico o estratégico' : 'New lesson every day · Tactical or strategic theme'}
        </p>
      </div>
    </div>
  );
}
