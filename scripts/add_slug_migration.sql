-- Run this migration in your Supabase/Neon SQL editor to add slug support to existing blogs.
-- Step 1: Add the slug column
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS slug VARCHAR(120) UNIQUE;

-- Step 2: Backfill slugs for all existing blogs using their title + id
-- This generates a slug like "my-blog-title-123"
UPDATE blogs
SET slug = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(
            TRIM(title),
            '[^a-zA-Z0-9\s-]', '', 'g'   -- remove special chars
        ),
        '[\s_]+', '-', 'g'               -- spaces to hyphens
    )
) || '-' || id::text
WHERE slug IS NULL;
