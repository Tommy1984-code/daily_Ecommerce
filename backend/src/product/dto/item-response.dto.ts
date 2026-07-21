import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ItemPriceInfo {
  @ApiProperty({ description: 'Price ID from NAV', example: 'PR-001', nullable: true })
  priceId: string | null;

  @ApiProperty({ description: 'Branch ID', example: 'BRANCH-001' })
  branchId: string;

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

class ItemStockInfo {
  @ApiProperty({ description: 'Branch ID', example: 'BRANCH-001' })
  branchId: string;

  @ApiProperty({ description: 'Current stock quantity (unverified, from NAV sync)', example: 50 })
  qty: number;

  @ApiProperty({ description: 'Stock snapshot timestamp', example: '2026-07-15T10:00:00.000Z' })
  syncedAt: string;
}

export class ItemResponseDto {
  @ApiProperty({ description: 'NAV item number (primary key)', example: 'ITEM-0001' })
  itemId: string;

  @ApiProperty({ description: 'Item name in English', example: 'Fresh Milk 1L' })
  titleEn: string;

  @ApiProperty({ description: 'Item name in Amharic', example: 'እርጥብ ወተት 1 ሊትር' })
  titleAm: string;

  @ApiProperty({ description: 'Category ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  categoryId: string;

  @ApiProperty({ description: 'Product ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  productId: string;

  @ApiProperty({ description: 'Brand ID', example: '550e8400-e29b-41d4-a716-446655440002' })
  brandId: string;

  @ApiProperty({ description: 'Item image URL', nullable: true })
  image: string | null;

  @ApiProperty({ description: 'Specification in English', nullable: true })
  specificationsEn: string | null;

  @ApiProperty({ description: 'Specification in Amharic', nullable: true })
  specificationsAm: string | null;

  @ApiProperty({ description: 'Sales unit of measurement', example: 'PCS', nullable: true })
  salesUom: string | null;

  @ApiProperty({ description: 'Item status', example: 1 })
  status: number;

  @ApiProperty({ description: 'Category name in English' })
  categoryTitleEn: string;

  @ApiProperty({ description: 'Product group name in English' })
  productGroupTitleEn: string;

  @ApiProperty({ description: 'Brand name in English' })
  brandTitleEn: string;

  @ApiPropertyOptional({ description: 'Current price info', type: [ItemPriceInfo] })
  prices?: ItemPriceInfo[];

  @ApiPropertyOptional({ description: 'Stock snapshot (hint only, not verified)', type: [ItemStockInfo] })
  stockSnapshots?: ItemStockInfo[];

  @ApiProperty({ description: 'Last sync timestamp from NAV', example: '2026-07-15T10:00:00.000Z' })
  syncedAt: string;

  @ApiProperty({ description: 'Sync staleness note', example: 'Prices last updated 2 hours ago — confirm with branch' })
  stalenessNote: string;
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

  @ApiProperty({ description: 'Sales unit of measurement', nullable: true })
  salesUom: string | null;

  @ApiProperty({ description: 'Category name in English' })
  categoryTitleEn: string;

  @ApiProperty({ description: 'Product group name in English' })
  productGroupTitleEn: string;

  @ApiProperty({ description: 'Brand name in English' })
  brandTitleEn: string;

  @ApiProperty({ description: 'Last sync timestamp', example: '2026-07-15T10:00:00.000Z' })
  syncedAt: string;
}
