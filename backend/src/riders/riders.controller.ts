import { Controller, Get, Post, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RidersService } from './riders.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import { RiderResponseDto } from './dto/rider-response.dto';
import { RBAC } from '../auth/decorators/roles.decorator';

@ApiTags('Riders')
@ApiBearerAuth()
@Controller('riders')
export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  @Get()
  @RBAC('orders', 'read')
  @ApiOperation({ summary: 'List all active riders' })
  async findAll(): Promise<RiderResponseDto[]> {
    return this.ridersService.findAll();
  }

  @Get(':id')
  @RBAC('orders', 'read')
  @ApiOperation({ summary: 'Get rider by id' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RiderResponseDto> {
    return this.ridersService.findOne(id);
  }

  @Post()
  @RBAC('orders', 'write')
  @ApiOperation({ summary: 'Create a new rider' })
  async create(@Body() dto: CreateRiderDto): Promise<RiderResponseDto> {
    return this.ridersService.create(dto);
  }
}
