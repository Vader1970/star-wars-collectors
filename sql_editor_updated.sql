-- Updated SQL Editor script with RLS performance optimization
-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS hero_settings CASCADE;

-- Create categories table with hierarchical structure
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  cloudflare_id TEXT, -- Cloudflare image ID for automatic deletion
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table with all the fields you specified
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  stock_status TEXT NOT NULL CHECK (stock_status IN ('In Stock', 'Out of Stock')),
  rating TEXT,
  valuation DECIMAL,
  image TEXT,
  cloudflare_id TEXT, -- Cloudflare image ID for main image
  images TEXT[], -- Added images column for multiple images
  cloudflare_ids TEXT[], -- Cloudflare image IDs for multiple images
  manufacturer TEXT,
  year_manufactured INTEGER,
  afa_number TEXT,
  afa_grade TEXT,
  description TEXT,
  bought_for DECIMAL DEFAULT 0,
  variations TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hero_settings table for storing hero section customization
CREATE TABLE hero_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  heading_line1 TEXT NOT NULL DEFAULT 'Star Wars',
  heading_line2 TEXT NOT NULL DEFAULT 'Memorabilia',
  paragraph TEXT NOT NULL DEFAULT 'Your ultimate collection management system for a galaxy far, far away. Organize, catalog, and treasure your Star Wars collectibles.',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_cloudflare_id ON categories(cloudflare_id);
CREATE INDEX idx_categories_created_at_asc ON categories(created_at ASC);
CREATE INDEX idx_categories_user_created ON categories(user_id, created_at DESC);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_cloudflare_id ON items(cloudflare_id);
CREATE INDEX idx_items_user_created ON items(user_id, created_at DESC);
CREATE INDEX idx_hero_settings_user_id ON hero_settings(user_id);
CREATE INDEX idx_hero_settings_user_created ON hero_settings(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

-- Categories policies with PERFORMANCE OPTIMIZATION
-- Using (SELECT auth.uid()) instead of auth.uid() to cache the user ID once per query
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Users can insert their own categories" ON categories FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can update their own categories" ON categories FOR UPDATE USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can delete their own categories" ON categories FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Items policies with PERFORMANCE OPTIMIZATION
CREATE POLICY "Anyone can view items" ON items FOR SELECT USING (true);
CREATE POLICY "Users can insert their own items" ON items FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can update their own items" ON items FOR UPDATE USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can delete their own items" ON items FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Hero settings policies with PERFORMANCE OPTIMIZATION
CREATE POLICY "Anyone can view hero settings" ON hero_settings FOR SELECT USING (true);
CREATE POLICY "Users can insert their own hero settings" ON hero_settings FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can update their own hero settings" ON hero_settings FOR UPDATE USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can delete their own hero settings" ON hero_settings FOR DELETE USING ((SELECT auth.uid()) = user_id); 