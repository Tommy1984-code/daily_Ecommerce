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
        orderBy: { createdAt: 'desc' },
        include: {
          item: { select: { titleEn: true } },
          _count: { select: { lines: true } },
        },
      }),
      this.prisma.comboHeader.count(),
    ]);

    return paginate(
      data.map((h) => ({
        id: h.id,
        navItemNo: h.navItemNo,
        titleEn: h.item.titleEn,
        description: h.description,
        price: Number(h.price),
        active: h.active,
        lineCount: h._count.lines,
        createdAt: h.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<ComboHeaderResponseDto> {
    const header = await this.prisma.comboHeader.findUnique({
      where: { id },
      include: {
        item: { select: { titleEn: true } },
        lines: {
          include: { item: { select: { titleEn: true } } },
          orderBy: { navItemNo: 'asc' },
        },
      },
    });
    if (!header) throw ApiError.NotFound('Combo not found', 'COMBO_NOT_FOUND');

    return {
      id: header.id,
      navItemNo: header.navItemNo,
      titleEn: header.item.titleEn,
      description: header.description,
      price: Number(header.price),
      active: header.active,
      lineCount: header.lines.length,
      lines: header.lines.map((l) => ({
        id: l.id,
        headerId: l.headerId,
        navItemNo: l.navItemNo,
        titleEn: l.item.titleEn,
        itemDescription: l.itemDescription,
        quantity: Number(l.quantity),
        salesUom: l.salesUom,
      })),
      createdAt: header.createdAt.toISOString(),
    };
  }

  async create(dto: CreateComboDto): Promise<ComboHeaderResponseDto> {
    const header = await this.prisma.$transaction(async (tx) => {
      const created = await tx.comboHeader.create({
        data: {
          navItemNo: dto.navItemNo,
          price: dto.price,
          active: dto.active ?? true,
          lines: {
            create: dto.lines.map((line) => ({
              navItemNo: line.navItemNo,
              itemDescription: line.itemDescription,
              quantity: line.quantity,
              salesUom: line.salesUom,
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

    return {
      id: header.id,
      navItemNo: header.navItemNo,
      titleEn: header.item.titleEn,
      description: header.description,
      price: Number(header.price),
      active: header.active,
      lineCount: header.lines.length,
      lines: header.lines.map((l) => ({
        id: l.id,
        headerId: l.headerId,
        navItemNo: l.navItemNo,
        titleEn: l.item.titleEn,
        itemDescription: l.itemDescription,
        quantity: Number(l.quantity),
        salesUom: l.salesUom,
      })),
      createdAt: header.createdAt.toISOString(),
    };
  }

  async update(id: string, dto: UpdateComboDto): Promise<ComboHeaderResponseDto> {
    const existing = await this.prisma.comboHeader.findUnique({ where: { id } });
    if (!existing) throw ApiError.NotFound('Combo not found', 'COMBO_NOT_FOUND');

    const data: Prisma.ComboHeaderUpdateInput = {};
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.active !== undefined) data.active = dto.active;

    const header = await this.prisma.comboHeader.update({
      where: { id },
      data,
      include: {
        item: { select: { titleEn: true } },
        _count: { select: { lines: true } },
      },
    });

    return {
      id: header.id,
      navItemNo: header.navItemNo,
      titleEn: header.item.titleEn,
      description: header.description,
      price: Number(header.price),
      active: header.active,
      lineCount: header._count.lines,
      createdAt: header.createdAt.toISOString(),
    };
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.comboHeader.findUnique({ where: { id } });
    if (!existing) throw ApiError.NotFound('Combo not found', 'COMBO_NOT_FOUND');

    await this.prisma.comboHeader.delete({ where: { id } });
  }
}
