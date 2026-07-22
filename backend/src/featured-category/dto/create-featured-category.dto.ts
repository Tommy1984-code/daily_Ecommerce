import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';

export class CreateFeaturedCategoryDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  productId: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  brandIds: number[];
}
