import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ToggleBrandFeaturedDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  brandId: number;
}
