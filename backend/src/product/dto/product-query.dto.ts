import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsUUID, MinLength } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class ProductQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search term for title (English or Amharic)', example: 'milk' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  q?: string;
}

export class ItemsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search term for item title', example: 'milk' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  q?: string;

  @ApiPropertyOptional({ description: 'Filter by Category ID', example: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by Product ID', example: 'uuid' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({ description: 'Filter by Brand ID', example: 'uuid' })
  @IsOptional()
  @IsUUID()
  brandId?: string;
}
