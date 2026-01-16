-- Project Management System Schema
-- Updated: 2026-01-16

-- Research Table
CREATE TABLE IF NOT EXISTS research (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  year VARCHAR(4) NOT NULL,
  tags TEXT,
  title_image TEXT,
  authors JSONB NOT NULL, -- Array of {name, image}
  content_sections JSONB NOT NULL, -- Array of {title, content, image}
  related_publications JSONB, -- Array of publication objects
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects Table (Updated)
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT,
  team_members JSONB, -- Array of {name, role}
  location VARCHAR(255),
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL, -- ongoing, completed
  image_url TEXT,
  about_project TEXT, -- Rich text/HTML
  project_objectives JSONB, -- Array of strings
  project_date VARCHAR(100),
  attached_research_ids JSONB, -- Array of research IDs
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Publications Table
CREATE TABLE IF NOT EXISTS publications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  journal VARCHAR(255),
  authors TEXT NOT NULL,
  description TEXT,
  year VARCHAR(4) NOT NULL,
  type VARCHAR(100), -- Journal, Conference, etc
  doi VARCHAR(100),
  link TEXT,
  image_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);