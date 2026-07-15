import { Module } from '@nestjs/common';
import { FeaturedCategoryController } from './featured-category.controller';
import { FeaturedCategoryService } from './featured-category.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FeaturedCategoryController],
  providers: [FeaturedCategoryService],
  exports: [FeaturedCategoryService],
})
export class FeaturedCategoryModule {}
