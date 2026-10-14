CREATE TABLE "classified_analytics" (
	"id" text PRIMARY KEY NOT NULL,
	"classified_id" text NOT NULL,
	"date" text NOT NULL,
	"views_count" integer DEFAULT 0 NOT NULL,
	"phone_views_count" integer DEFAULT 0 NOT NULL,
	"favorites_count" integer DEFAULT 0 NOT NULL,
	"whatsapp_clicks" integer DEFAULT 0 NOT NULL,
	"chat_initiations" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"permissions" jsonb DEFAULT '["read_analytics","auto_import_feed"]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "crm_collections" (
	"id" text PRIMARY KEY NOT NULL,
	"share_code" text NOT NULL,
	"agent_id" text NOT NULL,
	"agent_name" text NOT NULL,
	"agent_phone" text NOT NULL,
	"agent_avatar" text,
	"agent_agency" text,
	"title" text DEFAULT 'Персональная подборка недвижимости' NOT NULL,
	"notes" text,
	"property_ids" text NOT NULL,
	"views_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "crm_collections_share_code_unique" UNIQUE("share_code")
);
--> statement-breakpoint
CREATE TABLE "crm_leads" (
	"id" text PRIMARY KEY NOT NULL,
	"agent_id" text NOT NULL,
	"client_name" text NOT NULL,
	"client_phone" text NOT NULL,
	"classified_id" text,
	"classified_title" text,
	"status" text DEFAULT 'new' NOT NULL,
	"budget" integer DEFAULT 0 NOT NULL,
	"commission" integer DEFAULT 0 NOT NULL,
	"commission_percent" integer DEFAULT 2 NOT NULL,
	"source" text DEFAULT 'website' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "telegram_chat_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "telegram_notifications_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "developers" ADD COLUMN "name_tg" text;--> statement-breakpoint
ALTER TABLE "developers" ADD COLUMN "description_tg" text;--> statement-breakpoint
ALTER TABLE "developers" ADD COLUMN "office_address_tg" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "name_tg" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "description_tg" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "address_tg" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "landmark_tg" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "land_area" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "wall_material" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "facade" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "cadastral_number" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "custom_building_features" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "finishing_features" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "amenities_tg" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "parking_config" jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "parking_spots" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "storage_config" jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "storage_units" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "documents_config" jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "official_documents" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "classifieds" ADD COLUMN "moderation_note" text;--> statement-breakpoint
ALTER TABLE "classified_analytics" ADD CONSTRAINT "classified_analytics_classified_id_classifieds_id_fk" FOREIGN KEY ("classified_id") REFERENCES "public"."classifieds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_classified_id_classifieds_id_fk" FOREIGN KEY ("classified_id") REFERENCES "public"."classifieds"("id") ON DELETE set null ON UPDATE no action;