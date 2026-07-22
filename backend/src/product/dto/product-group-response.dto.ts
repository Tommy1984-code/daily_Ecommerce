import { ApiProperty } from '@nestjs/swagger';

export class ProductGroupResponseDto {
  @ApiProperty({ description: 'Product group unique identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'NAV product ID', example: 'PG-001' })
  productId: string;

  @ApiProperty({ description: 'Product group name in English', example: 'Milk' })
  titleEn: string;

  @ApiProperty({ description: 'Product group name in Amharic', example: 'ወተት' })
  titleAm: string;

  @ApiProperty({ description: 'Category ID this group belongs to', example: 1 })
  categoryId: number;

  @ApiProperty({ description: 'Parent category name in English', example: 'Dairy Products' })
  categoryTitleEn: string;

  @ApiProperty({ description: 'Parent category name in Amharic', example: 'የወተት ተዋጽኦዎች' })
  categoryTitleAm: string;

  @ApiProperty({ description: 'Product group image URL', nullable: true })
  image: string | null;

  @ApiProperty({ description: 'Number of brands in this group', example: 2 })
  brandCount: number;
}
