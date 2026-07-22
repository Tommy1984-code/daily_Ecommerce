import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateTopItemDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  itemId: number;
}
