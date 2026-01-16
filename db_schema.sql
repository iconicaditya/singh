-- Finalized Research Table Schema
CREATE TABLE IF NOT EXISTS research (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    year VARCHAR(4) NOT NULL,
    tags TEXT,
    title_image TEXT,
    authors JSONB NOT NULL,            -- Array of objects: { "name": string, "image": string }
    content_sections JSONB NOT NULL,   -- Array of objects: { "title": string, "content": string, "image": string }
    related_publications JSONB,        -- Array of related research reference objects
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
