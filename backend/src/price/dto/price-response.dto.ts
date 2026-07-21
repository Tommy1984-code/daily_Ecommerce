import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PriceResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  priceId: string | null;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  titleAm: string;

  @ApiProperty()
  branchId: string;

  @ApiPropertyOptional()
  uom: string | null;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  startDate: string | null;

  @ApiPropertyOptional()
  endDate: string | null;

  @ApiPropertyOptional()
  customerNo: string | null;
}
