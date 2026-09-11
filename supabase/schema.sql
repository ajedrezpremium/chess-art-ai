-- Supabase Schema for Chess Art & AI Academy
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Combinations table
CREATE TABLE combinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INT NOT NULL UNIQUE CHECK (number BETWEEN 1 AND 100),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  white_player TEXT NOT NULL,
  black_player TEXT NOT NULL,
  event TEXT,
  year INT,
  result TEXT,
  fen TEXT NOT NULL,
  pgn TEXT NOT NULL,
  opening TEXT,
  category TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert', 'Master')),
  description TEXT,
  artwork_url TEXT,
  artist_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_combinations_number ON combinations(number);
CREATE INDEX idx_combinations_slug ON combinations(slug);
CREATE INDEX idx_combinations_year ON combinations(year);
CREATE INDEX idx_combinations_difficulty ON combinations(difficulty);
CREATE INDEX idx_combinations_white_player ON combinations(white_player);
CREATE INDEX idx_combinations_black_player ON combinations(black_player);

-- Row Level Security
ALTER TABLE combinations ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON combinations
  FOR SELECT USING (true);

-- Admin write access (will be restricted by auth later)
CREATE POLICY "Admin write access" ON combinations
  FOR ALL USING (auth.role() = 'service_role');

-- Storage bucket for artworks
-- Run in Supabase Storage: create bucket 'artworks' with public read access

-- Users table (for future auth features)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Favorites table
CREATE TABLE favorites (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  combination_id UUID REFERENCES combinations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, combination_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Progress table
CREATE TABLE progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  combination_id UUID REFERENCES combinations(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INT DEFAULT 0,
  attempts INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, combination_id)
);

ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress" ON progress
  FOR ALL USING (auth.uid() = user_id);

-- AI Conversations table
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  combination_id UUID REFERENCES combinations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- AI Messages table
CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own messages" ON ai_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ai_conversations 
      WHERE id = conversation_id 
      AND (user_id = auth.uid() OR user_id IS NULL)
    )
  );