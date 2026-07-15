-- Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Category search index
CREATE INDEX IF NOT EXISTS idx_categories_title_en_trgm ON "categories" USING GIN ("title_en" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_categories_title_am_trgm ON "categories" USING GIN ("title_am" gin_trgm_ops);

-- ProductGroup search index
CREATE INDEX IF NOT EXISTS idx_product_groups_title_en_trgm ON "product_groups" USING GIN ("title_en" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_groups_title_am_trgm ON "product_groups" USING GIN ("title_am" gin_trgm_ops);

-- Brand search index
CREATE INDEX IF NOT EXISTS idx_brands_title_en_trgm ON "brands" USING GIN ("title_en" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_brands_title_am_trgm ON "brands" USING GIN ("title_am" gin_trgm_ops);

-- Item search index (most important for product search)
CREATE INDEX IF NOT EXISTS idx_items_title_en_trgm ON "items" USING GIN ("title_en" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_items_title_am_trgm ON "items" USING GIN ("title_am" gin_trgm_ops);
