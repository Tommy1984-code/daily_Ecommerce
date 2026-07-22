import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { StaffService } from '../staff/staff.service';

const ROLE_TITLE_MAP: Record<string, string> = {
  SUPERADMIN: 'Super Admin',
  ADMIN: 'Manager',
  STAFF: 'Staff',
  USER: 'Staff',
};

const ROLE_KEY_MAP: Record<string, string> = {
  'Super Admin': 'SUPERADMIN',
  'Manager': 'ADMIN',
  'Staff': 'STAFF',
};

const DEFAULT_PASSWORD = 'Default@123';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly staff: StaffService,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const staff = await this.staff.findAll();
    return staff.map(this.toUserResponse.bind(this));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const record = await this.staff.findById(id);
    if (!record) throw new NotFoundException('User not found');
    return this.toUserResponse(record);
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.staff.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const role = await this.resolveRole(dto.role);
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const record = await this.prisma.staff.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        password: hashedPassword,
        name: dto.name.trim(),
        roleId: role.id,
      },
      select: {
        id: true, email: true, name: true, isActive: true, roleId: true,
        createdAt: true, updatedAt: true, role: true,
      },
    });

    return this.toUserResponse(record);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const existing = await this.staff.findById(id);
    if (!existing) throw new NotFoundException('User not found');

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.role !== undefined) {
      const role = await this.resolveRole(dto.role);
      data.roleId = role.id;
    }

    const record = await this.prisma.staff.update({
      where: { id },
      data,
      select: {
        id: true, email: true, name: true, isActive: true, roleId: true,
        createdAt: true, updatedAt: true, role: true,
      },
    });

    return this.toUserResponse(record);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.staff.findById(id);
    if (!existing) throw new NotFoundException('User not found');
    await this.prisma.staff.delete({ where: { id } });
  }

  async getAuditLogs() {
    return [];
  }

  private async resolveRole(roleKey: string) {
    const title = ROLE_TITLE_MAP[roleKey] || 'Staff';
    const role = await this.prisma.role.findFirst({ where: { name: title } });
    if (!role) throw new NotFoundException(`Role '${title}' not found`);
    return role;
  }

  private toUserResponse(record: any): UserResponseDto {
    return {
      id: record.id,
      email: record.email,
      name: record.name,
      role: ROLE_KEY_MAP[record.role?.name] || 'STAFF',
      isActive: record.isActive,
      createdAt: record.createdAt?.toISOString() || new Date().toISOString(),
    };
  }
}
