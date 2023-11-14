import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { DeletePaymentDto } from './dto/delete-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async addPayment(createPaymentDto: CreatePaymentDto): Promise<void> {
    const { payment_method, user_id, expiry, prodiver, acount_no } =
      createPaymentDto;
    const newPayments = this.paymentRepository.create({
      payment_method,
      acount_no,
      expiry,
      prodiver,
      user_id,
    });

    await newPayments.save();
  }

  async updatePayments(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<void> {
    await this.paymentRepository.update(id, updatePaymentDto);
  }

  async findPayments(userId: string): Promise<Payment[]> {
    const payments = await this.paymentRepository.findBy({
      user_id: userId,
    });
    if (!payments || payments.length === 0) {
      throw new NotFoundException(`User has no payment`);
    }
    return payments;
  }

  async findPayment(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOneBy({
      id: id,
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async deletePayment(deletePaymentDto: DeletePaymentDto): Promise<void> {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .softDelete()
      .from(Payment)
      .where('id = :id AND user_id = :userId', {
        id: deletePaymentDto.id,
        user_id: deletePaymentDto.user_id,
      })
      .execute();
    if (result.affected === 0) {
      throw new NotFoundException(
        `Payment with id ${deletePaymentDto.id} not found!!`,
      );
    }
  }
}
