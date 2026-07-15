import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from './dto/pagination.dto';
import type { PaginatedResponse } from './dto/pagination.dto';
import type { ItemsQueryDto } from './dto/product-query.dto';
import type { CategoryResponseDto } from './dto/category-response.dto';
import type { ProductGroupResponseDto } from './dto/product-group-response.dto';
import type { BrandResponseDto } from './dto/brand-response.dto';
import type { ItemResponseDto, ItemSearchResultDto } from './dto/item-response.dto';
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
        titleEn: b.titleEn,
        titleAm: b.titleAm,
        productGroupId: b.productGroupId,
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
    productGroupId: string,
    page = 1,
    limit = 20,
    q?: string,
  ): Promise<PaginatedResponse<BrandResponseDto>> {
    const where: Prisma.BrandWhereInput = { productGroupId };
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
        titleEn: b.titleEn,
        titleAm: b.titleAm,
        productGroupId: b.productGroupId,
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
    const { page = 1, limit = 20, q, categoryId, productGroupId, brandId } = query;

    const where: Prisma.ItemWhereInput = {};
    if (q) {
      where.OR = [
        { titleEn: { contains: q, mode: 'insensitive' } },
        { titleAm: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (productGroupId) where.productGroupId = productGroupId;
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
        },
      }),
      this.prisma.item.count({ where }),
    ]);

    return paginate(
      data.map((item) => ({
        navItemNo: item.navItemNo,
        titleEn: item.titleEn,
        titleAm: item.titleAm,
        categoryId: item.categoryId,
        productGroupId: item.productGroupId,
        brandId: item.brandId,
        image: item.image,
        specificationsEn: item.specificationsEn,
        specificationsAm: item.specificationsAm,
        uom: item.uom,
        status: item.status,
        categoryTitleEn: item.category.titleEn,
        productGroupTitleEn: item.productGroup.titleEn,
        brandTitleEn: item.brand.titleEn,
        prices: [],
        stockSnapshots: [],
        syncedAt: item.syncedAt.toISOString(),
        stalenessNote: this.buildStalenessNote(item.syncedAt),
      })),
      total,
      page,
      limit,
    );
  }

  async findItemByNavItemNo(navItemNo: string): Promise<ItemResponseDto | null> {
    const item = await this.prisma.item.findUnique({
      where: { navItemNo },
      include: {
        category: { select: { titleEn: true } },
        productGroup: { select: { titleEn: true } },
        brand: { select: { titleEn: true } },
        prices: {
          select: { branchId: true, uom: true, price: true, discountPct: true, startDate: true, endDate: true, customerNo: true },
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
      navItemNo: item.navItemNo,
      titleEn: item.titleEn,
      titleAm: item.titleAm,
      categoryId: item.categoryId,
      productGroupId: item.productGroupId,
      brandId: item.brandId,
      image: item.image,
      specificationsEn: item.specificationsEn,
      specificationsAm: item.specificationsAm,
      uom: item.uom,
      status: item.status,
      categoryTitleEn: item.category.titleEn,
      productGroupTitleEn: item.productGroup.titleEn,
      brandTitleEn: item.brand.titleEn,
      prices: item.prices.map((p) => ({
        branchId: p.branchId,
        uom: p.uom,
        price: Number(p.price),
        discountPct: p.discountPct ? Number(p.discountPct) : null,
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
        navItemNo: r.nav_item_no,
        titleEn: r.title_en,
        titleAm: r.title_am,
        price: r.price ? Number(r.price) : null,
        image: r.image,
        uom: r.uom,
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
}
