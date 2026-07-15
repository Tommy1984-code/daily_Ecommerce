import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ValidationPipe } from '@nestjs/common';
import { envSchema } from './config/env.schema';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { StaffModule } from './staff/staff.module';
import { RbacModule } from './rbac/rbac.module';
import { ProductModule } from './product/product.module';
import { PriceModule } from './price/price.module';
import { DiscountModule } from './discount/discount.module';
import { ComboModule } from './combo/combo.module';
import { TopItemModule } from './top-item/top-item.module';
import { LandMarkPriceModule } from './land-mark-price/land-mark-price.module';
import { FeaturedCategoryModule } from './featured-category/featured-category.module';
import { AccessGuard } from './auth/guards/access.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        const parsed = envSchema.safeParse(env);
        if (!parsed.success) {
          throw new Error(`Environment validation failed: ${parsed.error.message}`);
        }
        return parsed.data;
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 60,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    CustomersModule,
    StaffModule,
    RbacModule,
    ProductModule,
    PriceModule,
    DiscountModule,
    ComboModule,
    TopItemModule,
    LandMarkPriceModule,
    FeaturedCategoryModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AccessGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
