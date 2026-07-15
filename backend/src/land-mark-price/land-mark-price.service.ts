import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate, PaginatedResponse } from '../product/dto/pagination.dto';
import { PaginationDto } from '../product/dto/pagination.dto';
import {
  LandMarkResponseDto,
  ShopResponseDto,
  DeliveryDateResponseDto,
  TimeRangeResponseDto,
  LandMarkPriceResponseDto,
  CreateLandMarkPriceDto,
  UpdateLandMarkPriceDto,
} from './dto/land-mark-price-response.dto';
import ApiError from '../common/errors/api.error';

@Injectable()
export class LandMarkPriceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllLandMarks(): Promise<LandMarkResponseDto[]> {
    const landMarks = await this.prisma.landMark.findMany({ orderBy: { titleEn: 'asc' } });
    return landMarks.map((l) => ({
      code: l.code,
      titleEn: l.titleEn,
      titleAm: l.titleAm,
      latitude: l.latitude ? Number(l.latitude) : null,
      longitude: l.longitude ? Number(l.longitude) : null,
    }));
  }

  async findAllShops(): Promise<ShopResponseDto[]> {
    const shops = await this.prisma.shop.findMany({ orderBy: { titleEn: 'asc' } });
    return shops.map((s) => ({
      locationCode: s.locationCode,
      titleEn: s.titleEn,
      titleAm: s.titleAm,
      latitude: s.latitude ? Number(s.latitude) : null,
      longitude: s.longitude ? Number(s.longitude) : null,
    }));
  }

  async findAllDeliveryDates(): Promise<DeliveryDateResponseDto[]> {
    const dates = await this.prisma.deliveryDate.findMany({ orderBy: { titleEn: 'asc' } });
    return dates.map((d) => ({ id: d.id, titleEn: d.titleEn, titleAm: d.titleAm }));
  }

  async findAllTimeRanges(): Promise<TimeRangeResponseDto[]> {
    const ranges = await this.prisma.timeRange.findMany({ orderBy: { timeRange: 'asc' } });
    return ranges.map((r) => ({ id: r.id, timeRange: r.timeRange }));
  }

  async findAllLandMarkPrices(query: PaginationDto): Promise<PaginatedResponse<LandMarkPriceResponseDto>> {
    const { page = 1, limit = 20 } = query;

    const [data, total] = await Promise.all([
      this.prisma.landMarkPrice.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          date: { select: { titleEn: true, titleAm: true } },
          landMark: { select: { titleEn: true, titleAm: true, latitude: true, longitude: true } },
          shop: { select: { titleEn: true, titleAm: true } },
        },
      }),
      this.prisma.landMarkPrice.count(),
    ]);

    return paginate(
      data.map((p) => ({
        id: p.id,
        dateId: p.dateId,
        dateTitleEn: p.date.titleEn,
        dateTitleAm: p.date.titleAm,
        timeRange: p.timeRange,
        landMarkCode: p.landMarkCode,
        landMarkTitleEn: p.landMark.titleEn,
        landMarkTitleAm: p.landMark.titleAm,
        landMarkLatitude: p.landMark.latitude ? Number(p.landMark.latitude) : null,
        landMarkLongitude: p.landMark.longitude ? Number(p.landMark.longitude) : null,
        shopCode: p.shopCode,
        shopTitleEn: p.shop.titleEn,
        shopTitleAm: p.shop.titleAm,
        price: Number(p.price),
      })),
      total,
      page,
      limit,
    );
  }

  async createLandMarkPrice(dto: CreateLandMarkPriceDto): Promise<LandMarkPriceResponseDto> {
    const created = await this.prisma.landMarkPrice.create({
      data: {
        dateId: dto.dateId,
        timeRange: dto.timeRange,
        landMarkCode: dto.landMarkCode,
        shopCode: dto.shopCode,
        price: dto.price,
      },
      include: {
        date: { select: { titleEn: true, titleAm: true } },
        landMark: { select: { titleEn: true, titleAm: true, latitude: true, longitude: true } },
        shop: { select: { titleEn: true, titleAm: true } },
      },
    });

    return {
      id: created.id,
      dateId: created.dateId,
      dateTitleEn: created.date.titleEn,
      dateTitleAm: created.date.titleAm,
      timeRange: created.timeRange,
      landMarkCode: created.landMarkCode,
      landMarkTitleEn: created.landMark.titleEn,
      landMarkTitleAm: created.landMark.titleAm,
      landMarkLatitude: created.landMark.latitude ? Number(created.landMark.latitude) : null,
      landMarkLongitude: created.landMark.longitude ? Number(created.landMark.longitude) : null,
      shopCode: created.shopCode,
      shopTitleEn: created.shop.titleEn,
      shopTitleAm: created.shop.titleAm,
      price: Number(created.price),
    };
  }

  async updateLandMarkPrice(id: string, dto: UpdateLandMarkPriceDto): Promise<LandMarkPriceResponseDto> {
    const existing = await this.prisma.landMarkPrice.findUnique({ where: { id } });
    if (!existing) throw ApiError.NotFound('Land mark price not found', 'LAND_MARK_PRICE_NOT_FOUND');

    const updated = await this.prisma.landMarkPrice.update({
      where: { id },
      data: { price: dto.price },
      include: {
        date: { select: { titleEn: true, titleAm: true } },
        landMark: { select: { titleEn: true, titleAm: true, latitude: true, longitude: true } },
        shop: { select: { titleEn: true, titleAm: true } },
      },
    });

    return {
      id: updated.id,
      dateId: updated.dateId,
      dateTitleEn: updated.date.titleEn,
      dateTitleAm: updated.date.titleAm,
      timeRange: updated.timeRange,
      landMarkCode: updated.landMarkCode,
      landMarkTitleEn: updated.landMark.titleEn,
      landMarkTitleAm: updated.landMark.titleAm,
      landMarkLatitude: updated.landMark.latitude ? Number(updated.landMark.latitude) : null,
      landMarkLongitude: updated.landMark.longitude ? Number(updated.landMark.longitude) : null,
      shopCode: updated.shopCode,
      shopTitleEn: updated.shop.titleEn,
      shopTitleAm: updated.shop.titleAm,
      price: Number(updated.price),
    };
  }

  async removeLandMarkPrice(id: string): Promise<void> {
    const existing = await this.prisma.landMarkPrice.findUnique({ where: { id } });
    if (!existing) throw ApiError.NotFound('Land mark price not found', 'LAND_MARK_PRICE_NOT_FOUND');

    await this.prisma.landMarkPrice.delete({ where: { id } });
  }
}
