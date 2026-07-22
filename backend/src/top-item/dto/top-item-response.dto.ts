import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TopItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  itemId: number;

  @ApiProperty()
  titleEn: string;

  @ApiPropertyOptional()
  titleAm: string | null;

  @ApiPropertyOptional()
  image: string | null;
}
