import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name (must be unique)',
    example: 'Manager',
    required: true,
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Order and product management',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
