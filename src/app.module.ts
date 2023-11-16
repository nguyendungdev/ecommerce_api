import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '@products/product.module';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@users/user.module';
import { TypeOrmConfig } from '@configs/database/typeorm.config';
import { CategoryModule } from '@categories/category.module';
import { OrderModule } from '@orders/order.module';
import { PaymentModule } from '@payments/payment.module';
import { InvoiceModule } from '@invoices/invoice.module';
import { EmailModule } from '@email/email.module';
import { ReviewModule } from '@reviews/review.module';
import { ForgotModule } from '@forgot/forgot.module';
import { SessionModule } from '@sessions/session.module';
import { OrderItemModule } from '@order-item/order-item.module';
import { CategoryProductModule } from '@category-product/category-product.module';
import LogsMiddleware from '@common/middlewares/logs.middleware';
@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    AuthModule,
    EmailModule,
    UserModule,
    PaymentModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    InvoiceModule,
    ReviewModule,
    ForgotModule,
    SessionModule,
    CategoryProductModule,
    OrderItemModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
