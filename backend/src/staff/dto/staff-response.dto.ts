import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class StaffRole {
  @ApiProperty({ description: 'Role unique identifier', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Role name', example: 'Super Admin' })
  name: string;

  @ApiProperty({ description: 'Role description', example: 'Full system access' })
  description: string;

  @ApiProperty({ description: 'Whether this is a system role', example: true })
  isSystem: boolean;

  @ApiProperty({ description: 'Role creation timestamp', example: '2026-07-15T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Role last update timestamp', example: '2026-07-15T10:00:00.000Z' })
  updatedAt: string;
}

export class StaffResponseDto {
  @ApiProperty({ description: 'Staff unique identifier', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Staff email address', example: 'staff@dailymart.com' })
  email: string;

  @ApiProperty({ description: 'Staff full name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'Whether the staff account is active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Role UUID assigned to this staff member', example: '550e8400-e29b-41d4-a716-446655440000' })
  roleId: string;

  @ApiProperty({ description: 'Account creation timestamp', example: '2026-07-15T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Account last update timestamp', example: '2026-07-15T10:00:00.000Z' })
  updatedAt: string;

  @ApiPropertyOptional({ description: 'Staff role details', type: StaffRole })
  role?: StaffRole;
}
