import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { validateEnvironment } from './config/validation.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { ServicesModule } from './modules/services/services.module.js';
import { TagsModule } from './modules/tags/tags.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate: validateEnvironment,
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    ServicesModule,
    TagsModule,
    OrdersModule,
    PaymentsModule,
    CategoriesModule,
    CloudinaryModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
