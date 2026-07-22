import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @RBAC('staff', 'read')
  @ApiOperation({ summary: 'List all users' })
  list() {
    return this.userService.findAll();
  }

  @Get(':id')
  @RBAC('staff', 'read')
  @ApiOperation({ summary: 'Get user by id' })
  get(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @RBAC('staff', 'write')
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch(':id')
  @RBAC('staff', 'write')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @RBAC('staff', 'write')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get('audit')
  @RBAC('staff', 'read')
  @ApiOperation({ summary: 'Get audit logs' })
  auditLogs() {
    return this.userService.getAuditLogs();
  }
}
