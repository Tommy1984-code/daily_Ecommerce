import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate, PaginatedResponse } from '../product/dto/pagination.dto';
import { DiscountQueryDto } from './dto/discount-query.dto';
import { DiscountResponseDto } from './dto/discount-response.dto';
import { Prisma } from '@prisma/client';
import ApiError from '../common/errors/api.error';

@Injectable()
export class DiscountService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: DiscountQueryDto): Promise<PaginatedResponse<DiscountResponseDto>> {
    const { page = 1, limit = 20, q } = query;
    const where: Prisma.PriceDiscountWhereInput = {};
    if (q) {
      where.item = { titleEn: { contains: q, mode: 'insensitive' } };
    }

    const [data, total] = await Promise.all([
      this.prisma.priceDiscount.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { item: { select: { titleEn: true, titleAm: true, salesUom: true } } },
      }),
      this.prisma.priceDiscount.count({ where }),
    ]);

    return paginate(
      data.map((d) => ({
        id: d.id,
        itemId: d.itemId,
        titleEn: d.item.titleEn,
        titleAm: d.item.titleAm || undefined,
        uom: d.item.salesUom || undefined,
        discountPer: Number(d.discountPer),
        createdAt: d.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<DiscountResponseDto> {
    const discount = await this.prisma.priceDiscount.findUnique({
      where: { id },
      include: { item: { select: { titleEn: true, titleAm: true, salesUom: true } } },
    });
    if (!discount) throw ApiError.NotFound('Discount not found', 'DISCOUNT_NOT_FOUND');
    return {
      id: discount.id,
      itemId: discount.itemId,
      titleEn: discount.item.titleEn,
      titleAm: discount.item.titleAm || undefined,
      uom: discount.item.salesUom || undefined,
      discountPer: Number(discount.discountPer),
      createdAt: discount.createdAt.toISOString(),
    };
  }
}
