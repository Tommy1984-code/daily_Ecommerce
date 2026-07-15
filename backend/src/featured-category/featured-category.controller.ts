import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { FeaturedCategoryService } from './featured-category.service';
import { RBAC } from '../auth/decorators/roles.decorator';
import { FeaturedCategoryResponseDto } from './dto/featured-category-response.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ToggleBrandFeaturedDto } from './dto/toggle-brand-featured.dto';

@ApiTags('Product - Featured Categories')
@ApiBearerAuth()
@Controller('product/featured-categories')
export class FeaturedCategoryController {
  constructor(private readonly featured: FeaturedCategoryService) {}

  @Get()
  @RBAC('product', 'read')
  @ApiOperation({ summary: 'List featured categories', description: 'Returns product groups with featured=true and their brands.' })
  @ApiOkResponse({ description: 'List of featured categories' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async findAll(): Promise<FeaturedCategoryResponseDto[]> {
    return this.featured.findAll();
  }

  @Patch(':id/banner')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Update banner', description: 'Updates the featuredImage for a product group.' })
  @ApiOkResponse({ description: 'Banner updated' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Product group not found' })
  async updateBanner(@Param('id') id: string, @Body() dto: UpdateBannerDto): Promise<FeaturedCategoryResponseDto> {
    return this.featured.updateBanner(id, dto.featuredImage);
  }

  @Patch(':id/toggle-featured')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Toggle brand featured', description: 'Toggles featured flag on a brand within a product group.' })
  @ApiOkResponse({ description: 'Brand featured toggled' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Brand not found' })
  async toggleBrandFeatured(@Param('id') id: string, @Body() dto: ToggleBrandFeaturedDto): Promise<FeaturedCategoryResponseDto> {
    return this.featured.toggleBrandFeatured(id, dto.brandId, dto.featured);
  }

  @Patch(':id/toggle')
  @RBAC('product', 'write')
  @ApiOperation({ summary: 'Toggle category featured', description: 'Toggles the featured flag on a product group.' })
  @ApiOkResponse({ description: 'Category featured toggled' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer token' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Product group not found' })
  async toggleFeatured(@Param('id') id: string): Promise<FeaturedCategoryResponseDto> {
    return this.featured.toggleFeatured(id);
  }
}
