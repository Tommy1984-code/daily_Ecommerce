import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { FeaturedCategoryService } from './featured-category.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import { CreateFeaturedCategoryDto } from './dto/create-featured-category.dto';
import { FeaturedCategoryResponseDto } from './dto/featured-category-response.dto';
import { FeaturedCategoryQueryDto } from './dto/featured-category-query.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ToggleBrandFeaturedDto } from './dto/toggle-brand-featured.dto';
import { PaginatedResponse } from '../product/dto/pagination.dto';

@ApiTags('Product - Featured Categories')
@ApiBearerAuth()
@Controller('product/featured-categories')
export class FeaturedCategoryController {
  constructor(private readonly featured: FeaturedCategoryService) {}

  @Get()
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List featured categories', description: 'Returns paginated featured categories with search.' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'q', required: false, example: 'bakery' })
  @ApiOkResponse({ description: 'Paginated list of featured categories' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async findAll(@Query() query: FeaturedCategoryQueryDto): Promise<PaginatedResponse<FeaturedCategoryResponseDto>> {
    return this.featured.findAll(query.page, query.limit, query.q);
  }

  @Post()
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Create featured category', description: 'Marks a product group as featured with selected brands and optional banner.' })
  @ApiCreatedResponse({ description: 'Featured category created' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Product group not found' })
  async create(@Body() dto: CreateFeaturedCategoryDto): Promise<FeaturedCategoryResponseDto> {
    return this.featured.create(dto);
  }

  @Patch(':id/banner')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Update banner', description: 'Updates the banner image for a product group.' })
  @ApiOkResponse({ description: 'Banner updated' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Product group not found' })
  async updateBanner(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBannerDto): Promise<FeaturedCategoryResponseDto> {
    return this.featured.updateBanner(id, dto.featuredImage);
  }

  @Patch(':id/toggle-featured')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Toggle brand featured', description: 'Toggles featured flag on a brand within a product group.' })
  @ApiOkResponse({ description: 'Brand featured toggled' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Brand not found' })
  async toggleBrandFeatured(@Param('id', ParseIntPipe) id: number, @Body() dto: ToggleBrandFeaturedDto): Promise<FeaturedCategoryResponseDto> {
    return this.featured.toggleBrandFeatured(id, dto.brandId);
  }

  @Patch(':id/toggle')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Toggle category featured', description: 'Toggles the featured flag on a product group.' })
  @ApiOkResponse({ description: 'Category featured toggled' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Product group not found' })
  async toggleFeatured(@Param('id', ParseIntPipe) id: number): Promise<FeaturedCategoryResponseDto> {
    return this.featured.toggleFeatured(id);
  }
}
