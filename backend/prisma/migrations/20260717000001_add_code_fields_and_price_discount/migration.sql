-- Add code columns as nullable first, backfill, then set NOT NULL + UNIQUE
ALTER TABLE "categories" ADD COLUMN "code" VARCHAR(50);
UPDATE "categories" SET "code" = sub.code FROM (
  SELECT id, 'CAT-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 3, '0') AS code FROM categories
) sub WHERE categories.id = sub.id;
ALTER TABLE "categories" ALTER COLUMN "code" SET NOT NULL;

ALTER TABLE "product_groups" ADD COLUMN "code" VARCHAR(50);
UPDATE "product_groups" SET "code" = sub.code FROM (
  SELECT id, 'PG-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 3, '0') AS code FROM product_groups
) sub WHERE product_groups.id = sub.id;
ALTER TABLE "product_groups" ALTER COLUMN "code" SET NOT NULL;

ALTER TABLE "brands" ADD COLUMN "code" VARCHAR(50);
UPDATE "brands" SET "code" = sub.code FROM (
  SELECT id, 'BR-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 3, '0') AS code FROM brands
) sub WHERE brands.id = sub.id;
ALTER TABLE "brands" ALTER COLUMN "code" SET NOT NULL;

-- Remove discount_pct from item_prices, add price_id
ALTER TABLE "item_prices" DROP COLUMN "discount_pct";
ALTER TABLE "item_prices" ADD COLUMN "price_id" VARCHAR(50);

-- Create separate price_discounts table
CREATE TABLE "price_discounts" (
    "id" UUID NOT NULL,
    "nav_item_no" VARCHAR(50) NOT NULL,
    "discount_pct" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_discounts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "price_discounts_nav_item_no_idx" ON "price_discounts"("nav_item_no");

CREATE UNIQUE INDEX "brands_code_key" ON "brands"("code");
CREATE UNIQUE INDEX "categories_code_key" ON "categories"("code");
CREATE UNIQUE INDEX "product_groups_code_key" ON "product_groups"("code");

ALTER TABLE "price_discounts" ADD CONSTRAINT "price_discounts_nav_item_no_fkey" FOREIGN KEY ("nav_item_no") REFERENCES "items"("nav_item_no") ON DELETE RESTRICT ON UPDATE CASCADE;
