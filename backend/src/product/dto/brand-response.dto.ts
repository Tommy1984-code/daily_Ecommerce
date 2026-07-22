import { ApiProperty } from '@nestjs/swagger';

export class BrandResponseDto {
  @ApiProperty({ description: 'Brand unique identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'NAV brand ID', example: 'BR-001' })
  brandId: string;

  @ApiProperty({ description: 'Brand name in English', example: 'Family' })
  titleEn: string;

  @ApiProperty({ description: 'Brand name in Amharic', example: 'ፋሚሊ' })
  titleAm: string;

  @ApiProperty({ description: 'Product ID this brand belongs to', example: 1 })
  productId: number;

  @ApiProperty({ description: 'Parent product group name in English', example: 'Milk' })
  productGroupTitleEn: string;

  @ApiProperty({ description: 'Parent product group name in Amharic', example: 'ወተት' })
  productGroupTitleAm: string;

  @ApiProperty({ description: 'Category name in English', example: 'Dairy Products' })
  categoryTitleEn: string;

  @ApiProperty({ description: 'Category name in Amharic', example: 'የወተት ተዋጽኦዎች' })
  categoryTitleAm: string;

  @ApiProperty({ description: 'Brand image URL', nullable: true })
  image: string | null;

  @ApiProperty({ description: 'Number of items under this brand', example: 5 })
  itemCount: number;
}
