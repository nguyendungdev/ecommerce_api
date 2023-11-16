import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { Session } from '@sessions/entities/session.entity';
import { UserService } from '@users/user.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly userService: UserService,
  ) {}

  async addPayment(
    sessionId: Session['id'],
    createPaymentDto: CreatePaymentDto,
  ): Promise<void> {
    const userId = await this.userService.getBySessionId(sessionId);
    const { payment_method, expiry, prodiver, acount_no } = createPaymentDto;
    const newPayments = this.paymentRepository.create({
      payment_method,
      acount_no,
      expiry,
      prodiver,
      user_id: userId[0].id,
    });
    await newPayments.save();
  }

  async updatePayments(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<void> {
    await this.paymentRepository.update(id, updatePaymentDto);
  }

  async findPayments(sessionId: Session['id']): Promise<Payment[]> {
    const userId = await this.userService.getBySessionId(sessionId);
    const payments = await this.paymentRepository.findBy({
      user_id: userId[0].id,
    });
    if (!payments || payments.length === 0) {
      throw new NotFoundException(`User has no payment`);
    }
    return payments;
  }

  async deletePayment(id: Payment['id']): Promise<void> {
    await this.paymentRepository.softDelete(id);
  }
}
