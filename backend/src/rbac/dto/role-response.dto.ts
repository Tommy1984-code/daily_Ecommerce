import { ApiProperty } from '@nestjs/swagger';

class ResourceInfo {
  @ApiProperty({ description: 'Resource unique identifier', example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ description: 'Resource name', example: 'orders' })
  name: string;

  @ApiProperty({ description: 'Resource description', example: 'orders management' })
  description: string;
}

class PermissionInfo {
  @ApiProperty({ description: 'Permission unique identifier', example: '550e8400-e29b-41d4-a716-446655440002' })
  id: string;

  @ApiProperty({ description: 'Role UUID this permission belongs to', example: '550e8400-e29b-41d4-a716-446655440000' })
  roleId: string;

  @ApiProperty({ description: 'Resource UUID this permission grants access to', example: '550e8400-e29b-41d4-a716-446655440001' })
  resourceId: string;

  @ApiProperty({ description: 'Whether read access is granted', example: true })
  canRead: boolean;

  @ApiProperty({ description: 'Whether write access is granted', example: true })
  canWrite: boolean;

  @ApiProperty({ description: 'Whether delete access is granted', example: true })
  canDelete: boolean;

  @ApiProperty({ description: 'Resource details', type: ResourceInfo })
  resource: ResourceInfo;
}

export class RoleResponseDto {
  @ApiProperty({ description: 'Role unique identifier', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Role name (unique)', example: 'Super Admin' })
  name: string;

  @ApiProperty({ description: 'Role description', example: 'Full system access' })
  description: string;

  @ApiProperty({ description: 'Whether this is a system-protected role', example: true })
  isSystem: boolean;

  @ApiProperty({ description: 'Role creation timestamp', example: '2026-07-15T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Role last update timestamp', example: '2026-07-15T10:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ description: 'List of permissions assigned to this role', type: [PermissionInfo] })
  permissions: PermissionInfo[];
}
