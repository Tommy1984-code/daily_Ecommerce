import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { paginate, PaginatedResponse } from '../product/dto/pagination.dto';
import { FeaturedCategoryResponseDto } from './dto/featured-category-response.dto';
import { CreateFeaturedCategoryDto } from './dto/create-featured-category.dto';
import ApiError from '../common/errors/api.error';

@Injectable()
export class FeaturedCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 10, q?: string): Promise<PaginatedResponse<FeaturedCategoryResponseDto>> {
    const where: Prisma.ProductGroupWhereInput = { featured: true };
    if (q) {
      where.OR = [
        { titleEn: { contains: q, mode: 'insensitive' } },
        { titleAm: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [groups, total] = await Promise.all([
      this.prisma.productGroup.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { brands: true } },
          brands: { select: { id: true, brandId: true, titleEn: true, titleAm: true, featured: true }, orderBy: { titleEn: 'asc' } },
        },
        orderBy: { titleEn: 'asc' },
      }),
      this.prisma.productGroup.count({ where }),
    ]);

    return paginate(
      groups.map((g) => ({
        id: g.id,
        productId: g.productId,
        titleEn: g.titleEn,
        titleAm: g.titleAm,
        image: g.image,
        featuredImage: g.featuredImage,
        brandCount: g._count.brands,
        brands: g.brands.map((b) => ({
          id: b.id,
          brandId: b.brandId,
          titleEn: b.titleEn,
          titleAm: b.titleAm,
          featured: b.featured,
        })),
      })),
      total,
      page,
      limit,
    );
  }

  async updateBanner(id: string, featuredImage: string): Promise<FeaturedCategoryResponseDto> {
    const existing = await this.prisma.productGroup.findUnique({ where: { id } });
    if (!existing) throw ApiError.NotFound('Product group not found', 'PRODUCT_GROUP_NOT_FOUND');

    const updated = await this.prisma.productGroup.update({
      where: { id },
      data: { featuredImage },
      include: {
        _count: { select: { brands: true } },
        brands: { select: { id: true, brandId: true, titleEn: true, titleAm: true, featured: true }, orderBy: { titleEn: 'asc' } },
      },
    });

    return {
      id: updated.id,
      productId: updated.productId,
      titleEn: updated.titleEn,
      titleAm: updated.titleAm,
      image: updated.image,
      featuredImage: updated.featuredImage,
      brandCount: updated._count.brands,
      brands: updated.brands.map((b) => ({
        id: b.id,
        brandId: b.brandId,
        titleEn: b.titleEn,
        titleAm: b.titleAm,
        featured: b.featured,
      })),
    };
  }

  async toggleBrandFeatured(productId: string, brandId: string, featured: boolean): Promise<FeaturedCategoryResponseDto> {
    const brand = await this.prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) {
      throw ApiError.NotFound('Brand not found', 'BRAND_NOT_FOUND');
    }

    await this.prisma.brand.update({
      where: { id: brandId },
      data: { featured },
    });

    const group = await this.prisma.productGroup.findUnique({
      where: { id: productId },
      include: {
        _count: { select: { brands: true } },
        brands: { select: { id: true, brandId: true, titleEn: true, titleAm: true, featured: true }, orderBy: { titleEn: 'asc' } },
      },
    });
    if (!group) throw ApiError.NotFound('Product group not found', 'PRODUCT_GROUP_NOT_FOUND');

    return {
      id: group.id,
      productId: group.productId,
      titleEn: group.titleEn,
      titleAm: group.titleAm,
      image: group.image,
      featuredImage: group.featuredImage,
      brandCount: group._count.brands,
      brands: group.brands.map((b) => ({
        id: b.id,
        brandId: b.brandId,
        titleEn: b.titleEn,
        titleAm: b.titleAm,
        featured: b.featured,
      })),
    };
  }

  async toggleFeatured(id: string): Promise<FeaturedCategoryResponseDto> {
    const existing = await this.prisma.productGroup.findUnique({ where: { id } });
    if (!existing) throw ApiError.NotFound('Product group not found', 'PRODUCT_GROUP_NOT_FOUND');

    const updated = await this.prisma.productGroup.update({
      where: { id },
      data: { featured: !existing.featured },
      include: {
        _count: { select: { brands: true } },
        brands: { select: { id: true, brandId: true, titleEn: true, titleAm: true, featured: true }, orderBy: { titleEn: 'asc' } },
      },
    });

    return {
      id: updated.id,
      productId: updated.productId,
      titleEn: updated.titleEn,
      titleAm: updated.titleAm,
      image: updated.image,
      featuredImage: updated.featuredImage,
      brandCount: updated._count.brands,
      brands: updated.brands.map((b) => ({
        id: b.id,
        brandId: b.brandId,
        titleEn: b.titleEn,
        titleAm: b.titleAm,
        featured: b.featured,
      })),
    };
  }

  async create(dto: CreateFeaturedCategoryDto): Promise<FeaturedCategoryResponseDto> {
    const group = await this.prisma.productGroup.findUnique({ where: { id: dto.productId } });
    if (!group) throw ApiError.NotFound('Product group not found', 'PRODUCT_GROUP_NOT_FOUND');

    await this.prisma.productGroup.update({
      where: { id: dto.productId },
      data: {
        featured: true,
        featuredImage: dto.featuredImage ?? null,
      },
    });

    if (dto.brandIds.length > 0) {
      await this.prisma.brand.updateMany({
        where: { id: { in: dto.brandIds } },
        data: { featured: true },
      });
    }

    return this.getFeaturedCategory(dto.productId);
  }

  private async getFeaturedCategory(id: string): Promise<FeaturedCategoryResponseDto> {
    const group = await this.prisma.productGroup.findUnique({
      where: { id },
      include: {
        _count: { select: { brands: true } },
        brands: { select: { id: true, brandId: true, titleEn: true, titleAm: true, featured: true }, orderBy: { titleEn: 'asc' } },
      },
    });
    if (!group) throw ApiError.NotFound('Product group not found', 'PRODUCT_GROUP_NOT_FOUND');

    return {
      id: group.id,
      productId: group.productId,
      titleEn: group.titleEn,
      titleAm: group.titleAm,
      image: group.image,
      featuredImage: group.featuredImage,
      brandCount: group._count.brands,
      brands: group.brands.map((b) => ({
        id: b.id,
        brandId: b.brandId,
        titleEn: b.titleEn,
        titleAm: b.titleAm,
        featured: b.featured,
      })),
    };
  }
}
