CREATE TYPE "public"."payment_method" AS ENUM('card', 'qr', 'wallet', 'installment_salom');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('korti_milli', 'dushanbe_city', 'alif_mobi', 'eskhata_online', 'visa_mastercard');--> statement-breakpoint
CREATE TYPE "public"."payment_purpose" AS ENUM('ad_balance', 'ad_sponsorship', 'classified_top', 'classified_highlight', 'classified_urgent', 'classified_turbo', 'unit_booking');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded');--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'agency' BEFORE 'admin';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'agency_agent' BEFORE 'admin';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'super_admin';--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"user_role" text NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"status" text NOT NULL,
	"details" jsonb DEFAULT '{}'::jsonb,
	"error_message" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ad_advertisers" (
	"id" text PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"brand_name" text NOT NULL,
	"tin" text,
	"contact_person" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"website_url" text,
	"logo_url" text,
	"industry" text DEFAULT 'other' NOT NULL,
	"tier" text DEFAULT 'auction_bidder' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"balance_tjs" integer DEFAULT 0 NOT NULL,
	"balance_usd" integer DEFAULT 0 NOT NULL,
	"total_spent_tjs" integer DEFAULT 0 NOT NULL,
	"total_spent_usd" integer DEFAULT 0 NOT NULL,
	"user_id" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ad_campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"advertiser_id" text NOT NULL,
	"name" text NOT NULL,
	"billing_model" text DEFAULT 'auction_cpm' NOT NULL,
	"bid_amount_tjs" numeric(10, 2) DEFAULT '15.00' NOT NULL,
	"bid_amount_usd" numeric(10, 2) DEFAULT '1.40' NOT NULL,
	"total_budget_tjs" integer DEFAULT 0 NOT NULL,
	"daily_limit_tjs" integer DEFAULT 0 NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"geo_targeting" jsonb DEFAULT '["all"]'::jsonb NOT NULL,
	"category_targeting" jsonb DEFAULT '["all"]'::jsonb NOT NULL,
	"placement_slots" jsonb DEFAULT '["catalog_banner"]'::jsonb NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"impressions_count" integer DEFAULT 0 NOT NULL,
	"clicks_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ad_creatives" (
	"id" text PRIMARY KEY NOT NULL,
	"campaignId" text NOT NULL,
	"title_ru" text NOT NULL,
	"title_tg" text NOT NULL,
	"subtitle_ru" text,
	"subtitle_tg" text,
	"badge_text_ru" text,
	"badge_text_tg" text,
	"cta_text_ru" text DEFAULT 'Узнать больше' NOT NULL,
	"cta_text_tg" text DEFAULT 'Маълумоти бештар' NOT NULL,
	"target_url" text NOT NULL,
	"banner_image_url" text,
	"mobile_image_url" text,
	"action_type" text DEFAULT 'link' NOT NULL,
	"phone" text,
	"whatsapp" text,
	"bg_color_hex" text DEFAULT '#064e3b',
	"text_color_hex" text DEFAULT '#ffffff',
	"accent_color_hex" text DEFAULT '#10b981',
	"is_active" boolean DEFAULT true NOT NULL,
	"impressions_count" integer DEFAULT 0 NOT NULL,
	"clicks_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ad_tracking_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text NOT NULL,
	"creative_id" text NOT NULL,
	"event_type" text NOT NULL,
	"city" text DEFAULT 'khujand',
	"category" text DEFAULT 'all',
	"slot" text DEFAULT 'catalog_banner',
	"user_agent" text,
	"ip_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"advertiser_id" text,
	"classified_id" text,
	"unit_id" text,
	"amount_tjs" integer NOT NULL,
	"amount_usd" integer NOT NULL,
	"currency" text DEFAULT 'TJS' NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"method" "payment_method" NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"purpose" "payment_purpose" NOT NULL,
	"description_ru" text NOT NULL,
	"description_tg" text NOT NULL,
	"payer_phone" text NOT NULL,
	"payer_name" text,
	"payer_email" text,
	"external_transaction_id" text,
	"payment_url" text,
	"qr_code_data" text,
	"otp_code" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payment_webhooks_log" (
	"id" text PRIMARY KEY NOT NULL,
	"transaction_id" text,
	"provider" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"signature" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "classifieds" ADD COLUMN "attributes" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "ad_advertisers" ADD CONSTRAINT "ad_advertisers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_campaigns" ADD CONSTRAINT "ad_campaigns_advertiser_id_ad_advertisers_id_fk" FOREIGN KEY ("advertiser_id") REFERENCES "public"."ad_advertisers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_creatives" ADD CONSTRAINT "ad_creatives_campaignId_ad_campaigns_id_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."ad_campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_advertiser_id_ad_advertisers_id_fk" FOREIGN KEY ("advertiser_id") REFERENCES "public"."ad_advertisers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_classified_id_classifieds_id_fk" FOREIGN KEY ("classified_id") REFERENCES "public"."classifieds"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_payment_status" ON "payment_transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_payment_user" ON "payment_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_payment_advertiser" ON "payment_transactions" USING btree ("advertiser_id");--> statement-breakpoint
CREATE INDEX "idx_payment_provider" ON "payment_transactions" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "idx_payment_created_at" ON "payment_transactions" USING btree ("created_at");