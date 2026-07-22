import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandFeaturedDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  brandId: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  titleAm: string;
}

export class FeaturedCategoryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  titleAm: string;

  @ApiPropertyOptional()
  image: string | null;

  @ApiProperty()
  brandCount: number;

  @ApiProperty({ type: [BrandFeaturedDto] })
  brands: BrandFeaturedDto[];
}
