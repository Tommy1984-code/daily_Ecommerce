import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ComboService } from './combo.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import { ComboQueryDto } from './dto/combo-query.dto';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { ComboHeaderResponseDto } from './dto/combo-response.dto';
import { PaginatedResponse } from '../product/dto/pagination.dto';

@ApiTags('Product - Combos')
@ApiBearerAuth()
@Controller('product/combos')
export class ComboController {
  constructor(private readonly combo: ComboService) {}

  @Get()
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List combos', description: 'Returns paginated list of combo headers with line count.' })
  @ApiOkResponse({ description: 'Paginated list of combos' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async findAll(@Query() query: ComboQueryDto): Promise<PaginatedResponse<ComboHeaderResponseDto>> {
    return this.combo.findAll(query);
  }

  @Get(':id')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'Get combo by ID', description: 'Returns a single combo header with all lines.' })
  @ApiOkResponse({ description: 'Combo details with lines' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Combo not found' })
  async findOne(@Param('id') id: string): Promise<ComboHeaderResponseDto> {
    return this.combo.findOne(id);
  }

  @Post()
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Create combo', description: 'Creates a combo header with lines in a transaction.' })
  @ApiOkResponse({ description: 'Combo created' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() dto: CreateComboDto): Promise<ComboHeaderResponseDto> {
    return this.combo.create(dto);
  }

  @Patch(':id')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Update combo', description: 'Updates combo header fields (price, active).' })
  @ApiOkResponse({ description: 'Combo updated' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Combo not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateComboDto): Promise<ComboHeaderResponseDto> {
    return this.combo.update(id, dto);
  }

  @Delete(':id')
  @RBAC('product', 'delete')
  @ApiOperation({ summary: 'Delete combo', description: 'Deletes a combo header (cascades lines).' })
  @ApiOkResponse({ description: 'Combo deleted' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Combo not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.combo.remove(id);
  }
}
