import { IsString, IsIn, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'STAFF', enum: ['ADMIN', 'STAFF', 'USER'] })
  @IsString()
  @IsIn(['ADMIN', 'STAFF', 'USER'])
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'NewP@ss1', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
