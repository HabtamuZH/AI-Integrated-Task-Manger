-- Create achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unlocked BOOLEAN DEFAULT true
);

-- Enable row level security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own achievements
DROP POLICY IF EXISTS "Users can only see their own achievements" ON achievements;
CREATE POLICY "Users can only see their own achievements"
  ON achievements FOR ALL
  USING (auth.uid() = userId);

-- Enable realtime for achievements table
alter publication supabase_realtime add table achievements;
