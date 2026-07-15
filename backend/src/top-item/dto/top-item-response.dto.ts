import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TopItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  navItemNo: string;

  @ApiProperty()
  titleEn: string;

  @ApiPropertyOptional()
  titleAm: string | null;

  @ApiPropertyOptional()
  image: string | null;

  @ApiProperty()
  createdAt: string;
}
