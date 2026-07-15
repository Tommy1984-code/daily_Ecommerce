import { ApiProperty } from '@nestjs/swagger';

class RoleInfo {
  @ApiProperty({ description: 'Role unique identifier', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Role name', example: 'Super Admin' })
  name: string;

  @ApiProperty({ description: 'Role description', example: 'Full system access' })
  description: string;

  @ApiProperty({ description: 'Whether this is a system role', example: true })
  isSystem: boolean;

  @ApiProperty({ description: 'Role creation timestamp', example: '2026-07-15T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Role last update timestamp', example: '2026-07-15T10:00:00.000Z' })
  updatedAt: string;
}

class UserInfo {
  @ApiProperty({ description: 'Staff unique identifier', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Staff email address', example: 'rootme1984@gmail.com' })
  email: string;

  @ApiProperty({ description: 'Staff full name', example: 'Super Admin' })
  name: string;

  @ApiProperty({ description: 'Staff role details', type: RoleInfo })
  role: RoleInfo;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token for API authorization', example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ description: 'Authenticated user details', type: UserInfo })
  user: UserInfo;
}
