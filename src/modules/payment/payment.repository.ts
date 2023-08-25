import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentRepository extends Repository<Payment> {}
