import { Module } from '@nestjs/common';
import { ProductModule } from '@products/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemService } from './order-item.service';
import { OrderItemRepository } from './order-item.repository';
import { OrderItem } from './entites/oder-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem]), ProductModule],
  providers: [OrderItemRepository, OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
