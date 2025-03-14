-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  joinDate TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own profile
DROP POLICY IF EXISTS "Users can only see their own profile" ON users;
CREATE POLICY "Users can only see their own profile"
  ON users FOR ALL
  USING (auth.uid() = id);

-- Enable realtime for users table
alter publication supabase_realtime add table users;
