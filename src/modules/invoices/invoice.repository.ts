import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoiceRepository extends Repository<Invoice> {
   constructor(private dataSource: DataSource) {
      super(Invoice, dataSource.createEntityManager());
   }

   async getAllByUserId(id: string) {
      const invoices = await this.query(`select i.*
                    from invoice i
                    inner join "order" o on o.id = i.order_id
                    where o.user_id = '${id}'`);
      return invoices;
   }
   async getAllByOrderId(id: string) {
      const invoices = await this.query(`select *
                    from invoice
                    where order_id = '${id}'`);
      return invoices;
   }
}
