import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { NullableType } from '@common/types/nullable.type';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoiceRepository extends Repository<Invoice> {
  constructor(private dataSource: DataSource) {
    super(Invoice, dataSource.createEntityManager());
  }

  async getAllByUserId(id: string): Promise<NullableType<Invoice[]>> {
    const invoices = await this.query(
      `
                    select number,invoice_date,invoice_total,due_date,payment_date,payment_id,order_id
                    from invoice
                    inner join "order" o on o.id = invoice.order_id
                    where o.user_id = $1`,
      [id],
    );
    return invoices;
  }
  async getAllByOrderId(id: string): Promise<NullableType<Invoice[]>> {
    const invoices = await this.query(
      `
                   select number,invoice_date,invoice_total,due_date,payment_date,payment_id,order_id
                   from invoice
                   where order_id = $1`,
      [id],
    );
    return invoices;
  }
}
