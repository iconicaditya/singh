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
  relatedPublications: jsonb("related_publications"), // Array of publication objects
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  anotherCategory: varchar("another_category", { length: 100 }),
  tags: text("tags"),
  teamMembers: jsonb("team_members"), // Array of {name, role}
  location: varchar("location", { length: 255 }),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).notNull(), // ongoing, completed, etc
  imageUrl: text("image_url"),
  aboutProject: text("about_project"), // Rich text
  projectObjectives: text("project_objectives"),
  attachedResearchIds: jsonb("attached_research_ids"), // Array of research IDs
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  journal: varchar("journal", { length: 255 }),
  authors: text("authors").notNull(),
  description: text("description"),
  year: varchar("year", { length: 4 }).notNull(),
  type: varchar("type", { length: 100 }), // Journal, Conference, etc
  doi: varchar("doi", { length: 100 }),
  link: text("link"),
  imageUrl: text("image_url"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
