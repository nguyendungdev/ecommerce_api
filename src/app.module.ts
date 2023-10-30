import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/products/product.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { TypeOrmConfig } from './configs/database/typeorm.config';
import { CategoryModule } from './modules/categories/category.module';
import { OrderModule } from './modules/orders/order.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/users/guards/roles.guard';
import { PaymentModule } from './modules/payments/payment.module';
import { InvoiceModule } from './modules/invoices/invoice.module';
import { EmailModule } from './modules/email/email.module';
import { ReviewModule } from './modules/reviews/review.module';

@Module({
   imports: [
      TypeOrmModule.forRoot(TypeOrmConfig),
      ProductModule,
      AuthModule,
      UserModule,
      CategoryModule,
      OrderModule,
      PaymentModule,
      InvoiceModule,
      EmailModule,
      ReviewModule,
   ],
   controllers: [],
   providers: [
      {
         provide: APP_GUARD,
         useClass: RolesGuard,
      },
   ],
})
export class AppModule {}
