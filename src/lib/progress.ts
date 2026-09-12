// Progress & Streak tracking - localStorage only, no server
export interface PuzzleAttempt {
  combinationId: string;
  combinationSlug: string;
  combinationTitle: string;
  difficulty: string;
  category: string;
  solved: boolean;
  usedHints: number;
  timeSeconds: number;
  date: string;
}

export interface DailyActivity {
  date: string;
  solved: number;
  attempted: number;
}

export interface UserProgress {
  totalSolved: number;
  totalAttempted: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
  tacticElo: number;
  attempts: PuzzleAttempt[];
  dailyActivity: DailyActivity[];
  byCategory: Record<string, { solved: number; attempted: number }>;
  byDifficulty: Record<string, { solved: number; attempted: number }>;
}

const STORAGE_KEY = 'chess-art-progress-v1';

const DEFAULT_PROGRESS: UserProgress = {
  totalSolved: 0,
  totalAttempted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  tacticElo: 1200,
  attempts: [],
  dailyActivity: [],
  byCategory: {},
  byDifficulty: {},
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn('Could not save progress');
  }
}

const DIFFICULTY_ELO: Record<string, number> = {
  Beginner: 5, Easy: 10, Intermediate: 20, Advanced: 35, Expert: 55, Master: 80,
};

export function recordAttempt(params: {
  combinationId: string;
  combinationSlug: string;
  combinationTitle: string;
  difficulty: string;
  category: string;
  solved: boolean;
  usedHints: number;
  timeSeconds: number;
}): UserProgress {
  const progress = loadProgress();
  const today = getToday();
  const attempt: PuzzleAttempt = { ...params, date: today };
  progress.attempts = [attempt, ...progress.attempts].slice(0, 500);
  progress.totalAttempted += 1;

  if (params.solved) {
    progress.totalSolved += 1;
    const delta = DIFFICULTY_ELO[params.difficulty] || 15;
    const hintPenalty = params.usedHints * 5;
    progress.tacticElo = Math.max(400, progress.tacticElo + delta - hintPenalty);
  } else {
    const delta = DIFFICULTY_ELO[params.difficulty] || 15;
    progress.tacticElo = Math.max(400, progress.tacticElo - Math.floor(delta * 0.4));
  }

  if (params.solved) {
    if (progress.lastPlayedDate === null) {
      progress.currentStreak = 1;
    } else if (progress.lastPlayedDate === today) {
      // same day - no change
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      progress.currentStreak = progress.lastPlayedDate === yStr ? progress.currentStreak + 1 : 1;
    }
    progress.lastPlayedDate = today;
    if (progress.currentStreak > progress.longestStreak) {
      progress.longestStreak = progress.currentStreak;
    }
  }

  const dayIdx = progress.dailyActivity.findIndex(d => d.date === today);
  if (dayIdx >= 0) {
    progress.dailyActivity[dayIdx].attempted += 1;
    if (params.solved) progress.dailyActivity[dayIdx].solved += 1;
  } else {
    progress.dailyActivity.push({ date: today, solved: params.solved ? 1 : 0, attempted: 1 });
    progress.dailyActivity = progress.dailyActivity.slice(-90);
  }

  const cat = params.category || 'General';
  if (!progress.byCategory[cat]) progress.byCategory[cat] = { solved: 0, attempted: 0 };
  progress.byCategory[cat].attempted += 1;
  if (params.solved) progress.byCategory[cat].solved += 1;

  const diff = params.difficulty || 'Intermediate';
  if (!progress.byDifficulty[diff]) progress.byDifficulty[diff] = { solved: 0, attempted: 0 };
  progress.byDifficulty[diff].attempted += 1;
  if (params.solved) progress.byDifficulty[diff].solved += 1;

  saveProgress(progress);
  return progress;
}

export function getAccuracyRate(p: UserProgress): number {
  if (p.totalAttempted === 0) return 0;
  return Math.round((p.totalSolved / p.totalAttempted) * 100);
}

export function getActivityGrid(p: UserProgress): Array<{ date: string; count: number; level: 0|1|2|3|4 }> {
  const today = new Date();
  return Array.from({ length: 90 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (89 - i));
    const dateStr = d.toISOString().split('T')[0];
    const act = p.dailyActivity.find(a => a.date === dateStr);
    const count = act?.solved ?? 0;
    const level: 0|1|2|3|4 = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4;
    return { date: dateStr, count, level };
  });
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}