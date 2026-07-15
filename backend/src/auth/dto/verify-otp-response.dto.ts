import { ApiProperty } from '@nestjs/swagger';

class CustomerUser {
  @ApiProperty({ description: 'Customer unique identifier', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Customer phone number', example: '+251911234567' })
  phone: string;
}

export class VerifyOtpResponseDto {
  @ApiProperty({ description: 'JWT access token for API authorization', example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ description: 'Whether this is a newly registered customer', example: true })
  isNew: boolean;

  @ApiProperty({ description: 'Authenticated customer details', type: CustomerUser })
  user: CustomerUser;
}
