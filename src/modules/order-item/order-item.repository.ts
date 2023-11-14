import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { OrderItem } from './entites/oder-item.entity';

@Injectable()
export class OrderItemRepository extends Repository<OrderItem> {
  constructor(private dataSource: DataSource) {
    super(OrderItem, dataSource.createEntityManager());
  }
  async findByOrderId(id: OrderItem['order_id']) {
    const item = await this.query(
      `
      select id
      from order_item
      where order_id = $1
      and delete_at is null;
    `,
      [id],
    );
    return item;
  }
}
