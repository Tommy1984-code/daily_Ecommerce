import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: 'Category unique identifier', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Category name in English', example: 'Dairy Products' })
  titleEn: string;

  @ApiProperty({ description: 'Category name in Amharic', example: 'የወተት ተዋጽኦዎች' })
  titleAm: string;

  @ApiProperty({ description: 'Category image URL', example: 'https://cdn.example.com/images/dairy.jpg', nullable: true })
  image: string | null;

  @ApiProperty({ description: 'Number of product groups in this category', example: 3 })
  productGroupCount: number;

  @ApiProperty({ description: 'Last sync timestamp from NAV', example: '2026-07-15T10:00:00.000Z' })
  syncedAt: string;
}
