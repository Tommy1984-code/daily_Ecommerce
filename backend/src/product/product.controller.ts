import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import ApiError from '../common/errors/api.error';
import { ItemsQueryDto, ProductQueryDto } from './dto/product-query.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { ProductGroupResponseDto } from './dto/product-group-response.dto';
import { BrandResponseDto } from './dto/brand-response.dto';
import { ItemResponseDto, ItemSearchResultDto } from './dto/item-response.dto';
import { PaginatedResponse } from './dto/pagination.dto';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly product: ProductService) {}

  @Get('categories')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List categories', description: 'Returns paginated list of categories (Category 1). Supports search by English or Amharic name.' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'q', required: false, example: 'dairy' })
  @ApiOkResponse({ description: 'Paginated list of categories' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getCategories(@Query() query: ProductQueryDto): Promise<PaginatedResponse<CategoryResponseDto>> {
    return this.product.findAllCategories(query.page, query.limit, query.q);
  }

  @Get('groups')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List all product groups', description: 'Returns paginated list of ALL product groups (Category 2) with parent category info.' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'q', required: false, example: 'milk' })
  @ApiOkResponse({ description: 'Paginated list of product groups' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getAllGroups(@Query() query: ProductQueryDto): Promise<PaginatedResponse<ProductGroupResponseDto>> {
    return this.product.findAllGroups(query.page, query.limit, query.q);
  }

  @Get('brands')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List all brands', description: 'Returns paginated list of ALL brands (Category 3) with full hierarchy info.' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'q', required: false, example: 'family' })
  @ApiOkResponse({ description: 'Paginated list of brands' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getAllBrands(@Query() query: ProductQueryDto): Promise<PaginatedResponse<BrandResponseDto>> {
    return this.product.findAllBrands(query.page, query.limit, query.q);
  }

  @Get('categories/:id/groups')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List product groups by category', description: 'Returns paginated product groups (Category 2) for a given category.' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiOkResponse({ description: 'Paginated list of product groups' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  async getProductGroups(
    @Param('id') id: string,
    @Query() query: ProductQueryDto,
  ): Promise<PaginatedResponse<ProductGroupResponseDto>> {
    return this.product.findProductGroupsByCategory(id, query.page, query.limit, query.q);
  }

  @Get('groups/:id/brands')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List brands by product group', description: 'Returns paginated brands (Category 3) for a given product group.' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiOkResponse({ description: 'Paginated list of brands' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Product group not found' })
  async getBrands(
    @Param('id') id: string,
    @Query() query: ProductQueryDto,
  ): Promise<PaginatedResponse<BrandResponseDto>> {
    return this.product.findBrandsByProductGroup(id, query.page, query.limit, query.q);
  }

  @Get('items')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List items', description: 'Returns paginated items with optional filters by category, product group, brand, or search term.' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'q', required: false, example: 'milk' })
  @ApiQuery({ name: 'categoryId', required: false, example: 'uuid' })
  @ApiQuery({ name: 'productGroupId', required: false, example: 'uuid' })
  @ApiQuery({ name: 'brandId', required: false, example: 'uuid' })
  @ApiOkResponse({ description: 'Paginated list of items' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getItems(@Query() query: ItemsQueryDto): Promise<PaginatedResponse<ItemResponseDto>> {
    return this.product.findAllItems(query);
  }

  @Get('items/:navItemNo')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'Get item by NAV number', description: 'Returns a single item with price and stock snapshot details.' })
  @ApiOkResponse({ description: 'Item details with prices and stock' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async getItem(@Param('navItemNo') navItemNo: string): Promise<ItemResponseDto> {
    const item = await this.product.findItemByNavItemNo(navItemNo);
    if (!item) throw ApiError.NotFound('Item not found', 'ITEM_NOT_FOUND');
    return item;
  }

  @Get('search')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'Search items', description: 'Full-text search across item titles using pg_trgm similarity. Returns items ranked by relevance.' })
  @ApiQuery({ name: 'q', required: true, example: 'milk' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiOkResponse({ description: 'Paginated search results ranked by relevance' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async searchItems(
    @Query('q') q: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<PaginatedResponse<ItemSearchResultDto>> {
    return this.product.searchItems(q, Number(page), Number(limit));
  }
}
