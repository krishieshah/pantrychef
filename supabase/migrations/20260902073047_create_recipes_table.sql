/*
# Create recipes table (multi-user, owner-scoped)

1. New Tables
- `recipes`
  - `id` (uuid, primary key, auto-generated)
  - `title` (text, not null) — the recipe name
  - `ingredients` (text array, not null) — list of ingredients
  - `instructions` (text, not null) — step-by-step cooking instructions
  - `user_id` (uuid, not null, defaults to the authenticated user via auth.uid())
  - `created_at` (timestamptz, defaults to now())

2. Security
- Enable RLS on `recipes`.
- Owner-scoped CRUD: each authenticated user can only SELECT, INSERT, UPDATE, and DELETE rows they own.
- Four separate policies (one per CRUD verb), scoped TO authenticated with auth.uid() = user_id.

3. Important Notes
- The `user_id` column has DEFAULT auth.uid() so frontend inserts that omit user_id still satisfy the INSERT WITH CHECK.
- Foreign key references auth.users(id) with ON DELETE CASCADE so deleting a user removes their recipes.
*/

CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  ingredients text[] NOT NULL DEFAULT '{}',
  instructions text NOT NULL DEFAULT '',
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_recipes" ON recipes;
CREATE POLICY "select_own_recipes" ON recipes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_recipes" ON recipes;
CREATE POLICY "insert_own_recipes" ON recipes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_recipes" ON recipes;
CREATE POLICY "update_own_recipes" ON recipes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_recipes" ON recipes;
CREATE POLICY "delete_own_recipes" ON recipes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
