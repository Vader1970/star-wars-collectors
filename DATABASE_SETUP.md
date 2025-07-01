# Database Setup Documentation

This document explains the different SQL files in this project and when to use each one.

## 📁 File Structure

```
├── supabase/migrations/           # ✅ Version controlled - Database schema history
│   ├── 001_create_categories_table.sql
│   ├── 002_fix_rls_performance.sql
│   └── 003_add_performance_indexes.sql
├── setup_database.sql             # ✅ Reference - Complete database setup
├── sql_editor_updated.sql         # ✅ Reference - Performance optimized setup
└── .env.*                         # ❌ Gitignored - Environment variables
```

## 🚀 Quick Start Options

### Option 1: Use Migrations (Recommended for Production)

```bash
# Apply migrations in order
supabase db push
```

### Option 2: Use SQL Editor Script (Quick Setup)

1. Copy `sql_editor_updated.sql` content
2. Paste into Supabase SQL Editor
3. Click "Run"

### Option 3: Use Setup Script (Complete Reset)

1. Copy `setup_database.sql` content
2. Paste into Supabase SQL Editor
3. Click "Run"

## 📋 File Descriptions

### Migration Files (`supabase/migrations/`)

- **Purpose**: Track database schema changes over time
- **Use Case**: Production deployments, team collaboration
- **Git Status**: ✅ Keep in version control
- **Order**: Applied sequentially (001, 002, 003...)

### `sql_editor_updated.sql`

- **Purpose**: Complete database setup with performance optimizations
- **Use Case**: Quick development setup, testing
- **Git Status**: ✅ Keep in version control
- **Features**:
  - All tables with proper indexes
  - RLS policies with performance optimization
  - Ready for production use

### `setup_database.sql`

- **Purpose**: Complete database setup with sample data
- **Use Case**: Development environment, demos
- **Git Status**: ✅ Keep in version control
- **Features**:
  - All tables and indexes
  - Sample manufacturer data
  - RLS policies (non-optimized)

## 🔧 Performance Optimizations

### Applied in `sql_editor_updated.sql`:

1. **RLS Performance**: `(SELECT auth.uid())` instead of `auth.uid()`
2. **Indexes**: Added `created_at` indexes for faster queries
3. **Column Selection**: Specific columns instead of `SELECT *`

### Migration Files Include:

- `002_fix_rls_performance.sql`: RLS optimization
- `003_add_performance_indexes.sql`: Performance indexes

## 🚨 Important Notes

### Data Loss Warning

- `sql_editor_updated.sql` and `setup_database.sql` include `DROP TABLE` statements
- **Backup your data** before running these scripts
- Use migrations for production environments

### Environment Variables

- Database connection strings are in `.env.*` files
- These are **not** committed to Git for security
- Copy `.env.example` and fill in your values

## 🛠️ Development Workflow

1. **New Feature**: Create migration file
2. **Testing**: Use SQL Editor scripts
3. **Production**: Apply migrations with `supabase db push`
4. **Rollback**: Use migration rollback commands

## 📊 Performance Monitoring

Use the database monitoring utility in `src/lib/database-monitoring.ts` to track query performance:

```typescript
import { monitoredQuery } from "@/lib/database-monitoring";

const { data, error } = await monitoredQuery("loadCategories", () => supabase.from("categories").select("*"));
```
