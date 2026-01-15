-- SQL for recreating the database schema for SinghLab Environment

-- Drop existing tables
DROP TABLE IF EXISTS research CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Research Table
CREATE TABLE research (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  year VARCHAR(4) NOT NULL,
  tags TEXT,
  title_image TEXT,
  authors JSONB NOT NULL DEFAULT '[]', -- Array of objects: [{ "name": "Author Name", "image": "URL" }]
  content_sections JSONB NOT NULL DEFAULT '[]', -- Array of objects: [{ "id": "uuid", "title": "Section Title", "content": "HTML", "image": "URL" }]
  related_publications JSONB DEFAULT '[]', -- Array of objects: [{ "id": 1, "title": "Pub Title", "authors": "Name", "journal": "Journal", "year": "2024", "link": "URL" }]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL, -- e.g., 'ongoing', 'completed'
  image_url TEXT,
  link TEXT,
  tags TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
