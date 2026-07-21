import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DiscountResponseDto {
  @ApiProperty({ description: 'Discount unique identifier' })
  id: string;

  @ApiProperty({ description: 'NAV item number', example: 'ITEM-0001' })
  itemId: string;

  @ApiProperty({ description: 'Item title in English' })
  titleEn: string;

  @ApiPropertyOptional({ description: 'Item title in Amharic' })
  titleAm?: string;

  @ApiPropertyOptional({ description: 'Item unit of measure' })
  uom?: string;

  @ApiProperty({ description: 'Discount percentage', example: 10 })
  discountPer: number;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: string;
}
