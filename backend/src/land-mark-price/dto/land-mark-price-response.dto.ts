import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LandMarkResponseDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  titleAm: string;

  @ApiPropertyOptional()
  latitude: number | null;

  @ApiPropertyOptional()
  longitude: number | null;
}

export class ShopResponseDto {
  @ApiProperty()
  locationCode: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  titleAm: string;

  @ApiPropertyOptional()
  latitude: number | null;

  @ApiPropertyOptional()
  longitude: number | null;
}

export class DeliveryDateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty()
  titleAm: string;
}

export class TimeRangeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timeRange: string;
}

export class LandMarkPriceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  dateId: string;

  @ApiProperty()
  dateTitleEn: string;

  @ApiProperty()
  dateTitleAm: string;

  @ApiProperty()
  timeRange: string;

  @ApiProperty()
  landMarkCode: string;

  @ApiProperty()
  landMarkTitleEn: string;

  @ApiProperty()
  landMarkTitleAm: string;

  @ApiPropertyOptional()
  landMarkLatitude: number | null;

  @ApiPropertyOptional()
  landMarkLongitude: number | null;

  @ApiProperty()
  shopCode: string;

  @ApiProperty()
  shopTitleEn: string;

  @ApiProperty()
  shopTitleAm: string;

  @ApiProperty()
  price: number;
}

export class CreateLandMarkPriceDto {
  @ApiProperty()
  dateId: string;

  @ApiProperty()
  timeRange: string;

  @ApiProperty()
  landMarkCode: string;

  @ApiProperty()
  shopCode: string;

  @ApiProperty()
  price: number;
}

export class UpdateLandMarkPriceDto {
  @ApiProperty()
  price: number;
}
