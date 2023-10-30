import { Repository, DataSource } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentRepository extends Repository<Payment> {
   constructor(private dataSource: DataSource) {
      super(Payment, dataSource.createEntityManager());
   }
}
