CREATE TYPE "public"."building_class" AS ENUM('economy', 'comfort', 'business', 'premium');--> statement-breakpoint
CREATE TYPE "public"."classified_status" AS ENUM('active', 'pending', 'rejected', 'archived', 'sold');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('TJS', 'USD');--> statement-breakpoint
CREATE TYPE "public"."deal_type" AS ENUM('sale', 'rent_long', 'rent_daily');--> statement-breakpoint
CREATE TYPE "public"."finishing_type" AS ENUM('rough', 'pre_finishing', 'turnkey');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('planned', 'under_construction', 'ready');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('apartment', 'house', 'commercial', 'land', 'garage');--> statement-breakpoint
CREATE TYPE "public"."sogd_city" AS ENUM('khujand', 'gafurov', 'guliston', 'buston', 'isfara', 'istaravshan', 'konibodom', 'panjakent', 'spitamen', 'zafarobod', 'rasulov', 'mastchoh', 'asht', 'shahriston', 'ayni', 'devashtich', 'kuhistoni_mastchoh');--> statement-breakpoint
CREATE TYPE "public"."unit_status" AS ENUM('available', 'reserved', 'sold');--> statement-breakpoint
CREATE TYPE "public"."unit_type" AS ENUM('studio', 'apartment', 'penthouse', 'commercial', 'parking');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'realtor', 'developer', 'admin');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"phone" text,
	"phone_verified" boolean DEFAULT false NOT NULL,
	"city" "sogd_city" DEFAULT 'khujand',
	"agency_name" text,
	"is_verified_realtor" boolean DEFAULT false NOT NULL,
	"bio" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "developer_members" (
	"id" text PRIMARY KEY NOT NULL,
	"developer_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'sales_agent' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "developers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"cover_url" text,
	"description" text,
	"founded_year" integer,
	"completed_projects_count" integer DEFAULT 0 NOT NULL,
	"active_projects_count" integer DEFAULT 0 NOT NULL,
	"rating" numeric(3, 2) DEFAULT '5.00',
	"is_verified" boolean DEFAULT false NOT NULL,
	"city" "sogd_city" DEFAULT 'khujand' NOT NULL,
	"office_address" text,
	"phone" text NOT NULL,
	"phone_secondary" text,
	"whatsapp" text,
	"telegram" text,
	"email" text,
	"website_url" text,
	"created_by_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "developers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"developer_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"short_description" text,
	"description" text,
	"status" "project_status" DEFAULT 'under_construction' NOT NULL,
	"building_class" "building_class" DEFAULT 'comfort' NOT NULL,
	"finishing" "finishing_type" DEFAULT 'rough' NOT NULL,
	"city" "sogd_city" DEFAULT 'khujand' NOT NULL,
	"district" text,
	"address" text NOT NULL,
	"landmark" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"floors_count" integer NOT NULL,
	"sections_count" integer DEFAULT 1 NOT NULL,
	"ceiling_height" numeric(3, 2),
	"construction_type" text DEFAULT 'Монолитно-каркасный',
	"deadline_quarter" integer,
	"deadline_year" integer,
	"min_price_per_meter_tjs" numeric(12, 2),
	"min_price_per_meter_usd" numeric(12, 2),
	"min_total_price_tjs" numeric(14, 2),
	"min_total_price_usd" numeric(14, 2),
	"has_installment" boolean DEFAULT true NOT NULL,
	"installment_months" integer,
	"installment_down_payment_percent" integer DEFAULT 30,
	"has_mortgage" boolean DEFAULT false NOT NULL,
	"has_underground_parking" boolean DEFAULT false NOT NULL,
	"has_elevator" boolean DEFAULT true NOT NULL,
	"has_playground" boolean DEFAULT true NOT NULL,
	"has_security" boolean DEFAULT true NOT NULL,
	"has_autonomous_heating" boolean DEFAULT true NOT NULL,
	"amenities" jsonb DEFAULT '[]'::jsonb,
	"cover_image_url" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"construction_progress" jsonb DEFAULT '[]'::jsonb,
	"documents" jsonb DEFAULT '[]'::jsonb,
	"video_url" text,
	"views_count" integer DEFAULT 0 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"unit_number" text,
	"type" "unit_type" DEFAULT 'apartment' NOT NULL,
	"rooms_count" integer NOT NULL,
	"total_area" numeric(7, 2) NOT NULL,
	"living_area" numeric(7, 2),
	"kitchen_area" numeric(7, 2),
	"floor" integer NOT NULL,
	"section" text,
	"price_tjs" numeric(14, 2) NOT NULL,
	"price_usd" numeric(14, 2) NOT NULL,
	"price_per_meter_tjs" numeric(12, 2) NOT NULL,
	"price_per_meter_usd" numeric(12, 2) NOT NULL,
	"status" "unit_status" DEFAULT 'available' NOT NULL,
	"finishing" "finishing_type" DEFAULT 'rough' NOT NULL,
	"has_balcony" boolean DEFAULT true NOT NULL,
	"has_terrace" boolean DEFAULT false NOT NULL,
	"window_view" text,
	"bathrooms_count" integer DEFAULT 1 NOT NULL,
	"layout_plan_url" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classifieds" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"deal_type" "deal_type" DEFAULT 'sale' NOT NULL,
	"property_type" "property_type" DEFAULT 'apartment' NOT NULL,
	"status" "classified_status" DEFAULT 'active' NOT NULL,
	"city" "sogd_city" DEFAULT 'khujand' NOT NULL,
	"district" text,
	"address" text NOT NULL,
	"landmark" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"rooms_count" integer,
	"total_area" numeric(7, 2) NOT NULL,
	"living_area" numeric(7, 2),
	"kitchen_area" numeric(7, 2),
	"land_area_sotka" numeric(6, 2),
	"floor" integer,
	"floors_count" integer,
	"building_type" text,
	"renovation" text,
	"has_city_water" boolean DEFAULT true NOT NULL,
	"has_water_hauz" boolean DEFAULT false NOT NULL,
	"has_electricity" boolean DEFAULT true NOT NULL,
	"has_heating" boolean DEFAULT false NOT NULL,
	"has_sewerage" boolean DEFAULT true NOT NULL,
	"is_furnished" boolean DEFAULT false NOT NULL,
	"original_currency" "currency" DEFAULT 'USD' NOT NULL,
	"price_tjs" numeric(14, 2) NOT NULL,
	"price_usd" numeric(14, 2) NOT NULL,
	"is_negotiable" boolean DEFAULT false NOT NULL,
	"exchange_possible" boolean DEFAULT false NOT NULL,
	"contact_name" text NOT NULL,
	"contact_phone" text NOT NULL,
	"contact_phone_secondary" text,
	"contact_whatsapp" text,
	"contact_telegram" text,
	"photos" jsonb DEFAULT '[]'::jsonb,
	"views_count" integer DEFAULT 0 NOT NULL,
	"is_promoted" boolean DEFAULT false NOT NULL,
	"promoted_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "classifieds_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"project_id" text,
	"classified_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_project_fav_unique" UNIQUE("user_id","project_id"),
	CONSTRAINT "user_classified_fav_unique" UNIQUE("user_id","classified_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "developer_members" ADD CONSTRAINT "developer_members_developer_id_developers_id_fk" FOREIGN KEY ("developer_id") REFERENCES "public"."developers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "developer_members" ADD CONSTRAINT "developer_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "developers" ADD CONSTRAINT "developers_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_developer_id_developers_id_fk" FOREIGN KEY ("developer_id") REFERENCES "public"."developers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classifieds" ADD CONSTRAINT "classifieds_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_classified_id_classifieds_id_fk" FOREIGN KEY ("classified_id") REFERENCES "public"."classifieds"("id") ON DELETE cascade ON UPDATE no action;