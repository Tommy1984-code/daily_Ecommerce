import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiTags,
  ApiOperation, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBadRequestResponse,
} from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import { CreateStaffDto } from '../auth/dto/create-staff.dto';
import { StaffResponseDto } from './dto/staff-response.dto';

@ApiTags('Staff')
@ApiBearerAuth()
@Controller('staff')
export class StaffController {
  constructor(private readonly staff: StaffService) {}

  @Get()
  @RBAC('staff', 'read')
  @ApiOperation({ summary: 'List staff', description: 'Returns all staff members. Requires staff:read permission.' })
  @ApiOkResponse({ description: 'List of staff members', type: [StaffResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions (requires staff:read)' })
  async list() {
    return this.staff.findAll();
  }

  @Post()
  @RBAC('staff', 'write')
  @ApiOperation({ summary: 'Create staff', description: 'Creates a new staff member. Requires staff:write permission.' })
  @ApiCreatedResponse({ description: 'Staff member created', type: StaffResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid input data (validation failed)' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions (requires staff:write)' })
  async create(@Body() body: CreateStaffDto) {
    return this.staff.create(body);
  }
}
