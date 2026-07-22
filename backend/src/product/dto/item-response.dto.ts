import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ItemPriceInfo {
  @ApiProperty({ description: 'Price ID from NAV', example: 'PR-001', nullable: true })
  priceId: string | null;

  @ApiProperty({ description: 'Unit of measure', example: 'PCS', nullable: true })
  uom: string | null;

  @ApiProperty({ description: 'Selling price', example: 45.50 })
  price: number;

  @ApiProperty({ description: 'Price valid from date', nullable: true })
  startDate: string | null;

  @ApiProperty({ description: 'Price valid to date', nullable: true })
  endDate: string | null;

  @ApiProperty({ description: 'Customer number/type filter', example: 'SCO%', nullable: true })
  customerNo: string | null;
}

export class ItemResponseDto {
  @ApiProperty({ description: 'NAV item number (primary key)', example: 'ITEM-0001' })
  itemId: string;

  @ApiProperty({ description: 'Item name in English', example: 'Fresh Milk 1L' })
  titleEn: string;

  @ApiProperty({ description: 'Item name in Amharic', example: 'እርጥብ ወተት 1 ሊትር' })
  titleAm: string;

  @ApiProperty({ description: 'Category ID', example: 1 })
  categoryId: number;

  @ApiProperty({ description: 'Product ID', example: 1 })
  productId: number;

  @ApiProperty({ description: 'Brand ID', example: 1 })
  brandId: number;

  @ApiProperty({ description: 'Item image URL', nullable: true })
  image: string | null;

  @ApiProperty({ description: 'Specification in English', nullable: true })
  specificationsEn: string | null;

  @ApiProperty({ description: 'Specification in Amharic', nullable: true })
  specificationsAm: string | null;

  @ApiProperty({ description: 'Category name in English' })
  categoryTitleEn: string;

  @ApiProperty({ description: 'Product group name in English' })
  productGroupTitleEn: string;

  @ApiProperty({ description: 'Brand name in English' })
  brandTitleEn: string;

  @ApiPropertyOptional({ description: 'Current price info', type: [ItemPriceInfo] })
  prices?: ItemPriceInfo[];
}

export class ItemSearchResultDto {
  @ApiProperty({ description: 'NAV item number', example: 'ITEM-0001' })
  itemId: string;

  @ApiProperty({ description: 'Item name in English', example: 'Fresh Milk 1L' })
  titleEn: string;

  @ApiProperty({ description: 'Item name in Amharic', example: 'እርጥብ ወተት 1 ሊትር' })
  titleAm: string;

  @ApiProperty({ description: 'Current selling price', example: 45.50, nullable: true })
  price: number | null;

  @ApiProperty({ description: 'Item image URL', nullable: true })
  image: string | null;

  @ApiProperty({ description: 'Category name in English' })
  categoryTitleEn: string;

  @ApiProperty({ description: 'Product group name in English' })
  productGroupTitleEn: string;

  @ApiProperty({ description: 'Brand name in English' })
  brandTitleEn: string;
}
