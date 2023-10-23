import { Module, forwardRef } from '@nestjs/common';
import EmailService from './email.service';
import { UserModule } from '../user/user.module';
import { EmailController } from './email.controller';
import { AuthModule } from 'src/auth/auth.module';
@Module({
   imports: [UserModule, forwardRef(() => AuthModule)],
   controllers: [EmailController],
   providers: [EmailService],
   exports: [EmailService],
})
export class EmailModule {}
