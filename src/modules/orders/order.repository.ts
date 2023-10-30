import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrderRepository extends Repository<Order> {
   constructor(private dataSource: DataSource) {
      super(Order, dataSource.createEntityManager());
   }

   async getByUserId(userId: User['id']) {
      const orders = await this.query(`
      select o.shipment_date,o.shipped_to,o.status,p.name,oi.quanity,oi.total_price
      from "order" o
      inner join order_item oi on o.id = oi.order_id
      inner join product p on p.id = oi.product_id
      where user_id = '${userId}'
      and o.delete_at is null 
      limit 1;
      `);
      return orders;
   }

   async getOneOrderById(id: Order['id']) {
      const order = await this.query(`select *
            from "order"
            where id = '${id}'
            and delete_at is null 
            limit 1;`);
      return order;
   }
}
