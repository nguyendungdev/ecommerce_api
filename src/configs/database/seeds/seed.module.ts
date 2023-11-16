import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '@products/product.module';
import { CategoryModule } from '@categories/category.module';
import { PaymentModule } from '@payments/payment.module';
import { OrderModule } from '@orders/order.module';
import { InvoiceModule } from '@invoices/invoice.module';
import { EmailModule } from '@email/email.module';
import { ReviewModule } from '@reviews/review.module';
import { ForgotModule } from '@forgot/forgot.module';
import { SessionModule } from '@sessions/session.module';
import { AuthModule } from '@auth/auth.module';
import { CategorySeedModule } from './categories/category-seed.module';
import { UserSeedModule } from './users/user-seed.module';
import { TypeOrmConfig } from '../typeorm.config';
import { ProductSeedModule } from './products/product-seed.module';
import { CategoryProductSeedModule } from './category-product/category-product-seed.module';
@Module({
  imports: [
    UserSeedModule,
    AuthModule,
    OrderModule,
    PaymentModule,
    InvoiceModule,
    EmailModule,
    ReviewModule,
    ForgotModule,
    SessionModule,
    CategoryProductSeedModule,
    CategorySeedModule,
    ProductSeedModule,
    TypeOrmModule.forRoot(TypeOrmConfig),
  ],
})
export class SeedModule {}
