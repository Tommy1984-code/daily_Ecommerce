import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PriceResponseDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  priceId: string | null;

  @ApiProperty()
  itemId: number;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  titleAm: string;

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
