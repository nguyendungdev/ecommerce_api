import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmConfig } from './configs/database/typeorm.config';
import { CategoryModule } from './modules/categories/category.module';
import { OrderModule } from './modules/order/order.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/user/guards/roles.guard';
import { PaymentModule } from './modules/payment/payment.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { EmailModule } from './modules/email/email.module';
import { EmailConfirmationGuard } from './modules/email/guards/emailConfirmation.guard';

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
