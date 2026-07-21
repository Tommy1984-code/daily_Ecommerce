import api from "./api";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface Category {
  id: string;
  categoryId: string;
  titleEn: string;
  titleAm: string;
  image: string | null;
  productGroupCount: number;
  syncedAt: string;
}

export interface ProductGroup {
  id: string;
  productId: string;
  titleEn: string;
  titleAm: string;
  categoryId: string;
  categoryTitleEn: string;
  categoryTitleAm: string;
  image: string | null;
  brandCount: number;
  syncedAt: string;
}

export interface Brand {
  id: string;
  brandId: string;
  titleEn: string;
  titleAm: string;
  productId: string;
  productGroupTitleEn: string;
  productGroupTitleAm: string;
  categoryTitleEn: string;
  categoryTitleAm: string;
  image: string | null;
  itemCount: number;
  syncedAt: string;
}

export interface ItemPrice {
  priceId: string | null;
  branchId: string;
  uom: string | null;
  price: number;
  startDate: string | null;
  endDate: string | null;
  customerNo: string | null;
}

export interface ItemStock {
  branchId: string;
  qty: number;
  syncedAt: string;
}

export interface Item {
  itemId: string;
  titleEn: string;
  titleAm: string;
  categoryId: string;
  productId: string;
  brandId: string;
  image: string | null;
  specificationsEn: string | null;
  specificationsAm: string | null;
  salesUom: string | null;
  status: number;
  categoryTitleEn: string;
  productGroupTitleEn: string;
  brandTitleEn: string;
  prices?: ItemPrice[];
  stockSnapshots?: ItemStock[];
  syncedAt: string;
  stalenessNote: string;
}

export async function getCategories(
  page = 1,
  limit = 20,
  q?: string,
): Promise<PaginatedResponse<Category>> {
  const params: Record<string, string | number> = { page, limit };
  if (q) params.q = q;
  const res = await api.get("/v1/product/categories", { params });
  return res.data;
}

export async function getCategoryGroups(
  categoryId: string,
  page = 1,
  limit = 20,
  q?: string,
): Promise<PaginatedResponse<ProductGroup>> {
  const params: Record<string, string | number> = { page, limit };
  if (q) params.q = q;
  const res = await api.get(`/v1/product/categories/${categoryId}/groups`, { params });
  return res.data;
}

export async function getGroupBrands(
  groupId: string,
  page = 1,
  limit = 20,
  q?: string,
): Promise<PaginatedResponse<Brand>> {
  const params: Record<string, string | number> = { page, limit };
  if (q) params.q = q;
  const res = await api.get(`/v1/product/groups/${groupId}/brands`, { params });
  return res.data;
}

export async function getAllGroups(page = 1, limit = 20, q?: string): Promise<PaginatedResponse<ProductGroup>> {
  const params: Record<string, string | number> = { page, limit };
  if (q) params.q = q;
  const res = await api.get("/v1/product/groups", { params });
  return res.data;
}

export async function getAllBrands(page = 1, limit = 20, q?: string): Promise<PaginatedResponse<Brand>> {
  const params: Record<string, string | number> = { page, limit };
  if (q) params.q = q;
  const res = await api.get("/v1/product/brands", { params });
  return res.data;
}

export async function getItems(params: {
  page?: number;
  limit?: number;
  q?: string;
  categoryId?: string;
  productId?: string;
  brandId?: string;
}): Promise<PaginatedResponse<Item>> {
  const cleanParams: Record<string, string | number> = {};
  if (params.page) cleanParams.page = params.page;
  if (params.limit) cleanParams.limit = params.limit;
  if (params.q) cleanParams.q = params.q;
  if (params.categoryId) cleanParams.categoryId = params.categoryId;
  if (params.productId) cleanParams.productId = params.productId;
  if (params.brandId) cleanParams.brandId = params.brandId;
  const res = await api.get("/v1/product/items", { params: cleanParams });
  return res.data;
}

