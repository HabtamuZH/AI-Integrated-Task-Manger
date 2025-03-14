-- Create tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  dueDate DATE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  completed BOOLEAN DEFAULT false,
  userId UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own tasks
DROP POLICY IF EXISTS "Users can only see their own tasks" ON tasks;
CREATE POLICY "Users can only see their own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = userId);

-- Enable realtime for tasks table
alter publication supabase_realtime add table tasks;
