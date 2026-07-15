import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DiscountResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  navItemNo: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  branchId: string;

  @ApiPropertyOptional()
  uom: string | null;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  discountPct: number | null;

  @ApiPropertyOptional()
  startDate: string | null;

  @ApiPropertyOptional()
  endDate: string | null;

  @ApiPropertyOptional()
  customerNo: string | null;
}
