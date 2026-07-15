import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OtpResponseDto {
  @ApiProperty({
    description: 'Status message',
    example: 'OTP sent successfully',
    required: true,
  })
  message: string;

  @ApiPropertyOptional({
    description: 'OTP code for debugging (only in development)',
    example: '483920',
  })
  debugCode?: string;
}
