import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelOrderDto {
  @ApiProperty({ description: 'Reason for cancellation', example: 'Customer requested cancellation' })
  @IsString()
  @MinLength(3)
  reason: string;
}
