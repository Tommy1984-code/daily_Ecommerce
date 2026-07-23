import { IsEmail, IsString, IsIn, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'STAFF', enum: ['ADMIN', 'STAFF', 'USER'] })
  @IsString()
  @IsIn(['ADMIN', 'STAFF', 'USER'])
  role: string;

  @ApiProperty({ example: 'P@ssw0rd', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
