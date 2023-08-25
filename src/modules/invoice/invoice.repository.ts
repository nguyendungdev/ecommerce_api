import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoiceRepository extends Repository<Invoice> {}
