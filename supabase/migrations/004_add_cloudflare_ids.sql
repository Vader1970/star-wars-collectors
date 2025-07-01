-- Migration: Add cloudflare_id fields to store Cloudflare image IDs
-- This allows us to delete images from Cloudflare when records are deleted

-- Add cloudflare_id to categories table
ALTER TABLE categories ADD COLUMN cloudflare_id TEXT;

-- Add cloudflare_id to items table for main image
ALTER TABLE items ADD COLUMN cloudflare_id TEXT;

-- Add cloudflare_ids array to items table for multiple images
ALTER TABLE items ADD COLUMN cloudflare_ids TEXT[];

-- Create indexes for better performance
CREATE INDEX idx_categories_cloudflare_id ON categories(cloudflare_id);
CREATE INDEX idx_items_cloudflare_id ON items(cloudflare_id); 