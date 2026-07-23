import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiPropertyOptional({ description: 'Payment reference number' })
  @IsString()
  @IsOptional()
  paymentReferenceNo?: string;

  @ApiPropertyOptional({ description: 'Payment description' })
  @IsString()
  @IsOptional()
  paymentDescription?: string;
}
