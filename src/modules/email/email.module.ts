import { Module, forwardRef } from '@nestjs/common';
import { EmailService } from './email.service';
import { UserModule } from '../users/user.module';
import { EmailController } from './email.controller';
import { AuthModule } from '../../auth/auth.module';
@Module({
  imports: [UserModule, forwardRef(() => AuthModule)],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
