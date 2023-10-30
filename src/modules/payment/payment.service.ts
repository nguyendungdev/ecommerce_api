import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { DeletePaymentDto } from './dto/delete-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
   constructor(
      @InjectRepository(Payment)
      private readonly paymentRepository: PaymentRepository,
   ) {}
   /**
    * Create a new payment.
    *
    * @param createPaymentDto CreatePaymentDto - Data for creating a new payment.
    */
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

   /**
    * Update a payment by its ID.
    *
    * @param id string - Payment ID.
    * @param updatePaymentDto UpdatePaymentDto - Data for updating the payment.
    */
   async updatePayments(
      id: string,
      updatePaymentDto: UpdatePaymentDto,
   ): Promise<void> {
      await this.paymentRepository.update(id, updatePaymentDto);
   }

   /**
    * Find all payments for a specific user.
    *
    * @param userId string - ID of the user.
    * @returns Promise<Payment[]> - Array of Payment objects.
    * @throws NotFoundException - If no payments are found for the user.
    */
   async findPayments(userId: string): Promise<Payment[]> {
      const payments = await this.paymentRepository.findBy({
         user_id: userId,
      });
      if (!payments || payments.length === 0) {
         throw new NotFoundException(`User has no payment`);
      }
      return payments;
   }

   /**
    * Find a payment by its ID.
    *
    * @param id string - Payment ID.
    * @returns Promise<Payment> - Payment object if found.
    */
   async findPayment(id: string): Promise<Payment> {
      const payment = await this.paymentRepository.findOneBy({
         id: id,
      });
      if (!payment) {
         throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      return payment;
   }

   /**
    * Delete a payment.
    *
    * @param deletePaymentDto DeletePaymentDto - Data for deleting a payment.
    * @throws NotFoundException - If the payment is not found.
    */
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
