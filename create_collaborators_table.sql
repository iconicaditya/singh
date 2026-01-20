-- SQL script to create collaborators table in Neon PostgreSQL
-- Run this in your Neon database SQL editor

CREATE TABLE IF NOT EXISTS collaborators (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),           -- Optional company name
    logo_url TEXT,                       -- Company logo image URL
    image_url TEXT,                      -- Additional image URL (optional)
    website TEXT,                        -- Company website URL (optional)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_collaborators_created_at ON collaborators(created_at DESC);
