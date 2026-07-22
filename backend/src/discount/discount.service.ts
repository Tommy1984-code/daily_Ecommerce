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
        orderBy: { id: 'desc' },
        include: { item: { select: { titleEn: true, titleAm: true } } },
      }),
      this.prisma.priceDiscount.count({ where }),
    ]);

    return paginate(
      data.map((d: any) => ({
        id: d.id.toString(),
        itemId: d.itemId.toString(),
        titleEn: d.item.titleEn,
        titleAm: d.item.titleAm || undefined,
        uom: d.uom || undefined,
        discountPer: Number(d.discountPer),
      })),
      total,
      page,
      limit,
    ) as unknown as PaginatedResponse<DiscountResponseDto>;
  }

  async findOne(id: string): Promise<DiscountResponseDto> {
    const discount = await this.prisma.priceDiscount.findUnique({
      where: { id: Number(id) },
      include: { item: { select: { titleEn: true, titleAm: true } } },
    });
    if (!discount) throw ApiError.NotFound('Discount not found', 'DISCOUNT_NOT_FOUND');
    const d = discount as any;
    return {
      id: d.id.toString(),
      itemId: d.itemId.toString(),
      titleEn: d.item.titleEn,
      titleAm: d.item.titleAm || undefined,
      uom: d.uom || undefined,
      discountPer: Number(d.discountPer),
    } as unknown as DiscountResponseDto;
  }
}
