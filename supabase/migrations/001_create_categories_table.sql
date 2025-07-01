-- Create manufacturers table
CREATE TABLE manufacturers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  stock_status TEXT NOT NULL CHECK (stock_status IN ('In Stock', 'Out of Stock')),
  rating TEXT,
  valuation DECIMAL,
  image TEXT,
  images TEXT[], -- Added images column for multiple images
  manufacturer TEXT, -- Manufacturer field
  year_manufactured INTEGER, -- Year Manufactured field
  afa_number TEXT, -- AFA Number field
  afa_grade TEXT, -- AFA Grade field
  description TEXT, -- Description field
  bought_for DECIMAL DEFAULT 0, -- Bought for field
  variations TEXT, -- Variations field
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hero_settings table for storing hero section customization
CREATE TABLE hero_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  heading_line1 TEXT NOT NULL DEFAULT 'Star Wars',
  heading_line2 TEXT NOT NULL DEFAULT 'Star Wars',
  paragraph TEXT NOT NULL DEFAULT 'Your ultimate collection management system for a galaxy far, far away. Organize, catalog, and treasure your Star Wars collectibles.',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_manufacturers_user_id ON manufacturers(user_id);
CREATE INDEX idx_manufacturers_name ON manufacturers(name);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_hero_settings_user_id ON hero_settings(user_id);

-- Enable Row Level Security
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

-- Manufacturers policies
CREATE POLICY "Anyone can view manufacturers" ON manufacturers FOR SELECT USING (true);
CREATE POLICY "Users can insert their own manufacturers" ON manufacturers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own manufacturers" ON manufacturers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own manufacturers" ON manufacturers FOR DELETE USING (auth.uid() = user_id);

-- Categories policies (allow all for now - can be restricted later)
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Users can insert their own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories" ON categories FOR DELETE USING (auth.uid() = user_id);

-- Items policies
CREATE POLICY "Anyone can view items" ON items FOR SELECT USING (true);
CREATE POLICY "Users can insert their own items" ON items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own items" ON items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own items" ON items FOR DELETE USING (auth.uid() = user_id);

-- Hero settings policies
CREATE POLICY "Anyone can view hero settings" ON hero_settings FOR SELECT USING (true);
CREATE POLICY "Users can insert their own hero settings" ON hero_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own hero settings" ON hero_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own hero settings" ON hero_settings FOR DELETE USING (auth.uid() = user_id);
