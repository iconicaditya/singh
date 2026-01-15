CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(50) NOT NULL,
	"image_url" text,
	"link" text,
	"tags" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "research" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"year" varchar(4) NOT NULL,
	"tags" text,
	"title_image" text,
	"authors" jsonb NOT NULL,
	"content_sections" jsonb NOT NULL,
	"related_publications" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
