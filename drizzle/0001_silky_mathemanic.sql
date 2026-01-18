CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"image_url" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "publications" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"authors" text NOT NULL,
	"description" text,
	"tags" text,
	"pdf_url" text NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"social_links" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "category" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "team_members" jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "location" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "about_project" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "project_objectives" jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "project_date" varchar(100);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "attached_research_ids" jsonb;--> statement-breakpoint
ALTER TABLE "research" DROP COLUMN "related_publications";