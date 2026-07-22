import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate, PaginatedResponse } from '../product/dto/pagination.dto';
import { ComboQueryDto } from './dto/combo-query.dto';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { ComboHeaderResponseDto, ComboLineResponseDto } from './dto/combo-response.dto';
import { Prisma } from '@prisma/client';
import ApiError from '../common/errors/api.error';

@Injectable()
export class ComboService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ComboQueryDto): Promise<PaginatedResponse<ComboHeaderResponseDto>> {
    const { page = 1, limit = 20 } = query;

    const [data, total] = await Promise.all([
      this.prisma.comboHeader.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          item: { select: { titleEn: true } },
          _count: { select: { lines: true } },
        },
      }),
      this.prisma.comboHeader.count(),
    ]);

    return paginate(
      data.map((h) => ({
        id: h.id.toString(),
        itemId: h.itemId.toString(),
        titleEn: (h as any).item.titleEn,
        description: h.description,
        price: Number(h.price),
        active: h.active,
        lineCount: (h as any)._count.lines,
      })),
      total,
      page,
      limit,
    ) as unknown as PaginatedResponse<ComboHeaderResponseDto>;
  }

  async findOne(id: string): Promise<ComboHeaderResponseDto> {
    const header = await this.prisma.comboHeader.findUnique({
      where: { id: Number(id) },
      include: {
        item: { select: { titleEn: true } },
        lines: {
          include: { item: { select: { titleEn: true } } },
          orderBy: { itemId: 'asc' },
        },
      },
    });
    if (!header) throw ApiError.NotFound('Combo not found', 'COMBO_NOT_FOUND');

    const h = header as any;
    return {
      id: h.id.toString(),
      itemId: h.itemId.toString(),
      titleEn: h.item.titleEn,
      description: h.description,
      price: Number(h.price),
      active: h.active,
      lineCount: h.lines.length,
      lines: h.lines.map((l: any) => ({
        id: l.id.toString(),
        headerNumber: l.headerNumber.toString(),
        itemId: l.itemId.toString(),
        titleEn: l.item.titleEn,
        itemDescription: l.itemDescription,
        quantity: Number(l.quantity),
        uom: l.uom,
      })),
    } as unknown as ComboHeaderResponseDto;
  }

  async create(dto: CreateComboDto): Promise<ComboHeaderResponseDto> {
    const header = await this.prisma.$transaction(async (tx) => {
      const created = await tx.comboHeader.create({
        data: {
          itemId: Number(dto.itemId),
          price: dto.price,
          active: dto.active ?? true,
          lines: {
            create: dto.lines.map((line) => ({
              itemId: Number(line.itemId),
              itemDescription: line.itemDescription,
              quantity: line.quantity,
            })),
          },
        },
        include: {
          item: { select: { titleEn: true } },
          lines: {
            include: { item: { select: { titleEn: true } } },
          },
        },
      });
      return created;
    });

    const h = header as any;
    return {
      id: h.id.toString(),
      itemId: h.itemId.toString(),
      titleEn: h.item.titleEn,
      description: h.description,
      price: Number(h.price),
      active: h.active,
      lineCount: h.lines.length,
      lines: h.lines.map((l: any) => ({
        id: l.id.toString(),
        headerNumber: l.headerNumber.toString(),
        itemId: l.itemId.toString(),
        titleEn: l.item.titleEn,
        itemDescription: l.itemDescription,
        quantity: Number(l.quantity),
        uom: l.uom,
      })),
    } as unknown as ComboHeaderResponseDto;
  }

  async update(id: string, dto: UpdateComboDto): Promise<ComboHeaderResponseDto> {
    const existing = await this.prisma.comboHeader.findUnique({ where: { id: Number(id) } });
    if (!existing) throw ApiError.NotFound('Combo not found', 'COMBO_NOT_FOUND');

    const data: Prisma.ComboHeaderUpdateInput = {};
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.active !== undefined) data.active = dto.active;

    // Handle lines if provided
    if (dto.lines && dto.lines.length > 0) {
      data.lines = {
        deleteMany: {},
        create: dto.lines.map((line) => ({
          itemId: Number(line.itemId),
          itemDescription: line.itemDescription,
          quantity: line.quantity,
        })),
      };
    }

    const header = await this.prisma.comboHeader.update({
      where: { id: Number(id) },
      data,
      include: {
        item: { select: { titleEn: true } },
        lines: {
          include: { item: { select: { titleEn: true } } },
          orderBy: { itemId: 'asc' },
        },
      },
    });

    const h = header as any;
    return {
      id: h.id.toString(),
      itemId: h.itemId.toString(),
      titleEn: h.item.titleEn,
      description: h.description,
      price: Number(h.price),
      active: h.active,
      lineCount: h.lines.length,
      lines: h.lines.map((l: any) => ({
        id: l.id.toString(),
        headerNumber: l.headerNumber.toString(),
        itemId: l.itemId.toString(),
        titleEn: l.item.titleEn,
        itemDescription: l.itemDescription,
        quantity: Number(l.quantity),
        uom: l.uom,
      })),
    } as unknown as ComboHeaderResponseDto;
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.comboHeader.findUnique({ where: { id: Number(id) } });
    if (!existing) throw ApiError.NotFound('Combo not found', 'COMBO_NOT_FOUND');

    await this.prisma.comboHeader.delete({ where: { id: Number(id) } });
  }
}