export async function getItemByItemId(itemId: string): Promise<Item> {
  const res = await api.get(`/v1/product/items/${itemId}`);
  return res.data;
}

// Price
export interface ItemPriceRecord {
  id: string;
  priceId: string | null;
  itemId: string;
  titleEn: string;
  titleAm: string;
  branchId: string;
  uom: string | null;
  price: number;
  startDate: string | null;
  endDate: string | null;
  customerNo: string | null;
}

export async function getPrices(page = 1, limit = 20, q?: string): Promise<PaginatedResponse<ItemPriceRecord>> {
  const params: Record<string, string | number> = { page, limit };
  if (q) params.q = q;
  const res = await api.get("/v1/product/prices", { params });
  return res.data;
}

// Discount
export interface DiscountRecord {
  id: string;
  itemId: string;
  titleEn: string;
  titleAm?: string;
  uom?: string;
  discountPer: number;
  createdAt: string;
}

export async function getDiscounts(page = 1, limit = 20): Promise<PaginatedResponse<DiscountRecord>> {
  const params: Record<string, string | number> = { page, limit };
  const res = await api.get("/v1/product/discounts", { params });
  return res.data;
}

// Combo
export interface ComboLine {
  id: string;
  headerNumber: string;
  itemId: string;
  titleEn: string;
  itemDescription: string | null;
  quantity: number;
  uom: string | null;
}

export interface ComboHeader {
  id: string;
  itemId: string;
  titleEn: string;
  description: string | null;
  price: number;
  active: boolean;
  lineCount: number;
  lines?: ComboLine[];
  createdAt: string;
}

export async function getCombos(page = 1, limit = 20): Promise<PaginatedResponse<ComboHeader>> {
  const res = await api.get("/v1/product/combos", { params: { page, limit } });
  return res.data;
}

export async function getComboById(id: string): Promise<ComboHeader> {
  const res = await api.get(`/v1/product/combos/${id}`);
  return res.data;
}

export async function createCombo(data: { itemId: string; price: number; active?: boolean; lines: { itemId: string; itemDescription: string; quantity: number }[] }): Promise<ComboHeader> {
  const res = await api.post("/v1/product/combos", data);
  return res.data;
}

export async function deleteCombo(id: string): Promise<void> {
  await api.delete(`/v1/product/combos/${id}`);
}

export async function updateCombo(
  id: string,
  data: { price?: number; active?: boolean; lines?: { id?: string; itemId: string; itemDescription?: string; quantity: number; uom?: string }[] }
): Promise<ComboHeader> {
  const res = await api.patch(`/v1/product/combos/${id}`, data);
  return res.data;
}

// Top Item
export interface TopItemRecord {
  id: string;
  itemId: string;
  titleEn: string;
  titleAm: string;
  image: string | null;
  createdAt: string;
}

export async function getTopItems(): Promise<TopItemRecord[]> {
  const res = await api.get("/v1/product/top-items");
  return res.data;
}

export async function addTopItem(itemId: string): Promise<TopItemRecord> {
  const res = await api.post("/v1/product/top-items", { itemId });
  return res.data;
}

export async function deleteTopItem(id: string): Promise<void> {
  await api.delete(`/v1/product/top-items/${id}`);
}

// Land Mark
export interface LandMark {
  code: string;
  titleEn: string;
  titleAm: string;
  latitude: number | null;
  longitude: number | null;
}

export interface Shop {
  locationCode: string;
  titleEn: string;
  titleAm: string;
  latitude: number | null;
  longitude: number | null;
}

export interface DeliveryDate {
  id: string;
  titleEn: string;
  titleAm: string;
}

export interface TimeRange {
  id: string;
  timeRange: string;
}

export interface LandMarkPriceRecord {
  id: string;
  dateId: string;
  dateTitleEn: string;
  dateTitleAm: string;
  timeRange: string;
  landMarkCode: string;
  landMarkTitleEn: string;
  landMarkTitleAm: string;
  landMarkLatitude: number | null;
  landMarkLongitude: number | null;
  shopCode: string;
  shopTitleEn: string;
  shopTitleAm: string;
  price: number;
}

