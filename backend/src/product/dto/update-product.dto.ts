import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Category image URL' })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateProductGroupDto {
  @ApiPropertyOptional({ description: 'Product group image URL' })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateBrandDto {
  @ApiPropertyOptional({ description: 'Brand image URL' })
  @IsOptional()
  @IsString()
  image?: string;
}
