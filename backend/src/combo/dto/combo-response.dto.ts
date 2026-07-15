import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ComboLineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  headerId: string;

  @ApiProperty()
  navItemNo: string;

  @ApiProperty()
  titleEn: string;

  @ApiPropertyOptional()
  itemDescription: string | null;

  @ApiProperty()
  quantity: number;

  @ApiPropertyOptional()
  salesUom: string | null;
}

export class ComboHeaderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  navItemNo: string;

  @ApiProperty()
  titleEn: string;

  @ApiPropertyOptional()
  description: string | null;

  @ApiProperty()
  price: number;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  lineCount: number;

  @ApiPropertyOptional({ type: [ComboLineResponseDto] })
  lines?: ComboLineResponseDto[];

  @ApiProperty()
  createdAt: string;
}