export async function getLandMarks(): Promise<LandMark[]> {
  const res = await api.get("/v1/product/land-marks");
  return res.data;
}

export async function getShops(): Promise<Shop[]> {
  const res = await api.get("/v1/product/shops");
  return res.data;
}

export async function getDeliveryDates(): Promise<DeliveryDate[]> {
  const res = await api.get("/v1/product/delivery-dates");
  return res.data;
}

export async function getTimeRanges(): Promise<TimeRange[]> {
  const res = await api.get("/v1/product/time-ranges");
  return res.data;
}

export async function getLandMarkPrices(page = 1, limit = 20): Promise<PaginatedResponse<LandMarkPriceRecord>> {
  const res = await api.get("/v1/product/land-mark-prices", { params: { page, limit } });
  return res.data;
}

export async function createLandMarkPrice(data: { dateId: string; timeRange: string; landMarkCode: string; shopCode: string; price: number }): Promise<void> {
  await api.post("/v1/product/land-mark-prices", data);
}

export async function deleteLandMarkPrice(id: string): Promise<void> {
  await api.delete(`/v1/product/land-mark-prices/${id}`);
}

// Image update functions
export async function updateCategoryImage(id: string, image: string): Promise<Category> {
  const res = await api.patch(`/v1/product/categories/${id}/image`, { image });
  return res.data;
}

export async function updateProductGroupImage(id: string, image: string): Promise<ProductGroup> {
  const res = await api.patch(`/v1/product/groups/${id}/image`, { image });
  return res.data;
}

export async function updateBrandImage(id: string, image: string): Promise<Brand> {
  const res = await api.patch(`/v1/product/brands/${id}/image`, { image });
  return res.data;
}

// Delete functions
export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/v1/product/categories/${id}`);
}

export async function deleteProductGroup(id: string): Promise<void> {
  await api.delete(`/v1/product/groups/${id}`);
}

export async function deleteBrand(id: string): Promise<void> {
  await api.delete(`/v1/product/brands/${id}`);
}

// Featured Categories
export interface FeaturedCategory {
  id: string;
  productId: string;
  titleEn: string;
  titleAm: string;
  image: string | null;
  featuredImage: string | null;
  brandCount: number;
  brands: { id: string; brandId: string; titleEn: string; titleAm: string; featured: boolean }[];
}

export async function getFeaturedCategories(page = 1, limit = 10, q?: string): Promise<PaginatedResponse<FeaturedCategory>> {
  const res = await api.get("/v1/product/featured-categories", { params: { page, limit, q } });
  return res.data;
}

export async function createFeaturedCategory(data: { productId: string; featuredImage?: string; brandIds: string[] }): Promise<FeaturedCategory> {
  const res = await api.post("/v1/product/featured-categories", data);
  return res.data;
}

export async function updateFeaturedBanner(id: string, featuredImage: string): Promise<void> {
  await api.patch(`/v1/product/featured-categories/${id}/banner`, { featuredImage });
}

export async function toggleFeaturedBrand(productId: string, brandId: string, featured: boolean): Promise<void> {
  await api.patch(`/v1/product/featured-categories/${productId}/toggle-featured`, { brandId, featured });
}

export async function toggleFeaturedCategory(id: string): Promise<void> {
  await api.patch(`/v1/product/featured-categories/${id}/toggle`, {});
}

export async function updateItem(
  itemId: string,
  data: { image?: string; specificationsEn?: string; specificationsAm?: string },
): Promise<Item> {
  const res = await api.patch(`/v1/product/items/${itemId}`, data);
  return res.data;
}

export async function deleteItem(itemId: string): Promise<void> {
  await api.delete(`/v1/product/items/${itemId}`);
}

export async function importItems(file: File): Promise<{ imported: number; errors: string[] }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/v1/product/items/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
