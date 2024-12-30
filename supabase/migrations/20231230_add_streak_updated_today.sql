-- Add streak_updated_today column to profiles table
ALTER TABLE profiles 
ADD COLUMN streak_updated_today boolean DEFAULT false;

-- Update existing rows to set streak_updated_today to false
UPDATE profiles 
SET streak_updated_today = false 
WHERE streak_updated_today IS NULL;
