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
ALTER TABLE "brands" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "product_groups" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "featured_image" VARCHAR(500);

-- CreateTable
CREATE TABLE "combo_headers" (
    "id" UUID NOT NULL,
    "nav_item_no" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500),
    "price" DECIMAL(12,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "combo_headers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_lines" (
    "id" UUID NOT NULL,
    "header_id" UUID NOT NULL,
    "nav_item_no" VARCHAR(50) NOT NULL,
    "item_description" VARCHAR(500),
    "quantity" DECIMAL(12,2) NOT NULL,
    "sales_uom" VARCHAR(20),

    CONSTRAINT "combo_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "top_items" (
    "id" UUID NOT NULL,
    "nav_item_no" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "top_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_marks" (
    "code" VARCHAR(50) NOT NULL,
    "title_en" VARCHAR(200) NOT NULL,
    "title_am" VARCHAR(200) NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "land_marks_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "shops" (
    "location_code" VARCHAR(50) NOT NULL,
    "title_en" VARCHAR(200) NOT NULL,
    "title_am" VARCHAR(200) NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("location_code")
);

-- CreateTable
CREATE TABLE "delivery_dates" (
    "id" UUID NOT NULL,
    "title_en" VARCHAR(200) NOT NULL,
    "title_am" VARCHAR(200) NOT NULL,

    CONSTRAINT "delivery_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_ranges" (
    "id" UUID NOT NULL,
    "time_range" VARCHAR(50) NOT NULL,

    CONSTRAINT "time_ranges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_mark_prices" (
    "id" UUID NOT NULL,
    "date_id" UUID NOT NULL,
    "time_range" VARCHAR(50) NOT NULL,
    "land_mark_code" VARCHAR(50) NOT NULL,
    "shop_code" VARCHAR(50) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "land_mark_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "combo_headers_nav_item_no_idx" ON "combo_headers"("nav_item_no");

-- CreateIndex
CREATE INDEX "combo_lines_header_id_idx" ON "combo_lines"("header_id");

-- CreateIndex
CREATE INDEX "combo_lines_nav_item_no_idx" ON "combo_lines"("nav_item_no");

-- CreateIndex
CREATE INDEX "top_items_nav_item_no_idx" ON "top_items"("nav_item_no");

-- CreateIndex
CREATE UNIQUE INDEX "top_items_nav_item_no_key" ON "top_items"("nav_item_no");

-- CreateIndex
CREATE INDEX "land_mark_prices_date_id_idx" ON "land_mark_prices"("date_id");

-- CreateIndex
CREATE INDEX "land_mark_prices_land_mark_code_idx" ON "land_mark_prices"("land_mark_code");

-- CreateIndex
CREATE INDEX "land_mark_prices_shop_code_idx" ON "land_mark_prices"("shop_code");

-- AddForeignKey
ALTER TABLE "combo_headers" ADD CONSTRAINT "combo_headers_nav_item_no_fkey" FOREIGN KEY ("nav_item_no") REFERENCES "items"("nav_item_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_lines" ADD CONSTRAINT "combo_lines_header_id_fkey" FOREIGN KEY ("header_id") REFERENCES "combo_headers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_lines" ADD CONSTRAINT "combo_lines_nav_item_no_fkey" FOREIGN KEY ("nav_item_no") REFERENCES "items"("nav_item_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "top_items" ADD CONSTRAINT "top_items_nav_item_no_fkey" FOREIGN KEY ("nav_item_no") REFERENCES "items"("nav_item_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_mark_prices" ADD CONSTRAINT "land_mark_prices_date_id_fkey" FOREIGN KEY ("date_id") REFERENCES "delivery_dates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_mark_prices" ADD CONSTRAINT "land_mark_prices_land_mark_code_fkey" FOREIGN KEY ("land_mark_code") REFERENCES "land_marks"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_mark_prices" ADD CONSTRAINT "land_mark_prices_shop_code_fkey" FOREIGN KEY ("shop_code") REFERENCES "shops"("location_code") ON DELETE RESTRICT ON UPDATE CASCADE;
