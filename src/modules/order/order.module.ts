import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/oder-item.entity';
import { OrderRepository } from './order.repository';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { OrderItemRepository } from './order-item.repository';

@Module({
   imports: [
      TypeOrmModule.forFeature([Order, OrderItem]),
      ProductModule,
      UserModule,
   ],
   providers: [OrderService, OrderRepository, OrderItemRepository],
   controllers: [OrderController],
   exports: [OrderService],
})
export class OrderModule {}
