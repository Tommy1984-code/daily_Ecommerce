import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopItemDto } from './dto/create-top-item.dto';
import { TopItemResponseDto } from './dto/top-item-response.dto';
import ApiError from '../common/errors/api.error';

@Injectable()
export class TopItemService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TopItemResponseDto[]> {
    const items = await this.prisma.topItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: { item: { select: { titleEn: true, titleAm: true, image: true } } },
    });

    return items.map((t) => ({
      id: t.id,
      navItemNo: t.navItemNo,
      titleEn: t.item.titleEn,
      titleAm: t.item.titleAm,
      image: t.item.image,
      createdAt: t.createdAt.toISOString(),
    }));
  }

  async create(dto: CreateTopItemDto): Promise<TopItemResponseDto> {
    const topItem = await this.prisma.topItem.create({
      data: { navItemNo: dto.navItemNo },
      include: { item: { select: { titleEn: true, titleAm: true, image: true } } },
    });

    return {
      id: topItem.id,
      navItemNo: topItem.navItemNo,
      titleEn: topItem.item.titleEn,
      titleAm: topItem.item.titleAm,
      image: topItem.item.image,
      createdAt: topItem.createdAt.toISOString(),
    };
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.topItem.findUnique({ where: { id } });
    if (!existing) throw ApiError.NotFound('Top item not found', 'TOP_ITEM_NOT_FOUND');

    await this.prisma.topItem.delete({ where: { id } });
  }
}
