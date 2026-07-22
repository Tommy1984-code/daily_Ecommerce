import { Controller, Get, Param, ParseIntPipe, Query, Patch, Body, Delete, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import {
  ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse,
  ApiConsumes, ApiProperty,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import ApiError from '../common/errors/api.error';
import { ItemsQueryDto, ProductQueryDto } from './dto/product-query.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { ProductGroupResponseDto } from './dto/product-group-response.dto';
import { BrandResponseDto } from './dto/brand-response.dto';
import { ItemResponseDto, ItemSearchResultDto } from './dto/item-response.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginatedResponse } from './dto/pagination.dto';
import { IsUrl, IsOptional } from 'class-validator';

class UpdateImageDto {
  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Image URL' })
  @IsUrl()
  @IsOptional()
  image: string;
}

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
    @Param('id', ParseIntPipe) id: number,
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
    @Param('id', ParseIntPipe) id: number,
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
  @ApiQuery({ name: 'productId', required: false, example: 'uuid' })
  @ApiQuery({ name: 'brandId', required: false, example: 'uuid' })
  @ApiOkResponse({ description: 'Paginated list of items' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getItems(@Query() query: ItemsQueryDto): Promise<PaginatedResponse<ItemResponseDto>> {
    return this.product.findAllItems(query);
  }

  @Get('items/:itemId')
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'Get item by NAV number', description: 'Returns a single item with price and stock snapshot details.' })
  @ApiOkResponse({ description: 'Item details with prices and stock' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async getItem(@Param('itemId') itemId: string): Promise<ItemResponseDto> {
    const item = await this.product.findItemByItemId(itemId);
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

  @Patch('categories/:id/image')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Update category image', description: 'Updates the image URL for a category (Category 1). Data comes from NAV; only image is editable.' })
  @ApiOkResponse({ description: 'Updated category', type: CategoryResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  async updateCategoryImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateImageDto,
  ): Promise<CategoryResponseDto> {
    return this.product.updateCategoryImage(id, dto.image);
  }

  @Patch('groups/:id/image')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Update product group image', description: 'Updates the image URL for a product group (Category 2). Data comes from NAV; only image is editable.' })
  @ApiOkResponse({ description: 'Updated product group', type: ProductGroupResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Product group not found' })
  async updateProductGroupImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateImageDto,
  ): Promise<ProductGroupResponseDto> {
    return this.product.updateProductGroupImage(id, dto.image);
  }

  @Patch('brands/:id/image')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Update brand image', description: 'Updates the image URL for a brand (Category 3). Data comes from NAV; only image is editable.' })
  @ApiOkResponse({ description: 'Updated brand', type: BrandResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Brand not found' })
  async updateBrandImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateImageDto,
  ): Promise<BrandResponseDto> {
    return this.product.updateBrandImage(id, dto.image);
  }

  @Delete('categories/:id')
  @RBAC('product', 'delete')
  @ApiOperation({ summary: 'Delete category', description: 'Deletes a category (Category 1). Data comes from NAV; this is for local override only.' })
  @ApiOkResponse({ description: 'Category deleted' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.product.deleteCategory(id);
  }

  @Delete('groups/:id')
  @RBAC('product', 'delete')
  @ApiOperation({ summary: 'Delete product group', description: 'Deletes a product group (Category 2). Data comes from NAV; this is for local override only.' })
  @ApiOkResponse({ description: 'Product group deleted' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Product group not found' })
  async deleteProductGroup(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.product.deleteProductGroup(id);
  }

  @Delete('brands/:id')
  @RBAC('product', 'delete')
  @ApiOperation({ summary: 'Delete brand', description: 'Deletes a brand (Category 3). Data comes from NAV; this is for local override only.' })
  @ApiOkResponse({ description: 'Brand deleted' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Brand not found' })
  async deleteBrand(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.product.deleteBrand(id);
  }

  @Patch('items/:itemId')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Update item', description: 'Updates image and/or specifications for an item.' })
  @ApiOkResponse({ description: 'Item updated', type: ItemResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    const item = await this.product.updateItem(itemId, dto);
    if (!item) throw ApiError.NotFound('Item not found', 'ITEM_NOT_FOUND');
    return item;
  }

  @Delete('items/:itemId')
  @RBAC('product', 'delete')
  @ApiOperation({ summary: 'Delete item', description: 'Deletes an item and cascades prices/stock.' })
  @ApiOkResponse({ description: 'Item deleted' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async deleteItem(@Param('itemId') itemId: string): Promise<void> {
    await this.product.deleteItem(itemId);
  }

  @Post('items/import')
  @RBAC('product', 'write')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Import items', description: 'Imports items from a CSV or Excel file.' })
  @ApiOkResponse({ description: 'Items imported', schema: { example: { imported: 10, errors: [] } } })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async importItems(@UploadedFile() file: Multer.File): Promise<{ imported: number; errors: string[] }> {
    if (!file) throw ApiError.BadRequest('No file uploaded', 'NO_FILE');
    return this.product.importItems(file);
  }
}
