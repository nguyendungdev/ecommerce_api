import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './oder-item.entity';
import { OrderRepository } from './order.repository';
import { Invoice } from '../invoice/invoice.entity';
import { ProductModule } from '../product/product.module';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
   imports: [TypeOrmModule.forFeature([Order, OrderItem]), ProductModule],
   providers: [OrderService, OrderRepository],
   controllers: [OrderController],
   exports: [OrderService],
})
export class OrderModule {}
