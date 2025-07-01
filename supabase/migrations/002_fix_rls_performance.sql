-- Migration: Fix RLS performance issues by caching auth.uid() calls
-- This migration replaces auth.uid() with (SELECT auth.uid()) to avoid re-evaluation per row

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own manufacturers" ON manufacturers;
DROP POLICY IF EXISTS "Users can update their own manufacturers" ON manufacturers;
DROP POLICY IF EXISTS "Users can delete their own manufacturers" ON manufacturers;

DROP POLICY IF EXISTS "Users can insert their own categories" ON categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;

DROP POLICY IF EXISTS "Users can insert their own items" ON items;
DROP POLICY IF EXISTS "Users can update their own items" ON items;
DROP POLICY IF EXISTS "Users can delete their own items" ON items;

DROP POLICY IF EXISTS "Users can insert their own hero settings" ON hero_settings;
DROP POLICY IF EXISTS "Users can update their own hero settings" ON hero_settings;
DROP POLICY IF EXISTS "Users can delete their own hero settings" ON hero_settings;

-- Recreate policies with optimized auth.uid() calls
-- Manufacturers policies
CREATE POLICY "Users can insert their own manufacturers" ON manufacturers FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can update their own manufacturers" ON manufacturers FOR UPDATE USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can delete their own manufacturers" ON manufacturers FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Categories policies
CREATE POLICY "Users can insert their own categories" ON categories FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can update their own categories" ON categories FOR UPDATE USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can delete their own categories" ON categories FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Items policies
CREATE POLICY "Users can insert their own items" ON items FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can update their own items" ON items FOR UPDATE USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can delete their own items" ON items FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Hero settings policies
CREATE POLICY "Users can insert their own hero settings" ON hero_settings FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can update their own hero settings" ON hero_settings FOR UPDATE USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can delete their own hero settings" ON hero_settings FOR DELETE USING ((SELECT auth.uid()) = user_id); 