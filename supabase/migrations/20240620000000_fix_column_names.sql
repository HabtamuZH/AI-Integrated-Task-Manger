-- Fix column names in tasks table to match our schema
ALTER TABLE IF EXISTS tasks
RENAME COLUMN "userId" TO userid;

ALTER TABLE IF EXISTS tasks
RENAME COLUMN "createdAt" TO createdat;

ALTER TABLE IF EXISTS tasks
RENAME COLUMN "updatedAt" TO updatedat;

ALTER TABLE IF EXISTS tasks
RENAME COLUMN "dueDate" TO duedate;

-- Fix column names in achievements table
ALTER TABLE IF EXISTS achievements
RENAME COLUMN "userId" TO userid;

-- Fix column names in suggestions table
ALTER TABLE IF EXISTS suggestions
RENAME COLUMN "userId" TO userid;

ALTER TABLE IF EXISTS suggestions
RENAME COLUMN "createdAt" TO createdat;

ALTER TABLE IF EXISTS suggestions
RENAME COLUMN "dueDate" TO duedate;

ALTER TABLE IF EXISTS suggestions
RENAME COLUMN "estimatedTime" TO estimatedtime;

-- Fix column names in users table
ALTER TABLE IF EXISTS users
RENAME COLUMN "joinDate" TO joindate;
