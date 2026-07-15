import { ApiProperty } from '@nestjs/swagger';

export class BrandResponseDto {
  @ApiProperty({ description: 'Brand unique identifier', example: '550e8400-e29b-41d4-a716-446655440002' })
  id: string;

  @ApiProperty({ description: 'Brand name in English', example: 'Family' })
  titleEn: string;

  @ApiProperty({ description: 'Brand name in Amharic', example: 'ፋሚሊ' })
  titleAm: string;

  @ApiProperty({ description: 'Product group ID this brand belongs to', example: '550e8400-e29b-41d4-a716-446655440001' })
  productGroupId: string;

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

  @ApiProperty({ description: 'Last sync timestamp from NAV', example: '2026-07-15T10:00:00.000Z' })
  syncedAt: string;
}
