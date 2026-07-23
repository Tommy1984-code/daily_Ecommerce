import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import { RiderResponseDto } from './dto/rider-response.dto';

@Injectable()
export class RidersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<RiderResponseDto[]> {
    const riders = await this.prisma.rider.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return riders.map(this.mapRider);
  }

  async findOne(id: string): Promise<RiderResponseDto> {
    const rider = await this.prisma.rider.findUnique({ where: { id } });
    if (!rider) throw new NotFoundException('Rider not found');
    return this.mapRider(rider);
  }

  async create(dto: CreateRiderDto): Promise<RiderResponseDto> {
    const rider = await this.prisma.rider.create({
      data: { name: dto.name, phone: dto.phone },
    });
    return this.mapRider(rider);
  }

  private mapRider(r: any): RiderResponseDto {
    return {
      id: r.id,
      name: r.name,
      phone: r.phone,
      isActive: r.isActive,
      createdAt: r.createdAt?.toISOString?.() || r.createdAt,
    };
  }
}
