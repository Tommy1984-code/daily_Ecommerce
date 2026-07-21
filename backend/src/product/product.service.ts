import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from './dto/pagination.dto';
import type { PaginatedResponse } from './dto/pagination.dto';
import type { ItemsQueryDto } from './dto/product-query.dto';
import type { CategoryResponseDto } from './dto/category-response.dto';
import type { ProductGroupResponseDto } from './dto/product-group-response.dto';
import type { BrandResponseDto } from './dto/brand-response.dto';
import type { UpdateItemDto } from './dto/update-item.dto';
import type { ItemResponseDto, ItemSearchResultDto } from './dto/item-response.dto';
import { Multer } from 'multer';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCategories(page = 1, limit = 20, q?: string): Promise<PaginatedResponse<CategoryResponseDto>> {
    const where: Prisma.CategoryWhereInput = {};
    if (q) {
      where.OR = [
        { titleEn: { contains: q, mode: 'insensitive' } },
        { titleAm: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { titleEn: 'asc' },
        include: { _count: { select: { productGroups: true } } },
      }),
      this.prisma.category.count({ where }),
    ]);

    return paginate(
      data.map((c) => ({
        id: c.id,
        categoryId: c.categoryId,
        titleEn: c.titleEn,
        titleAm: c.titleAm,
        image: c.image,
        productGroupCount: c._count.productGroups,
        syncedAt: c.syncedAt.toISOString(),
      })),
      total,
      page,
      limit,
    );
  }

  async findAllGroups(page = 1, limit = 20, q?: string): Promise<PaginatedResponse<ProductGroupResponseDto>> {
    const where: Prisma.ProductGroupWhereInput = {};
    if (q) {
      where.OR = [
        { titleEn: { contains: q, mode: 'insensitive' } },
        { titleAm: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.productGroup.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { titleEn: 'asc' },
        include: {
          category: { select: { titleEn: true, titleAm: true } },
          _count: { select: { brands: true } },
        },
      }),
      this.prisma.productGroup.count({ where }),
    ]);

    return paginate(
      data.map((g) => ({
        id: g.id,
        productId: g.productId,
        titleEn: g.titleEn,
        titleAm: g.titleAm,
        categoryId: g.categoryId,
        categoryTitleEn: g.category.titleEn,
        categoryTitleAm: g.category.titleAm,
        image: g.image,
        brandCount: g._count.brands,
        syncedAt: g.syncedAt.toISOString(),
      })),
      total,
      page,
      limit,
    );
  }

  async findProductGroupsByCategory(
    categoryId: string,
    page = 1,
    limit = 20,
    q?: string,
  ): Promise<PaginatedResponse<ProductGroupResponseDto>> {
    const where: Prisma.ProductGroupWhereInput = { categoryId };
    if (q) {
      where.OR = [
        { titleEn: { contains: q, mode: 'insensitive' } },
        { titleAm: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.productGroup.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { titleEn: 'asc' },
        include: {
          category: { select: { titleEn: true, titleAm: true } },
          _count: { select: { brands: true } },
        },
      }),
      this.prisma.productGroup.count({ where }),
    ]);

    return paginate(
      data.map((g) => ({
        id: g.id,
        productId: g.productId,
        titleEn: g.titleEn,
        titleAm: g.titleAm,
        categoryId: g.categoryId,
        categoryTitleEn: g.category.titleEn,
        categoryTitleAm: g.category.titleAm,
        image: g.image,
        brandCount: g._count.brands,
        syncedAt: g.syncedAt.toISOString(),
      })),
      total,
      page,
      limit,
    );
  }

  async findAllBrands(page = 1, limit = 20, q?: string): Promise<PaginatedResponse<BrandResponseDto>> {
    const where: Prisma.BrandWhereInput = {};
    if (q) {
      where.OR = [
        { titleEn: { contains: q, mode: 'insensitive' } },
        { titleAm: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { titleEn: 'asc' },
        include: {
          productGroup: {
            select: { titleEn: true, titleAm: true, category: { select: { titleEn: true, titleAm: true } } },
          },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.brand.count({ where }),
    ]);

    return paginate(
      data.map((b) => ({
        id: b.id,
        brandId: b.brandId,
        titleEn: b.titleEn,
        titleAm: b.titleAm,
        productId: b.productId,
        productGroupTitleEn: b.productGroup.titleEn,
        productGroupTitleAm: b.productGroup.titleAm,
        categoryTitleEn: b.productGroup.category.titleEn,
        categoryTitleAm: b.productGroup.category.titleAm,
        image: b.image,
        itemCount: b._count.items,
        syncedAt: b.syncedAt.toISOString(),
      })),
      total,
      page,
      limit,
    );
  }

  async findBrandsByProductGroup(
    productId: string,
    page = 1,
    limit = 20,
    q?: string,
  ): Promise<PaginatedResponse<BrandResponseDto>> {
    const where: Prisma.BrandWhereInput = { productId };
    if (q) {
      where.OR = [
        { titleEn: { contains: q, mode: 'insensitive' } },
        { titleAm: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { titleEn: 'asc' },
        include: {
          productGroup: {
            select: { titleEn: true, titleAm: true, category: { select: { titleEn: true, titleAm: true } } },
          },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.brand.count({ where }),
    ]);

    return paginate(
      data.map((b) => ({
        id: b.id,
        brandId: b.brandId,
        titleEn: b.titleEn,
        titleAm: b.titleAm,
        productId: b.productId,
        productGroupTitleEn: b.productGroup.titleEn,
        productGroupTitleAm: b.productGroup.titleAm,
        categoryTitleEn: b.productGroup.category.titleEn,
        categoryTitleAm: b.productGroup.category.titleAm,
        image: b.image,
        itemCount: b._count.items,
        syncedAt: b.syncedAt.toISOString(),
      })),
      total,
      page,
      limit,
    );
  }

  async findAllItems(query: ItemsQueryDto): Promise<PaginatedResponse<ItemResponseDto>> {
    const { page = 1, limit = 20, q, categoryId, productId, brandId } = query;

    const where: Prisma.ItemWhereInput = {};
    if (q) {
      where.OR = [
        { itemId: { contains: q, mode: 'insensitive' } },
        { titleEn: { contains: q, mode: 'insensitive' } },
        { titleAm: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (productId) where.productId = productId;
    if (brandId) where.brandId = brandId;

    const [data, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { titleEn: 'asc' },
        include: {
          category: { select: { titleEn: true } },
          productGroup: { select: { titleEn: true } },
          brand: { select: { titleEn: true } },
          prices: {
            where: {
              startDate: { lte: new Date() },
              endDate: { gte: new Date() },
              customerNo: { startsWith: 'SCO' },
            },
            take: 1,
            orderBy: { endDate: { sort: 'desc', nulls: 'last' } },
            select: { priceId: true, branchId: true, uom: true, price: true, startDate: true, endDate: true, customerNo: true },
          },
        },
      }),
      this.prisma.item.count({ where }),
    ]);

    return paginate(
      data.map((item) => ({
        itemId: item.itemId,
        titleEn: item.titleEn,
        titleAm: item.titleAm,
        categoryId: item.categoryId,
        productId: item.productId,
        brandId: item.brandId,
        image: item.image,
        specificationsEn: item.specificationsEn,
        specificationsAm: item.specificationsAm,
        salesUom: item.prices[0]?.uom ?? item.salesUom,
        status: item.status,
        categoryTitleEn: item.category.titleEn,
        productGroupTitleEn: item.productGroup.titleEn,
        brandTitleEn: item.brand.titleEn,
        prices: item.prices.map((p) => ({
          priceId: p.priceId,
          branchId: p.branchId,
          uom: p.uom,
          price: Number(p.price),
          startDate: p.startDate?.toISOString() ?? null,
          endDate: p.endDate?.toISOString() ?? null,
          customerNo: p.customerNo,
        })),
        stockSnapshots: [],
        syncedAt: item.syncedAt.toISOString(),
        stalenessNote: this.buildStalenessNote(item.syncedAt),
      })),
      total,
      page,
      limit,
    );
  }

  async findItemByItemId(itemId: string): Promise<ItemResponseDto | null> {
    const item = await this.prisma.item.findUnique({
      where: { itemId },
      include: {
        category: { select: { titleEn: true } },
        productGroup: { select: { titleEn: true } },
        brand: { select: { titleEn: true } },
        prices: {
          select: { priceId: true, branchId: true, uom: true, price: true, startDate: true, endDate: true, customerNo: true },
          orderBy: { branchId: 'asc' },
        },
        stockSnapshots: {
          select: { branchId: true, qty: true, syncedAt: true },
          orderBy: { branchId: 'asc' },
        },
      },
    });

    if (!item) return null;

    return {
      itemId: item.itemId,
      titleEn: item.titleEn,
      titleAm: item.titleAm,
      categoryId: item.categoryId,
      productId: item.productId,
      brandId: item.brandId,
      image: item.image,
      specificationsEn: item.specificationsEn,
      specificationsAm: item.specificationsAm,
      salesUom: item.salesUom,
      status: item.status,
      categoryTitleEn: item.category.titleEn,
      productGroupTitleEn: item.productGroup.titleEn,
      brandTitleEn: item.brand.titleEn,
      prices: item.prices.map((p) => ({
        priceId: p.priceId,
        branchId: p.branchId,
        uom: p.uom,
        price: Number(p.price),
        startDate: p.startDate?.toISOString() ?? null,
        endDate: p.endDate?.toISOString() ?? null,
        customerNo: p.customerNo,
      })),
      stockSnapshots: item.stockSnapshots.map((s) => ({
        branchId: s.branchId,
        qty: s.qty,
        syncedAt: s.syncedAt.toISOString(),
      })),
      syncedAt: item.syncedAt.toISOString(),
      stalenessNote: this.buildStalenessNote(item.syncedAt),
    };
  }

  async searchItems(q: string, page = 1, limit = 20): Promise<PaginatedResponse<ItemSearchResultDto>> {
    const minScore = 0.2;

    const searchResults = await this.prisma.$queryRaw<
      Array<{ nav_item_no: string; title_en: string; title_am: string; image: string | null; uom: string | null; category_title_en: string; product_group_title_en: string; brand_title_en: string; synced_at: Date; price: number | null; similarity: number }>
    >`
      SELECT
        i.nav_item_no,
        i.title_en,
        i.title_am,
        i.image,
        i.uom,
        c.title_en AS category_title_en,
        pg.title_en AS product_group_title_en,
        b.title_en AS brand_title_en,
        i.synced_at,
        ip.price,
        GREATEST(
          similarity(i.title_en, ${q}),
          similarity(i.title_am, ${q})
        ) AS similarity
      FROM items i
      LEFT JOIN categories c ON c.id = i.category_id
      LEFT JOIN product_groups pg ON pg.id = i.product_group_id
      LEFT JOIN brands b ON b.id = i.brand_id
      LEFT JOIN LATERAL (
        SELECT price FROM item_prices
        WHERE nav_item_no = i.nav_item_no
          AND (end_date IS NULL OR end_date >= NOW())
        ORDER BY end_date DESC NULLS LAST
        LIMIT 1
      ) ip ON true
      WHERE i.title_en % ${q} OR i.title_am % ${q}
      ORDER BY similarity DESC
      LIMIT ${limit}
      OFFSET ${(page - 1) * limit}
    `;

    const countResult = await this.prisma.$queryRaw<Array<{ total: bigint }>>`
      SELECT COUNT(*) as total
      FROM items i
      WHERE i.title_en % ${q} OR i.title_am % ${q}
    `;

    const total = Number(countResult[0]?.total ?? 0);

    return paginate(
      searchResults.map((r) => ({
        itemId: r.nav_item_no,
        titleEn: r.title_en,
        titleAm: r.title_am,
        price: r.price ? Number(r.price) : null,
        image: r.image,
        salesUom: r.uom,
        categoryTitleEn: r.category_title_en,
        productGroupTitleEn: r.product_group_title_en,
        brandTitleEn: r.brand_title_en,
        syncedAt: r.synced_at.toISOString(),
      })),
      total,
      page,
      limit,
    );
  }

  private buildStalenessNote(syncedAt: Date): string {
    const minutes = Math.floor((Date.now() - syncedAt.getTime()) / 60000);
    if (minutes < 1) return 'Just updated';
    if (minutes < 60) return `Updated ${minutes} minutes ago — confirm with branch`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago — confirm with branch`;
    return `Updated ${Math.floor(hours / 24)} days ago — may be outdated`;
  }

  async updateCategoryImage(id: string, image: string | null): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.update({
      where: { id },
      data: { image },
    });
    return {
      id: category.id,
      categoryId: category.categoryId,
      titleEn: category.titleEn,
      titleAm: category.titleAm,
      image: category.image,
      productGroupCount: 0,
      syncedAt: category.syncedAt.toISOString(),
    };
  }

  async updateProductGroupImage(id: string, image: string | null): Promise<ProductGroupResponseDto> {
    const group = await this.prisma.productGroup.update({
      where: { id },
      data: { image },
      include: { category: { select: { titleEn: true, titleAm: true } } },
    });
    return {
      id: group.id,
      productId: group.productId,
      titleEn: group.titleEn,
      titleAm: group.titleAm,
      categoryId: group.categoryId,
      categoryTitleEn: group.category.titleEn,
      categoryTitleAm: group.category.titleAm,
      image: group.image,
      brandCount: 0,
      syncedAt: group.syncedAt.toISOString(),
    };
  }

  async updateBrandImage(id: string, image: string | null): Promise<BrandResponseDto> {
    const brand = await this.prisma.brand.update({
      where: { id },
      data: { image },
      include: {
        productGroup: {
          select: { titleEn: true, titleAm: true, category: { select: { titleEn: true, titleAm: true } } },
        },
      },
    });
    return {
      id: brand.id,
      brandId: brand.brandId,
      titleEn: brand.titleEn,
      titleAm: brand.titleAm,
      productId: brand.productId,
      productGroupTitleEn: brand.productGroup.titleEn,
      productGroupTitleAm: brand.productGroup.titleAm,
      categoryTitleEn: brand.productGroup.category.titleEn,
      categoryTitleAm: brand.productGroup.category.titleAm,
      image: brand.image,
      itemCount: 0,
      syncedAt: brand.syncedAt.toISOString(),
    };
  }

  async deleteCategory(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  async deleteProductGroup(id: string): Promise<void> {
    await this.prisma.productGroup.delete({ where: { id } });
  }

  async deleteBrand(id: string): Promise<void> {
    await this.prisma.brand.delete({ where: { id } });
  }

  async updateItem(itemId: string, dto: UpdateItemDto): Promise<ItemResponseDto | null> {
    const data: Record<string, string> = {};
    if (dto.image !== undefined) data.image = dto.image;
    if (dto.specificationsEn !== undefined) data.specificationsEn = dto.specificationsEn;
    if (dto.specificationsAm !== undefined) data.specificationsAm = dto.specificationsAm;

    if (Object.keys(data).length === 0) return this.findItemByItemId(itemId);

    try {
      await this.prisma.item.update({
        where: { itemId },
        data,
      });
    } catch {
      return null;
    }

    return this.findItemByItemId(itemId);
  }

  async deleteItem(itemId: string): Promise<void> {
    await this.prisma.itemPrice.deleteMany({ where: { itemId } });
    await this.prisma.itemStockSnapshot.deleteMany({ where: { itemId } });
    await this.prisma.item.delete({ where: { itemId } });
  }

  async importItems(file: Multer.File): Promise<{ imported: number; errors: string[] }> {
    const buffer = file.buffer.toString('utf-8');
    const lines = buffer.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) return { imported: 0, errors: ['File must have header and at least one data row'] };

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const requiredHeaders = ['item_id', 'category_id', 'product_group_id', 'brand_id', 'title_en'];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return { imported: 0, errors: [`Missing required columns: ${missingHeaders.join(', ')}`] };
    }

    const errors: string[] = [];
    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      if (values.length < headers.length) continue;

      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ''; });

      try {
        const category = await this.prisma.category.findUnique({ where: { id: row.category_id } });
        const productGroup = await this.prisma.productGroup.findUnique({ where: { id: row.product_group_id } });
        const brand = await this.prisma.brand.findUnique({ where: { id: row.brand_id } });

        if (!category) throw new Error(`Category not found: ${row.category_id}`);
        if (!productGroup) throw new Error(`Product Group not found: ${row.product_group_id}`);
        if (!brand) throw new Error(`Brand not found: ${row.brand_id}`);
        if (!row.title_en) throw new Error('Title EN is required');

        await this.prisma.item.upsert({
          where: { itemId: row.item_id },
          update: {
            titleEn: row.title_en,
            titleAm: row.title_am || undefined,
            categoryId: row.category_id,
            productId: row.product_group_id,
            brandId: row.brand_id,
            image: row.image || undefined,
            specificationsEn: row.specifications_en || undefined,
            specificationsAm: row.specifications_am || undefined,
            salesUom: row.uom || undefined,
            status: row.status ? parseInt(row.status, 10) : 1,
          },
          create: {
            itemId: row.item_id,
            titleEn: row.title_en,
            titleAm: row.title_am || '',
            categoryId: row.category_id,
            productId: row.product_group_id,
            brandId: row.brand_id,
            image: row.image || undefined,
            specificationsEn: row.specifications_en || undefined,
            specificationsAm: row.specifications_am || undefined,
            salesUom: row.uom || undefined,
            status: row.status ? parseInt(row.status, 10) : 1,
          },
        });
        imported++;
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    return { imported, errors };
  }
}
