import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: 'Category unique identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'NAV category ID', example: 'CAT-001' })
  categoryId: string;

  @ApiProperty({ description: 'Category name in English', example: 'Dairy Products' })
  titleEn: string;

  @ApiProperty({ description: 'Category name in Amharic', example: 'የወተት ተዋጽኦዎች' })
  titleAm: string;

  @ApiProperty({ description: 'Category image URL', example: 'https://cdn.example.com/images/dairy.jpg', nullable: true })
  image: string | null;

  @ApiProperty({ description: 'Number of product groups in this category', example: 3 })
  productGroupCount: number;
}
