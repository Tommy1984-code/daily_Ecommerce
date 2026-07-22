import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, MinLength } from 'class-validator';
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

  @ApiPropertyOptional({ description: 'Filter by Category ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Filter by Product ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  productId?: number;

  @ApiPropertyOptional({ description: 'Filter by Brand ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  brandId?: number;
}
