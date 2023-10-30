import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { OrderService } from '../order/order.service';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
@Injectable()
export class InvoiceService {
   constructor(
      private readonly orderService: OrderService,
      private readonly invoiceRepository: InvoiceRepository,
   ) {}
   /**
    * Get all invoices for a specific order.
    * @param id string - ID of the order.
    * @returns Promise<Invoice[]> - Array of Invoice objects for the order.
    * @throws NotFoundException - If no invoices are found for the order.
    */
   async getAllInvoice(id: string): Promise<Invoice[]> {
      const invoices = await this.invoiceRepository.getAllByOrderId(id);
      if (!invoices || invoices.length === 0) {
         throw new NotFoundException(
            `No invoices found for order with ID ${id}`,
         );
      }
      return invoices;
   }

   /**
    * Create a new invoice.
    * @param createInvoiceDto CreateInvoiceDto - Data for creating a new invoice.
    */
   async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<void> {
      const {
         number,
         invoice_date,
         due_date,
         payment_date,
         order_id,
         payment_id,
      } = createInvoiceDto;

      const invoiceTotal = await this.orderService.getInvoiceTotalPrice(
         order_id,
      );
      const newInvoice = await this.invoiceRepository.create({
         number,
         invoice_date,
         due_date,
         payment_date,
         order_id,
         payment_id,
         invoice_total: invoiceTotal,
      });
      await newInvoice.save();
   }

   /**
    * Delete an invoice by its ID.
    * @param id string - ID of the invoice to delete.
    * @throws NotFoundException - If the invoice is not found.
    */
   async delete(id: string): Promise<void> {
      const result = await this.invoiceRepository.softDelete(id);

      if (result.affected === 0) {
         throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
   }

   /**
    * Restore a soft-deleted invoice by its ID.
    * @param id string - ID of the invoice to restore.
    */
   async restore(id: string): Promise<void> {
      await this.invoiceRepository.restore(id);
   }

   /**
    * Update an invoice by its ID.
    * @param id string - ID of the invoice to update.
    * @param updateInvoiceDto UpdateInvoiceDto - Data to update the invoice.
    * @throws NotFoundException - If the invoice is not found.
    */
   async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<void> {
      const result = await this.invoiceRepository.update(id, updateInvoiceDto);

      if (result.affected === 0) {
         throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
   }
}
