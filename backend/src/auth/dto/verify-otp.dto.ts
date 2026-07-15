import { IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Customer phone number in international format',
    example: '+251911234567',
    required: true,
  })
  @IsString()
  @Matches(/^\+?[1-9]\d{6,14}$/, { message: 'Invalid phone number format' })
  phone: string;

  @ApiProperty({
    description: 'OTP code received via SMS',
    example: '483920',
    required: true,
  })
  @IsString()
  @Length(4, 8)
  code: string;
}
