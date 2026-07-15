import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTopItemDto {
  @ApiProperty()
  @IsString()
  navItemNo: string;
}
