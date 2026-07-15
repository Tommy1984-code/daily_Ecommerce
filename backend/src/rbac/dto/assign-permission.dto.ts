import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignPermissionDto {
  @ApiProperty({
    description: 'Role UUID to assign permission to',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  @IsUUID()
  roleId: string;

  @ApiProperty({
    description: 'Resource UUID the permission applies to',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: true,
  })
  @IsUUID()
  resourceId: string;

  @ApiPropertyOptional({
    description: 'Allow read access',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  canRead?: boolean;

  @ApiPropertyOptional({
    description: 'Allow write access',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  canWrite?: boolean;

  @ApiPropertyOptional({
    description: 'Allow delete access',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  canDelete?: boolean;
}
