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

      include: { item: { select: { titleEn: true, titleAm: true, image: true } } },
    });

    return items.map((t) => ({
      id: t.id,
      itemId: t.itemId,
      titleEn: t.item.titleEn,
      titleAm: t.item.titleAm,
      image: t.item.image,
    }));
  }

  async create(dto: CreateTopItemDto): Promise<TopItemResponseDto> {
    const topItem = await this.prisma.topItem.create({
      data: { itemId: dto.itemId },
      include: { item: { select: { titleEn: true, titleAm: true, image: true } } },
    });

    return {
      id: topItem.id,
      itemId: topItem.itemId,
      titleEn: topItem.item.titleEn,
      titleAm: topItem.item.titleAm,
      image: topItem.item.image,
    };
  }

  async remove(id: number): Promise<void> {
    const existing = await this.prisma.topItem.findUnique({ where: { id } });
    if (!existing) throw ApiError.NotFound('Top item not found', 'TOP_ITEM_NOT_FOUND');

    await this.prisma.topItem.delete({ where: { id } });
  }
}
