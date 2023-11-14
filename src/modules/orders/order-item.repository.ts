import { Repository, DataSource } from 'typeorm';
import { OrderItem } from './entities/oder-item.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderItemRepository extends Repository<OrderItem> {
   constructor(private dataSource: DataSource) {
      super(OrderItem, dataSource.createEntityManager());
   }
}
