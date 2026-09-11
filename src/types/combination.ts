export interface Combination {
  id: string;
  number: number;
  slug: string;
  title: string;
  whitePlayer: string;
  blackPlayer: string;
  white_player: string;
  black_player: string;
  event: string;
  year: number;
  result: string;
  fen: string;
  pgn: string;
  opening: string;
  category: string;
  difficulty: DifficultyLevel;
  description: string;
  artworkUrl: string;
  artwork_url: string;
  artistNotes: string;
  artist_notes: string;
  createdAt: string;
  created_at: string;
}

export type DifficultyLevel = 
  | 'Beginner' 
  | 'Easy' 
  | 'Intermediate' 
  | 'Advanced' 
  | 'Expert' 
  | 'Master';

export interface CombinationCardProps {
  combination: Combination;
  locale?: 'es' | 'en';
}

export interface PGNMove {
  san: string;
  fen: string;
  moveNumber: number;
  isWhite: boolean;
  comment?: string;
  variations?: PGNMove[][];
}

export interface ParsedPGN {
  headers: Record<string, string>;
  moves: PGNMove[];
  initialFen: string;
}

export interface ChessContext {
  currentFen: string;
  currentPgn: string;
  moveHistory: PGNMove[];
  currentMoveIndex: number;
  combination?: Combination;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIChatContext {
  messages: AIMessage[];
  isOpen: boolean;
  currentPageContext?: ChessContext;
}