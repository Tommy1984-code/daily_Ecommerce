/*
  Warnings:

  - You are about to drop the column `image_url` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `valid_from` on the `item_prices` table. All the data in the column will be lost.
  - You are about to drop the column `valid_to` on the `item_prices` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `specification_am` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `specification_en` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `product_groups` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "idx_brands_title_am_trgm";

-- DropIndex
DROP INDEX "idx_brands_title_en_trgm";

-- DropIndex
DROP INDEX "idx_categories_title_am_trgm";

-- DropIndex
DROP INDEX "idx_categories_title_en_trgm";

-- DropIndex
DROP INDEX "idx_items_title_am_trgm";

-- DropIndex
DROP INDEX "idx_items_title_en_trgm";

-- DropIndex
DROP INDEX "idx_product_groups_title_am_trgm";

-- DropIndex
DROP INDEX "idx_product_groups_title_en_trgm";

-- AlterTable
ALTER TABLE "brands" RENAME COLUMN "image_url" TO "image";

-- AlterTable
ALTER TABLE "categories" RENAME COLUMN "image_url" TO "image";

-- AlterTable
ALTER TABLE "item_prices" RENAME COLUMN "valid_from" TO "start_date";
ALTER TABLE "item_prices" RENAME COLUMN "valid_to" TO "end_date";
ALTER TABLE "item_prices" ADD COLUMN "customer_no" VARCHAR(50);
ALTER TABLE "item_prices" ADD COLUMN "uom" VARCHAR(20);

-- AlterTable
ALTER TABLE "items" RENAME COLUMN "image_url" TO "image";
ALTER TABLE "items" RENAME COLUMN "specification_en" TO "specifications_en";
ALTER TABLE "items" RENAME COLUMN "specification_am" TO "specifications_am";
ALTER TABLE "items" ADD COLUMN "status" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "product_groups" RENAME COLUMN "image_url" TO "image";

-- Recreate GIN trigram indexes
CREATE INDEX IF NOT EXISTS idx_categories_title_en_trgm ON "categories" USING gin ("title_en" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_categories_title_am_trgm ON "categories" USING gin ("title_am" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_groups_title_en_trgm ON "product_groups" USING gin ("title_en" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_groups_title_am_trgm ON "product_groups" USING gin ("title_am" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_brands_title_en_trgm ON "brands" USING gin ("title_en" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_brands_title_am_trgm ON "brands" USING gin ("title_am" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_items_title_en_trgm ON "items" USING gin ("title_en" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_items_title_am_trgm ON "items" USING gin ("title_am" gin_trgm_ops);
