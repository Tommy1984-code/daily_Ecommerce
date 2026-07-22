import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'admin@dailymart.com' })
  email: string;

  @ApiProperty({ example: 'Super Admin' })
  name: string;

  @ApiProperty({ example: 'SUPERADMIN', enum: ['SUPERADMIN', 'ADMIN', 'STAFF', 'USER'] })
  role: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-07-15T10:00:00.000Z' })
  createdAt: string;
}
