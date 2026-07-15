import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class ToggleBrandFeaturedDto {
  @ApiProperty()
  @IsString()
  brandId: string;

  @ApiProperty()
  @IsBoolean()
  featured: boolean;
}
