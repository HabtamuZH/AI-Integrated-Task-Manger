-- Create tables for TaskAI application

-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Achievements table
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  unlocked BOOLEAN DEFAULT true NOT NULL
);

-- Suggestions table
CREATE TABLE suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) NOT NULL,
  estimated_time TEXT,
  due_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" 
  ON tasks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks" 
  ON tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" 
  ON tasks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" 
  ON tasks FOR DELETE 
  USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view own achievements" 
  ON achievements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own achievements" 
  ON achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Suggestions policies
CREATE POLICY "Users can view own suggestions" 
  ON suggestions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own suggestions" 
  ON suggestions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own suggestions" 
  ON suggestions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own suggestions" 
  ON suggestions FOR DELETE 
  USING (auth.uid() = user_id);
