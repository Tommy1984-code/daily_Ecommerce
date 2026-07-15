import { IsEmail, IsString, MinLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({
    description: 'Staff email address',
    example: 'staff@dailymart.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Staff password (minimum 6 characters)',
    example: 'securePass123',
    required: true,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Staff full name',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Role UUID to assign to this staff member',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  @IsUUID()
  roleId: string;
}
