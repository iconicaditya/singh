import { pgTable, serial, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const research = pgTable("research", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  year: varchar("year", { length: 4 }).notNull(),
  tags: text("tags"),
  titleImage: text("title_image"),
  authors: jsonb("authors").notNull(), // Array of objects {name, image}
  contentSections: jsonb("content_sections").notNull(), // Array of objects {title, content, image}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  tags: text("tags"),
  teamMembers: jsonb("team_members"), // Array of {name, role}
  location: varchar("location", { length: 255 }),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).notNull(), // ongoing, completed, etc
  imageUrl: text("image_url"),
  aboutProject: text("about_project"), // Rich text
  projectObjectives: jsonb("project_objectives"), // Changed from text to jsonb
  projectDate: varchar("project_date", { length: 100 }), // Added date field
  attachedResearchIds: jsonb("attached_research_ids"), // Array of research IDs
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  authors: text("authors").notNull(),
  description: text("description"),
  tags: text("tags"),
  pdfUrl: text("pdf_url").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const team = pgTable("team", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  socialLinks: jsonb("social_links").notNull(), // {linkedin, twitter, website, etc}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  year: varchar("year", { length: 4 }).notNull(),
  tags: text("tags"),
  titleImage: text("title_image"),
  contentSections: jsonb("content_sections").notNull(), // Array of objects {title, content, image}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const collaborators = pgTable("collaborators", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 255 }), // Optional company name
  logoUrl: text("logo_url"), // Company logo image
  imageUrl: text("image_url"), // Additional image (optional)
  website: text("website"), // Company website URL
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const researchThemes = pgTable("research_themes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  iconImage: text("icon_image"),
  points: jsonb("points").notNull(), // Array of strings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hero = pgTable("hero", {
  id: serial("id").primaryKey(),
  mainHeading: varchar("main_heading", { length: 500 }).notNull(),
  subheading: varchar("subheading", { length: 500 }).notNull(),
  backgroundImage: text("background_image").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  roleDesignation: varchar("role_designation", { length: 255 }).notNull(), // Professor, Graduate students, Undergraduate students
  profileImage: text("profile_image").notNull(),
  nationality: varchar("nationality", { length: 255 }),
  labId: varchar("lab_id", { length: 100 }),
  
  // Professor fields
  educationBackground: text("education_background"),
  pastTeachingBackground: text("past_teaching_background"),
  publications: jsonb("publications"), // Array of {link}
  cvUrl: text("cv_url"),
  cvLinks: jsonb("cv_links"), // Array of {title, link}
  
  // Student fields (Graduate & Undergraduate)
  graduationYears: jsonb("graduation_years"), // Array of strings ["Class of 2025", etc]
  researchTopic: varchar("research_topic", { length: 500 }),
  conferencePresentation: text("conference_presentation"),
  
  // Social media links
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
