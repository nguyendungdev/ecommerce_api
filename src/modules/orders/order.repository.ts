import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { Injectable } from '@nestjs/common';
import { Session } from '@sessions/entities/session.entity';

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async getBySessionId(sessionId: Session['id']): Promise<Order[]> {
    const orders = await this.query(
      `
     select o.shipment_date,o.shipped_to,o.status,p.name,oi.quantity,oi.total_price,o.comment
      from "order" o
      inner join order_item oi on o.id = oi.order_id
      inner join product p on p.id = oi.product_id
      inner join session s on o.user_id = s.user_id
      where o.user_id = $1
      and o.delete_at is null
      limit 1;`,
      [sessionId],
    );
    if (!orders || orders.length === 0) {
      return null;
    }
    return orders;
  }

  async getOneOrderById(id: Order['id']) {
    const order = await this.query(
      `
            select id
            from "order"
            where id = $1
            and delete_at is null 
            limit 1;`[id],
    );
    return order;
  }
}
