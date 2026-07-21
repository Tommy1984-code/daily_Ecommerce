import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate, PaginatedResponse } from '../product/dto/pagination.dto';
import { PriceQueryDto } from './dto/price-query.dto';
import { PriceResponseDto } from './dto/price-response.dto';
import { Prisma } from '@prisma/client';
import ApiError from '../common/errors/api.error';

@Injectable()
export class PriceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PriceQueryDto): Promise<PaginatedResponse<PriceResponseDto>> {
    const { page = 1, limit = 20, q } = query;
    const where: Prisma.ItemPriceWhereInput = {};
    if (q) {
      where.item = {
        OR: [
          { titleEn: { contains: q, mode: 'insensitive' } },
          { titleAm: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.itemPrice.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { item: { select: { titleEn: true, titleAm: true } } },
      }),
      this.prisma.itemPrice.count({ where }),
    ]);

    return paginate(
      data.map((p) => ({
        id: p.id,
        priceId: p.priceId,
        itemId: p.itemId,
        titleEn: p.item.titleEn,
        titleAm: p.item.titleAm,
        branchId: p.branchId,
        uom: p.uom,
        price: Number(p.price),
        startDate: p.startDate?.toISOString() ?? null,
        endDate: p.endDate?.toISOString() ?? null,
        customerNo: p.customerNo,
      })),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<PriceResponseDto> {
const price = await this.prisma.itemPrice.findUnique({
      where: { id },
      include: { item: { select: { titleEn: true, titleAm: true } } },
    });
    if (!price) throw ApiError.NotFound('Price not found', 'PRICE_NOT_FOUND');
    return {
      id: price.id,
      priceId: price.priceId,
      itemId: price.itemId,
      titleEn: price.item.titleEn,
      titleAm: price.item.titleAm,
      branchId: price.branchId,
      uom: price.uom,
      price: Number(price.price),
      startDate: price.startDate?.toISOString() ?? null,
      endDate: price.endDate?.toISOString() ?? null,
      customerNo: price.customerNo,
    };
  }
}
