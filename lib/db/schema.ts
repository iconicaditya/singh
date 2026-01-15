import { pgTable, serial, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const research = pgTable("research", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  year: varchar("year", { length: 4 }).notNull(),
  tags: text("tags"),
  titleImage: text("title_image"),
  authors: jsonb("authors").notNull(), // Array of strings
  contentSections: jsonb("content_sections").notNull(), // Array of objects {title, content, image}
  relatedPublications: jsonb("related_publications"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).notNull(), // ongoing, completed, etc
  imageUrl: text("image_url"),
  link: text("link"),
  tags: text("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
