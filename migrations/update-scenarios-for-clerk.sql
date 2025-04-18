-- Update the scenarios table to work with Clerk user IDs
-- First, remove any foreign key constraints that might exist
ALTER TABLE IF EXISTS scenarios
DROP CONSTRAINT IF EXISTS fk_scenarios_user;

-- Make sure the user_id column exists and is the right type
ALTER TABLE scenarios
ALTER COLUMN user_id TYPE VARCHAR(255);

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON scenarios(user_id);

-- Update the scenario_versions table to use the right type for created_by
ALTER TABLE scenario_versions
ALTER COLUMN created_by TYPE VARCHAR(255);
