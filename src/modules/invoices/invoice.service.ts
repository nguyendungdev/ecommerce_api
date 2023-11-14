import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItemService } from '@order-item/order-item.service';
import { InvoiceRepository } from './invoice.repository';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly orderItemService: OrderItemService,
    private readonly invoiceRepository: InvoiceRepository,
  ) { }

  async getAllInvoice(id: string): Promise<Invoice[]> {
    const invoices = await this.invoiceRepository.getAllByUserId(id);
    if (!invoices || invoices.length === 0) {
      throw new NotFoundException(`No invoices found for order with ID ${id}`);
    }
    return invoices;
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<void> {
    const {
      number,
      invoice_date,
      due_date,
      payment_date,
      order_id,
      payment_id,
    } = createInvoiceDto;

    const invoiceTotal = await this.orderItemService.getInvoiceTotalPrice(
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

  async delete(id: string): Promise<void> {
    await this.invoiceRepository.softDelete(id);

  }

  async restore(id: string): Promise<void> {
    await this.invoiceRepository.restore(id);
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<void> {
    await this.invoiceRepository.update(id, updateInvoiceDto);
  }
}
