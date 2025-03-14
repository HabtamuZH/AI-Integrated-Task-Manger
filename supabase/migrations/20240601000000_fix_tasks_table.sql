-- Fix column names to match TypeScript interface
ALTER TABLE tasks RENAME COLUMN user_id TO "userId";
ALTER TABLE tasks RENAME COLUMN due_date TO "dueDate";
ALTER TABLE tasks RENAME COLUMN created_at TO "createdAt";
ALTER TABLE tasks RENAME COLUMN updated_at TO "updatedAt";

-- Enable realtime for tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
