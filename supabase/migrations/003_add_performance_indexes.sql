-- Migration: Add performance indexes to fix slow queries
-- This addresses the slow categories query that's taking 31+ seconds

-- Add index for the slow categories query (ordering by created_at)
CREATE INDEX IF NOT EXISTS idx_categories_created_at_asc ON categories(created_at ASC);

-- Add composite index for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_categories_user_created ON categories(user_id, created_at DESC);

-- Add index for items queries that might be slow
CREATE INDEX IF NOT EXISTS idx_items_user_created ON items(user_id, created_at DESC);

-- Add index for hero_settings queries
CREATE INDEX IF NOT EXISTS idx_hero_settings_user_created ON hero_settings(user_id, created_at DESC);

-- Add index for manufacturer queries
CREATE INDEX IF NOT EXISTS idx_manufacturers_user_created ON manufacturers(user_id, created_at DESC); 