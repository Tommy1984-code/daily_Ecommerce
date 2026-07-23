import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRiderDto {
  @ApiProperty({ example: 'Abebe Kebede' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: '0911234567' })
  @IsString()
  @MinLength(10)
  phone: string;
}
