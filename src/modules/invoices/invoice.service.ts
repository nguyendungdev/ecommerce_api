import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItemService } from '@order-item/order-item.service';
import { UserService } from '@users/user.service';
import { Session } from '@sessions/entities/session.entity';
import { InvoiceRepository } from './invoice.repository';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesMessage } from './invoice.constants';
@Injectable()
export class InvoiceService {
  constructor(
    private readonly orderItemService: OrderItemService,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly userService: UserService,
  ) {}

  async getAllInvoice(sessionId: Session['id']): Promise<Invoice[]> {
    const userId = await this.userService.getBySessionId(sessionId);
    const invoices = await this.invoiceRepository.getAllByUserId(userId[0].id);
    if (!invoices || invoices.length === 0) {
      throw new NotFoundException(InvoicesMessage.NOT_FOUND_BY_ORDER_ID);
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
