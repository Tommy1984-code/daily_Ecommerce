-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "title_en" VARCHAR(200) NOT NULL,
    "title_am" VARCHAR(200) NOT NULL,
    "image_url" VARCHAR(500),
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_groups" (
    "id" UUID NOT NULL,
    "title_en" VARCHAR(200) NOT NULL,
    "title_am" VARCHAR(200) NOT NULL,
    "category_id" UUID NOT NULL,
    "image_url" VARCHAR(500),
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "title_en" VARCHAR(200) NOT NULL,
    "title_am" VARCHAR(200) NOT NULL,
    "product_group_id" UUID NOT NULL,
    "image_url" VARCHAR(500),
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "nav_item_no" VARCHAR(50) NOT NULL,
    "title_en" VARCHAR(200) NOT NULL,
    "title_am" VARCHAR(200) NOT NULL,
    "category_id" UUID NOT NULL,
    "product_group_id" UUID NOT NULL,
    "brand_id" UUID NOT NULL,
    "image_url" VARCHAR(500),
    "specification_en" TEXT,
    "specification_am" TEXT,
    "uom" VARCHAR(20),
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("nav_item_no")
);

-- CreateTable
CREATE TABLE "item_prices" (
    "id" UUID NOT NULL,
    "nav_item_no" VARCHAR(50) NOT NULL,
    "branch_id" VARCHAR(50) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "discount_pct" DECIMAL(5,2),
    "valid_from" TIMESTAMP(3),
    "valid_to" TIMESTAMP(3),
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_stock_snapshots" (
    "id" UUID NOT NULL,
    "nav_item_no" VARCHAR(50) NOT NULL,
    "branch_id" VARCHAR(50) NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_stock_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nav_sync_logs" (
    "id" SERIAL NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "rows_synced" INTEGER,
    "status" VARCHAR(20) NOT NULL,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nav_sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "categories_title_en_idx" ON "categories"("title_en");

-- CreateIndex
CREATE INDEX "categories_title_am_idx" ON "categories"("title_am");

-- CreateIndex
CREATE INDEX "product_groups_category_id_idx" ON "product_groups"("category_id");

-- CreateIndex
CREATE INDEX "product_groups_title_en_idx" ON "product_groups"("title_en");

-- CreateIndex
CREATE INDEX "product_groups_title_am_idx" ON "product_groups"("title_am");

-- CreateIndex
CREATE INDEX "brands_product_group_id_idx" ON "brands"("product_group_id");

-- CreateIndex
CREATE INDEX "brands_title_en_idx" ON "brands"("title_en");

-- CreateIndex
CREATE INDEX "brands_title_am_idx" ON "brands"("title_am");

-- CreateIndex
CREATE INDEX "items_category_id_idx" ON "items"("category_id");

-- CreateIndex
CREATE INDEX "items_product_group_id_idx" ON "items"("product_group_id");

-- CreateIndex
CREATE INDEX "items_brand_id_idx" ON "items"("brand_id");

-- CreateIndex
CREATE INDEX "items_title_en_idx" ON "items"("title_en");

-- CreateIndex
CREATE INDEX "items_title_am_idx" ON "items"("title_am");

-- CreateIndex
CREATE INDEX "item_prices_nav_item_no_idx" ON "item_prices"("nav_item_no");

-- CreateIndex
CREATE INDEX "item_prices_branch_id_idx" ON "item_prices"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_prices_nav_item_no_branch_id_key" ON "item_prices"("nav_item_no", "branch_id");

-- CreateIndex
CREATE INDEX "item_stock_snapshots_nav_item_no_idx" ON "item_stock_snapshots"("nav_item_no");

-- CreateIndex
CREATE INDEX "item_stock_snapshots_branch_id_idx" ON "item_stock_snapshots"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_stock_snapshots_nav_item_no_branch_id_key" ON "item_stock_snapshots"("nav_item_no", "branch_id");

-- CreateIndex
CREATE INDEX "nav_sync_logs_status_idx" ON "nav_sync_logs"("status");

-- CreateIndex
CREATE INDEX "nav_sync_logs_started_at_idx" ON "nav_sync_logs"("started_at");

-- AddForeignKey
ALTER TABLE "product_groups" ADD CONSTRAINT "product_groups_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_product_group_id_fkey" FOREIGN KEY ("product_group_id") REFERENCES "product_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_product_group_id_fkey" FOREIGN KEY ("product_group_id") REFERENCES "product_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_prices" ADD CONSTRAINT "item_prices_nav_item_no_fkey" FOREIGN KEY ("nav_item_no") REFERENCES "items"("nav_item_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_stock_snapshots" ADD CONSTRAINT "item_stock_snapshots_nav_item_no_fkey" FOREIGN KEY ("nav_item_no") REFERENCES "items"("nav_item_no") ON DELETE RESTRICT ON UPDATE CASCADE;
