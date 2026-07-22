import { Body, Controller, Delete, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import {
  ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { TopItemService } from './top-item.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import { CreateTopItemDto } from './dto/create-top-item.dto';
import { TopItemResponseDto } from './dto/top-item-response.dto';

@ApiTags('Product - Top Items')
@ApiBearerAuth()
@Controller('product/top-items')
export class TopItemController {
  constructor(private readonly topItem: TopItemService) {}

  @Get()
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List top items', description: 'Returns all top items with item info.' })
  @ApiOkResponse({ description: 'List of top items' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async findAll(): Promise<TopItemResponseDto[]> {
    return this.topItem.findAll();
  }

  @Post()
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Add top item', description: 'Adds an item to top items by navItemNo.' })
  @ApiOkResponse({ description: 'Top item created' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async create(@Body() dto: CreateTopItemDto): Promise<TopItemResponseDto> {
    return this.topItem.create(dto);
  }

  @Delete(':id')
  @RBAC('product', 'delete')
  @ApiOperation({ summary: 'Remove top item', description: 'Removes an item from top items.' })
  @ApiOkResponse({ description: 'Top item removed' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Top item not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.topItem.remove(id);
  }
}
