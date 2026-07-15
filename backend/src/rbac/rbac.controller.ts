import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiTags,
  ApiOperation, ApiUnauthorizedResponse, ApiForbiddenResponse,
  ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { ResourceResponseDto } from './dto/resource-response.dto';

@ApiTags('RBAC')
@ApiBearerAuth()
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbac: RbacService) {}

  @Get('roles')
  @RBAC('roles', 'read')
  @ApiOperation({ summary: 'List roles', description: 'Returns all roles with their permissions. Requires roles:read permission.' })
  @ApiOkResponse({ description: 'List of roles', type: [RoleResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions (requires roles:read)' })
  async getRoles() {
    return this.rbac.getRoles();
  }

  @Get('resources')
  @RBAC('roles', 'read')
  @ApiOperation({ summary: 'List resources', description: 'Returns all available resources for permission assignment. Requires roles:read permission.' })
  @ApiOkResponse({ description: 'List of resources', type: [ResourceResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions (requires roles:read)' })
  async getResources() {
    return this.rbac.getResources();
  }

  @Post('roles')
  @RBAC('roles', 'write')
  @ApiOperation({ summary: 'Create role', description: 'Creates a new role. Requires roles:write permission.' })
  @ApiCreatedResponse({ description: 'Role created', type: RoleResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid input data (validation failed)' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions (requires roles:write)' })
  @ApiConflictResponse({ description: 'A role with this name already exists' })
  async createRole(@Body() body: CreateRoleDto) {
    return this.rbac.createRole(body.name, body.description);
  }

  @Post('permissions')
  @RBAC('roles', 'write')
  @ApiOperation({ summary: 'Assign permission', description: 'Assigns or updates permissions for a role on a resource. Requires roles:write permission.' })
  @ApiCreatedResponse({ description: 'Permission assigned', type: RoleResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid input data (validation failed)' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions (requires roles:write)' })
  @ApiNotFoundResponse({ description: 'Role or resource not found' })
  async assignPermission(@Body() body: AssignPermissionDto) {
    return this.rbac.assignPermission(body.roleId, body.resourceId, {
      canRead: body.canRead,
      canWrite: body.canWrite,
      canDelete: body.canDelete,
    });
  }
}
