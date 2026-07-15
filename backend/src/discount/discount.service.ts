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
    const { page = 1, limit = 20 } = query;
    const where: Prisma.ItemPriceWhereInput = {
      discountPct: { not: null, gt: 0 },
    };

    const [data, total] = await Promise.all([
      this.prisma.itemPrice.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { item: { select: { titleEn: true } } },
      }),
      this.prisma.itemPrice.count({ where }),
    ]);

    return paginate(
      data.map((p) => ({
        id: p.id,
        navItemNo: p.navItemNo,
        titleEn: p.item.titleEn,
        branchId: p.branchId,
        uom: p.uom,
        price: Number(p.price),
        discountPct: p.discountPct ? Number(p.discountPct) : null,
        startDate: p.startDate?.toISOString() ?? null,
        endDate: p.endDate?.toISOString() ?? null,
        customerNo: p.customerNo,
      })),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<DiscountResponseDto> {
    const price = await this.prisma.itemPrice.findUnique({
      where: { id },
      include: { item: { select: { titleEn: true } } },
    });
    if (!price) throw ApiError.NotFound('Discount not found', 'DISCOUNT_NOT_FOUND');
    return {
      id: price.id,
      navItemNo: price.navItemNo,
      titleEn: price.item.titleEn,
      branchId: price.branchId,
      uom: price.uom,
      price: Number(price.price),
      discountPct: price.discountPct ? Number(price.discountPct) : null,
      startDate: price.startDate?.toISOString() ?? null,
      endDate: price.endDate?.toISOString() ?? null,
      customerNo: price.customerNo,
    };
  }
}
