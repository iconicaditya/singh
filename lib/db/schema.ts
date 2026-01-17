import { pgTable, serial, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

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

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
