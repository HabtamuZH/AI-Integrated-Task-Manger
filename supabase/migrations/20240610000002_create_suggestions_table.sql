-- Create suggestions table if it doesn't exist
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  estimatedTime TEXT,
  dueDate TEXT,
  userId UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own suggestions
DROP POLICY IF EXISTS "Users can only see their own suggestions" ON suggestions;
CREATE POLICY "Users can only see their own suggestions"
  ON suggestions FOR ALL
  USING (auth.uid() = userId);

-- Enable realtime for suggestions table
alter publication supabase_realtime add table suggestions;
