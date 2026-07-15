import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StaffLoginDto {
  @ApiProperty({
    description: 'Staff email address',
    example: 'rootme1984@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Staff password',
    example: 'admin123',
    required: true,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
