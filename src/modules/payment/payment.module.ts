import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentRepository } from './payment.repository';

@Module({
   imports: [TypeOrmModule.forFeature([Payment])],
   controllers: [PaymentController],
   providers: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
