import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeaturedCategoryResponseDto } from './dto/featured-category-response.dto';
import ApiError from '../common/errors/api.error';

@Injectable()
export class FeaturedCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FeaturedCategoryResponseDto[]> {
    const groups = await this.prisma.productGroup.findMany({
      where: { featured: true },
      include: {
        _count: { select: { brands: true } },
        brands: { select: { id: true, titleEn: true, featured: true }, orderBy: { titleEn: 'asc' } },
      },
      orderBy: { titleEn: 'asc' },
    });

    return groups.map((g) => ({
      id: g.id,
      titleEn: g.titleEn,
      titleAm: g.titleAm,
      image: g.image,
      featuredImage: g.featuredImage,
      brandCount: g._count.brands,
      brands: g.brands.map((b) => ({
        id: b.id,
        titleEn: b.titleEn,
        featured: b.featured,
      })),
    }));
  }

  async updateBanner(id: string, featuredImage: string): Promise<FeaturedCategoryResponseDto> {
    const existing = await this.prisma.productGroup.findUnique({ where: { id } });
    if (!existing) throw ApiError.NotFound('Product group not found', 'PRODUCT_GROUP_NOT_FOUND');

    const updated = await this.prisma.productGroup.update({
      where: { id },
      data: { featuredImage },
      include: {
        _count: { select: { brands: true } },
        brands: { select: { id: true, titleEn: true, featured: true }, orderBy: { titleEn: 'asc' } },
      },
    });

    return {
      id: updated.id,
      titleEn: updated.titleEn,
      titleAm: updated.titleAm,
      image: updated.image,
      featuredImage: updated.featuredImage,
      brandCount: updated._count.brands,
      brands: updated.brands.map((b) => ({
        id: b.id,
        titleEn: b.titleEn,
        featured: b.featured,
      })),
    };
  }

  async toggleBrandFeatured(productGroupId: string, brandId: string, featured: boolean): Promise<FeaturedCategoryResponseDto> {
    const brand = await this.prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand || brand.productGroupId !== productGroupId) {
      throw ApiError.NotFound('Brand not found in this product group', 'BRAND_NOT_FOUND');
    }

    await this.prisma.brand.update({
      where: { id: brandId },
      data: { featured },
    });

    const group = await this.prisma.productGroup.findUnique({
      where: { id: productGroupId },
      include: {
        _count: { select: { brands: true } },
        brands: { select: { id: true, titleEn: true, featured: true }, orderBy: { titleEn: 'asc' } },
      },
    });
    if (!group) throw ApiError.NotFound('Product group not found', 'PRODUCT_GROUP_NOT_FOUND');

    return {
      id: group.id,
      titleEn: group.titleEn,
      titleAm: group.titleAm,
      image: group.image,
      featuredImage: group.featuredImage,
      brandCount: group._count.brands,
      brands: group.brands.map((b) => ({
        id: b.id,
        titleEn: b.titleEn,
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
        brands: { select: { id: true, titleEn: true, featured: true }, orderBy: { titleEn: 'asc' } },
      },
    });

    return {
      id: updated.id,
      titleEn: updated.titleEn,
      titleAm: updated.titleAm,
      image: updated.image,
      featuredImage: updated.featuredImage,
      brandCount: updated._count.brands,
      brands: updated.brands.map((b) => ({
        id: b.id,
        titleEn: b.titleEn,
        featured: b.featured,
      })),
    };
  }
}
