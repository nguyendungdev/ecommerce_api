import { Module } from '@nestjs/common';
import { OrderItem } from '@order-item/entites/oder-item.entity';
import { UserModule } from '@users/user.module';
import { OrderItemRepository } from '@order-item/order-item.repository';
import { OrderItemModule } from '@order-item/order-item.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UserModule,
    OrderItemModule,
  ],
  providers: [OrderService, OrderRepository, OrderItemRepository],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule { }
