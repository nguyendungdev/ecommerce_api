import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repository';
import { OrderModule } from '../order/order.module';

@Module({
   imports: [TypeOrmModule.forFeature([Invoice]), OrderModule],
   controllers: [InvoiceController],
   providers: [InvoiceService, InvoiceRepository],
   exports: [InvoiceService],
})
export class InvoiceModule {}
