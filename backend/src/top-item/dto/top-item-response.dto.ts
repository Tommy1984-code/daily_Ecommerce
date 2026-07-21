import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TopItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  titleEn: string;

  @ApiPropertyOptional()
  titleAm: string | null;

  @ApiPropertyOptional()
  image: string | null;

  @ApiProperty()
  createdAt: string;
}
