import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandFeaturedDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  brandId: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  titleAm: string;

  @ApiProperty()
  featured: boolean;
}

export class FeaturedCategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  titleAm: string;

  @ApiPropertyOptional()
  image: string | null;

  @ApiPropertyOptional()
  featuredImage: string | null;

  @ApiProperty()
  brandCount: number;

  @ApiProperty({ type: [BrandFeaturedDto] })
  brands: BrandFeaturedDto[];
}
