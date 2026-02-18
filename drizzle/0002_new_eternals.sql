CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"year" varchar(4) NOT NULL,
	"tags" text,
	"title_image" text,
	"content_sections" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "collaborators" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(255),
	"logo_url" text,
	"image_url" text,
	"website" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hero" (
	"id" serial PRIMARY KEY NOT NULL,
	"main_heading" varchar(500) NOT NULL,
	"subheading" varchar(500) NOT NULL,
	"background_image" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(255),
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"role_designation" varchar(255) NOT NULL,
	"profile_image" text NOT NULL,
	"nationality" varchar(255),
	"lab_id" varchar(100),
	"education_background" text,
	"past_teaching_background" text,
	"publications" jsonb,
	"cv_url" text,
	"cv_links" jsonb,
	"graduation_years" jsonb,
	"research_topic" varchar(500),
	"conference_presentation" text,
	"linkedin_url" text,
	"twitter_url" text,
	"facebook_url" text,
	"instagram_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "research_themes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"icon_image" text,
	"points" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
