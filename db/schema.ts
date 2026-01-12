import { pgTable, serial, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";

export const research = pgTable("research", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: varchar("category", { length: 100 }),
  year: varchar("year", { length: 4 }),
  summary: text("summary"),
  titleImage: text("title_image"),
  abstract: text("abstract"),
  authors: jsonb("authors").$type<string[]>(),
  doi: varchar("doi", { length: 255 }),
  journal: varchar("journal", { length: 255 }),
  sections: jsonb("sections").$type<{title: string, content: string, image?: string}[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});
